# Agents

Workflow definitions that combine multiple skills to accomplish complex tasks.

## What are Agents?

Agents are workflow definitions that orchestrate multiple skills to complete end-to-end tasks. They define:
- **Workflow steps** - Sequential or parallel steps to complete a task
- **Skills used** - Which skills are required for each step
- **Configuration** - Parameters and options
- **Validation** - How to verify the workflow completed successfully

## Available Agents

- **`story-completion`** - Complete story implementation workflow (branch → implement → verify → document → PR)
- **`design-verification`** - Design verification workflow (Figma → compare → verify)
- **`pr-creation`** - PR creation workflow (validate → create → label)
- **`mobile-ui-change`** - End-to-end Mobile UI change workflow (widgetjs → widgetlib → XIF → ODC testing)

## Using Agents

Reference agents in your AI prompts:
- "Run agent:story-completion for story ROU-12345"
- "Use agent:design-verification to check my component"
- "Execute agent:pr-creation"

## Agent Structure

Each agent document includes:
1. **Metadata** - ID, version, skills used, MCPs required
2. **Workflow** - Step-by-step process
3. **Configuration** - Configurable parameters
4. **Validation** - Success criteria
5. **Error Handling** - How to handle failures

## Adding New Agents

1. Create `.cursor/shared/agents/{agent-name}.md`
2. Define workflow steps
3. List required skills
4. Document configuration options
5. Update this README

## Agent Dependencies

Agents depend on skills:
- `story-completion` uses: `branch-naming`, `jira-updates`, `pr-creation`, `design-verification`
- Agents can call other agents for sub-workflows

## Team/Project Overrides

Teams can override org-level agents:
- `.cursor/shared/teams/{team}/agents/{agent-name}.md` - Team override

**Note:** Project overrides are not accessible via symlink (projects folder is automation-repo-only).

Overrides inherit from base agent and only need to specify differences.
