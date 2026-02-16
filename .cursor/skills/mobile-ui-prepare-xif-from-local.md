# Skill: Mobile-UI Prepare XIF From Local

**ID**: `skill:mobile-ui-prepare-xif-from-local`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:mobile-ui`)  
**Repository**: `ai-automation`

## Overview

Orchestrate **preparing the XIF for publishing** from local changes: bundle widgets-js, update WidgetLibrary from local, run prepare-xif (version bump, build, copy XIF to ODC plugins folder). Delegate each step to the agent that owns the corresponding skill.

**Out of scope**: Publishing the XIF in ODC Studio (Support menu) is manual and not automated; that could be a separate future skill.

## When to use (natural language)

Use this skill when the user wants to prepare the XIF from local, for example:

- "Prepare XIF from local"
- "Prepare XIF with my local widgets-js"
- "Bundle and prepare XIF"
- "Get the XIF ready for publishing from local"

## CRITICAL: Always Follow These Rules

### Orchestration steps (skill-level delegation)

Do not run the underlying npm commands directly. Delegate to the repo agents so they run their task-scoped skills.

1. **Bundle widgets-js**
   - Delegate to **agent:widgets-js** to run **skill:widgets-js-build** only.
   - Production bundle in runtime-mobile-widgets-js. No branch, implement, Storybook, commit, or push; just ensure dist/ is up to date.

2. **Update WidgetLibrary from local**
   - Delegate to **agent:widget-library** to run **skill:widget-library-update-widgets-js** in **local** mode (run `npm run copy-from-local` in ServiceStudio).
   - Skip npm; use local widgets-js dist.

3. **Prepare XIF**
   - Same agent (**agent:widget-library**), run **skill:widget-library-xif** (run `npm run prepare-xif` in ServiceStudio).
   - This bumps version, builds the XIF, copies it to the ODC Studio Plugins folder. User completes interactive steps (version input, Slack, etc.).
   - **Publishing** the XIF in ODC Studio (Support → Publish xif) is done by the user manually and is not part of this skill.

### Validation

- After step 1: dist/ exists in runtime-mobile-widgets-js.
- After step 2: WidgetLibrary updated from local (RuntimeResources, DesignTime).
- After step 3: XIF built and copied to plugins folder. User publishes in ODC separately.

## Related Skills

- `skill:widgets-js-build` - Production bundle (agent:widgets-js)
- `skill:widget-library-update-widgets-js` - Update widgets-js in WidgetLibrary, local mode (agent:widget-library)
- `skill:widget-library-xif` - Prepare XIF script (agent:widget-library)

## Related Agents

- `agent:widgets-js` - Run skill:widgets-js-build for step 1
- `agent:widget-library` - Run skill:widget-library-update-widgets-js (local) and skill:widget-library-xif for steps 2 and 3
