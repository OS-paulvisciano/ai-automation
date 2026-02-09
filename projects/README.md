# Projects

Project-specific configurations and overrides.

## Purpose

Projects can have specific configurations (Figma file keys, Jira projects, etc.) and can override skills/agents for project-specific needs.

## Structure

```
projects/
├── {project-name}/
│   ├── skills/          # Project-specific skill overrides
│   ├── agents/          # Project-specific agent overrides
│   └── config.json      # Project configuration
```

## Available Projects

- **`runtime-mobile-widgets`** - Runtime Mobile Widgets JS project

## Project Configuration

Each project can define:
- **Figma Settings**: File keys, design system info
- **Jira Settings**: Project keys, workflows
- **GitHub Settings**: Repo-specific conventions
- **Build Settings**: Test commands, build scripts

## Adding Project Config

1. Create `projects/{project-name}/` directory
2. Create `config.json` with project settings
3. Add skill/agent overrides if needed
4. Document project-specific conventions

## Example: Runtime Mobile Widgets

See `runtime-mobile-widgets/config.json` for project-specific settings.
