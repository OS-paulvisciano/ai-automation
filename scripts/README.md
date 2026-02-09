# Setup Scripts

Scripts to help set up and configure the AI Automation Framework.

## setup-mcp.sh

Merges shared MCP server configurations with your personal credentials.

**What it does:**
1. Reads your personal credentials from `.env` file
2. Takes the shared MCP config template from `infrastructure/mcp-config.template.json`
3. Replaces environment variable placeholders with your actual credentials
4. Creates/updates `~/.cursor/mcp.json` with the merged configuration

**Usage:**
```bash
# From the repository root
./scripts/setup-mcp.sh
```

**Requirements:**
- `.env` file must exist with your credentials (copy from `.env.example`)
- Standard shell environment (bash/zsh)

**Safety:**
- Backs up existing `~/.cursor/mcp.json` before overwriting
- Never commits credentials to git (`.env` is gitignored)
- Validates credentials before creating config
- Creates `.env` from `.env.example` if it doesn't exist
