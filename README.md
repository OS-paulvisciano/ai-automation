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

```bash
# Clone this repository
git clone <your-repo-url> ~/.cursor/ai-automation

# Or symlink if you prefer
ln -s ~/repos/paul-visciano-ai-automation ~/.cursor/ai-automation
```

### 2. Configure Personal Settings

Create `personal/mcp-credentials.json` with your API keys:

```json
{
  "ATLASSIAN_CLOUD_ID": "your-cloud-id",
  "ATLASSIAN_EMAIL": "your-email@outsystems.com",
  "FIGMA_API_KEY": "your-figma-api-key"
}
```

### 3. Setup MCP Configuration

Copy the MCP server configs to your `~/.cursor/mcp.json` and replace environment variables with your credentials.

## Usage

### Referencing Skills

When working with AI, reference skills and agents:

- "Use skill:pr-creation to create a PR"
- "Run agent:story-completion for story ROU-12345"
- "Follow skill:jira-updates to update the story"
- "Apply skill:branch-naming rules"

### Priority Order

The framework uses a priority system for overrides:
1. `personal/` - Personal overrides (highest priority)
2. `projects/{project}/` - Project-specific
3. `teams/{team}/` - Team-specific
4. `skills/`, `agents/` - Org-level defaults (lowest priority)

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
- `teams/{team-name}/skills/{skill-name}.md`
- `teams/{team-name}/agents/{agent-name}.md`

## Documentation

- [Infrastructure Setup](./infrastructure/README.md) - MCP server configuration
- [Skills Guide](./skills/README.md) - Available skills and how to use them
- [Agents Guide](./agents/README.md) - Available workflows
- [Team Customization](./teams/README.md) - How to customize for your team

## License

This framework is for internal OutSystems use.
