---
name: widget-library-update-widgets-js
description: Updates widgets-js in WidgetLibrary from npm or local copy (RuntimeResources, DesignTime). Use when the user says update widgets-js, copy from local, update runtime widgets, or needs WidgetLibrary to use latest widgets-js before preparing XIF.
---

# Skill: Widget Library Update Widgets-JS

**ID**: `skill:widget-library-update-widgets-js`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:widget-library`)  
**Repository**: `OutSystems.WidgetLibrary`

## Overview

Updating widgets-js in WidgetLibrary — pulling widgets-js artifacts from either npm or the local `runtime-mobile-widgets-js` repo into WidgetLibrary. Use before preparing XIF so the XIF contains the desired widget code. Naming uses "widgets-js" to stay consistent with the widgets-js repo and to avoid confusion with the separate runtime.

## CRITICAL: Always Follow These Rules

### NPM Mode (published package)

**When to use**: Consuming a published widgets-js version; no local bundle needed.

**Required Steps**:
1. Navigate to ServiceStudio directory:
   ```bash
   cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio
   ```
2. Run update script:
   ```bash
   npm run update-runtime-widgets
   ```

**What This Does**:
- Installs `@outsystems/runtime-mobile-widgets-js@latest` from npm
- Copies from `node_modules/@outsystems/runtime-mobile-widgets-js/dist/` into RuntimeResources and DesignTime

### Local Mode (copy from local repo)

**When to use**: Iterating on widgets-js and WidgetLibrary together; want to test XIF with unreleased/local bundle. Keeps everything local and avoids publishing to npm.

**Prerequisite**: In `runtime-mobile-widgets-js`, run `npm run bundle` (per `skill:widgets-js-build`) so `dist/` is up to date.

**Required Steps**:
1. Ensure widgets-js has been built: in `runtime-mobile-widgets-js`, run `npm run bundle`.
2. Navigate to ServiceStudio directory:
   ```bash
   cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio
   ```
3. Run local copy script:
   ```bash
   npm run copy-from-local
   ```

**What This Does**:
- Copies from local repo `../../runtime-mobile-widgets-js/dist/` (repos assumed siblings) into WidgetLibrary:
  - `outsystems-mobile-widgets.css` → `RuntimeResources/wwwroot/css/outsystems-mobile-widgets.css`
  - `runtime-mobile-widgets.esm.js` → `RuntimeResources/wwwroot/sources/runtime-mobile-widgets.js`
  - `MobileUI.MobileUI.css` → `RuntimeResources/wwwroot/css/MobileUI.MobileUI.css`
  - `runtime-mobile-widgets.designtime.js` → `DesignTime/runtime-mobile-widgets.designtime.js`

**Note**: If repos are not siblings, run equivalent copy commands with your source path, or set up a script that uses `WIDGETS_JS_DIST` for the source directory.

**No `copy-from-local` script**: If ServiceStudio has no `copy-from-local` npm script, run the equivalent copies manually (e.g. `npx ncp` or `cp`) from `../../runtime-mobile-widgets-js/dist/` to the four destinations listed above (RuntimeResources and DesignTime paths).

### Validation

- Script completes without errors
- The four files exist under RuntimeResources and DesignTime with updated content
- No file conflicts or copy errors

## Repository-Specific Knowledge

**Repository**: `OutSystems.WidgetLibrary`  
**Location**: `~/repos/OutSystems.WidgetLibrary`  
**ServiceStudio Directory**: `~/repos/OutSystems.WidgetLibrary/ServiceStudio`

**WidgetLibrary Role**:
- Controls how widgets appear in ODC (labels, properties, design-time experience)
- Consumes widgets-js artifacts (from npm or local copy) for XIF generation
- Generates XIF files for ODC consumption

## Common Issues

### NPM Mode Fails
- Check npm package is published/available
- Verify network and npm permissions
- Verify ServiceStudio directory exists

### Local Mode Fails
- **Path wrong**: Repos must be siblings (e.g. `~/repos/OutSystems.WidgetLibrary` and `~/repos/runtime-mobile-widgets-js`) for default path; otherwise use manual copy or custom script with `WIDGETS_JS_DIST`
- **dist/ missing**: Run `npm run bundle` in `runtime-mobile-widgets-js` first (use `skill:widgets-js-build`)

## AI Instructions

When updating widgets-js in WidgetLibrary:

1. **Choose mode**: NPM (published) or local (unreleased bundle). Use local when iterating with widgets-js repo.
2. **NPM**: Run `npm run update-runtime-widgets` in ServiceStudio.
3. **Local**: Run `npm run bundle` in widgets-js first, then `npm run copy-from-local` in ServiceStudio.
4. **Validate**: Confirm the four files are present and script exited successfully.
5. **Handle errors**: NPM — check package availability and permissions; local — check dist exists and path (sibling repos).

For production bundle in widgets-js, use `skill:widgets-js-build`. After updating widgets-js in WidgetLibrary, use `skill:widget-library-xif` when preparing XIF.

## Related Skills

- `skill:widgets-js-build` - For local bundle before local copy (repo: runtime-mobile-widgets-js)
- `skill:widget-library-xif` - For XIF preparation after updating widgets-js (repo-specific)
- `skill:branch-naming` - For creating feature branches (from shared, from `dev`)

## Related Agents

- `agent:widget-library` - Uses this skill for updating widgets-js in WidgetLibrary
