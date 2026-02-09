# Setup Scripts

Scripts to help set up and configure the AI Automation Framework.

## setup-mcp.sh

Merges shared MCP server configurations with your personal credentials.

**What it does:**
1. Reads your personal credentials from `personal/mcp-credentials.json`
2. Takes the shared MCP config template from `infrastructure/mcp-config.json`
3. Replaces environment variable placeholders with your actual credentials
4. Creates/updates `~/.cursor/mcp.json` with the merged configuration

**Usage:**
```bash
# From the repository root
./scripts/setup-mcp.sh
```

**Requirements:**
- `personal/mcp-credentials.json` must exist with your credentials
- Optional: `jq` for better JSON handling (falls back to sed if not available)

**Safety:**
- Backs up existing `~/.cursor/mcp.json` before overwriting
- Never commits credentials to git
- Validates credentials before creating config
