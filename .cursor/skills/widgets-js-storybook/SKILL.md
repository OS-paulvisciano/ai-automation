---
name: widgets-js-storybook
description: Runs the Storybook dev server for widgets-js (Vite, port 6006). Use when the user says run Storybook, storybook, start Storybook, or wants to preview components in Storybook.
---

# Skill: Widgets-JS Storybook

**ID**: `skill:widgets-js-storybook`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:widgets-js`)  
**Repository**: `runtime-mobile-widgets-js`

## Overview

Running the Storybook dev server for the widgets-js repository. Storybook uses Vite for its build; the production bundle (`npm run bundle`) is separate and used for release/WidgetLibrary consumption.

## CRITICAL: Always Follow These Rules

### Run Storybook

**Required Steps**:
1. Run `npm run storybook` to start the Storybook dev server
2. Verify Storybook starts without errors (default port 6006)
3. Optionally verify components render and runtime integration works

**Command**:
```bash
npm run storybook
```

**Note**: The current script may run Rollup if `dist/outsystems-mobile-widgets.css` is missing. Eventually Storybook will use Vite for its own build.

**What Storybook Exercises**:
- StencilJS compilation
- Ionic component rendering
- Mobile UI widget functionality
- Runtime integration (uses actual `@outsystems/runtime-core-js` and `@outsystems/runtime-view-js` packages)
- Runtime classes: DataTypes, Widget, WidgetHelpers, Model.Variable, Model.DummyViewModel
- Does NOT test WidgetLibrary integration (ODC design-time experience)
- Does NOT test ODC end-to-end integration

**Validation**:
- Storybook starts without errors
- Dev server listens (default port 6006)
- Components render correctly
- No console errors
- Runtime integration works (variables, widgets, etc.)

## Repository-Specific Knowledge

**Repository**: `runtime-mobile-widgets-js`  
**Location**: `~/repos/runtime-mobile-widgets-js`  
**Default Port**: 6006

**Stack**:
- Storybook uses Vite for development
- Runtime packages (`@outsystems/runtime-core-js`, `@outsystems/runtime-view-js`) are used for integration testing in Storybook

## Common Issues

### Storybook Fails to Start
- Check Vite configuration
- Verify dependencies are installed (`npm install`)
- Check for port conflicts (default port 6006)
- Verify Storybook configuration in `.storybook/main.ts`

### Runtime Integration Issues
- Verify `@outsystems/runtime-core-js` and `@outsystems/runtime-view-js` are installed
- Check package versions match requirements
- Verify CommonJS plugin is configured in Vite (for runtime packages)

## AI Instructions

When running Storybook for widgets-js:

1. **Start Storybook**: Run `npm run storybook`
2. **Verify startup**: Ensure the dev server starts and listens on port 6006 (or reported port)
3. **Handle errors**: If Storybook fails to start, check Vite config, dependencies, and port; for runtime issues, check runtime package installation and Vite CommonJS config

For production bundle, use `skill:widgets-js-build`. For running Vitest tests (unit or Storybook project), use `skill:widgets-js-tests`.

## Related Skills

- `skill:widgets-js-build` - For production bundle (repo-specific)
- `skill:widgets-js-tests` - For running unit and Storybook Vitest tests (repo-specific)
- `skill:design-verification` - For verifying implementation matches Figma design (from shared)

## Related Agents

- `agent:widgets-js` - Uses this skill for Storybook dev server workflows
