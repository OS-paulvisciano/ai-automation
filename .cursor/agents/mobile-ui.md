
# Agent: Mobile UI

**ID**: `agent:mobile-ui`  
**Version**: `1.0.0`  
**Type**: Orchestrator Agent (meta-agent that coordinates multiple skills and agents)

**Skills Used**: 
  - `skill:branch-naming` - For creating feature branches
  - `skill:design-verification` - For verifying implementation matches Figma design (if story has Figma file)
  - `skill:jira-updates` - For updating Jira story with implementation details
  - `skill:release-notes` - For updating Release Notes field in Jira
  - `skill:odc-testing` - For complete ODC testing workflow
  - `skill:pr-creation` - For creating PR after testing (if needed)
  - `skill:mobile-ui-prepare-xif-from-local` - For preparing the XIF for publishing from local (bundle widgets-js, update WidgetLibrary from local, run prepare-xif); delegates to repo agents. Publishing in ODC is manual and out of scope.

**Agents Used** (delegates to repo-specific agents):
  - `agent:widgets-js` - For Phase 1 (implementation in runtime-mobile-widgets-js)
  - `agent:widget-library` - For Phase 2 & 3 (WidgetLibrary consumption + XIF preparation)

**MCPs Required**: `jira`, `figma` (if story has Figma file), `github` (for PR creation)

## Overview

Complete end-to-end workflow orchestrator for making Mobile UI widget changes, from implementation in `runtime-mobile-widgets-js` through consumption in `OutSystems.WidgetLibrary`, XIF publishing, and testing in ODC Studio.

**Agent Role**: This is an orchestrator agent that coordinates multiple skills and delegates to repo-specific agents to complete complex workflows. It serves as the high-level workflow coordinator for the entire Mobile UI change process, delegating repository-specific work to appropriate agents while handling cross-repo coordination and ODC testing.

## Recommended story flow

Follow this order so the user can verify the plan and the implementation before anything is committed or reported to Jira.

1. **Information gathering** (no code changes)
   - Use **Jira MCP** to fetch the story: summary, description, acceptance criteria, DoD, labels, any linked Figma or docs.
   - Use **Figma MCP** when the story references a Figma file (e.g. node URL): fetch design specs, tokens, and component properties so the plan and implementation match design.
2. **Create a plan**
   - Write a plan (e.g. in `.cursor/plans/`) that covers branches, implementation outline (widgets-js and WidgetLibrary), XIF version, and execution order. Base it on the gathered Jira and Figma information.
3. **Manual verification of the plan**
   - User reviews the plan. Do not run implementation until the user has confirmed or adjusted the plan.
4. **Run the plan**
   - Execute the plan (create branches, implement, build, update WidgetLibrary, prepare XIF, test in Storybook / ODC as needed). **Do not commit, push, or update the Jira story yet.**
5. **Manual verification of the implementation**
   - User manually verifies the implementation (e.g. Storybook, ODC test app). Only after the user confirms that everything looks correct:
6. **Commit, Jira, and PR**
   - Commit; **pull latest** (merge base branch into feature branch in each repo: `main` in runtime-mobile-widgets-js, `dev` in OutSystems.WidgetLibrary), resolve any conflicts, then push; use `skill:jira-updates` to update "What I Did" and verification steps; use `skill:release-notes` if needed; use `skill:pr-creation` when ready.
   - **Why pull before push/PR**: Merging the base branch into the feature branch before pushing and creating PRs avoids merge conflicts that would otherwise trigger CI, then require conflict resolution and a second CI run.

**Summary**: Gather (Jira + Figma) → Plan → User verifies plan → Run (no commit/Jira) → User verifies implementation → Then commit, **pull latest and resolve conflicts**, push, update Jira, create PR.

## Technology Stack

OutSystems owns the entire stack, with each layer built on top of the previous:

```
StencilJS (base layer)
  ↓
Ionic (built on StencilJS)
  ↓
Mobile UI (integration layer between Ionic and ODC)
  ↓
Runtime (another team owns this)
  ↓
WidgetLibrary (controls ODC design-time experience)
  ↓
ODC (uses Mobile UI via XIF files)
```

**Layer Dependencies**:
- **StencilJS**: Web component compiler, base framework
  - **Open Source**: External project with community contributions
  - **Dependency**: OutSystems depends on StencilJS but doesn't control it
- **Ionic**: UI component library built with StencilJS
  - **Open Source**: External project with community contributions
  - **Dependency**: OutSystems depends on Ionic but doesn't control it
- **Mobile UI**: Integration layer that brings Ionic into ODC
  - **Internal**: Fully owned and maintained by OutSystems
  - Provides improvements and customizations over base Ionic
  - Serves as the integration layer between Ionic and ODC
  - Owned by the Mobile UI team
- **Runtime**: Runtime logic layer (another team owns this)
  - **Internal**: Owned by OutSystems (different team)
- **WidgetLibrary**: Controls how widgets appear in ODC (labels, properties, design-time experience)
  - **Internal**: Owned by OutSystems
- **ODC**: OutSystems Development Cloud uses Mobile UI widgets via XIF files
  - **Internal**: Owned by OutSystems

**Mobile UI Library Purpose**:
- **Integration Layer**: Bridges Ionic components into ODC
- **Improvements**: Adds customizations and enhancements over base Ionic
- **Customizations**: Tailored for OutSystems development patterns
- **Team Ownership**: Mobile UI team maintains and develops this layer

**Holistic Stack View**:
- **Cross-Layer Impact**: Changes in one layer can affect others
  - **External Dependencies**: StencilJS/Ionic updates from open source community can affect Mobile UI
  - **Internal Dependencies**: Runtime changes can break Mobile UI widgets
  - **Internal Dependencies**: Mobile UI changes can break ODC integration
- **Open Source vs Internal**:
  - **StencilJS/Ionic**: Open source - OutSystems monitors and adapts to external changes
  - **Mobile UI/Runtime/WidgetLibrary/ODC**: Internal - OutSystems has full control
- **Resource Allocation Paradox**:
  - **StencilJS**: 1 OutSystems resource (base layer, open source)
  - **Ionic**: 3 OutSystems resources (middle layer, open source)
  - **Mobile UI**: 11 OutSystems resources (integration layer, internal)
  - **Paradox**: More resources dedicated to Mobile UI than to the base layers it depends on
  - **Implication**: Mobile UI team must be self-sufficient in testing and adapting to lower layer changes
- **Testing Paradox**:
  - **Better Testing at Mobile UI**: More comprehensive testing exists at Mobile UI layer than base layers
  - **Paradox**: Base layers (StencilJS/Ionic) have less testing despite being foundational
  - **Implication**: Mobile UI testing must compensate for gaps in base layer testing
  - **Reality**: Mobile UI has more resources and better testing infrastructure than the layers it depends on
- **Automation Framework Vision**: Integrate all repositories to:
  - Monitor external dependencies (StencilJS/Ionic) for breaking changes
  - Leverage Mobile UI's superior testing infrastructure
  - Make changes across internal stack (Mobile UI, Runtime, WidgetLibrary, ODC)
  - Understand cross-layer dependencies (external → internal)
  - Automate end-to-end workflows
  - Detect breaking changes early (especially from external dependencies)

**Current Automation Status**:
- ✅ **WidgetLibrary**: Integrated (update-runtime-widgets, prepare-xif scripts)
- ✅ **runtime-mobile-widgets-js**: Integrated (bundle, storybook)
- ⚠️ **StencilJS**: Not yet integrated (potential for automation)
- ⚠️ **Ionic**: Not yet integrated (potential for automation)
- ⚠️ **Runtime**: Not yet integrated (potential for automation)
- ⚠️ **ODC**: Manual steps only (high automation potential):
  - ❌ XIF publishing (currently manual via ODC Studio UI)
  - ❌ Sample app creation (currently manual)
  - ❌ Sample app publishing (currently manual)
  - **Goal**: Automate entire ODC integration workflow

**Future Automation Opportunities**:
- **ODC Integration**: Automate XIF publishing, app creation, and app publishing
- **Cross-Layer Testing**: Automate testing across stack layers
- **Breaking Change Detection**: Automate detection of cross-layer breaking changes
- **Dependency Analysis**: Automate understanding of how changes propagate through stack

## Workflow

This orchestrator delegates repository-specific work to repo-specific agents and handles cross-repo coordination and ODC testing.

### Phase 1: Widget Implementation

**Delegate to**: `agent:widgets-js`  
**Repository**: `runtime-mobile-widgets-js`

**What This Phase Does**:
- Creates feature branch from `main`
- Implements widget changes
- Tests in Storybook
- Builds and bundles
- When following the [Recommended story flow](#recommended-story-flow): do **not** commit, push, or update Jira until after the user has manually verified the implementation. Then commit, push, and update Jira "What I Did" (and release notes/PR as needed).

**Delegation**:
- Pass to `agent:widgets-js`: Jira issue ID, Figma file (if available)
- Receive from `agent:widgets-js`: Branch created, implemented, tested, committed, pushed

**Validation**:
- `agent:widgets-js` completes successfully
- Branch exists in `runtime-mobile-widgets-js`
- After manual verification: changes are committed and pushed

---

### Phase 2 & 3: WidgetLibrary Integration

**Delegate to**: `agent:widget-library`  
**Repository**: `OutSystems.WidgetLibrary`

**What This Phase Does**:
- Creates/verifies feature branch from `dev`
- Updates runtime widgets from npm
- Prepares XIF file
- Guides through manual XIF publishing

**Delegation**:
- Pass to `agent:widget-library`: Jira issue ID, reference to widgetjs changes
- Receive from `agent:widget-library`: Widgets updated, XIF prepared, XIF published (manual)

**Validation**:
- `agent:widget-library` completes successfully
- Branch exists in `OutSystems.WidgetLibrary`
- Runtime widgets updated
- XIF file generated and published

---

### Phase 4: Test in ODC Studio

**Repository**: ODC Studio (no code changes)  
**Skills**: `skill:odc-testing`, `skill:jira-updates`

#### 4.1 Create/Update Test App

**Current Status**: Manual process (automation opportunity)

**Steps** (Current - Manual):
1. Follow `skill:odc-testing` workflow
2. Create new app or update existing app in ODC Studio
3. Use the newly published XIF when creating/updating
4. Verify MobileUI version in Themes > MobileUI matches published version

**Future Automation** (When ODC repo is integrated):
- Automate app creation via ODC API/CLI
- Automatically configure app with latest XIF
- Automatically set Home screen to "Accessible by Everyone"
- Remove manual steps from workflow

**Validation**:
- App created/updated successfully
- MobileUI version matches published XIF version

#### 4.2 Configure App for Testing

**Steps**:
1. Select Home screen in UI Flows tree
2. Set Authorization > Accessible by: "Everyone"
3. Drag widget component onto Home screen
4. Configure widget to test specific functionality

**Validation**:
- Home screen accessible without authentication
- Widget component added to screen

#### 4.3 Test Widget Functionality

**Current Status**: Manual process (automation opportunity)

**Steps** (Current - Manual):
1. Publish the app in ODC Studio
2. Test in browser using "Open in browser"
3. For device-specific changes (e.g., Android styles), create native build
4. Test on actual device if native build required
5. Verify full integration works correctly

**Future Automation** (When ODC repo is integrated):
- Automate app publishing via ODC API/CLI
- Automate browser testing (if possible)
- Automate native build creation (if possible)
- Enable fully automated testing workflow

**Full Stack Testing**:
- **Storybook**: Tests widget layer (StencilJS → Ionic → Mobile UI widgets) + Runtime integration
  - ✅ Tests StencilJS compilation
  - ✅ Tests Ionic component rendering
  - ✅ Tests Mobile UI widget functionality
  - ✅ Tests Runtime integration (uses actual `@outsystems/runtime-core-js` and `@outsystems/runtime-view-js` packages)
  - ✅ Tests runtime classes: DataTypes, Widget, WidgetHelpers, Model.Variable, Model.DummyViewModel
  - ❌ Does NOT test WidgetLibrary integration (ODC design-time experience)
  - ❌ Does NOT test ODC end-to-end integration
- **ODC Testing**: Tests complete integration including:
  - ✅ Widget layer (already tested in Storybook)
  - ✅ Runtime logic (already tested in Storybook via actual runtime packages)
  - ✅ WidgetLibrary integration (how widgets appear in ODC - labels, properties, etc.)
  - ✅ ODC end-to-end integration
- **Why ODC Testing is Required**: Storybook tests the widget layer and runtime integration, but not WidgetLibrary/ODC integration or end-to-end ODC workflows

**Validation**:
- App publishes successfully
- Widget functionality works as expected
- Full integration verified:
  - ✅ Widget layer (StencilJS → Ionic → Mobile UI) - already tested in Storybook
  - ✅ Runtime logic integration - already tested in Storybook (uses actual runtime packages)
  - ✅ WidgetLibrary integration (labels, properties, design-time experience)
  - ✅ ODC end-to-end integration

#### 4.4 Document in Jira

**Skills**: `skill:jira-updates`, `skill:release-notes`

**When**: Only after the user has **manually verified** the implementation (Storybook and/or ODC). See [Recommended story flow](#recommended-story-flow): no Jira updates or commits until verification is done.

**Steps**:
1. Use `skill:jira-updates` to update Jira story
2. Move story to "Review" status
3. Add comment with link to test app in ODC
4. Use `skill:release-notes` to update Release Notes field

**Comment Format**:
```
Test app created and published:
- App Name: [App Name]
- Location: [ODC environment URL]
- Version: [XIF Version]

Ready for verification. [Brief description of what to test].
```

**Release Notes**:
- Use `skill:release-notes` to update the "Release Note" custom field (`customfield_12701`)
- Must use ADF (Atlassian Document Format) when updating via API
- Write from user perspective (not technical)
- Focus on what users will see/experience
- See `skill:release-notes` for complete guidelines and format requirements

**Validation**:
- Story moved to Review status
- Test app link added to comments
- Release Notes updated using `skill:release-notes` (user-focused, ADF format)

---

## Configuration

**Parameters**:
- `skip-storybook` - Skip Storybook testing (default: false)
- `skip-odc-testing` - Skip ODC testing phase (default: false)
- `auto-publish-xif` - Auto-publish XIF without prompts (default: false)

## Repository Structure

**Currently Integrated**:
- **runtime-mobile-widgets-js**: 
  - Location: `~/repos/runtime-mobile-widgets-js`
  - Default branch: `main`
  - Feature branches: `ROU-XXXX` (just the Jira issue ID, per `skill:branch-naming`)
  - Automation: ✅ Bundle, Storybook scripts

- **OutSystems.WidgetLibrary**: 
  - Location: `~/repos/OutSystems.WidgetLibrary`
  - Default branch: `dev`
  - Feature branches: `ROU-XXXX` (just the Jira issue ID, per `skill:branch-naming`)
  - Automation: ✅ update-runtime-widgets, prepare-xif scripts

**Future Integration Opportunities**:
- **StencilJS** (Open Source): 
  - Potential automation: Monitor external releases, breaking change detection, dependency analysis
  - Impact: Understanding how StencilJS community changes affect Ionic → Mobile UI → ODC
  - Challenge: External dependency - OutSystems doesn't control release schedule or changes

- **Ionic** (Open Source): 
  - Potential automation: Monitor external releases, breaking change detection, dependency analysis
  - Impact: Understanding how Ionic community changes affect Mobile UI → ODC
  - Challenge: External dependency - OutSystems doesn't control release schedule or changes

- **Runtime**: 
  - Potential automation: Cross-layer testing, breaking change detection
  - Impact: Understanding how Runtime changes break Mobile UI widgets

- **ODC**: 
  - Potential automation: XIF publishing, app creation, app publishing
  - Impact: Fully automated end-to-end workflow from widgetjs changes to published app
  - **High Priority**: Would eliminate all manual ODC steps

## Error Handling

### Branch Creation Fails
- Verify Jira issue exists
- Check branch name format
- Ensure starting from correct base branch (`main` for widgetjs, `dev` for widgetlib)

### Update Runtime Widgets Fails
- Verify feature branch exists in runtime-mobile-widgets-js
- Check npm package is published/available
- Verify ServiceStudio directory exists

### XIF Preparation Fails
- Check for uncommitted changes (script will offer to stash)
- Verify dev branch is up to date
- Check build tools are installed (.NET SDK)
- Verify ODC Studio Plugins folder exists

### ODC Testing Fails
- Verify XIF was published successfully
- Check MobileUI version matches
- Verify app has correct XIF reference
- Check ODC Studio is running

### Jira Update Fails
- Verify Jira authentication
- Check issue permissions
- Retry with different format

## Success Criteria

- [ ] Feature branch created in runtime-mobile-widgets-js
- [ ] Changes implemented and tested in Storybook
- [ ] Changes committed and pushed
- [ ] Feature branch created/verified in OutSystems.WidgetLibrary
- [ ] Runtime widgets updated via npm script
- [ ] XIF prepared and published
- [ ] Slack message posted and updated
- [ ] Test app created/updated in ODC
- [ ] Widget functionality tested and verified
- [ ] Full integration verified in ODC
- [ ] Jira story moved to Review
- [ ] Test app link added to Jira comments
- [ ] Release Notes updated in Jira

## Common Workflows

### Quick Iteration (Changes Already in WidgetLibrary)
If changes are already consumed in WidgetLibrary:
- Skip Phase 1 and Phase 2
- Start at Phase 3 (Prepare and Publish XIF)

### Prepare XIF from local
Use `skill:mobile-ui-prepare-xif-from-local`. Delegate to agent:widgets-js (run skill:widgets-js-build), then to agent:widget-library (run skill:widget-library-update-widgets-js in local mode, then skill:widget-library-xif). User publishes the XIF in ODC Studio manually afterward.

### Browser Testing Only
If changes don't require device-specific testing:
- Skip native build in Phase 4
- Use browser testing only

### Device-Specific Testing Required
If changes require platform-specific testing (Android/iOS):
- Create native build in Phase 4
- Test on actual device
- Document device requirements in Jira

## Notes

- **Technology Stack**: StencilJS → Ionic → Mobile UI → ODC (OutSystems owns entire stack)
- **Mobile UI Team**: Owns and maintains the Mobile UI library (integration layer between Ionic and ODC)
- **Mobile UI Purpose**: Integration layer that brings Ionic into ODC with improvements and customizations
- **Branch Naming**: Follow `skill:branch-naming` - format is `ROU-XXXX` (just the Jira issue ID, no prefix, no description)
- **Version Bumping**: XIF preparation script handles version bumping automatically
- **Slack Integration**: Manual posting required (automation coming soon)
- **ODC Studio**: Can stay open during XIF preparation - no restart needed
- **Testing**: Full integration testing in ODC is required (Storybook is not sufficient)
  - Storybook tests widget layer (StencilJS → Ionic → Mobile UI widgets) + Runtime integration
  - Storybook uses actual runtime code (`@outsystems/runtime-core-js`, `@outsystems/runtime-view-js`) and tests runtime integration (DataTypes, Widget, Model.Variable, etc.)
  - Storybook does NOT test WidgetLibrary integration (ODC design-time - labels, properties)
  - Storybook does NOT test ODC end-to-end integration
  - ODC tests complete integration: widget layer + Runtime logic + WidgetLibrary + ODC end-to-end
- **Ionic Dependencies**: Mobile UI widgets leverage Ionic components, CSS variables, and platform detection
- **Mobile UI Enhancements**: Widgets include OutSystems-specific improvements and customizations over base Ionic
- **Platform Styles**: Android/iOS specific styles use Ionic's platform detection (`.plt-android`, `.plt-ios`)
- **Reviewer**: Gonzalo typically performs final verification using test app reference

## Agent Architecture

**Orchestrator Pattern**: This agent uses an orchestrator pattern to coordinate multiple skills and delegate to repo-specific agents:
- **Skills**: Used for cross-cutting tasks (Jira updates, release notes, ODC testing, PR creation)
- **Repo-Specific Agents**: Delegates repository-specific work to agents in their respective repos:
  - `agent:widgets-js` (in `runtime-mobile-widgets-js/.cursor/agents/`)
  - `agent:widget-library` (in `OutSystems.WidgetLibrary/.cursor/agents/`)
- **Coordination**: Orchestrates the entire end-to-end workflow across multiple repositories and phases

**When to Use This Agent**:
- Complete Mobile UI change workflow from start to finish
- Need coordination across multiple repositories (widgetjs → widgetlib → ODC)
- Require multiple skills and potentially other agents
- End-to-end automation of the full stack change process

**When to Use Individual Skills/Agents**:
- Single task (e.g., just create a branch → use `skill:branch-naming`)
- Focused task (e.g., just verify design → use `skill:design-verification`)
- Repository-specific work (e.g., just Phase 1 → use `agent:widgets-js` directly)
- WidgetLibrary work only (e.g., just Phase 2 & 3 → use `agent:widget-library` directly)

## Related Skills

- `skill:branch-naming` - For creating feature branches
- `skill:design-verification` - For verifying implementation matches Figma design (if story has Figma file)
- `skill:jira-updates` - For updating Jira story
- `skill:release-notes` - For updating Release Notes field in Jira
- `skill:odc-testing` - For complete ODC testing workflow
- `skill:pr-creation` - For creating PR after testing (if needed)
- `skill:mobile-ui-prepare-xif-from-local` - For preparing the XIF for publishing from local (bundle widgets-js, update WidgetLibrary from local, run prepare-xif); delegates to repo agents. Publishing in ODC is manual and out of scope.

## Related Agents

- `agent:widgets-js` - Repository-specific agent for `runtime-mobile-widgets-js` (Phase 1)
- `agent:widget-library` - Repository-specific agent for `OutSystems.WidgetLibrary` (Phase 2 & 3)

**Note**: These agents are located in their respective repositories:
- `agent:widgets-js` → `runtime-mobile-widgets-js/.cursor/agents/widgets-js.md`
- `agent:widget-library` → `OutSystems.WidgetLibrary/.cursor/agents/widget-library.md`

## Reference Documentation

- **`docs/mobile-ui-lifecycle-reference.md`** - Complete lifecycle reference from TO DO to DONE, showing automation status and full workflow details
