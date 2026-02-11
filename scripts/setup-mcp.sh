#!/bin/bash

# Setup script to merge shared MCP config with personal credentials
# This allows sharing MCP server configurations without exposing credentials

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CURSOR_DIR="$HOME/.cursor"
MCP_CONFIG="$CURSOR_DIR/mcp.json"
SHARED_CONFIG="$REPO_ROOT/infrastructure/mcp-config.template.json"
ENV_FILE="$REPO_ROOT/.env"
ENV_EXAMPLE="$REPO_ROOT/.env.example"

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

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Warning: .env file not found at $ENV_FILE${NC}"
    if [ -f "$ENV_EXAMPLE" ]; then
        echo "Creating .env from .env.example..."
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo -e "${YELLOW}Please edit $ENV_FILE with your actual credentials${NC}"
    else
        echo "Creating .env template file..."
        cat > "$ENV_FILE" << 'EOF'
# MCP Server Credentials
ATLASSIAN_CLOUD_ID=your-cloud-id
ATLASSIAN_EMAIL=your-email@outsystems.com
FIGMA_API_KEY=your-figma-api-key
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_CHANNEL_ID=CXXXXXXXXXX
EOF
        echo -e "${YELLOW}Please edit $ENV_FILE with your actual credentials${NC}"
    fi
    exit 1
fi

# Create .cursor directory if it doesn't exist
mkdir -p "$CURSOR_DIR"

# Load environment variables from .env file
# This handles comments and empty lines
set -a
source "$ENV_FILE"
set +a

# Read credentials from environment
ATLASSIAN_CLOUD_ID="${ATLASSIAN_CLOUD_ID:-}"
ATLASSIAN_EMAIL="${ATLASSIAN_EMAIL:-}"
FIGMA_API_KEY="${FIGMA_API_KEY:-}"
SLACK_BOT_TOKEN="${SLACK_BOT_TOKEN:-}"
SLACK_CHANNEL_ID="${SLACK_CHANNEL_ID:-}"

# Validate credentials
if [ -z "$ATLASSIAN_CLOUD_ID" ] || [ "$ATLASSIAN_CLOUD_ID" = "your-cloud-id" ]; then
    echo -e "${RED}Error: ATLASSIAN_CLOUD_ID not set in $ENV_FILE${NC}"
    exit 1
fi

if [ -z "$ATLASSIAN_EMAIL" ] || [ "$ATLASSIAN_EMAIL" = "your-email@outsystems.com" ]; then
    echo -e "${RED}Error: ATLASSIAN_EMAIL not set in $ENV_FILE${NC}"
    exit 1
fi

if [ -z "$FIGMA_API_KEY" ] || [ "$FIGMA_API_KEY" = "your-figma-api-key" ]; then
    echo -e "${YELLOW}Warning: FIGMA_API_KEY not set in $ENV_FILE${NC}"
    echo "Figma MCP will not work without this key"
fi

if [ -z "$SLACK_BOT_TOKEN" ] || [ "$SLACK_BOT_TOKEN" = "xoxb-your-bot-token" ]; then
    echo -e "${YELLOW}Warning: SLACK_BOT_TOKEN not set in $ENV_FILE${NC}"
    echo "Slack MCP will not work without this token"
fi

if [ -z "$SLACK_CHANNEL_ID" ] || [ "$SLACK_CHANNEL_ID" = "CXXXXXXXXXX" ]; then
    echo -e "${YELLOW}Warning: SLACK_CHANNEL_ID not set in $ENV_FILE${NC}"
    echo "Slack MCP will not work without channel ID"
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
       --arg slack_token "$SLACK_BOT_TOKEN" \
       --arg slack_channel "$SLACK_CHANNEL_ID" \
       '.mcpServers.Atlassian.env.ATLASSIAN_CLOUD_ID = $cloud_id |
        .mcpServers.Atlassian.env.ATLASSIAN_EMAIL = $email |
        .mcpServers."Framelink MCP for Figma".args[2] = "--figma-api-key=" + $figma_key |
        .mcpServers.Slack.env.SLACK_BOT_TOKEN = $slack_token |
        .mcpServers.Slack.env.SLACK_CHANNEL_ID = $slack_channel' \
       "$SHARED_CONFIG" > "$MCP_CONFIG"
else
    # Fallback: use sed to replace placeholders
    sed "s|\${ATLASSIAN_CLOUD_ID}|$ATLASSIAN_CLOUD_ID|g; \
         s|\${ATLASSIAN_EMAIL}|$ATLASSIAN_EMAIL|g; \
         s|\${FIGMA_API_KEY}|$FIGMA_API_KEY|g; \
         s|\${SLACK_BOT_TOKEN}|$SLACK_BOT_TOKEN|g; \
         s|\${SLACK_CHANNEL_ID}|$SLACK_CHANNEL_ID|g" \
        "$SHARED_CONFIG" > "$MCP_CONFIG"
fi

echo -e "${GREEN}✓ MCP configuration created at $MCP_CONFIG${NC}"
echo -e "${GREEN}✓ Credentials loaded from $ENV_FILE${NC}"
echo ""
echo "Next steps:"
echo "1. Restart Cursor to load the new MCP configuration"
echo "2. Test MCP connections by asking AI to search for Jira issues"
