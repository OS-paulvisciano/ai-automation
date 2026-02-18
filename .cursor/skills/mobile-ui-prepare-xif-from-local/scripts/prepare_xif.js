#!/usr/bin/env node
/**
 * Prepare XIF for ODC. Run from WidgetLibrary root or ServiceStudio.
 * REPO_ROOT = WIDGET_LIBRARY_ROOT env, or cwd if it has Common/Widgets.xml, else cwd/..
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');
const readline = require('readline');

const cwd = process.cwd();
const REPO_ROOT = process.env.WIDGET_LIBRARY_ROOT
    ? path.resolve(process.env.WIDGET_LIBRARY_ROOT)
    : fs.existsSync(path.join(cwd, 'Common', 'Widgets.xml'))
        ? cwd
        : path.resolve(cwd, '..');

if (!fs.existsSync(path.join(REPO_ROOT, 'Common', 'Widgets.xml'))) {
    console.error('\n✗ WidgetLibrary root not found. Run from OutSystems.WidgetLibrary (root or ServiceStudio) or set WIDGET_LIBRARY_ROOT.');
    process.exit(1);
}

const WIDGETS_XML = path.join(REPO_ROOT, 'Common', 'Widgets.xml');
const ASSEMBLY_INFO = path.join(REPO_ROOT, 'Images', 'MobileUI.Light', 'Properties', 'AssemblyInfo.cs');
const XIF_OUTPUT_DIR = path.join(REPO_ROOT, 'ServiceStudio', 'bin', 'Debug', 'xif');

const activeProcesses = [];
const isInteractive = process.stdin.isTTY && process.stdout.isTTY;
let rl = isInteractive ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null;

function cleanup() {
    activeProcesses.forEach(p => { try { p && !p.killed && p.kill('SIGTERM'); } catch (_) {} });
    if (rl) rl.close();
}
process.on('SIGINT', () => { console.log('\n\n⚠️  Interrupted'); cleanup(); process.exit(130); });
process.on('SIGTERM', () => { console.log('\n\n⚠️  Terminated'); cleanup(); process.exit(143); });

function question(prompt, defaultValue = null) {
    if (!isInteractive || !rl) {
        console.error('\n✗ Interactive terminal required. Run: node path/to/prepare_xif.js');
        process.exit(1);
    }
    return new Promise((resolve, reject) => {
        if (rl.closed) return reject(new Error('Readline closed'));
        const p = defaultValue != null ? `${prompt.replace(/: $/, '')} (default: ${defaultValue}): ` : prompt;
        rl.question(p, ans => resolve(ans.trim() === '' && defaultValue != null ? defaultValue : ans));
    });
}

function openInNewTerminal() {
    const dir = REPO_ROOT;
    const script = __filename;
    console.log('\n⚠️  Non-interactive. Opening new terminal...\n');
    try {
        if (os.platform() === 'darwin') {
            const d = dir.replace(/'/g, "'\\''");
            const s = script.replace(/'/g, "'\\''");
            const appleScript = `tell application "Terminal" to do script "cd '${d}' && node '${s}'"`;
            execSync(`osascript -e '${appleScript}'`, { stdio: 'inherit' });
        } else if (os.platform() === 'win32') {
            const cmd = `cd /d "${dir.replace(/"/g, '\\"')}" && node "${script.replace(/"/g, '\\"')}"`;
            execSync(`start cmd /k "${cmd}"`, { stdio: 'inherit' });
        } else {
            console.error(`Run: cd "${dir}" && node "${script}"`);
            process.exit(1);
        }
        process.exit(0);
    } catch (e) {
        console.error(`Run manually: cd "${dir}" && node "${script}"`);
        process.exit(1);
    }
}

function getODCPluginsDir() {
    const h = os.homedir();
    return os.platform() === 'darwin'
        ? path.join(h, 'Library', 'Application Support', 'OutSystems', 'ODC Studio', 'Plugins')
        : path.join(h, 'AppData', 'Local', 'OutSystems', 'ODC Studio', 'Plugins');
}

function updateVersion(newVersion) {
    fs.writeFileSync(WIDGETS_XML, fs.readFileSync(WIDGETS_XML, 'utf8').replace(/AssemblyVersion="(\d+\.\d+\.\d+)"/, `AssemblyVersion="${newVersion}"`), 'utf8');
    fs.writeFileSync(ASSEMBLY_INFO, fs.readFileSync(ASSEMBLY_INFO, 'utf8').replace(/AssemblyVersion\("(\d+\.\d+\.\d+)"\)/, `AssemblyVersion("${newVersion}")`), 'utf8');
    console.log(`✓ Version files → ${newVersion}`);
}

function findXifFile() {
    if (!fs.existsSync(XIF_OUTPUT_DIR)) throw new Error(`XIF dir not found: ${XIF_OUTPUT_DIR}`);
    const files = fs.readdirSync(XIF_OUTPUT_DIR).filter(f => f.startsWith('MobileUI-') && f.endsWith('.xif')).sort().reverse();
    if (!files.length) throw new Error(`No XIF in ${XIF_OUTPUT_DIR}`);
    return path.join(XIF_OUTPUT_DIR, files[0]);
}

function runDotnet(args) {
    return new Promise((resolve, reject) => {
        const proc = spawn('dotnet', args, { cwd: REPO_ROOT, stdio: 'inherit', shell: false });
        activeProcesses.push(proc);
        proc.on('close', (code, signal) => {
            activeProcesses.splice(activeProcesses.indexOf(proc), 1);
            if (signal) reject(new Error(`${args[0]} interrupted`));
            else if (code !== 0) reject(new Error(`${args[0]} failed: ${code}`));
            else resolve();
        });
        proc.on('error', e => reject(e));
    });
}

async function cleanAndBuild() {
    console.log('\nBuilding WidgetLibrary...');
    process.chdir(REPO_ROOT);
    await runDotnet(['clean']);
    await runDotnet(['build']);
}

function copyXifToPlugins(newVersion) {
    const xifFile = findXifFile();
    const name = path.basename(xifFile);
    const pluginsDir = getODCPluginsDir();
    if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true });
    fs.readdirSync(pluginsDir).filter(f => f.startsWith('MobileUI-') && f.endsWith('.xif') && f !== name).forEach(f => fs.unlinkSync(path.join(pluginsDir, f)));
    fs.copyFileSync(xifFile, path.join(pluginsDir, name));
    console.log(`✓ Copied ${name} to ODC Plugins`);
    return { xifFilename: name, destPath: path.join(pluginsDir, name) };
}

function isODCStudioRunning() {
    try {
        if (os.platform() === 'darwin') return execSync('ps aux | grep -i "ODC Studio" | grep -v grep', { encoding: 'utf8' }).trim().length > 0;
        for (const n of ['ODC Studio.exe', 'ODCStudio.exe']) {
            if (execSync(`tasklist /FI "IMAGENAME eq ${n}"`, { encoding: 'utf8' }).includes(n)) return true;
        }
    } catch (_) {}
    return false;
}

function openODCStudioInSupportMode() {
    if (os.platform() === 'darwin') {
        execSync('open "/Applications/ODC Studio.app" --args -support', { stdio: 'inherit' });
        return;
    }
    const candidates = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
        .filter(Boolean)
        .flatMap(p => [
            path.join(p, 'OutSystems', 'ODC Studio', 'ODC Studio.exe'),
            path.join(p, 'OutSystems', 'ODC Studio', 'ODCStudio.exe')
        ]);
    const exe = candidates.find(p => fs.existsSync(p));
    if (exe) {
        try { execSync(`"${exe}" -support`, { stdio: 'inherit', shell: true }); }
        catch { execSync(`start "" "${exe}" -support`, { stdio: 'inherit', shell: true }); }
    } else {
        console.warn('⚠️  ODC Studio not found. Launch manually with -support.');
    }
}

async function main() {
    if (!isInteractive || !rl) {
        openInNewTerminal();
        return;
    }

    console.log('\n========== XIF Preparation ==========\n');

    const latestVersion = await question('Latest published version (e.g. 1.0.355): ').catch(e => {
        if (/readline|closed/.test(e.message)) { console.error('\n✗ Cannot read stdin.'); openInNewTerminal(); process.exit(0); }
        throw e;
    });
    if (!/^\d+\.\d+\.\d+$/.test(latestVersion.trim())) {
        console.error('✗ Version must be X.Y.Z');
        if (rl) rl.close();
        process.exit(1);
    }
    const newVersion = latestVersion.trim().split('.').map(Number).map((n, i) => i === 2 ? n + 1 : n).join('.');
    console.log(`  New version: ${newVersion}\n`);

    console.log('Post to #rd-uicomponents-releases:');
    console.log(`  ${newVersion} :loading:\n`);
    await question('Press Enter after posting...');
    updateVersion(newVersion);
    await cleanAndBuild();
    const { xifFilename, destPath } = copyXifToPlugins(newVersion);

    if (!isODCStudioRunning()) {
        console.log('\nLaunching ODC Studio (-support)...');
        openODCStudioInSupportMode();
    }

    console.log('\n--- Publish in ODC ---');
    console.log(`XIF: ${destPath}`);
    console.log('Support menu → Publish xif\n');
    await question('Press Enter after publishing in ODC...');

    console.log('\nEdit your Slack message to:');
    console.log(`  ${newVersion} :check:\n`);
    await question('Press Enter when done...');

    console.log('\n✓ Done. Next: create test app in ODC, add link to Jira story.\n');
    if (rl) rl.close();
}

main().catch(e => {
    console.error('\n✗', e.message);
    if (rl) rl.close();
    process.exit(1);
});
