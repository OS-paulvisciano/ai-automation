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

### Shared Skills (Used by All Agents)

- **`pr-creation`** - Pull request creation rules and guidelines
- **`jira-updates`** - Jira issue update conventions
- **`branch-naming`** - Branch naming rules and conventions
- **`design-verification`** - Figma/design token verification rules
- **`release-notes`** - Release notes update conventions
- **`odc-testing`** - ODC Studio testing workflow after XIF publishing

### Repository-Specific Skills

Repository-specific skills are located in their respective repositories:

- **`skill:widgets-js-build`** - Located in `runtime-mobile-widgets-js/.cursor/skills/widgets-js-build.md`
  - Build and bundle workflows for widgets-js repository
  - Storybook testing procedures, build validation

- **`skill:widget-library-xif`** - Located in `OutSystems.WidgetLibrary/.cursor/skills/widget-library-xif.md`
  - XIF preparation workflow for WidgetLibrary
  - Version bumping, XIF file generation, manual publishing steps

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

**For Shared Skills** (used across all repos):
1. Create `.cursor/shared/skills/{skill-name}.md` in the automation repo
2. Follow the skill template (see existing skills)
3. Update this README
4. Document dependencies and required MCPs
5. Include validation criteria and examples

**For Repository-Specific Skills**:
1. Create `.cursor/skills/{skill-name}.md` in the target repository
2. Follow the skill template (see existing skills)
3. Document that it's repo-specific
4. Reference shared skills when needed

## Skill Dependencies

Some skills depend on others:
- `pr-creation` depends on `branch-naming` and `jira-updates`
- Skills can reference other skills for related tasks

## Team/Project Overrides

Teams can override org-level skills:
- `.cursor/teams/{team}/skills/{skill-name}.md` - Team override (in automation repo)

**Note:** Project overrides are not accessible via symlink (projects folder is automation-repo-only).

Overrides inherit from base skill and only need to specify differences.
