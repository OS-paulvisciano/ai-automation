# Infrastructure

MCP (Model Context Protocol) server configurations and setup instructions.

## MCP Servers

This directory contains MCP server definitions that can be used to configure your Cursor AI assistant with external integrations.

### Available MCP Servers

- **Jira** (`mcp-servers/jira.json`) - Atlassian/Jira integration for issue management
- **Figma** (`mcp-servers/figma.json`) - Figma design system integration
- **GitHub** (`mcp-servers/github.json`) - GitHub API integration (via GitHub CLI)
- **Browser** (`mcp-servers/browser.json`) - Browser automation for visual verification

## Setup Instructions

### 1. Install Required Tools

- **Node.js** - For running MCP servers via npx
- **GitHub CLI** (`gh`) - For GitHub integration (if using GitHub MCP)
- **Figma API Key** - Get from [Figma Settings](https://www.figma.com/settings)

### 2. Configure MCP Servers

Copy the MCP server configurations to your `~/.cursor/mcp.json`:

```bash
# The mcp-config.json shows the structure
# Copy relevant servers to your ~/.cursor/mcp.json
```

### 3. Set Environment Variables

For servers that require credentials, use environment variables:

```bash
# In your shell profile (~/.zshrc or ~/.bashrc)
export ATLASSIAN_CLOUD_ID="your-cloud-id"
export ATLASSIAN_EMAIL="your-email@outsystems.com"
export FIGMA_API_KEY="your-figma-api-key"
```

Or create a `personal/mcp-credentials.json` (gitignored) with your credentials.

### 4. Test Connections

After setup, test each MCP server:
- Jira: "Search for my in-progress Jira stories"
- Figma: "Get Figma file information for file key p8xYRIBjILWM1zG6AJtkAb"
- Browser: "Navigate to https://example.com"

## Configuration Files

- `mcp-servers/*.json` - Individual MCP server definitions
- `mcp-config.json` - Example merged configuration (for reference)

## Troubleshooting

### MCP Server Not Connecting

1. Check that the server command is installed (e.g., `npx` works)
2. Verify environment variables are set correctly
3. Check API keys are valid and have correct permissions
4. Review Cursor logs for error messages

### Authentication Issues

- **Jira**: Verify cloud ID and email are correct
- **Figma**: Ensure API key has `file_content:read` permission
- **GitHub**: Run `gh auth login` to authenticate GitHub CLI

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
