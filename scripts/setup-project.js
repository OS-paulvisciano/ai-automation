#!/usr/bin/env node

/**
 * Setup script for projects in the automation framework
 * 
 * This script:
 * 1. Clones or uses existing project repository
 * 2. Symlinks the automation repo into .cursor/ai-automation
 * 3. Runs project-specific setup steps (npm auth, etc.)
 * 
 * Usage:
 *   node scripts/setup-project.js <project-name>
 * 
 * Example:
 *   node scripts/setup-project.js widget-library
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');
const readline = require('readline');

const SCRIPT_DIR = __dirname;
const AUTOMATION_ROOT = path.join(SCRIPT_DIR, '..');
const PROJECTS_DIR = path.join(AUTOMATION_ROOT, 'projects');
const ENV_FILE = path.join(AUTOMATION_ROOT, '.env');

// Track active child processes for cleanup
const activeProcesses = [];

// Handle interrupts (Ctrl+C) and cleanup
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Interrupted by user (Ctrl+C)');
    console.log('Cleaning up child processes...');
    
    // Kill all active child processes
    activeProcesses.forEach(proc => {
        try {
            if (proc && !proc.killed) {
                proc.kill('SIGTERM');
            }
        } catch (e) {
            // Ignore errors during cleanup
        }
    });
    
    rl.close();
    process.exit(130); // Exit code 130 = terminated by SIGINT
});

process.on('SIGTERM', () => {
    console.log('\n\n⚠️  Terminated');
    activeProcesses.forEach(proc => {
        try {
            if (proc && !proc.killed) {
                proc.kill('SIGTERM');
            }
        } catch (e) {
            // Ignore errors during cleanup
        }
    });
    rl.close();
    process.exit(143); // Exit code 143 = terminated by SIGTERM
});

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function loadProjectConfig(projectName) {
    const configPath = path.join(PROJECTS_DIR, projectName, 'config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error(`Project config not found: ${configPath}`);
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function getReposDir() {
    // Default to ~/repos, but allow override via environment
    const reposDir = process.env.REPOS_DIR || path.join(os.homedir(), 'repos');
    return reposDir;
}

function getProjectRepoPath(projectConfig) {
    const reposDir = getReposDir();
    const repoName = projectConfig.github.repo;
    return path.join(reposDir, repoName);
}

async function cloneRepository(projectConfig, targetPath, force = false) {
    const org = projectConfig.github.org || 'OutSystems';
    const repo = projectConfig.github.repo;
    const baseBranch = projectConfig.github.baseBranch || 'main';
    const repoUrl = `git@github.com:${org}/${repo}.git`;

    console.log(`\nCloning ${repo}...`);
    console.log(`  URL: ${repoUrl}`);
    console.log(`  Branch: ${baseBranch}`);
    console.log(`  Target: ${targetPath}\n`);

    if (fs.existsSync(targetPath)) {
        if (force) {
            console.log('Removing existing directory (--force flag)...');
            fs.rmSync(targetPath, { recursive: true, force: true });
            console.log('✓ Removed existing directory');
        } else {
            console.log(`✓ Repository already exists at ${targetPath}`);
            console.log('  Skipping clone. Use --force to clone fresh.\n');
            return;
        }
    }

    // Create repos directory if it doesn't exist
    const reposDir = path.dirname(targetPath);
    if (!fs.existsSync(reposDir)) {
        fs.mkdirSync(reposDir, { recursive: true });
        console.log(`✓ Created repos directory: ${reposDir}`);
    }

    try {
        console.log('Cloning repository...');
        console.log(`  Command: git clone -b ${baseBranch} ${repoUrl}`);
        console.log(`  Target: ${targetPath}`);
        console.log('  (This will show progress and download size)\n');
        
        // Use spawn to properly stream output and show progress
        const startTime = Date.now();
        const cloneProcess = spawn('git', ['clone', '-b', baseBranch, '--progress', repoUrl, targetPath], {
            stdio: 'inherit',
            shell: false
        });

        // Track process for cleanup on interrupt
        activeProcesses.push(cloneProcess);

        await new Promise((resolve, reject) => {
            cloneProcess.on('close', (code, signal) => {
                // Remove from active processes
                const index = activeProcesses.indexOf(cloneProcess);
                if (index > -1) {
                    activeProcesses.splice(index, 1);
                }

                if (signal === 'SIGTERM' || signal === 'SIGINT') {
                    reject(new Error('Clone operation was interrupted.'));
                } else if (code === 0) {
                    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
                    console.log(`\n✓ Repository cloned successfully (took ${duration}s)`);
                    resolve();
                } else {
                    reject(new Error(`Git clone failed with exit code ${code}`));
                }
            });

            cloneProcess.on('error', (error) => {
                const index = activeProcesses.indexOf(cloneProcess);
                if (index > -1) {
                    activeProcesses.splice(index, 1);
                }
                reject(new Error(`Failed to start git clone: ${error.message}`));
            });
        });
    } catch (error) {
        if (error.signal === 'SIGTERM') {
            throw new Error('Clone operation was interrupted. Please try again.');
        }
        if (error.message.includes('Permission denied') || error.message.includes('permission denied')) {
            throw new Error('SSH authentication failed. Please:\n  - Check your SSH key is added to GitHub\n  - Test with: ssh -T git@github.com\n  - Ensure you have access to the repository');
        }
        if (error.message.includes('fatal:')) {
            throw new Error(`Git clone failed: ${error.message}`);
        }
        throw new Error(`Failed to clone repository: ${error.message}`);
    }
}

function symlinkAutomation(repoPath) {
    const cursorDir = path.join(repoPath, '.cursor');
    const automationLink = path.join(cursorDir, 'ai-automation');

    // Create .cursor directory if it doesn't exist
    if (!fs.existsSync(cursorDir)) {
        fs.mkdirSync(cursorDir, { recursive: true });
        console.log(`✓ Created .cursor directory: ${cursorDir}`);
    }

    // Remove existing symlink or directory if it exists
    if (fs.existsSync(automationLink)) {
        if (fs.lstatSync(automationLink).isSymbolicLink()) {
            fs.unlinkSync(automationLink);
        } else {
            throw new Error(`${automationLink} exists but is not a symlink. Please remove it manually.`);
        }
    }

    // Create symlink
    const relativePath = path.relative(cursorDir, AUTOMATION_ROOT);
    fs.symlinkSync(relativePath, automationLink, 'dir');
    console.log(`✓ Symlinked automation repo: ${automationLink} -> ${AUTOMATION_ROOT}`);
}

async function setupNpmAuth(projectConfig, repoPath) {
    if (!projectConfig.setup?.requiresNpmAuth) {
        return;
    }

    console.log('\nSetting up npm authentication...');

    const tokenEnvVar = projectConfig.setup.npmAuthTokenEnvVar || 'AZURE_DEVOPS_PAT';
    
    // Load or create .env file
    let envVars = {};
    if (fs.existsSync(ENV_FILE)) {
        const envContent = fs.readFileSync(ENV_FILE, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^#=]+)=(.*)$/);
            if (match) {
                envVars[match[1].trim()] = match[2].trim();
            }
        });
    }

    let token = envVars[tokenEnvVar];
    const placeholderPattern = new RegExp(`^your-${tokenEnvVar.toLowerCase().replace(/_/g, '-')}`, 'i');

    // If token is missing or is a placeholder, prompt user
    if (!token || placeholderPattern.test(token)) {
        console.log('\n⚠️  Azure DevOps PAT token not found in .env file.');
        console.log('\nTo generate a token:');
        console.log('1. Go to: https://dev.azure.com/OutSystemsRD/_usersSettings/tokens');
        console.log('2. Click "New Token" (or "+ New Token")');
        console.log('3. Fill in:');
        console.log('   - Name: e.g., "npm-authentication"');
        console.log('   - Organization: OutSystemsRD');
        console.log('   - Expiration: choose a duration (e.g., 90 days)');
        console.log('   - Scopes: select "Packaging" → "Read"');
        console.log('4. Click "Create"');
        console.log('5. Copy the token (it won\'t be shown again)\n');
        
        token = await question(`Paste your ${tokenEnvVar} token here: `);
        token = token.trim();
        
        if (!token) {
            throw new Error('Token is required. Please run the script again and provide a token.');
        }

        // Save token to .env file
        console.log(`\nSaving token to ${ENV_FILE}...`);
        
        // Read existing .env content to preserve other variables
        let envContent = '';
        if (fs.existsSync(ENV_FILE)) {
            envContent = fs.readFileSync(ENV_FILE, 'utf8');
        } else {
            // Create from template if it doesn't exist
            const examplePath = path.join(AUTOMATION_ROOT, '.env.example');
            if (fs.existsSync(examplePath)) {
                envContent = fs.readFileSync(examplePath, 'utf8');
            }
        }

        // Update or add the token
        const lines = envContent.split('\n');
        let found = false;
        const updatedLines = lines.map(line => {
            if (line.startsWith(`${tokenEnvVar}=`)) {
                found = true;
                return `${tokenEnvVar}=${token}`;
            }
            return line;
        });

        if (!found) {
            // Add token at the end
            if (updatedLines[updatedLines.length - 1] !== '') {
                updatedLines.push('');
            }
            updatedLines.push(`# Azure DevOps PAT (for npm authentication)`);
            updatedLines.push(`${tokenEnvVar}=${token}`);
        }

        fs.writeFileSync(ENV_FILE, updatedLines.join('\n'), 'utf8');
        console.log(`✓ Token saved to ${ENV_FILE}`);
    } else {
        console.log(`✓ Found ${tokenEnvVar} in .env file`);
    }

    // Run npm auth
    const serviceStudioDir = path.join(repoPath, 'ServiceStudio');
    if (!fs.existsSync(serviceStudioDir)) {
        console.log('⚠️  ServiceStudio directory not found, skipping npm auth setup');
        return;
    }

    try {
        console.log('\nRunning npm authentication...');
        const npmAuthProcess = spawn('npx', ['@outsystems/assistant', 'login', '--token', token], {
            cwd: serviceStudioDir,
            stdio: 'inherit',
            shell: false
        });

        // Track process for cleanup on interrupt
        activeProcesses.push(npmAuthProcess);

        await new Promise((resolve, reject) => {
            npmAuthProcess.on('close', (code, signal) => {
                // Remove from active processes
                const index = activeProcesses.indexOf(npmAuthProcess);
                if (index > -1) {
                    activeProcesses.splice(index, 1);
                }

                if (signal === 'SIGTERM' || signal === 'SIGINT') {
                    reject(new Error('npm authentication was interrupted.'));
                } else if (code === 0) {
                    console.log('✓ npm authentication completed');
                    resolve();
                } else {
                    reject(new Error(`npm authentication failed with exit code ${code}`));
                }
            });

            npmAuthProcess.on('error', (error) => {
                const index = activeProcesses.indexOf(npmAuthProcess);
                if (index > -1) {
                    activeProcesses.splice(index, 1);
                }
                reject(new Error(`Failed to start npm authentication: ${error.message}`));
            });
        });

        // Check if .npmrc needs the @outsystems registry line
        const npmrcPath = path.join(repoPath, '.npmrc');
        if (fs.existsSync(npmrcPath)) {
            const npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
            if (!npmrcContent.includes('@outsystems:registry=')) {
                console.log('\nAdding @outsystems registry configuration to .npmrc...');
                const registryLine = '@outsystems:registry=https://pkgs.dev.azure.com/OutSystemsRD/_packaging/ArtifactRepository/npm/registry/\n';
                fs.appendFileSync(npmrcPath, registryLine);
                console.log('✓ Added @outsystems registry configuration');
            }
        }

        // Copy .npmrc to ServiceStudio if needed
        const serviceStudioNpmrc = path.join(serviceStudioDir, '.npmrc');
        if (fs.existsSync(npmrcPath) && !fs.existsSync(serviceStudioNpmrc)) {
            fs.copyFileSync(npmrcPath, serviceStudioNpmrc);
            console.log('✓ Copied .npmrc to ServiceStudio directory');
        }
    } catch (error) {
        console.warn(`⚠️  npm authentication failed: ${error.message}`);
        console.warn('   You may need to run this manually');
    }
}

async function main() {
    try {
        const args = process.argv.slice(2);
        const projectName = args.find(arg => !arg.startsWith('--'));
        const force = args.includes('--force') || args.includes('-f');

        if (!projectName) {
            console.error('Usage: node scripts/setup-project.js <project-name> [--force]');
            console.error('\nOptions:');
            console.error('  --force, -f    Force fresh clone (removes existing directory)');
            console.error('\nAvailable projects:');
            const projects = fs.readdirSync(PROJECTS_DIR)
                .filter(item => {
                    const itemPath = path.join(PROJECTS_DIR, item);
                    return fs.statSync(itemPath).isDirectory() && item !== 'README.md';
                });
            projects.forEach(p => console.error(`  - ${p}`));
            process.exit(1);
        }

        console.log('==========================================');
        console.log(`Setting up project: ${projectName}`);
        console.log('==========================================\n');

        // Load project config
        const projectConfig = loadProjectConfig(projectName);
        console.log(`Project: ${projectConfig.project}`);
        console.log(`Description: ${projectConfig.description}\n`);

        // Get repository path
        const repoPath = getProjectRepoPath(projectConfig);
        console.log(`Repository will be at: ${repoPath}\n`);

        const reposDir = getReposDir();
        if (reposDir !== path.join(os.homedir(), 'repos')) {
            console.log(`Using custom repos directory: ${reposDir}\n`);
        }

        // Clone repository
        await cloneRepository(projectConfig, repoPath, force);

        // Symlink automation repo
        console.log('\nSetting up automation symlink...');
        symlinkAutomation(repoPath);

        // Run setup steps
        const setupSteps = projectConfig.setup?.setupSteps || [];
        for (const step of setupSteps) {
            if (step === 'symlink-automation') {
                // Already done above
                continue;
            } else if (step === 'npm-auth') {
                await setupNpmAuth(projectConfig, repoPath);
            } else {
                console.warn(`⚠️  Unknown setup step: ${step}`);
            }
        }

        console.log('\n==========================================');
        console.log('✓ Project setup complete!');
        console.log('==========================================');
        console.log(`\nRepository: ${repoPath}`);
        console.log('\nNext steps:');
        console.log('1. Navigate to the repository');
        console.log('2. Follow the setup instructions in the repository README');
        console.log('3. The automation framework is symlinked at .cursor/ai-automation\n');

    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
