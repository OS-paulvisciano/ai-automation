---
name: ""
overview: ""
todos: []
---

# New Agent Architecture Implementation Plan

## Architecture Overview

Transform from monolithic `mobile-ui-change` agent to hierarchical architecture:

```
agent:mobile-ui-change (orchestrator)
  ├── agent:widgets-js (Phase 1)
  ├── agent:widget-library (Phase 1)
  ├── agent:ionic (Future)
  ├── agent:stencil (Future)
  ├── agent:runtime (Future)
  └── agent:odc-xif, agent:odc-app, agent:odc-testing (Future)
```

**Skill Architecture:**

- **Shared Skills** (used by all agents): `pr-creation`, `release-notes`, `jira-updates`, `branch-naming`, `design-verification`
- **Agent-Specific Skills**: `odc-testing`, `widgets-js-build` (new), `widget-library-xif` (new), etc.

**Agent vs Skill Distinction:**

- **Agents**: Orchestrate multi-step workflows across repos/domains (e.g., `agent:widgets-js`, `agent:widget-library`)
- **Skills**: Single tasks or reusable rules (e.g., `skill:pr-creation`, `skill:design-verification`)
- **Note**: `design-verification` and `pr-creation` are skills only, not agents

## Phase 1: Immediate Refactor (Widgets-JS & Widget-Library)

### 1. Create `agent:widgets-js`

**File**: `.cursor/shared/agents/widgets-js.md`

**Responsibilities:**

- Phase 1 from current `mobile-ui-change` (Implementation in runtime-mobile-widgets-js)
- Branch creation (from `main`)
- Implementation workflow
- Storybook testing
- Build and bundle
- Commit/push

**Skills Used:**

- `skill:branch-naming` (shared)
- `skill:design-verification` (shared)
- `skill:jira-updates` (shared)
- `skill:widgets-js-build` (new, agent-specific)

**Workflow:**

1. Create feature branch using `skill:branch-naming`
2. Implement changes
3. Test in Storybook
4. Run `npm run bundle`
5. Update Jira "What I Did" using `skill:jira-updates`
6. Commit and push

**Repository**: `runtime-mobile-widgets-js`

**Base Branch**: `main`

**Branch Format**: `ROU-XXXX` (just Jira ID)

### 2. Create `agent:widget-library`

**File**: `.cursor/shared/agents/widget-library.md`

**Responsibilities:**

- Phase 2 & 3 from current `mobile-ui-change` (WidgetLibrary consumption + XIF preparation)
- Branch creation (from `dev`)
- Update runtime widgets
- Prepare XIF file
- Coordinate XIF publishing (manual step documented)

**Skills Used:**

- `skill:branch-naming` (shared)
- `skill:widget-library-xif` (new, agent-specific)

**Workflow:**

1. Create/verify feature branch using `skill:branch-naming` (from `dev`)
2. Run `npm run update-runtime-widgets`
3. Run `npm run prepare-xif`
4. Guide through manual XIF publishing steps

**Repository**: `OutSystems.WidgetLibrary`

**Base Branch**: `dev`

**Branch Format**: `ROU-XXXX` (just Jira ID)

### 3. Create Agent-Specific Skills

#### `skill:widgets-js-build`

**File**: `.cursor/shared/skills/widgets-js-build.md`

**Responsibilities:**

- Build and bundle workflows for widgets-js
- Storybook testing procedures
- Build validation
- Repository-specific knowledge

**Content:**

- `npm run bundle` workflow
- `npm run storybook` testing
- Build output validation
- Storybook test requirements

#### `skill:widget-library-xif`

**File**: `.cursor/shared/skills/widget-library-xif.md`

**Responsibilities:**

- XIF preparation workflow
- Version bumping procedures
- XIF file generation
- Manual publishing steps documentation

**Content:**

- `npm run update-runtime-widgets` workflow
- `npm run prepare-xif` workflow
- Version file updates (`Widgets.xml`, `AssemblyInfo.cs`)
- XIF file location and validation
- Manual ODC Studio publishing steps

### 4. Refactor `agent:mobile-ui-change` to Orchestrator

**File**: `.cursor/shared/agents/mobile-ui-change.md`

**Changes:**

- Remove all Phase 1, 2, 3 implementation details (extracted to repo agents)
- Add delegation to `agent:widgets-js` and `agent:widget-library`
- Keep Phase 4 (ODC testing) as orchestrator responsibility
- Update "Agents Used" section
- Update workflow to show delegation pattern
- Simplify orchestrator to focus on coordination, not implementation

**New Structure:**

```markdown
### Phase 1: Widget Implementation
**Delegate to**: `agent:widgets-js`
- Pass: Jira issue ID, Figma file (if available)
- Receive: Branch created, implemented, tested, committed

### Phase 2 & 3: WidgetLibrary Integration
**Delegate to**: `agent:widget-library`
- Pass: Jira issue ID, widgetjs changes reference
- Receive: Widgets updated, XIF prepared

### Phase 4: ODC Testing
**Handle directly**: (orchestrator responsibility)
- Use `skill:odc-testing`
- Use `skill:jira-updates`
- Use `skill:release-notes`
```

**Skills Used:**

- `skill:odc-testing` (shared)
- `skill:jira-updates` (shared)
- `skill:release-notes` (shared)
- `skill:pr-creation` (shared)

**Agents Used:**

- `agent:widgets-js` (new)
- `agent:widget-library` (new)

**Note**: `design-verification` and `pr-creation` are skills only, not agents

### 5. Deprecate Single-Task Agents

**Remove/Deprecate:**

- `agent:design-verification` - Should only be `skill:design-verification` (agents orchestrate workflows, not single tasks)
- `agent:pr-creation` - Should only be `skill:pr-creation` (agents orchestrate workflows, not single tasks)

**Actions:**

- Delete or deprecate `.cursor/shared/agents/design-verification.md`
- Delete or deprecate `.cursor/shared/agents/pr-creation.md`
- Update all references to use skills instead of agents
- Update README to remove these from agent list

**Rationale:**

- Agents should orchestrate multi-step workflows across repos/domains
- Single tasks (design verification, PR creation) are skills, not agents
- This aligns with the new architecture where agents are domain/repo-specific orchestrators

### 6. Update Documentation

**Files to Update:**

- `.cursor/shared/agents/README.md` - Add new agents, remove deprecated agents, update architecture section
- `.cursor/shared/skills/README.md` - Add new agent-specific skills, categorize shared vs specific
- `.cursorrules` - Update examples to show new agent structure, remove agent references for design-verification/pr-creation
- `docs/mobile-ui-lifecycle-reference.md` - Update to reference new agents

**New Sections:**

- Architecture diagram showing orchestrator → repo agents
- Skill categorization (shared vs agent-specific)
- Agent delegation patterns
- Clarification: Agents orchestrate workflows, Skills are single tasks

## Phase 2: Future Agents (Planned, Not Implemented)

### 6. Plan `agent:ionic`

**Responsibilities:**

- Monitor Ionic releases
- Detect breaking changes
- Upgrade workflows
- Impact analysis on Mobile UI layer

**Skills:**

- `skill:ionic-upgrade` (new)
- `skill:breaking-change-detection` (new)
- Shared skills: `pr-creation`, `jira-updates`

### 8. Plan `agent:stencil`

**Responsibilities:**

- Monitor StencilJS releases
- Detect breaking changes
- Upgrade workflows
- Impact analysis on dependent layers

**Skills:**

- `skill:stencil-monitor` (new)
- `skill:breaking-change-detection` (new)
- Shared skills: `pr-creation`, `jira-updates`

### 9. Plan `agent:runtime`

**Responsibilities:**

- Runtime logic changes (another team)
- API change detection
- Breaking change impact on Mobile UI

**Skills:**

- `skill:runtime-api-analysis` (new)
- `skill:breaking-change-detection` (new)
- Shared skills: `pr-creation`, `jira-updates`

### 10. Plan ODC Agents

**Multiple agents for ODC domain:**

- `agent:odc-xif` - XIF publishing workflows
- `agent:odc-app` - App creation and management
- `agent:odc-testing` - Test app workflows (or use existing `skill:odc-testing`)

## Implementation Order

1. ✅ **Remove single-task agents** (`agent:design-verification`, `agent:pr-creation`) - COMPLETED
2. **Create agent-specific skills** (`widgets-js-build`, `widget-library-xif`)
3. **Create `agent:widgets-js`** (extract Phase 1 from mobile-ui-change)
4. **Create `agent:widget-library`** (extract Phase 2 & 3 from mobile-ui-change)
5. **Refactor `agent:mobile-ui-change`** (remove implementation details, add delegation, remove agent references)
6. **Update documentation** (READMEs, .cursorrules, lifecycle reference) - Remove references to deleted agents
7. **Test workflow** (verify delegation works correctly)

## Validation Criteria

- [ ] `agent:widgets-js` can be used standalone
- [ ] `agent:widget-library` can be used standalone
- [ ] `agent:mobile-ui-change` successfully delegates to repo agents
- [ ] All shared skills work across agents
- [ ] Agent-specific skills only used by relevant agents
- [ ] Documentation updated and accurate

## Files to Create

1. `.cursor/shared/agents/widgets-js.md`
2. `.cursor/shared/agents/widget-library.md`
3. `.cursor/shared/skills/widgets-js-build.md`
4. `.cursor/shared/skills/widget-library-xif.md`

## Files Deleted

1. ✅ `.cursor/shared/agents/design-verification.md` (deleted - keep only skill)
2. ✅ `.cursor/shared/agents/pr-creation.md` (deleted - keep only skill)

## Files to Modify

1. `.cursor/shared/agents/mobile-ui-change.md` (refactor to orchestrator, remove agent:design-verification reference)
2. `.cursor/shared/agents/README.md` (add new agents, remove deprecated agents, update architecture)
3. `.cursor/shared/skills/README.md` (categorize skills, add new ones)
4. `.cursorrules` (update examples, remove agent references for design-verification/pr-creation)
5. `docs/mobile-ui-lifecycle-reference.md` (reference new agents)

## Notes

- **Agent vs Skill Distinction**: 
  - Agents orchestrate multi-step workflows across repos/domains
  - Skills are single tasks or reusable rules
  - `design-verification` and `pr-creation` are skills only, not agents
- Agents can be used standalone OR as part of orchestrator workflow
- Shared skills remain in `.cursor/shared/skills/` (no changes needed)
- Agent-specific skills follow same structure as shared skills
- Future phases can be implemented incrementally without breaking existing agents
- `agent:mobile-ui-change` is refactored to pure orchestrator - no need to maintain old implementation details