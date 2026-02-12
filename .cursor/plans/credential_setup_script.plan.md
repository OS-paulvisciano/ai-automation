# Create Interactive Credential Setup Script

## Overview

Create `scripts/setup-auth.js` that provides an interactive, guided setup for all credentials needed by the automation framework. This script will walk users through obtaining and entering credentials for:

- Atlassian/Jira MCP (Cloud ID, Email)
- Figma MCP (API Key)
- Azure DevOps PAT (for npm authentication)

Note: Slack MCP credentials are excluded for now as the bot is not yet running.

## Implementation Details

### File to Create

- `scripts/setup-auth.js` - Main interactive credential setup script

### Key Features

1. **Interactive Prompts**: Use `readline` interface (similar to `setup-project.js`) to prompt for each credential
2. **Instructions**: For each credential, display clear instructions on where/how to obtain it
3. **Validation**: Basic format validation (email format, token prefixes, etc.)
4. **Skip/Update**: Allow users to skip credentials they don't need or update existing ones
5. **Save to .env**: Write all credentials to `.env` file, preserving existing values
6. **Optional MCP Setup**: At the end, offer to run `setup-mcp.js` to generate MCP config

### Credential Flow

For each credential, the script should:

1. Check if credential already exists in `.env` (not a placeholder)
2. If exists, ask if user wants to update it
3. If missing or placeholder, show instructions on how to get it
4. Prompt for the value
5. Validate format (where possible)
6. Save to `.env` file

### Credentials to Handle

1. **ATLASSIAN_CLOUD_ID**

      - Instructions: Get from Atlassian admin or cloud instance URL
      - Validation: Non-empty string

2. **ATLASSIAN_EMAIL**

      - Instructions: Your OutSystems email address
      - Validation: Email format

3. **FIGMA_API_KEY**

      - Instructions: Get from https://www.figma.com/settings
      - Validation: Non-empty string (optional - can skip)

4. **AZURE_DEVOPS_PAT**

      - Instructions: Generate at https://dev.azure.com/OutSystemsRD/_usersSettings/tokens (scope: Packaging Read)
      - Validation: Non-empty string

### Script Structure

```javascript
// Similar structure to setup-project.js:
- Signal handlers for interrupt handling
- Readline interface for prompts
- Load existing .env file
- For each credential:
 - Check if exists/valid
 - Show instructions
 - Prompt for value
 - Validate
 - Save to .env
- Optionally run setup-mcp.js
- Show summary of what was configured
```

### Integration Points

- Read from `.env.example` as template if `.env` doesn't exist
- Use same patterns as `setup-project.js` for interrupt handling
- Call `setup-mcp.js` programmatically or via `spawn` at the end
- Preserve comments and formatting in `.env` file

### User Experience

1. Script starts with welcome message
2. For each credential, shows:

      - Current status (missing/exists/placeholder)
      - Instructions on where to get it
      - Prompt for value

3. At end, shows summary
4. Asks if user wants to run `setup-mcp.js` now
5. Provides next steps

### Error Handling

- Handle Ctrl+C gracefully (like setup-project.js)
- Validate inputs where possible
- Allow skipping optional credentials (Figma)
- Preserve existing .env file structure and comments