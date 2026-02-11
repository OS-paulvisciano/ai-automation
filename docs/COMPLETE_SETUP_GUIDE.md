# Complete Setup Guide - Automation Framework Integration

This guide walks through the complete setup process for integrating the AI automation framework into a repository, including MCP server configuration and connection.

## Prerequisites

- Cursor IDE installed
- Node.js installed (for MCP servers that use `npx`)
- Git repository access
- Atlassian account (for Jira integration)
- Figma API key (for Figma integration)

## Step 1: Clone and Setup Automation Framework

### Option A: Clone to Cursor folder (Simple)
```bash
git clone https://github.com/OS-paulvisciano/ai-automation.git ~/.cursor/ai-automation
```

### Option B: Clone to repos folder and symlink (Recommended)
```bash
# Clone to your repos folder
git clone https://github.com/OS-paulvisciano/ai-automation.git /Users/paul.visciano/repos/ai-automation

# Create symlink so Cursor can access it
ln -s /Users/paul.visciano/repos/ai-automation ~/.cursor/ai-automation
```

**Why symlink?** This keeps your repos organized while allowing Cursor to access the framework at the expected location.

## Step 2: Configure Personal Credentials

Create a `.env` file in the automation framework directory:

```bash
cd ~/.cursor/ai-automation
cp .env.example .env
# Edit .env with your actual credentials
```

The `.env` file should contain:
```bash
ATLASSIAN_CLOUD_ID=your-cloud-id
ATLASSIAN_EMAIL=your-email@outsystems.com
FIGMA_API_KEY=your-figma-api-key
```

**Note:** The `.env` file is gitignored and never committed.

## Step 3: Setup MCP Configuration

**Important: MCP configuration is stored at USER LEVEL** (`~/.cursor/mcp.json`), not in repositories. 

**How credentials work:**
- The `.env` file is the **source of truth** - store all credentials here (never hardcode in `.env`)
- The `mcp.json` file is **auto-generated** from `.env` and contains actual values (required by Cursor's MCP)
- **Never manually edit `mcp.json`** with hardcoded values - always edit `.env` and regenerate using the setup script
- The setup script pulls values from `.env` and generates `mcp.json` with actual values (Cursor requires this)

### Option A: Use Setup Script (Recommended)

```bash
cd ~/.cursor/ai-automation
node scripts/setup-mcp.js
```

The script will:
- Read **all credentials** from `.env` file (no hardcoded values)
- Merge with shared MCP config template from `infrastructure/mcp-config.template.json`
- Replace all placeholder values (e.g., `${ATLASSIAN_CLOUD_ID}`) with actual values from `.env`
- Create/update `~/.cursor/mcp.json` at the **user level** with your credentials

**Note:** To update credentials later, edit `.env` and run the setup script again.

### Option B: Manual Setup (Not Recommended)

1. Read your credentials from `.env`:
   ```bash
   source ~/.cursor/ai-automation/.env
   ```

2. Create `~/.cursor/mcp.json` manually:
   ```bash
   # Copy template
   cp ~/.cursor/ai-automation/infrastructure/mcp-config.template.json ~/.cursor/mcp.json
   
   # Replace ALL placeholders with actual values from .env
   # Edit ~/.cursor/mcp.json and replace:
   # - ${ATLASSIAN_CLOUD_ID} with your cloud ID from .env
   # - ${ATLASSIAN_EMAIL} with your email from .env
   # - ${FIGMA_API_KEY} with your Figma API key from .env
   # - ${SLACK_BOT_TOKEN} with your Slack token from .env
   # - ${SLACK_CHANNEL_ID} with your channel ID from .env
   # NEVER hardcode credentials - always use values from .env
   # Or simply run: node scripts/setup-mcp.js
   ```

The final `~/.cursor/mcp.json` should look like:
```json
{
  "mcpServers": {
    "Atlassian": {
      "url": "https://mcp.atlassian.com/v1/mcp",
      "env": {
        "ATLASSIAN_CLOUD_ID": "outsystemsrd",
        "ATLASSIAN_EMAIL": "your-email@outsystems.com"
      }
    },
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    },
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=your-figma-api-key",
        "--stdio"
      ]
    }
  }
}
```

## Step 4: Connect MCP Servers in Cursor

1. **Restart Cursor completely**:
   - Quit Cursor (Cmd+Q on Mac, Alt+F4 on Windows/Linux)
   - Reopen Cursor

2. **Open Settings**:
   - Go to **Settings** → **Tools & MCP**

3. **Verify MCP servers appear**:
   You should see three MCP servers in the "Installed MCP Servers" section:
   - **Atlassian** - Shows "Needs authentication" with a "Connect" button
   - **browsermcp** - Shows "X tools enabled" with toggle switch (should be ON)
   - **Framelink MCP for Figma** - Shows "X tools enabled" with toggle switch (should be ON)

4. **Connect Atlassian MCP**:
   - Click the **"Connect"** button next to Atlassian
   - A browser window will open for OAuth authentication
   - Sign in with your Atlassian account (use the email configured in `mcp.json`)
   - Authorize the connection
   - Return to Cursor
   - The status should change to "Connected" with tools enabled

**Troubleshooting:**
- If MCP servers don't appear, verify `~/.cursor/mcp.json` exists and contains valid JSON
- Check that the `mcpServers` object is populated (not empty)
- Try restarting Cursor again

## Step 5: Integrate Framework into Repository

For each repository you work on, integrate the automation framework:

```bash
# Navigate to your repository
cd /Users/paul.visciano/repos/your-repo-name

# Create .cursor directory
mkdir -p .cursor

# Create symlink to shared automation framework
ln -s ~/.cursor/ai-automation .cursor/ai-automation

# Create README explaining the setup (optional but recommended)
cat > .cursor/README.md << 'EOF'
# Repo-Specific Cursor Configuration

This directory contains repository-specific AI automation configurations and plans.

## Structure

- **`ai-automation/`** - Symlink to shared AI automation framework (`~/.cursor/ai-automation`)
- **`plans/`** - Repository-specific automation plans (e.g., story-specific workflows)
- Other repo-specific configurations as needed

## How It Works

The `ai-automation/` folder is a symlink to the shared framework, which provides:
- Org-level skills and agents
- Shared MCP server configurations
- Team and project configurations

This repo can have its own customizations:
- `plans/` - Specific automation plans for this repo
- Custom skills/agents if needed (would override shared ones)
- Repo-specific configurations

## Priority Order

When AI looks for skills/agents, it checks in this order:
1. `~/.cursor/ai-automation/personal/` - Personal overrides (highest priority)
2. `.cursor/` (this folder) - Repo-specific overrides
3. `~/.cursor/ai-automation/projects/{project}/` - Project config
4. `~/.cursor/ai-automation/teams/{team}/` - Team config
5. `~/.cursor/ai-automation/skills/`, `agents/` - Org defaults (lowest priority)
EOF
```

## Step 6: Verify Integration

Verify the integration works:

```bash
# Check symlink exists
ls -la .cursor/ai-automation

# Verify you can access skills
ls .cursor/ai-automation/skills/

# Verify you can access agents
ls .cursor/ai-automation/agents/

# Verify you can access project configs
ls .cursor/ai-automation/projects/
```

## Step 7: Test MCP Connections

Test each MCP server to ensure they're working:

1. **Test Atlassian/Jira MCP**:
   - Ask AI: "Search for my in-progress Jira stories"
   - Should return a list of your Jira issues

2. **Test Figma MCP**:
   - Ask AI: "Get Figma file information for file key p8xYRIBjILWM1zG6AJtkAb"
   - Should return Figma file details

3. **Test Browser MCP**:
   - Ask AI: "Navigate to https://example.com"
   - Should open the URL in browser

## Complete Setup Checklist

- [ ] Automation framework cloned to `~/.cursor/ai-automation`
- [ ] `.env` file created with credentials
- [ ] `~/.cursor/mcp.json` created with MCP server configurations
- [ ] Cursor restarted
- [ ] MCP servers visible in Settings → Tools & MCP
- [ ] Atlassian MCP connected (OAuth completed)
- [ ] browsermcp enabled (toggle ON)
- [ ] Figma MCP enabled (toggle ON)
- [ ] Repository integrated (`.cursor/ai-automation` symlink created)
- [ ] All MCP servers tested and working

## What's Next?

Now that everything is set up, you can:

- Use natural language commands: "Create a PR", "Update Jira story", etc.
- Access project-specific configurations
- Use all automation skills and agents from the shared framework
- Customize workflows at personal, repo, project, or team levels

See the main [README.md](../README.md) for usage examples and the [Skills Guide](../skills/README.md) for available automation capabilities.

## Troubleshooting

### MCP Servers Don't Appear
- Verify `~/.cursor/mcp.json` exists and is valid JSON
- Check that `mcpServers` object is populated
- Restart Cursor completely

### Atlassian MCP Won't Connect
- Verify cloud ID and email in `mcp.json` are correct
- Check that you have access to the Atlassian cloud instance
- Try disconnecting and reconnecting
- Check Cursor logs for error messages

### Framework Not Accessible in Repository
- Verify symlink exists: `ls -la .cursor/ai-automation`
- Check symlink points to correct location: `readlink .cursor/ai-automation`
- Ensure `~/.cursor/ai-automation` directory exists

## Support

For issues or questions:
- Check the [Infrastructure README](../infrastructure/README.md) for MCP-specific help
- Review the [Skills Guide](../skills/README.md) for automation capabilities
- See [AUTOMATION_SETUP.md](./AUTOMATION_SETUP.md) for workflow examples
