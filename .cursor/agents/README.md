
# Agents

Workflow definitions that combine multiple skills to accomplish complex tasks.

## What are Agents?

Agents are workflow definitions that orchestrate multiple skills to complete end-to-end tasks. They define:
- **Workflow steps** - Sequential or parallel steps to complete a task
- **Skills used** - Which skills are required for each step
- **Configuration** - Parameters and options
- **Validation** - How to verify the workflow completed successfully

## Available Agents

### Orchestrator Agents

**Note**: Orchestrator agents are located in the automation repo at `.cursor/agents/`, not in shared.

- **`mobile-ui`** - Located in `.cursor/agents/mobile-ui.md` (automation repo)
  - End-to-end Mobile UI workflow orchestrator (delegates to repo-specific agents)
  - **Primary agent for Mobile UI work**

### Repository-Specific Agents

Repository-specific agents are located in their respective repositories:

- **`agent:widgets-js`** - Located in `runtime-mobile-widgets-js/.cursor/agents/widgets-js.md`
  - Handles implementation workflow for widgets-js repository
  - Branch creation, implementation, Storybook testing, build, commit/push

- **`agent:widget-library`** - Located in `OutSystems.WidgetLibrary/.cursor/agents/widget-library.md`
  - Handles WidgetLibrary consumption and XIF preparation
  - Branch creation, update runtime widgets, prepare XIF, coordinate publishing

**Note**: `design-verification` and `pr-creation` are skills only, not agents. Agents orchestrate multi-step workflows across repos/domains, while skills are single tasks.

## Using Agents

Reference agents in your AI prompts:
- "Run agent:mobile-ui for story ROU-12345" (primary orchestrator for Mobile UI work)
- "Use agent:widgets-js for story ROU-12345" (repo-specific agent for widgets-js work)
- "Use agent:widget-library for story ROU-12345" (repo-specific agent for WidgetLibrary work)

## Agent Structure

Each agent document includes:
1. **Metadata** - ID, version, skills used, MCPs required
2. **Workflow** - Step-by-step process
3. **Configuration** - Configurable parameters
4. **Validation** - Success criteria
5. **Error Handling** - How to handle failures

## Adding New Agents

**For Orchestrator Agents** (automation repo):
1. Create `.cursor/agents/{agent-name}.md` in the automation repo
2. Define workflow steps
3. List required skills
4. Document configuration options

**For Repository-Specific Agents**:
1. Create `.cursor/agents/{agent-name}.md` in the target repository
2. Define workflow steps
3. List required skills (shared and repo-specific)
4. Document configuration options

## Agent Architecture

**Orchestrator Pattern**: 
- **Orchestrator Agents** (shared): Coordinate workflows across multiple repositories
  - `agent:mobile-ui` - Delegates to repo-specific agents for end-to-end Mobile UI workflows
- **Repository-Specific Agents**: Handle workflows within a single repository
  - Located in their respective repos (e.g., `runtime-mobile-widgets-js/.cursor/agents/`, `OutSystems.WidgetLibrary/.cursor/agents/`)

**Agent Dependencies**:
- Orchestrator agents use shared skills and delegate to repo-specific agents
- Repo-specific agents use shared skills and repo-specific skills
- `agent:mobile-ui` delegates to: `agent:widgets-js`, `agent:widget-library`

## Reference Documentation

- **`docs/mobile-ui-lifecycle-reference.md`** - Complete lifecycle reference from TO DO to DONE, showing automation status and full workflow details

## Team/Project Overrides

Teams can override orchestrator agents:
- `.cursor/teams/{team}/agents/{agent-name}.md` - Team override (in automation repo)

**Note:** Project overrides are not accessible via symlink (projects folder is automation-repo-only).

Overrides inherit from base agent and only need to specify differences.
