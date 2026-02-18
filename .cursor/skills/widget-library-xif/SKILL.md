---
name: widget-library-xif
description: Prepares XIF file for WidgetLibrary (version bump, build, copy to ODC plugins). Use when the user says prepare XIF, run prepare-xif, build XIF, or needs to generate the XIF for ODC. Run skill:widget-library-update-widgets-js first if widgets-js is outdated.
---

# Skill: Widget Library XIF

**ID**: `skill:widget-library-xif`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:widget-library`)  
**Repository**: `OutSystems.WidgetLibrary`

## Overview

XIF preparation and publishing workflows for the WidgetLibrary repository. Handles preparing XIF files and coordinating XIF publishing. Before preparing XIF, update widgets-js in WidgetLibrary using `skill:widget-library-update-widgets-js` (npm or local).

## CRITICAL: Always Follow These Rules

### Prepare XIF File

**Required Steps**:
1. From WidgetLibrary root, run the prepare script (symlink it to `scripts/prepare_xif.js` if needed; see skill `mobile-ui-prepare-xif-from-local`):
   ```bash
   cd ~/repos/OutSystems.WidgetLibrary
   node scripts/prepare_xif.js
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
- XIF file generated in `ServiceStudio/bin/Debug/xif/`
- XIF copied to ODC Studio Plugins folder
- Version matches expected format (e.g., `1.0.380`)

### XIF Publishing (Manual)

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
- MobileUI version available in ODC Studio

## Repository-Specific Knowledge

**Repository**: `OutSystems.WidgetLibrary`  
**Location**: `~/repos/OutSystems.WidgetLibrary`  
**Base Branch**: `dev`  
**ServiceStudio Directory**: `~/repos/OutSystems.WidgetLibrary/ServiceStudio`

**WidgetLibrary Role**:
- Controls how widgets appear in ODC (labels, properties, design-time experience)
- Consumes widgets-js artifacts (update via `skill:widget-library-update-widgets-js` before preparing XIF)
- Generates XIF files for ODC consumption

**Version Files**:
- `Common/Widgets.xml` - Widget version metadata
- `Images/MobileUI.Light/Properties/AssemblyInfo.cs` - Assembly version

**XIF File Location**:
- Generated: `ServiceStudio/bin/Debug/xif/MobileUI-<VERSION>.xif`
- Copied to: ODC Studio Plugins folder (automated by script)

## Common Issues

### Widgets-js in WidgetLibrary Outdated
- If widgets-js in WidgetLibrary is outdated, run `skill:widget-library-update-widgets-js` first (npm or local as appropriate).

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

## AI Instructions

When preparing XIF:

1. **Ensure widgets-js is updated in WidgetLibrary first** (use `skill:widget-library-update-widgets-js`, npm or local, as appropriate).

2. **Follow manual steps**:
   - Post to Slack before build (`<version> :loading:`)
   - Guide user through ODC Studio publishing
   - Update Slack after publishing (`<version> :check:`)

3. **Validate XIF generation**:
   - Check version files are updated correctly
   - Verify XIF file is generated
   - Confirm XIF is copied to ODC Studio Plugins folder

4. **Handle errors**:
   - If widgets-js update is needed, direct user to `skill:widget-library-update-widgets-js`
   - If XIF preparation fails, check .NET SDK and build tools
   - Report specific error messages to user

## Related Skills

- `skill:widget-library-update-widgets-js` - For updating widgets-js in WidgetLibrary before preparing XIF (repo-specific)
- `skill:branch-naming` - For creating feature branches (from shared, from `dev`)

## Related Agents

- `agent:widget-library` - Uses this skill for XIF preparation workflows
