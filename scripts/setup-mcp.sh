#!/bin/bash

# Setup script to merge shared MCP config with personal credentials
# This allows sharing MCP server configurations without exposing credentials

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CURSOR_DIR="$HOME/.cursor"
MCP_CONFIG="$CURSOR_DIR/mcp.json"
SHARED_CONFIG="$REPO_ROOT/infrastructure/mcp-config.template.json"
PERSONAL_CREDS="$REPO_ROOT/personal/mcp-credentials.json"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up MCP configuration...${NC}"

# Check if shared config exists
if [ ! -f "$SHARED_CONFIG" ]; then
    echo -e "${RED}Error: Shared config not found at $SHARED_CONFIG${NC}"
    exit 1
fi

# Check if personal credentials exist
if [ ! -f "$PERSONAL_CREDS" ]; then
    echo -e "${YELLOW}Warning: Personal credentials not found at $PERSONAL_CREDS${NC}"
    echo "Creating template file..."
    mkdir -p "$(dirname "$PERSONAL_CREDS")"
    cat > "$PERSONAL_CREDS" << 'EOF'
{
  "ATLASSIAN_CLOUD_ID": "your-cloud-id",
  "ATLASSIAN_EMAIL": "your-email@outsystems.com",
  "FIGMA_API_KEY": "your-figma-api-key"
}
EOF
    echo -e "${YELLOW}Please edit $PERSONAL_CREDS with your actual credentials${NC}"
    exit 1
fi

# Create .cursor directory if it doesn't exist
mkdir -p "$CURSOR_DIR"

# Read personal credentials
if command -v jq &> /dev/null; then
    # Use jq if available for better JSON handling
    ATLASSIAN_CLOUD_ID=$(jq -r '.ATLASSIAN_CLOUD_ID // empty' "$PERSONAL_CREDS")
    ATLASSIAN_EMAIL=$(jq -r '.ATLASSIAN_EMAIL // empty' "$PERSONAL_CREDS")
    FIGMA_API_KEY=$(jq -r '.FIGMA_API_KEY // empty' "$PERSONAL_CREDS")
else
    # Fallback to grep/sed (less robust but works without jq)
    ATLASSIAN_CLOUD_ID=$(grep -o '"ATLASSIAN_CLOUD_ID"[[:space:]]*:[[:space:]]*"[^"]*"' "$PERSONAL_CREDS" | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
    ATLASSIAN_EMAIL=$(grep -o '"ATLASSIAN_EMAIL"[[:space:]]*:[[:space:]]*"[^"]*"' "$PERSONAL_CREDS" | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
    FIGMA_API_KEY=$(grep -o '"FIGMA_API_KEY"[[:space:]]*:[[:space:]]*"[^"]*"' "$PERSONAL_CREDS" | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
fi

# Validate credentials
if [ -z "$ATLASSIAN_CLOUD_ID" ] || [ "$ATLASSIAN_CLOUD_ID" = "your-cloud-id" ]; then
    echo -e "${RED}Error: ATLASSIAN_CLOUD_ID not set in $PERSONAL_CREDS${NC}"
    exit 1
fi

if [ -z "$ATLASSIAN_EMAIL" ] || [ "$ATLASSIAN_EMAIL" = "your-email@outsystems.com" ]; then
    echo -e "${RED}Error: ATLASSIAN_EMAIL not set in $PERSONAL_CREDS${NC}"
    exit 1
fi

if [ -z "$FIGMA_API_KEY" ] || [ "$FIGMA_API_KEY" = "your-figma-api-key" ]; then
    echo -e "${YELLOW}Warning: FIGMA_API_KEY not set in $PERSONAL_CREDS${NC}"
    echo "Figma MCP will not work without this key"
fi

# Backup existing config if it exists
if [ -f "$MCP_CONFIG" ]; then
    BACKUP="$MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}Backing up existing config to $BACKUP${NC}"
    cp "$MCP_CONFIG" "$BACKUP"
fi

# Replace environment variables in shared config and write to mcp.json
if command -v jq &> /dev/null; then
    # Use jq for better JSON handling
    jq --arg cloud_id "$ATLASSIAN_CLOUD_ID" \
       --arg email "$ATLASSIAN_EMAIL" \
       --arg figma_key "$FIGMA_API_KEY" \
       '.mcpServers.Atlassian.env.ATLASSIAN_CLOUD_ID = $cloud_id |
        .mcpServers.Atlassian.env.ATLASSIAN_EMAIL = $email |
        .mcpServers."Framelink MCP for Figma".args[2] = "--figma-api-key=" + $figma_key' \
       "$SHARED_CONFIG" > "$MCP_CONFIG"
else
    # Fallback: use sed to replace placeholders
    sed "s|\${ATLASSIAN_CLOUD_ID}|$ATLASSIAN_CLOUD_ID|g; \
         s|\${ATLASSIAN_EMAIL}|$ATLASSIAN_EMAIL|g; \
         s|\${FIGMA_API_KEY}|$FIGMA_API_KEY|g" \
        "$SHARED_CONFIG" > "$MCP_CONFIG"
fi

echo -e "${GREEN}✓ MCP configuration created at $MCP_CONFIG${NC}"
echo -e "${GREEN}✓ Credentials loaded from $PERSONAL_CREDS${NC}"
echo ""
echo "Next steps:"
echo "1. Restart Cursor to load the new MCP configuration"
echo "2. Test MCP connections by asking AI to search for Jira issues"
