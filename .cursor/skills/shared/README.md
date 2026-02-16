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

### All Other Skills (Automation Repo)

All skills live in the automation repo at `.cursor/skills/`. Shared skills are in `shared/` (symlinked into other repos); the rest are used when working with the corresponding repo or agent.

- **`skill:mobile-ui-prepare-xif-from-local`** - `ai-automation/.cursor/skills/mobile-ui-prepare-xif-from-local/SKILL.md`
  - Prepares the XIF for publishing from local: bundle widgets-js, update WidgetLibrary from local, run prepare-xif. Delegates to agent:widgets-js (skill:widgets-js-build) then agent:widget-library (skill:widget-library-update-widgets-js local, skill:widget-library-xif). ODC publishing is manual and out of scope.

- **widgets-js** (automation repo `.cursor/skills/`):
  - **`skill:widgets-js-build`** - Production bundle (Rollup, dist validation)
  - **`skill:widgets-js-storybook`** - Run Storybook dev server (Vite, port 6006)
  - **`skill:widgets-js-tests`** - Run Vitest (unit and Storybook projects)

- **WidgetLibrary** (automation repo `.cursor/skills/`):
  - **`skill:widget-library-update-widgets-js`** - Update widgets-js in WidgetLibrary (npm or local copy)
  - **`skill:widget-library-xif`** - XIF preparation (version bump, build, copy to ODC plugins). ODC publishing is manual.

## Using Skills

Reference skills in your AI prompts:
- "Follow skill:pr-creation"
- "Use skill:jira-updates to update story ROU-12345"
- "Apply skill:branch-naming rules"
- "Prepare XIF from local", "XIF prepare", "prepare xif", or "Bundle and prepare XIF" → Use `skill:mobile-ui-prepare-xif-from-local` (automation repo `.cursor/skills/mobile-ui-prepare-xif-from-local/SKILL.md`)

## Skill Structure

Each skill document includes:
1. **Metadata** - ID, version, dependencies, required MCPs
2. **Rules** - Critical rules that must be followed
3. **Validation** - How to verify the task was done correctly
4. **Examples** - Good and bad examples
5. **AI Instructions** - Step-by-step guide for AI

## Adding New Skills

**For Shared Skills** (used across all repos):
1. Create `.cursor/skills/shared/{skill-name}/SKILL.md` in the automation repo (directory + SKILL.md)
2. Add YAML frontmatter to SKILL.md: `name` (lowercase, hyphens) and `description` (what it does + trigger phrases for Cursor discovery)
3. Follow the skill template (see existing skills in each subdirectory)
4. Update this README
5. Document dependencies and required MCPs
6. Include validation criteria and examples

Other repos get shared skills by symlinking `.cursor/skills/shared` to this repo's `.cursor/skills/shared`.

**For Agent-Specific Skills** (orchestrator-only, automation repo):
1. Create `.cursor/skills/{skill-name}/SKILL.md` in the automation repo (directory + SKILL.md with frontmatter)
2. Document that it's used by an orchestrator agent (e.g. mobile-ui)
3. Update this README

**For repo/agent-specific skills** (widgets-js, widget-library, etc.):
1. Create `.cursor/skills/{skill-name}/SKILL.md` in the **automation repo** (directory + SKILL.md with YAML frontmatter)
2. Follow the skill template (see existing skills)
3. Document which repo/agent the skill applies to
4. Reference shared skills when needed

## Skill Dependencies

Some skills depend on others:
- `pr-creation` depends on `branch-naming` and `jira-updates`
- Skills can reference other skills for related tasks

## Team/Project Overrides

Teams can override org-level skills:
- `.cursor/teams/{team}/skills/{skill-name}.md` - Team override (in automation repo; single file)

**Note:** Project overrides are not accessible via symlink (projects folder is automation-repo-only).

Overrides inherit from base skill and only need to specify differences.
