# Skills

Reusable knowledge and rules for specific tasks.

## What are Skills?

Skills are comprehensive rule documents that define how to perform specific tasks correctly. They contain:
- **Rules and conventions** - What must be followed
- **Validation criteria** - How to verify correctness
- **Examples** - Good and bad examples
- **Common mistakes** - What to avoid
- **AI instructions** - How the AI should perform the task

## Available Skills

- **`pr-creation`** - Pull request creation rules and guidelines
- **`jira-updates`** - Jira issue update conventions
- **`branch-naming`** - Branch naming rules and conventions
- **`design-verification`** - Figma/design token verification rules

## Using Skills

Reference skills in your AI prompts:
- "Follow skill:pr-creation"
- "Use skill:jira-updates to update story ROU-12345"
- "Apply skill:branch-naming rules"

## Skill Structure

Each skill document includes:
1. **Metadata** - ID, version, dependencies, required MCPs
2. **Rules** - Critical rules that must be followed
3. **Validation** - How to verify the task was done correctly
4. **Examples** - Good and bad examples
5. **AI Instructions** - Step-by-step guide for AI

## Adding New Skills

1. Create `.cursor/shared/skills/{skill-name}.md`
2. Follow the skill template (see existing skills)
3. Update this README
4. Document dependencies and required MCPs
5. Include validation criteria and examples

## Skill Dependencies

Some skills depend on others:
- `pr-creation` depends on `branch-naming` and `jira-updates`
- Skills can reference other skills for related tasks

## Team/Project Overrides

Teams can override org-level skills:
- `.cursor/shared/teams/{team}/skills/{skill-name}.md` - Team override

**Note:** Project overrides are not accessible via symlink (projects folder is automation-repo-only).

Overrides inherit from base skill and only need to specify differences.
