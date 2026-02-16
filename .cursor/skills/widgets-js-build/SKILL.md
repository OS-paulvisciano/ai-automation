---
name: widgets-js-build
description: Runs production bundle for widgets-js (Rollup, dist validation for WidgetLibrary). Use when the user says build widgets-js, run bundle, production bundle, bundle for WidgetLibrary, or needs the dist built.
---

# Skill: Widgets-JS Build

**ID**: `skill:widgets-js-build`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:widgets-js`)  
**Repository**: `runtime-mobile-widgets-js`

## Overview

Production bundle workflow for the widgets-js repository. Handles Rollup bundling and dist validation for consumption by WidgetLibrary.

## CRITICAL: Always Follow These Rules

### Build Workflow

**Required Steps**:
1. Run `npm run bundle` to build
   - Builds StencilJS components into web components
   - Bundles for consumption by WidgetLibrary
   - Generates distributable files in `dist/` directory
2. Verify build completes without errors
3. Check build output exists in `dist/` directory

**Build Command**:
```bash
npm run bundle
```

**What This Does**:
- Compiles TypeScript to JavaScript
- Bundles StencilJS components into web components
- Generates ESM and UMD bundles
- Extracts CSS files
- Outputs to `dist/` directory

**Validation**:
- Build completes without errors
- `dist/runtime-mobile-widgets.esm.js` exists
- `dist/runtime-mobile-widgets.esm.min.js` exists
- `dist/outsystems-mobile-widgets.css` exists
- No TypeScript compilation errors
- No bundling errors

### Build Output Validation

**Required Files After Build**:
- `dist/runtime-mobile-widgets.esm.js` - ESM bundle
- `dist/runtime-mobile-widgets.esm.min.js` - Minified ESM bundle
- `dist/outsystems-mobile-widgets.css` - CSS bundle
- `dist/MobileUI.MobileUI.css` - MobileUI CSS
- `dist/Template_MobileApp.css` - Template CSS

**Validation Checks**:
- All required files exist
- Files are not empty
- No build warnings (unless expected)
- CSS files contain expected styles

## Repository-Specific Knowledge

**Repository**: `runtime-mobile-widgets-js`  
**Location**: `~/repos/runtime-mobile-widgets-js`  
**Base Branch**: `main`  
**Build Tool**: Rollup (via `rollup.config.js`)

**Stack Dependencies**:
- **StencilJS**: Components compile to web components via StencilJS
- **Ionic**: Widgets built on Ionic components
- **Runtime**: Uses actual `@outsystems/runtime-core-js` and `@outsystems/runtime-view-js` packages
- **Storybook**: Uses Vite for dev; see `skill:widgets-js-storybook` for running Storybook

**Files Typically Modified**:
- Component files in `src/scripts/Components/`
- Style files (SCSS/CSS) - may use Ionic CSS variables
- Story files for Storybook testing
- Platform-specific styles (`.plt-android`, `.plt-ios`)

## Common Issues

### Build Fails
- Check TypeScript compilation errors
- Verify all dependencies are installed (`npm install`)
- Check Rollup configuration
- Verify file paths are correct

## AI Instructions

When building widgets-js (production bundle):

1. **Run build**:
   - Run `npm run bundle`
   - Verify build completes without errors

2. **Validate build output**:
   - Check that required files exist in `dist/`
   - Verify no build errors or warnings

3. **Handle errors**:
   - If build fails, check TypeScript errors first, then Rollup config and file paths
   - Report specific error messages to user

For running the Storybook dev server, use `skill:widgets-js-storybook`. For running Vitest tests, use `skill:widgets-js-tests`.

## Related Skills

- `skill:branch-naming` - For creating feature branches (from shared)
- `skill:design-verification` - For verifying implementation matches Figma design (from shared)
- `skill:jira-updates` - For updating Jira with implementation details (from shared)
- `skill:widgets-js-storybook` - For running Storybook dev server (repo-specific)
- `skill:widgets-js-tests` - For running unit and Storybook Vitest tests (repo-specific)

## Related Agents

- `agent:widgets-js` - Uses this skill for production bundle workflows
