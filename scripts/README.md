# Setup Scripts

Scripts to help set up and configure the AI Automation Framework.

## setup-mcp.js

Merges shared MCP server configurations with your personal credentials. **Cross-platform Node.js version** (works on Windows, macOS, Linux).

**What it does:**
1. Reads your personal credentials from `.env` file
2. Takes the shared MCP config template from `infrastructure/mcp-config.template.json`
3. Replaces environment variable placeholders with your actual credentials
4. Creates/updates `~/.cursor/mcp.json` with the merged configuration
5. Adds a comment indicating the file is auto-generated from `.env`

**Usage:**
```bash
# From the repository root
node scripts/setup-mcp.js
```

**Requirements:**
- Node.js installed
- `.env` file must exist with your credentials (copy from `.env.example`)

**Safety:**
- Backs up existing `~/.cursor/mcp.json` before overwriting
- Never commits credentials to git (`.env` is gitignored)
- Validates credentials before creating config
- Creates `.env` from `.env.example` if it doesn't exist
- Adds warning comment in generated `mcp.json` to prevent manual editing

**Note:** The generated `mcp.json` contains actual values (required by Cursor's MCP), but they are pulled from `.env` - never hardcoded. To update credentials, edit `.env` and run this script again.