#!/usr/bin/env node

/**
 * Setup script to merge shared MCP config with personal credentials
 * This allows sharing MCP server configurations without exposing credentials
 *
 * IMPORTANT: MCP configuration is stored at USER LEVEL (~/.cursor/mcp.json)
 * All credential values are pulled from .env file
 * This script replaces all placeholder values (${VAR}) with actual values from .env
 * Note: Cursor's MCP requires actual values in mcp.json (not env var references),
 *       so this script generates mcp.json with actual values from .env
 *
 * Cross-platform Node.js version (works on Windows, macOS, Linux)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.join(SCRIPT_DIR, '..');
const CURSOR_DIR = path.join(os.homedir(), '.cursor');
const MCP_CONFIG = path.join(CURSOR_DIR, 'mcp.json');
const SHARED_CONFIG = path.join(REPO_ROOT, 'infrastructure', 'mcp-config.template.json');
const ENV_FILE = path.join(REPO_ROOT, '.env');
const ENV_EXAMPLE = path.join(REPO_ROOT, '.env.example');

// Colors for output
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color

function log(message, color = '') {
    console.log(`${color}${message}${NC}`);
}

function error(message) {
    log(message, RED);
    process.exit(1);
}

function warn(message) {
    log(message, YELLOW);
}

function success(message) {
    log(message, GREEN);
}

// Load environment variables from .env file
function loadEnvFile(filePath) {
    const env = {};
    if (!fs.existsSync(filePath)) {
        return env;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            env[key] = value;
        }
    }
    
    return env;
}

// Main execution
try {
    log('Setting up MCP configuration...', GREEN);
    
    // Check if shared config exists
    if (!fs.existsSync(SHARED_CONFIG)) {
        error(`Error: Shared config not found at ${SHARED_CONFIG}`);
    }
    
    // Check if .env file exists
    if (!fs.existsSync(ENV_FILE)) {
        warn(`Warning: .env file not found at ${ENV_FILE}`);
        if (fs.existsSync(ENV_EXAMPLE)) {
            log('Creating .env from .env.example...');
            fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
            warn(`Please edit ${ENV_FILE} with your actual credentials`);
        } else {
            log('Creating .env template file...');
            const template = `# MCP Server Credentials
ATLASSIAN_CLOUD_ID=your-cloud-id
ATLASSIAN_EMAIL=your-email@outsystems.com
FIGMA_API_KEY=your-figma-api-key
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_CHANNEL_ID=CXXXXXXXXXX
`;
            fs.writeFileSync(ENV_FILE, template);
            warn(`Please edit ${ENV_FILE} with your actual credentials`);
        }
        process.exit(1);
    }
    
    // Create .cursor directory if it doesn't exist
    if (!fs.existsSync(CURSOR_DIR)) {
        fs.mkdirSync(CURSOR_DIR, { recursive: true });
    }
    
    // Load environment variables
    const env = loadEnvFile(ENV_FILE);
    
    const ATLASSIAN_CLOUD_ID = env.ATLASSIAN_CLOUD_ID || '';
    const ATLASSIAN_EMAIL = env.ATLASSIAN_EMAIL || '';
    const FIGMA_API_KEY = env.FIGMA_API_KEY || '';
    const SLACK_BOT_TOKEN = env.SLACK_BOT_TOKEN || '';
    const SLACK_CHANNEL_ID = env.SLACK_CHANNEL_ID || '';
    
    // Validate credentials
    if (!ATLASSIAN_CLOUD_ID || ATLASSIAN_CLOUD_ID === 'your-cloud-id') {
        error(`Error: ATLASSIAN_CLOUD_ID not set in ${ENV_FILE}`);
    }
    
    if (!ATLASSIAN_EMAIL || ATLASSIAN_EMAIL === 'your-email@outsystems.com') {
        error(`Error: ATLASSIAN_EMAIL not set in ${ENV_FILE}`);
    }
    
    if (!FIGMA_API_KEY || FIGMA_API_KEY === 'your-figma-api-key') {
        warn(`Warning: FIGMA_API_KEY not set in ${ENV_FILE}`);
        log('Figma MCP will not work without this key');
    }
    
    if (!SLACK_BOT_TOKEN || SLACK_BOT_TOKEN === 'xoxb-your-bot-token') {
        warn(`Warning: SLACK_BOT_TOKEN not set in ${ENV_FILE}`);
        log('Slack MCP will not work without this token');
    }
    
    if (!SLACK_CHANNEL_ID || SLACK_CHANNEL_ID === 'CXXXXXXXXXX') {
        warn(`Warning: SLACK_CHANNEL_ID not set in ${ENV_FILE}`);
        log('Slack MCP will not work without channel ID');
    }
    
    // Backup existing config if it exists
    if (fs.existsSync(MCP_CONFIG)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const backup = `${MCP_CONFIG}.backup.${timestamp}`;
        warn(`Backing up existing config to ${backup}`);
        fs.copyFileSync(MCP_CONFIG, backup);
    }
    
    // Read shared config template
    const template = JSON.parse(fs.readFileSync(SHARED_CONFIG, 'utf8'));
    
    // Update comment to indicate auto-generation
    template._comment = `⚠️ AUTO-GENERATED FROM .env - DO NOT EDIT MANUALLY | Source: ${ENV_FILE} | Regenerate: node scripts/setup-mcp.js`;
    
    // Replace placeholder values with actual values from .env
    if (template.mcpServers.Atlassian) {
        template.mcpServers.Atlassian.env.ATLASSIAN_CLOUD_ID = ATLASSIAN_CLOUD_ID;
        template.mcpServers.Atlassian.env.ATLASSIAN_EMAIL = ATLASSIAN_EMAIL;
    }
    
    if (template.mcpServers['Framelink MCP for Figma']) {
        const figmaArgs = template.mcpServers['Framelink MCP for Figma'].args;
        const apiKeyIndex = figmaArgs.findIndex(arg => arg.startsWith('--figma-api-key='));
        if (apiKeyIndex !== -1) {
            figmaArgs[apiKeyIndex] = `--figma-api-key=${FIGMA_API_KEY}`;
        }
    }
    
    if (template.mcpServers.Slack) {
        template.mcpServers.Slack.env.SLACK_BOT_TOKEN = SLACK_BOT_TOKEN;
        template.mcpServers.Slack.env.SLACK_CHANNEL_ID = SLACK_CHANNEL_ID;
    }
    
    // Write the generated config
    fs.writeFileSync(MCP_CONFIG, JSON.stringify(template, null, 2) + '\n', 'utf8');
    
    success(`✓ MCP configuration created at ${MCP_CONFIG}`);
    success(`✓ All credentials loaded from ${ENV_FILE} (no hardcoded values)`);
    success(`✓ MCP config is stored at user level (~/.cursor/mcp.json)`);
    log('');
    log('Next steps:');
    log('1. Restart Cursor to load the new MCP configuration');
    log('2. Test MCP connections by asking AI to search for Jira issues');
    log('');
    log(`Note: To update credentials, edit ${ENV_FILE} and run this script again`);
    
} catch (err) {
    error(`Error: ${err.message}`);
}
