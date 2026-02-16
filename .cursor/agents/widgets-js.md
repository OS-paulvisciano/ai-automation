
# Agent: Widgets-JS

**ID**: `agent:widgets-js`  
**Version**: `1.0.0`  
**Type**: Repository-Specific Agent  
**Repository**: `runtime-mobile-widgets-js`

**Skills Used**: 
  - `skill:branch-naming` - For creating feature branches (from shared)
  - `skill:design-verification` - For verifying implementation matches Figma design (from shared, if story has Figma file)
  - `skill:jira-updates` - For updating Jira story with implementation details (from shared)
  - `skill:widgets-js-build` - For production bundle (repo-specific)
  - `skill:widgets-js-storybook` - For running Storybook dev server (repo-specific)
  - `skill:widgets-js-tests` - For running unit and Storybook Vitest tests (repo-specific)

**MCPs Required**: `jira`, `figma` (if story has Figma file)

## Overview

Repository-specific agent for implementing widget changes in `runtime-mobile-widgets-js`. Handles branch creation, implementation, Storybook testing, build, and commit/push workflows.

**Agent Role**: This agent manages the complete workflow for making changes in the widgets-js repository, from branch creation through implementation, testing, and pushing changes.

## Repository Information

**Repository**: `runtime-mobile-widgets-js`  
**Location**: `~/repos/runtime-mobile-widgets-js`  
**Base Branch**: `main`  
**Branch Format**: `ROU-XXXX` (just the Jira issue ID, per `skill:branch-naming`)

## Workflow

### 1. Create Feature Branch

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

### 2. Implement Changes

**Steps**:
1. Make widget changes in `runtime-mobile-widgets-js`
   - Widgets are built on Ionic components (which use StencilJS)
   - Changes may leverage Ionic CSS variables, components, or utilities
   - Platform-specific styles (Android/iOS) use Ionic's platform detection
2. Test changes in Storybook (if applicable)
3. Run `npm run bundle` to build (using `skill:widgets-js-build`)
   - Builds StencilJS components into web components
   - Bundles for consumption by WidgetLibrary
4. Run `npm run storybook` to verify in Storybook (using `skill:widgets-js-storybook`)
   - Storybook tests most of the stack (StencilJS → Ionic → Mobile UI + Runtime integration)
   - Uses actual runtime code (`@outsystems/runtime-core-js`, `@outsystems/runtime-view-js`)
   - Does not test the ODC integration part (WidgetLibrary + ODC end-to-end)
5. Run tests (using `skill:widgets-js-tests`): e.g. `npm run test:ci` for unit tests, and optionally `npm run test-storybook` for Storybook tests
6. Commit changes to feature branch

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
- Tests pass (unit and, if applicable, Storybook tests)
- Storybook verification passes (if applicable)
- Changes match design requirements (verified via Figma if available)
- Ionic dependencies are correctly used
- **Note**: Storybook tests most of the stack (StencilJS → Ionic → Mobile UI + Runtime integration using actual runtime packages) but not the ODC integration part (WidgetLibrary + ODC end-to-end)

### 3. Update Jira

**Steps**:
1. Use `skill:jira-updates` to update Jira story "What I Did" section
2. Document implementation details
3. Include verification steps

**Validation**:
- Jira story updated with implementation details
- "What I Did" section formatted correctly

### 4. Push Changes

**Steps**:
1. Push feature branch to remote
2. Ensure all changes are committed

**Validation**:
- Branch exists on remote
- All changes are committed

## Configuration

**Parameters**:
- `skip-storybook` - Skip Storybook testing (default: false)
- `skip-design-verification` - Skip Figma design verification (default: false)

## Error Handling

### Branch Creation Fails
- Verify Jira issue exists
- Check branch name format
- Ensure starting from `main` branch

### Build Fails
- Check TypeScript compilation errors
- Verify all dependencies are installed
- Check Rollup configuration

### Storybook Fails
- Check Vite configuration
- Verify dependencies are installed
- Check for port conflicts
- Verify runtime packages are correctly configured

### Jira Update Fails
- Verify Jira authentication
- Check issue permissions
- Retry with different format

## Success Criteria

- [ ] Feature branch created from `main`
- [ ] Changes implemented
- [ ] Build completes successfully
- [ ] Tests pass (unit and optionally Storybook tests)
- [ ] Storybook verification passes (if applicable)
- [ ] Design verification passes (if Figma file available)
- [ ] Jira story updated with implementation details
- [ ] Changes committed and pushed

## Common Workflows

### Quick Iteration
If making small changes:
- Skip Storybook if not needed
- Focus on build validation
- Update Jira with brief notes

### Full Testing
If making significant changes:
- Run full Storybook testing
- Verify design matches Figma (if available)
- Comprehensive Jira documentation

## Notes

- **Branch Naming**: Follow `skill:branch-naming` - format is `ROU-XXXX` (just the Jira issue ID)
- **Build**: Use `skill:widgets-js-build`; run `npm run bundle` before testing
- **Storybook**: Use `skill:widgets-js-storybook` for running the Storybook dev server; it tests widget layer + Runtime integration, but not WidgetLibrary/ODC integration
- **Tests**: Use `skill:widgets-js-tests` for unit and Storybook Vitest runs
- **Runtime Integration**: Storybook uses actual runtime packages, so it tests real runtime integration
- **Design Verification**: Use `skill:design-verification` when story has Figma file

## Related Skills

- `skill:branch-naming` - For creating feature branches (from shared)
- `skill:design-verification` - For verifying implementation matches Figma design (from shared)
- `skill:jira-updates` - For updating Jira story (from shared)
- `skill:widgets-js-build` - For production bundle (repo-specific)
- `skill:widgets-js-storybook` - For running Storybook dev server (repo-specific)
- `skill:widgets-js-tests` - For running unit and Storybook Vitest tests (repo-specific)

## Related Agents

- `agent:mobile-ui` - Orchestrator that delegates to this agent for Phase 1
