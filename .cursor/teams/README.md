# Teams

Team-specific overrides and customizations.

## Purpose

Teams can override org-level skills and agents to customize workflows for their specific needs while maintaining consistency across the organization.

## Structure

```
.cursor/teams/
├── {team-name}/
│   ├── skills/          # Team-specific skill overrides
│   ├── agents/          # Team-specific agent overrides
│   └── config.json      # Team configuration
```

## Available Teams

- **`ui-components`** - UI Components team

## How Overrides Work

1. **Inheritance**: Team overrides inherit from org-level skills/agents
2. **Selective Override**: Only specify what's different
3. **Priority**: Team overrides take precedence over org-level

## Adding Team Overrides

1. Create `.cursor/teams/{team-name}/` directory (in automation repo)
2. Create override files:
   - `skills/{skill-name}.md` - Override specific skill
   - `agents/{agent-name}.md` - Override orchestrator agent
3. Add `config.json` for team-specific settings
4. Document why override is needed

## Example: UI Components Team

The UI Components team may have:
- Custom PR templates
- Specific Jira project settings
- Team-specific design verification rules

See `ui-components/config.json` for team configuration.
