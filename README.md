# AI Automation Framework

Shared AI automation rules, skills, and workflows for OutSystems teams.

## Overview

This repository contains a comprehensive framework for standardizing AI-assisted development workflows. It provides reusable skills, agent workflows, and infrastructure configurations that can be shared across teams and projects.

## Structure

**Shared Framework (symlinked to individual repos):**
- **`.cursor/shared/skills/`** - Reusable task rules and guidelines (each skill is `shared/skills/<name>/SKILL.md`). Other repos get these by symlinking `.cursor/shared` to this repo's `.cursor/shared`.
- **`.cursor/agents/`** - Orchestrator agents (automation repo only)
- **`.cursor/skills/`** - Agent-specific skills (automation repo only), e.g. prepare XIF from local
- **`.cursor/teams/`** - Team-specific overrides (automation repo only)

**Automation Repo Only:**
- **`infrastructure/`** - MCP server configurations and setup
- **`projects/`** - Project-specific configurations (used by setup scripts)
- **`scripts/`** - Setup and utility scripts
- **`docs/`** - Documentation
- **`.cursor/plans/`** - Automation repo's own plans

## Getting Started

### Recommended Workflow

The recommended approach is to **clone the automation repo first**, configure it, then use it to set up your project repositories. This ensures all repos are properly configured with the automation framework.

### 1. Clone the Automation Repository

Clone the automation repository to your repos folder:

```bash
# Clone to your repos folder
git clone https://github.com/OS-paulvisciano/ai-automation.git ~/repos/ai-automation

# Navigate to the automation repo
cd ~/repos/ai-automation
```

**Note:** The automation repo can be cloned anywhere, but keeping it in your repos folder alongside other projects keeps things organized.

### 2. Configure Credentials

**All MCP credentials are stored in the ai-automation framework** so they can be shared across repositories. Create a `.env` file in the ai-automation repo root with your API keys (this file is gitignored):

```bash
# Navigate to ai-automation repo (if not already there)
cd ~/repos/ai-automation

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

# Azure DevOps PAT (for npm authentication in WidgetLibrary and runtime-mobile-widgets-js)
# Generate at: https://dev.azure.com/OutSystemsRD/_usersSettings/tokens
# Required scope: Packaging (Read)
AZURE_DEVOPS_PAT=your-azure-devops-pat-token
```

**Important:** The `.env` file is gitignored and stored in the ai-automation repo, not in individual repositories. This allows credentials to be shared across all repos that use the framework via symlinks.

### 3. Setup MCP Configuration

**Important: MCP configuration is stored at USER LEVEL** (`~/.cursor/mcp.json`), not in repositories. 

**How credentials work:**
- The `.env` file is the **source of truth** - store all credentials here
- The `mcp.json` file is **auto-generated** from `.env` and contains actual values (required by Cursor's MCP)
- **Never manually edit `mcp.json`** - always edit `.env` and regenerate using the setup script
- The setup script pulls values from `.env` and generates `mcp.json` with actual values (Cursor requires this)

**Option A: Use the setup script (Recommended)**
```bash
# Run the setup script to merge shared config with your credentials
node scripts/setup-mcp.js
```

The script will:
- Read **all credentials** from `.env` file (no hardcoded values)
- Merge with the shared MCP config template from `infrastructure/mcp-config.template.json`
- Replace all placeholder values (e.g., `${ATLASSIAN_CLOUD_ID}`) with actual values from `.env`
- Create/update `~/.cursor/mcp.json` at the **user level** with your credentials

**Option B: Manual setup (Not Recommended)**
1. Copy `infrastructure/mcp-config.template.json` to `~/.cursor/mcp.json`
2. Load your `.env` file: `source .env`
3. Replace **all** placeholder values (`${VAR}`) with actual values from your `.env` file
4. **Never hardcode credentials** - always use values from `.env`

**Note:** 
- The shared MCP config template uses environment variable placeholders (e.g., `${ATLASSIAN_CLOUD_ID}`)
- The setup script automatically replaces these with actual values from `.env`
- MCP config is user-level (`~/.cursor/mcp.json`) and shared across all repositories
- To update credentials, edit `.env` and run the setup script again

### 4. Connect MCP Servers in Cursor

After creating `~/.cursor/mcp.json`, you need to:

1. **Restart Cursor** completely (quit and reopen)
2. **Open Settings** → **Tools & MCP**
3. **Verify MCP servers appear** in the "Installed MCP Servers" section:
   - **Atlassian** - Shows "Needs authentication" with a "Connect" button
   - **browsermcp** - Should show "X tools enabled" with toggle on
   - **Framelink MCP for Figma** - Should show "X tools enabled" with toggle on

4. **Connect Atlassian MCP**:
   - Click the **"Connect"** button next to Atlassian
   - This will open a browser window for OAuth authentication
   - Sign in with your Atlassian account
   - Authorize the connection
   - The status should change to "Connected" with tools enabled

**Note:** If MCP servers don't appear after restarting, verify that `~/.cursor/mcp.json` exists and contains valid JSON with the `mcpServers` object populated.

### 4. Setup Project Repositories

Now that the automation framework is configured, use it to set up your project repositories. The setup script will:
- Clone the project repository (or use existing if present)
- Create symlink to automation framework in `.cursor/shared`
- Configure project-specific settings (npm authentication, etc.)

**Available Projects:**
- `widget-library` - OutSystems Widget Library for Mobile UI components
- `runtime-mobile-widgets` - Runtime Mobile Widgets JS project

**Example: Setting up WidgetLibrary**
```bash
# From the automation repo directory
cd ~/repos/ai-automation

# Run the setup script
node scripts/setup-project.js widget-library
```

The script will:
1. Clone `OutSystems/OutSystems.WidgetLibrary` to `~/repos/OutSystems.WidgetLibrary` (or use existing)
2. Create `.cursor/shared` symlink pointing to `.cursor/shared` in the automation framework
3. Prompt for Azure DevOps PAT if missing (saves to `.env` file)
4. Configure npm authentication
5. Set up `.npmrc` files

**Why symlink?** The symlink ensures:
- Updates to automation framework docs propagate to all repos automatically
- Works in both single-repo and multi-repo workspace scenarios
- Single source of truth for automation framework
- Each repo can still have its own `.cursor/plans/` and customizations

**For complete workflow documentation**, see [projects/README.md](./projects/README.md) which includes:
- Complete setup workflow for each project
- Step-by-step instructions from clone to XIF creation
- Project-specific automation scripts

## Usage

### Using Skills and Agents

Use natural language - the AI will automatically identify which skills/agents to use:

- "Create a PR" → Uses PR creation rules
- "Update the Jira story" → Uses Jira update rules
- "Create a branch" → Uses branch naming rules
- "Check if this matches Figma" → Uses design verification rules
- "Prepare XIF from local" or "Bundle and prepare XIF" → Uses prepare-xif-from-local skill (bundle widgets-js, update WidgetLibrary from local, run prepare-xif)
- "Complete story ROU-12345" → Uses story completion workflow

**Prefixes are optional** - You can use `skill:` or `agent:` prefixes if you want to be explicit, but natural language works just as well.

### Configuration Hierarchy

The framework uses a **priority-based override system** that allows customization at multiple levels while maintaining shared defaults:

```
Priority (Highest → Lowest):
1. .cursor/ (in user's repo)                    # Repo-specific agents, skills, and overrides
2. .cursor/teams/{team}/ (automation repo)       # Team-specific overrides
3. .cursor/shared/skills/ (automation repo)      # Shared skills (org-level defaults)
```

**How it works:**
- **Shared skills** (`.cursor/shared/skills/`) provide org-wide standards for reusable tasks
- **Orchestrator agents** (`.cursor/agents/`) coordinate workflows across repos (automation repo only)
- **Team overrides** (`.cursor/teams/{team}/`) customize for specific teams (automation repo only)
- **Repo-specific agents/skills** (`.cursor/agents/`, `.cursor/skills/` in individual repos) allow per-repo customizations
- **Project configs** (`projects/{project}/config.json` in automation repo) are used by setup scripts, not directly by individual repos

**Example:**
If you're working on `runtime-mobile-widgets` project with `.cursor/shared/` symlink:
1. AI looks for `.cursor/skills/pr-creation.md` in repo (if exists, use it)
2. Else looks for `.cursor/teams/ui-components/skills/pr-creation.md` in automation repo (if exists, use it)
3. Else uses `.cursor/shared/skills/pr-creation/SKILL.md` in automation repo (org default)

This allows teams to customize workflows while maintaining consistency across the organization.

## Contributing

### Adding New Skills

1. Create `.cursor/shared/skills/{skill-name}/SKILL.md` (directory + SKILL.md with YAML frontmatter)
2. Follow the skill template (see existing skills)
3. Update `.cursor/shared/skills/README.md`
4. Document dependencies and required MCPs

### Adding New Agents

**For Orchestrator Agents** (automation repo):
1. Create `.cursor/agents/{agent-name}.md` in automation repo
2. Define workflow steps
3. List required skills

**For Repository-Specific Agents**:
1. Create `.cursor/agents/{agent-name}.md` in target repository
2. Define workflow steps
3. List required skills (shared and repo-specific)

### Team Customizations

Teams can override org-level skills/agents by creating:
- `teams/{team-name}/skills/{skill-name}.md` - Override specific skill
- `teams/{team-name}/agents/{agent-name}.md` - Override specific agent
- `teams/{team-name}/config.json` - Team-specific configuration

**Example:** UI Components team might override PR creation to add team-specific requirements:
```bash
# Create team override (in automation repo)
mkdir -p .cursor/teams/ui-components/skills
cp .cursor/shared/skills/pr-creation/SKILL.md .cursor/teams/ui-components/skills/pr-creation.md
# Edit to add team-specific rules
```

### Project Customizations

Projects can have specific configurations and overrides:
- `projects/{project-name}/config.json` - Project settings (Figma file keys, Jira projects, etc.)
- `projects/{project-name}/skills/{skill-name}.md` - Project-specific skill overrides
- `projects/{project-name}/agents/{agent-name}.md` - Project-specific agent overrides

**Example:** Runtime Mobile Widgets project has its own Figma file key in `projects/runtime-mobile-widgets/config.json`.

### Repo-Specific Customizations

In individual repositories, create `.cursor/` folder with:
- `shared/` - Symlink to `~/repos/ai-automation/.cursor/shared` (shared framework)
- `plans/` - Repo-specific automation plans
- `skills/` - Repo-specific skill overrides (optional)
- `agents/` - Repo-specific agent overrides (optional)

**Example:**
```bash
# In your repo root
mkdir -p .cursor/plans
# Add story-specific automation plans here
```

### Personal Customizations

Personal overrides can be created in individual repos' `.cursor/` folders (gitignored):
- `.cursor/skills/{skill-name}.md` - Personal skill customizations (repo-specific)
- `.cursor/agents/{agent-name}.md` - Personal workflow preferences (repo-specific)

These are never committed and take highest priority in that repo.

## Documentation

- **[Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md)** - Step-by-step setup instructions (start here!)
- [Infrastructure Setup](./infrastructure/README.md) - MCP server configuration details
- [Automation Setup](./docs/AUTOMATION_SETUP.md) - Overview of automation workflows
- [Skills Guide](./.cursor/shared/skills/README.md) - Available skills and how to use them
- [Agents Guide](./.cursor/shared/agents/README.md) - Available workflows (note: orchestrator agents are in `.cursor/agents/`)
- [Team Customization](./.cursor/teams/README.md) - How to customize for your team
- [TODO](./TODO.md) - Future enhancements and improvements

## License

This framework is for internal OutSystems use.
