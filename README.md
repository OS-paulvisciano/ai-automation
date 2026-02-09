# AI Automation Framework

Shared AI automation rules, skills, and workflows for OutSystems teams.

## Overview

This repository contains a comprehensive framework for standardizing AI-assisted development workflows. It provides reusable skills, agent workflows, and infrastructure configurations that can be shared across teams and projects.

## Structure

- **`infrastructure/`** - MCP server configurations and setup
- **`skills/`** - Reusable task rules and guidelines (PR creation, Jira updates, etc.)
- **`agents/`** - Workflow definitions that combine multiple skills
- **`teams/`** - Team-specific overrides and customizations
- **`projects/`** - Project-specific configurations
- **`personal/`** - Personal overrides (gitignored, for local customization)

## Getting Started

### 1. Clone and Setup

You have two options for setup:

**Option A: Clone directly to Cursor folder**
```bash
# Clone this repository
git clone https://github.com/OS-paulvisciano/ai-automation.git ~/.cursor/ai-automation
```

**Option B: Clone to repos folder and symlink (recommended)**
```bash
# Clone to your repos folder
git clone https://github.com/OS-paulvisciano/ai-automation.git ~/repos/ai-automation

# Create symlink so Cursor can access it
ln -s ~/repos/ai-automation ~/.cursor/ai-automation
```

**Why symlink?** This keeps your repos organized while allowing Cursor to access the framework at the expected location. Changes in either location are the same (they point to the same files).

### 4. Setup Repo-Specific Access (Optional)

For individual repositories, you can create a symlink to access the framework:

```bash
# In your repo root (e.g., runtime-mobile-widgets-js)
mkdir -p .cursor
ln -s ~/.cursor/ai-automation .cursor/ai-automation
```

This allows:
- Access to shared framework via `.cursor/ai-automation/`
- Repo-specific items in `.cursor/` (e.g., `plans/`, custom skills/agents)
- Clear separation between shared and repo-specific configurations

### 2. Configure Personal Settings

Create a `.env` file with your API keys (this file is gitignored):

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual credentials
```

The `.env` file should contain:
```bash
ATLASSIAN_CLOUD_ID=your-cloud-id
ATLASSIAN_EMAIL=your-email@outsystems.com
FIGMA_API_KEY=your-figma-api-key
```

### 3. Setup MCP Configuration

**Option A: Use the setup script (Recommended)**
```bash
# Run the setup script to merge shared config with your credentials
./scripts/setup-mcp.sh
```

The script will:
- Read your credentials from `.env` file
- Merge with the shared MCP config from `infrastructure/mcp-config.template.json`
- Create `~/.cursor/mcp.json` with your credentials

**Option B: Manual setup**
1. Copy `infrastructure/mcp-config.template.json` to `~/.cursor/mcp.json`
2. Load your `.env` file: `source .env`
3. Replace `${ATLASSIAN_CLOUD_ID}`, `${ATLASSIAN_EMAIL}`, and `${FIGMA_API_KEY}` with actual values from your `.env` file

**Note:** The shared MCP config template is in `infrastructure/mcp-config.template.json` - it uses environment variable placeholders that get replaced with your personal credentials from `.env`.

## Usage

### Referencing Skills

When working with AI, reference skills and agents:

- "Use skill:pr-creation to create a PR"
- "Run agent:story-completion for story ROU-12345"
- "Follow skill:jira-updates to update the story"
- "Apply skill:branch-naming rules"

### Configuration Hierarchy

The framework uses a **priority-based override system** that allows customization at multiple levels while maintaining shared defaults:

```
Priority (Highest → Lowest):
1. personal/              # Your personal overrides (gitignored)
2. .cursor/ (in repo)     # Repo-specific overrides (if .cursor/ai-automation symlink exists)
3. projects/{project}/     # Project-specific configs
4. teams/{team}/          # Team-specific overrides
5. skills/, agents/       # Org-level defaults (shared)
```

**How it works:**
- **Shared defaults** (`skills/`, `agents/`) provide org-wide standards
- **Team overrides** (`teams/{team}/`) customize for specific teams
- **Project overrides** (`projects/{project}/`) customize for specific projects
- **Personal overrides** (`personal/`) are your local customizations (never committed)

**Example:**
If you're working on `runtime-mobile-widgets` project with `.cursor/ai-automation/` symlink:
1. AI looks for `personal/skills/pr-creation.md` (if exists, use it)
2. Else looks for `.cursor/skills/pr-creation.md` in repo (if exists, use it)
3. Else looks for `projects/runtime-mobile-widgets/skills/pr-creation.md` (if exists, use it)
4. Else looks for `teams/ui-components/skills/pr-creation.md` (if exists, use it)
5. Else uses `skills/pr-creation.md` (org default)

This allows teams to customize workflows while maintaining consistency across the organization.

## Contributing

### Adding New Skills

1. Create `skills/{skill-name}.md`
2. Follow the skill template (see existing skills)
3. Update `skills/README.md`
4. Document dependencies and required MCPs

### Adding New Agents

1. Create `agents/{agent-name}.md`
2. Define workflow steps
3. List required skills
4. Update `agents/README.md`

### Team Customizations

Teams can override org-level skills/agents by creating:
- `teams/{team-name}/skills/{skill-name}.md` - Override specific skill
- `teams/{team-name}/agents/{agent-name}.md` - Override specific agent
- `teams/{team-name}/config.json` - Team-specific configuration

**Example:** UI Components team might override PR creation to add team-specific requirements:
```bash
# Create team override
mkdir -p teams/ui-components/skills
cp skills/pr-creation.md teams/ui-components/skills/pr-creation.md
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
- `ai-automation/` - Symlink to `~/.cursor/ai-automation` (shared framework)
- `plans/` - Repo-specific automation plans
- `skills/` - Repo-specific skill overrides
- `agents/` - Repo-specific agent overrides

**Example:**
```bash
# In your repo root
mkdir -p .cursor/plans
# Add story-specific automation plans here
```

### Personal Customizations

Create personal overrides in `personal/` (gitignored):
- `personal/.env` - Your API keys and credentials
- `personal/skills/{skill-name}.md` - Personal skill customizations
- `personal/agents/{agent-name}.md` - Personal workflow preferences

These are never committed and take highest priority.

## Documentation

- [Infrastructure Setup](./infrastructure/README.md) - MCP server configuration
- [Skills Guide](./skills/README.md) - Available skills and how to use them
- [Agents Guide](./agents/README.md) - Available workflows
- [Team Customization](./teams/README.md) - How to customize for your team
- [TODO](./TODO.md) - Future enhancements and improvements

## License

This framework is for internal OutSystems use.
