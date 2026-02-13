# Agent: Mobile UI Change

**ID**: `agent:mobile-ui-change`  
**Version**: `1.0.0`  
**Type**: Orchestrator Agent (meta-agent that coordinates multiple skills and agents)

**Skills Used**: 
  - `skill:branch-naming` - For creating feature branches
  - `skill:design-verification` - For verifying implementation matches Figma design (if story has Figma file)
  - `skill:jira-updates` - For updating Jira story with implementation details
  - `skill:release-notes` - For updating Release Notes field in Jira
  - `skill:odc-testing` - For complete ODC testing workflow
  - `skill:pr-creation` - For creating PR after testing (if needed)

**Agents Used** (can call other agents):
  - `agent:story-completion` - Can be used for complete story workflows
  - `agent:design-verification` - Can be used for design verification workflows
  - Other agents as needed for sub-workflows

**MCPs Required**: `jira`, `figma` (if story has Figma file), `github` (for PR creation)

## Overview

Complete end-to-end workflow orchestrator for making Mobile UI widget changes, from implementation in `runtime-mobile-widgets-js` through consumption in `OutSystems.WidgetLibrary`, XIF publishing, and testing in ODC Studio.

**Agent Role**: This is an orchestrator agent that coordinates multiple skills and can call other agents to complete complex workflows. It serves as the high-level workflow coordinator for the entire Mobile UI change process, delegating specific tasks to appropriate skills and agents.

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

### Phase 1: Implementation in runtime-mobile-widgets-js

**Repository**: `runtime-mobile-widgets-js`  
**Skills**: `skill:branch-naming`, `skill:design-verification` (if story has Figma file)

#### 1.1 Create Feature Branch

**Steps**:
1. Extract Jira issue ID (e.g., `ROU-12461`)
2. Get Jira issue summary
3. Create branch using `skill:branch-naming`:
   - Format: `ROU-XXXX` (just the Jira issue ID, simple format)
   - Example: `ROU-12461`
   - Branch from `main`
4. Switch to new branch

**Validation**:
- Branch name follows convention
- Branch created from `main`
- Branch checked out successfully

#### 1.2 Implement Changes

**Steps**:
1. Make widget changes in `runtime-mobile-widgets-js`
   - Widgets are built on Ionic components (which use StencilJS)
   - Changes may leverage Ionic CSS variables, components, or utilities
   - Platform-specific styles (Android/iOS) use Ionic's platform detection
2. Test changes in Storybook (if applicable)
3. Run `npm run bundle` to build
   - Builds StencilJS components into web components
   - Bundles for consumption by WidgetLibrary
4. Run `npm run storybook` to verify in Storybook
   - Storybook tests most of the stack (StencilJS → Ionic → Mobile UI + Runtime integration)
   - Uses actual runtime code (`@outsystems/runtime-core-js`, `@outsystems/runtime-view-js`)
   - Does not test the ODC integration part (WidgetLibrary + ODC end-to-end)
5. Commit changes to feature branch

**Files Typically Modified**:
- Component files in `src/scripts/Components/`
- Style files (SCSS/CSS) - may use Ionic CSS variables
- Story files for Storybook testing
- Platform-specific styles (`.plt-android`, `.plt-ios`)

**Stack Considerations**:
- **Ionic Dependencies**: Changes may use Ionic components, CSS variables, or utilities
- **Mobile UI Integration**: Changes leverage Mobile UI's integration layer (improvements/customizations over Ionic)
- **StencilJS**: Components compile to web components via StencilJS
- **Platform Detection**: Ionic's platform detection used for Android/iOS specific styles
- **ODC Integration**: Changes must work within ODC's consumption model (via XIF files)
- **WidgetLibrary**: Controls how widgets appear in ODC (labels, properties, design-time experience)
- **Runtime Logic**: Storybook uses actual runtime code (`@outsystems/runtime-core-js`, `@outsystems/runtime-view-js`) and tests runtime integration (DataTypes, Widget, Model.Variable, etc.)

**Design Verification** (if story has Figma file):
- Use `skill:design-verification` to verify implementation matches Figma design
- Fetch Figma specs using Figma MCP
- Compare design tokens (colors, spacing, border radius) with codebase
- Verify component states (hover, pressed, disabled) match design
- Flag any discrepancies between Figma and implementation

**Validation**:
- Code compiles without errors
- Storybook tests pass (if applicable)
- Changes match design requirements (verified via Figma if available)
- Ionic dependencies are correctly used
- **Note**: Storybook tests most of the stack (StencilJS → Ionic → Mobile UI + Runtime integration using actual runtime packages) but not the ODC integration part (WidgetLibrary + ODC end-to-end)

#### 1.3 Push Changes

**Steps**:
1. Push feature branch to remote
2. Ensure all changes are committed

**Validation**:
- Branch exists on remote
- All changes are committed

---

### Phase 2: Consume Changes in OutSystems.WidgetLibrary

**Repository**: `OutSystems.WidgetLibrary`  
**Skills**: None (automated via npm scripts)

**Available Scripts**:
- `npm run update-runtime-widgets` - Pulls latest version of widgetjs lib from npm and copies resources
- `npm run prepare-xif` - Prepares XIF file for ODC publishing (see Phase 3)

#### 2.1 Create/Verify Feature Branch

**Steps**:
1. Check if feature branch exists (e.g., `ROU-12461`)
2. If exists, switch to it:
   ```bash
   git checkout ROU-12461
   ```
3. If doesn't exist, create from `dev`:
   ```bash
   git checkout -b ROU-12461 dev
   ```

**Validation**:
- Branch exists or created successfully
- Branch is checked out

#### 2.2 Update Runtime Widgets

**Steps**:
1. Navigate to ServiceStudio directory:
   ```bash
   cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio
   ```
2. Run update script:
   ```bash
   npm run update-runtime-widgets
   ```

**What This Script Does**:
- Pulls latest version of `@outsystems/runtime-mobile-widgets-js` from npm (`npm i @outsystems/runtime-mobile-widgets-js@latest --force`)
- Copies runtime resources (CSS, JS) to WidgetLibrary RuntimeResources
- Copies design-time resources to WidgetLibrary DesignTime
- Updates package dependencies
- **WidgetLibrary Role**: Controls how widgets appear in ODC (labels, properties, design-time experience)

**Validation**:
- Script completes without errors
- Runtime widgets package updated
- Resources copied successfully

#### 2.3 Verify Changes

**Steps**:
1. Review changes in WidgetLibrary
2. Verify runtime widgets are updated correctly
3. Check that design-time resources are in place

**Validation**:
- Changes from runtime-mobile-widgets-js are present
- No errors in WidgetLibrary structure

---

### Phase 3: Prepare and Publish XIF

**Repository**: `OutSystems.WidgetLibrary`  
**Skills**: None (automated via `npm run prepare-xif` script)

#### 3.1 Prepare XIF File

**Steps**:
1. Navigate to ServiceStudio directory:
   ```bash
   cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio
   ```
2. Run XIF preparation script:
   ```bash
   npm run prepare-xif
   ```

**What The Script Does**:
- Pulls latest changes from `dev` branch (with option to stash uncommitted changes)
- Prompts for latest published version (check Slack #rd-uicomponents-releases)
- **Posts to Slack BEFORE build** (with `:loading:` emoji syntax)
- Automatically bumps the patch version
- Updates version in `Widgets.xml` and `AssemblyInfo.cs`
- Cleans and builds the solution (generates XIF file)
- Copies XIF to ODC Studio Plugins folder
- Removes older XIF versions
- Guides through ODC publishing and Slack update (with `:check:` emoji syntax)

**Manual Steps During Script**:
1. **Post to Slack**: Post `<version> :loading:` to `#rd-uicomponents-releases` (before build)
2. **Publish in ODC**: Open ODC Studio (Support menu → Publish xif)
3. **Update Slack**: Edit your message to `<version> :check:`

**Files Modified**:
- `Common/Widgets.xml` - Version updated
- `Images/MobileUI.Light/Properties/AssemblyInfo.cs` - Version updated
- XIF file generated at: `ServiceStudio/bin/Debug/xif/MobileUI-<VERSION>.xif`

**Validation**:
- Script completes successfully
- Version files updated correctly
- XIF file generated
- XIF copied to ODC Studio Plugins folder
- Slack message posted and updated

#### 3.2 Publish XIF in ODC Studio

**Current Status**: Manual process (automation opportunity)

**Steps** (Current - Manual):
1. Open ODC Studio (if not already open)
2. Navigate to Support menu (top menu bar)
3. Select "Publish xif" from dropdown
4. Follow prompts to select and publish the XIF file
5. Wait for publishing to complete

**Future Automation** (When ODC repo is integrated):
- Automate XIF publishing via ODC API/CLI
- Remove manual steps from workflow
- Enable fully automated end-to-end workflow

**Validation**:
- XIF published successfully in ODC
- No errors during publishing

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

**Orchestrator Pattern**: This agent uses an orchestrator pattern to coordinate multiple skills and agents:
- **Skills**: Used for specific tasks (branch naming, Jira updates, design verification, etc.)
- **Other Agents**: Can be called for complete sub-workflows (story completion, design verification workflows)
- **Coordination**: Orchestrates the entire end-to-end workflow across multiple repositories and phases

**When to Use This Agent**:
- Complete Mobile UI change workflow from start to finish
- Need coordination across multiple repositories (widgetjs → widgetlib → ODC)
- Require multiple skills and potentially other agents
- End-to-end automation of the full stack change process

**When to Use Individual Skills/Agents**:
- Single task (e.g., just create a branch → use `skill:branch-naming`)
- Single workflow (e.g., just complete a story → use `agent:story-completion`)
- Focused task (e.g., just verify design → use `skill:design-verification`)

## Related Skills

- `skill:branch-naming` - For creating feature branches
- `skill:design-verification` - For verifying implementation matches Figma design (if story has Figma file)
- `skill:jira-updates` - For updating Jira story
- `skill:release-notes` - For updating Release Notes field in Jira
- `skill:odc-testing` - For complete ODC testing workflow
- `skill:pr-creation` - For creating PR after testing (if needed)

## Related Agents

- `agent:story-completion` - Can be used for complete story workflows (branch → implement → document → PR)
- `agent:design-verification` - Can be used for design verification workflows (Figma → compare → verify)
- Other agents can be called as sub-workflows when needed
