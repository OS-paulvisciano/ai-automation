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

### 2. Configure Personal Settings

Create `personal/mcp-credentials.json` with your API keys (this file is gitignored):

```json
{
  "ATLASSIAN_CLOUD_ID": "your-cloud-id",
  "ATLASSIAN_EMAIL": "your-email@outsystems.com",
  "FIGMA_API_KEY": "your-figma-api-key"
}
```

### 3. Setup MCP Configuration

Copy the MCP server configs to your `~/.cursor/mcp.json` and replace environment variables with your credentials from `personal/mcp-credentials.json`.

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
2. projects/{project}/     # Project-specific configs
3. teams/{team}/          # Team-specific overrides
4. skills/, agents/       # Org-level defaults (shared)
```

**How it works:**
- **Shared defaults** (`skills/`, `agents/`) provide org-wide standards
- **Team overrides** (`teams/{team}/`) customize for specific teams
- **Project overrides** (`projects/{project}/`) customize for specific projects
- **Personal overrides** (`personal/`) are your local customizations (never committed)

**Example:**
If you're working on `runtime-mobile-widgets` project:
1. AI looks for `personal/skills/pr-creation.md` (if exists, use it)
2. Else looks for `projects/runtime-mobile-widgets/skills/pr-creation.md` (if exists, use it)
3. Else looks for `teams/ui-components/skills/pr-creation.md` (if exists, use it)
4. Else uses `skills/pr-creation.md` (org default)

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

### Personal Customizations

Create personal overrides in `personal/` (gitignored):
- `personal/mcp-credentials.json` - Your API keys and credentials
- `personal/skills/{skill-name}.md` - Personal skill customizations
- `personal/agents/{agent-name}.md` - Personal workflow preferences

These are never committed and take highest priority.

## Documentation

- [Infrastructure Setup](./infrastructure/README.md) - MCP server configuration
- [Skills Guide](./skills/README.md) - Available skills and how to use them
- [Agents Guide](./agents/README.md) - Available workflows
- [Team Customization](./teams/README.md) - How to customize for your team

## License

This framework is for internal OutSystems use.
