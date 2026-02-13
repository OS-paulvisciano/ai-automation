# Agents

Workflow definitions that combine multiple skills to accomplish complex tasks.

## What are Agents?

Agents are workflow definitions that orchestrate multiple skills to complete end-to-end tasks. They define:
- **Workflow steps** - Sequential or parallel steps to complete a task
- **Skills used** - Which skills are required for each step
- **Configuration** - Parameters and options
- **Validation** - How to verify the workflow completed successfully

## Available Agents

- **`mobile-ui-change`** - End-to-end Mobile UI change workflow (branch → implement → widgetlib → XIF → ODC testing → PR) - **Primary agent for Mobile UI work**
- **`design-verification`** - Design verification workflow (Figma → compare → verify)
- **`pr-creation`** - PR creation workflow (validate → create → label)

## Using Agents

Reference agents in your AI prompts:
- "Run agent:mobile-ui-change for story ROU-12345" (primary agent for Mobile UI work)
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
- `mobile-ui-change` uses: `branch-naming`, `jira-updates`, `pr-creation`, `design-verification`, `release-notes`, `odc-testing`
- Agents can call other agents for sub-workflows

## Reference Documentation

- **`docs/mobile-ui-lifecycle-reference.md`** - Complete lifecycle reference from TO DO to DONE, showing automation status and full workflow details

## Team/Project Overrides

Teams can override org-level agents:
- `.cursor/shared/teams/{team}/agents/{agent-name}.md` - Team override

**Note:** Project overrides are not accessible via symlink (projects folder is automation-repo-only).

Overrides inherit from base agent and only need to specify differences.
