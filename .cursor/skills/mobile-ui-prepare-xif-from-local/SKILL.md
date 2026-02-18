---
name: mobile-ui-prepare-xif-from-local
description: Orchestrates preparing the XIF for publishing from local changes (bundle widgets-js, update WidgetLibrary from local, run prepare-xif). Use when the user says prepare XIF, xif prepare, bundle and prepare XIF, or wants to get the XIF ready for publishing from local. Supports skipping the widgets-js build for WidgetLibrary-only iteration. Delegates to agent:widgets-js and agent:widget-library.
---

# Skill: Mobile-UI Prepare XIF From Local

**ID**: `skill:mobile-ui-prepare-xif-from-local`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:mobile-ui`)  
**Repository**: `ai-automation`

## Overview

Orchestrate **preparing the XIF for publishing** from local changes: bundle widgets-js, update WidgetLibrary from local, run prepare-xif (version bump, build, copy XIF to ODC plugins folder). Delegate each step to the agent that owns the corresponding skill. You can **skip the widgets-js build** (and optionally the copy step) when iterating on WidgetLibrary-only changes.

**Out of scope**: Publishing the XIF in ODC Studio (Support menu) is manual and not automated; that could be a separate future skill.

## When to use (natural language)

Use this skill when the user wants to prepare the XIF from local, for example:

- "Prepare XIF from local"
- "XIF prepare" / "prepare xif"
- "Prepare XIF with my local widgets-js"
- "Bundle and prepare XIF"
- "Get the XIF ready for publishing from local"
- **Skip widgets-js build**: "Prepare XIF without building widgets-js", "Prepare XIF skip bundle", "WidgetLibrary only prepare XIF", "Iterating on WidgetLibrary only"

## CRITICAL: Always Follow These Rules

### When to skip the widgets-js build

- **Skip build (steps 1 and 2)** when the user says they are iterating on **WidgetLibrary only** (e.g. Widgets.xml, Carousel.cs, other .cs or ODC config). Run **only step 3** (prepare-xif). Do not run bundle or copy-from-local.
- **Skip build only (step 1)** when the user says "skip bundle" but still wants the latest widgets-js dist copied in (e.g. dist/ is already built). Run **steps 2 and 3** (copy-from-local, then prepare-xif).
- **Full flow** (default): when the user says "prepare XIF", "bundle and prepare XIF", or does not mention skipping, run **steps 1, 2, 3** (bundle, copy-from-local, prepare-xif).

### Orchestration steps (skill-level delegation)

Do not run the underlying npm commands directly. Delegate to the repo agents so they run their task-scoped skills.

1. **Bundle widgets-js** (skip if WidgetLibrary-only or user asked to skip build)
   - Delegate to **agent:widgets-js** to run **skill:widgets-js-build** only.
   - Production bundle in runtime-mobile-widgets-js. No branch, implement, Storybook, commit, or push; just ensure dist/ is up to date.

2. **Update WidgetLibrary from local** (skip if WidgetLibrary-only)
   - Delegate to **agent:widget-library** to run **skill:widget-library-update-widgets-js** in **local** mode (run `npm run copy-from-local` in ServiceStudio).
   - Skip npm; use local widgets-js dist.

3. **Prepare XIF**
   - Same agent (**agent:widget-library**), run **skill:widget-library-xif** (run `node scripts/prepare_xif.js` from WidgetLibrary root, or the script path if symlinked there).
   - This bumps version, builds the XIF, copies it to the ODC Studio Plugins folder. User completes interactive steps (version input, Slack, etc.).
   - **Publishing** the XIF in ODC Studio (Support → Publish xif) is done by the user manually and is not part of this skill.

### Validation

- After step 1 (if run): dist/ exists in runtime-mobile-widgets-js.
- After step 2 (if run): WidgetLibrary updated from local (RuntimeResources, DesignTime).
- After step 3: XIF built and copied to plugins folder. User publishes in ODC separately.

## Script location and symlink setup (self-contained skill)

This skill includes the prepare script at `scripts/prepare_xif.js`. The skill lives only in **ai-automation** so it appears once in the Skills list.

**To run from WidgetLibrary**: Symlink only the script (do not symlink the whole skill folder, or the skill would appear twice):

```bash
# From OutSystems.WidgetLibrary repo root
ln -sf /path/to/ai-automation/.cursor/skills/mobile-ui-prepare-xif-from-local/scripts/prepare_xif.js scripts/prepare_xif.js
```

Then from WidgetLibrary root:

```bash
node scripts/prepare_xif.js
```

**How the script finds WidgetLibrary root**: Uses `WIDGET_LIBRARY_ROOT` env, or `process.cwd()` if it has `Common/Widgets.xml`, or `process.cwd()/..` when run from ServiceStudio. Run from **WidgetLibrary root** or **ServiceStudio**.

## Related Skills

- `skill:widgets-js-build` - Production bundle (agent:widgets-js)
- `skill:widget-library-update-widgets-js` - Update widgets-js in WidgetLibrary, local mode (agent:widget-library)
- `skill:widget-library-xif` - Prepare XIF script (agent:widget-library)

## Related Agents

- `agent:widgets-js` - Run skill:widgets-js-build for step 1
- `agent:widget-library` - Run skill:widget-library-update-widgets-js (local) and skill:widget-library-xif for steps 2 and 3
