
# Agent: Widget Library

**ID**: `agent:widget-library`  
**Version**: `1.0.0`  
**Type**: Repository-Specific Agent  
**Repository**: `OutSystems.WidgetLibrary`

**Skills Used**: 
  - `skill:branch-naming` - For creating feature branches (from shared)
  - `skill:widget-library-update-widgets-js` - For updating widgets-js in WidgetLibrary (repo-specific)
  - `skill:widget-library-xif` - For XIF preparation workflows (repo-specific)

**MCPs Required**: None (automated via npm scripts)

## Overview

Repository-specific agent for consuming widget changes in `OutSystems.WidgetLibrary` and preparing XIF files for ODC publishing. Handles branch creation, updating widgets-js in WidgetLibrary, and XIF preparation.

**Agent Role**: This agent manages the workflow for consuming changes from `runtime-mobile-widgets-js` and preparing them for ODC consumption via XIF files.

## Repository Information

**Repository**: `OutSystems.WidgetLibrary`  
**Location**: `~/repos/OutSystems.WidgetLibrary`  
**Base Branch**: `dev`  
**Branch Format**: `ROU-XXXX` (just the Jira issue ID, per `skill:branch-naming`)

## Workflow

### 1. Create/Verify Feature Branch

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
   - Use `skill:branch-naming` for branch format
   - Format: `ROU-XXXX` (just the Jira issue ID)
   - Branch from `dev`

**Validation**:
- Branch exists or created successfully
- Branch is checked out
- Branch is based on `dev`

### 2. Update widgets-js in WidgetLibrary

**Steps** (using `skill:widget-library-update-widgets-js`):

Choose based on whether you are using a published package or the local widgets-js repo:

**Option A — NPM (published package)**:
1. Navigate to ServiceStudio: `cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio`
2. Run: `npm run update-runtime-widgets`
3. Installs `@outsystems/runtime-mobile-widgets-js@latest` and copies from node_modules into RuntimeResources and DesignTime.

**Option B — Local (copy from local repo)**:
1. In `runtime-mobile-widgets-js`, run `npm run bundle` so `dist/` is up to date (use `skill:widgets-js-build`).
2. Navigate to ServiceStudio: `cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio`
3. Run: `npm run copy-from-local`
4. Copies from local repo `dist/` into WidgetLibrary (repos assumed siblings). Keeps everything local without npm publish.

**Validation**:
- Script completes without errors
- Widgets-js resources copied to RuntimeResources and DesignTime

### 3. Verify Changes

**Steps**:
1. Review changes in WidgetLibrary
2. Verify widgets-js resources are updated correctly (RuntimeResources, DesignTime)
3. Check that design-time resources are in place

**Validation**:
- Changes from widgets-js are present in WidgetLibrary
- No errors in WidgetLibrary structure

### 4. Prepare XIF File

**Steps** (using `skill:widget-library-xif`):
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
- **Posts to Slack BEFORE build** (with `:loading:` emoji syntax) - Manual step
- Automatically bumps the patch version
- Updates version in `Widgets.xml` and `AssemblyInfo.cs`
- Cleans and builds the solution (generates XIF file)
- Copies XIF to ODC Studio Plugins folder
- Removes older XIF versions
- Guides through ODC publishing and Slack update (with `:check:` emoji syntax) - Manual steps

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

### 5. Publish XIF in ODC Studio (Manual)

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

## Configuration

**Parameters**:
- `skip-xif-publishing` - Skip XIF publishing step (default: false)

## Error Handling

### Branch Creation Fails
- Verify Jira issue exists
- Check branch name format
- Ensure starting from `dev` branch

### Update widgets-js in WidgetLibrary Fails
- Use `skill:widget-library-update-widgets-js` for steps. NPM: check package is published and npm permissions. Local: ensure `npm run bundle` was run in widgets-js and repos are siblings (or use custom path).

### XIF Preparation Fails
- Check for uncommitted changes (script will offer to stash)
- Verify dev branch is up to date
- Check build tools are installed (.NET SDK)
- Verify ODC Studio Plugins folder exists
- Check version format is correct

### XIF Publishing Fails
- Verify XIF file exists in ODC Studio Plugins folder
- Check ODC Studio is running
- Verify XIF file is not corrupted
- Check ODC Studio permissions

## Success Criteria

- [ ] Feature branch created/verified from `dev`
- [ ] Widgets-js updated in WidgetLibrary (via npm or local copy as appropriate)
- [ ] XIF prepared successfully
- [ ] Version files updated correctly
- [ ] XIF file generated
- [ ] XIF copied to ODC Studio Plugins folder
- [ ] Slack message posted and updated
- [ ] XIF published in ODC Studio (manual)

## Common Workflows

### Quick Iteration (Widgets-js Already Updated in WidgetLibrary)
If widgets-js is already updated in WidgetLibrary:
- Skip Step 2 (Update widgets-js in WidgetLibrary)
- Start at Step 4 (Prepare XIF)

### Full Workflow
If starting from scratch:
- Update widgets-js in WidgetLibrary first (npm or local via `skill:widget-library-update-widgets-js`)
- Then prepare XIF
- Guide through manual publishing steps

## Notes

- **Branch Naming**: Follow `skill:branch-naming` - format is `ROU-XXXX` (just the Jira issue ID)
- **Base Branch**: Always branch from `dev`, not `main`
- **Version Bumping**: XIF preparation script handles version bumping automatically
- **Slack Integration**: Manual posting required (automation coming soon)
- **ODC Studio**: Can stay open during XIF preparation - no restart needed
- **WidgetLibrary Role**: Controls how widgets appear in ODC (labels, properties, design-time experience)

## Related Skills

- `skill:branch-naming` - For creating feature branches (from shared)
- `skill:widget-library-update-widgets-js` - For updating widgets-js in WidgetLibrary (repo-specific)
- `skill:widget-library-xif` - For XIF preparation workflows (repo-specific)

## Related Agents

- `agent:mobile-ui` - Orchestrator that delegates to this agent for Phase 2 & 3
