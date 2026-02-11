# Infrastructure

MCP (Model Context Protocol) server configurations and setup instructions.

## MCP Servers

This directory contains MCP server definitions that can be used to configure your Cursor AI assistant with external integrations.

### Available MCP Servers

- **Jira** (`mcp-servers/jira.json`) - Atlassian/Jira integration for issue management
- **Figma** (`mcp-servers/figma.json`) - Figma design system integration
- **GitHub** (`mcp-servers/github.json`) - GitHub API integration (via GitHub CLI)
- **Browser** (`mcp-servers/browser.json`) - Browser automation for visual verification
- **Slack** (`mcp-servers/slack.json`) - Slack integration for channel messages and notifications

## Setup Instructions

### Important: MCP Configuration is User-Level

**MCP configuration is stored at the user level** in `~/.cursor/mcp.json`, not in individual repositories. This means:
- One MCP configuration per user (shared across all repos)
- Credentials are stored in `.env` file in the ai-automation repo
- The setup script merges the shared template with your personal credentials
- **Never manually edit `mcp.json`** - always edit `.env` and use the setup script to regenerate `mcp.json`
- The generated `mcp.json` will contain actual values (required by Cursor's MCP), but they come from `.env`

### 1. Install Required Tools

- **Node.js** - For running MCP servers via npx
- **GitHub CLI** (`gh`) - For GitHub integration (if using GitHub MCP)
- **Figma API Key** - Get from [Figma Settings](https://www.figma.com/settings)

### 2. Configure Credentials

**All MCP credentials are stored in the ai-automation framework's `.env` file** and are used to generate the user-level `~/.cursor/mcp.json`. Create a `.env` file in the ai-automation repo root:

```bash
# Navigate to ai-automation repo
cd ~/.cursor/ai-automation  # or ~/repos/paul-visciano-ai-automation

# Copy the example file
cp .env.example .env

# Edit .env with your actual credentials
```

The `.env` file should contain:
```bash
# Atlassian/Jira MCP
ATLASSIAN_CLOUD_ID=your-cloud-id
ATLASSIAN_EMAIL=your-email@outsystems.com

# Figma MCP
FIGMA_API_KEY=your-figma-api-key

# Slack MCP
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_CHANNEL_ID=CXXXXXXXXXX
```

**Important:** The `.env` file is gitignored and stored in the ai-automation repo, not in individual repositories. This allows credentials to be shared across all repos that use the framework via symlinks.

### 3. Setup MCP Configuration

Run the setup script to merge the shared MCP config template with your credentials:

```bash
cd ~/.cursor/ai-automation
node scripts/setup-mcp.js
```

This will:
- Read **all credentials** from `.env` file (no hardcoded values)
- Merge with the shared MCP config template from `infrastructure/mcp-config.template.json`
- Replace all placeholder values (e.g., `${ATLASSIAN_CLOUD_ID}`) with actual values from `.env`
- Create/update `~/.cursor/mcp.json` at the **user level** with your credentials

**Important:**
- The `.env` file is gitignored and never committed
- The `mcp.json` file is created at the **user level** (`~/.cursor/mcp.json`), not in repositories
- **Never manually edit `~/.cursor/mcp.json` with hardcoded values** - always use the setup script
- All credential values must come from `.env` - the template uses placeholders that get replaced

### 4. Verify Setup

After running the setup script, verify:
- Your `.env` file contains all required credentials
- `~/.cursor/mcp.json` was created/updated successfully
- All placeholder values (${...}) have been replaced with actual values from `.env`

### 5. Connect MCP Servers in Cursor

After creating `~/.cursor/mcp.json`:

1. **Restart Cursor** completely (quit and reopen the application)
2. **Open Settings** → **Tools & MCP**
3. **Verify MCP servers appear** in the "Installed MCP Servers" section:
   - **Atlassian** - Will show "Needs authentication" with a "Connect" button
   - **browsermcp** - Should show "X tools enabled" with toggle switch
   - **Framelink MCP for Figma** - Should show "X tools enabled" with toggle switch
   - **Slack** - Should show "X tools enabled" with toggle switch (if credentials are set)

4. **Connect Atlassian MCP** (OAuth authentication):
   - Click the **"Connect"** button next to Atlassian
   - This opens a browser window for OAuth authentication
   - Sign in with your Atlassian account (use the email configured in `mcp.json`)
   - Authorize the connection
   - Return to Cursor - the status should change to "Connected" with tools enabled

**Note:** If MCP servers don't appear after restarting:
- Verify `~/.cursor/mcp.json` exists and contains valid JSON
- Check that the `mcpServers` object is populated (not empty)
- Ensure credentials in the config match your `.env` file
- Try restarting Cursor again

### 6. Test Connections

After connecting, test each MCP server:
- **Jira**: "Search for my in-progress Jira stories"
- **Figma**: "Get Figma file information for file key p8xYRIBjILWM1zG6AJtkAb"
- **Browser**: "Navigate to https://example.com"
- **Slack**: "Query the latest published XIF version from #rd-uicomponents-releases"

## Configuration Files

- `mcp-servers/*.json` - Individual MCP server definitions
- `mcp-config.template.json` - Shared MCP configuration template (with placeholders)

**How it works:**
1. The shared template (`mcp-config.template.json`) contains the MCP server structure with environment variable placeholders
2. Users run `node scripts/setup-mcp.js` to merge the template with their personal credentials
3. The script creates `~/.cursor/mcp.json` with actual credentials (never committed)
4. This allows sharing the MCP server structure without exposing credentials

## Troubleshooting

### MCP Server Not Connecting

1. Check that the server command is installed (e.g., `npx` works)
2. Verify environment variables are set correctly
3. Check API keys are valid and have correct permissions
4. Review Cursor logs for error messages

### Authentication Issues

- **Jira/Atlassian**: 
  - Verify cloud ID and email are correct in `~/.cursor/mcp.json`
  - Click "Connect" button in Cursor Settings → Tools & MCP
  - Complete OAuth flow in browser
  - If connection fails, verify your Atlassian account has access to the cloud instance
- **Figma**: Ensure API key has `file_content:read` permission
- **GitHub**: Run `gh auth login` to authenticate GitHub CLI
- **Slack**: 
  - Verify bot token starts with `xoxb-` and is valid
  - Check that bot is added to the channel (`#rd-uicomponents-releases`)
  - Verify `channels:history` scope is enabled in Slack app settings

### Browser MCP Flakiness

Browser MCP can be unreliable. If issues persist:
- Try retrying the operation
- Use manual browser verification as fallback
- Consider alternative browser automation tools

## Adding New MCP Servers

1. Create `mcp-servers/{server-name}.json`
2. Define server configuration
3. Document capabilities and setup requirements
4. Update this README
5. Add to `mcp-config.json` example
