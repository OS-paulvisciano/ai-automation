---
name: Refactor to .cursor/shared structure
overview: Move only framework components needed by individual repos (skills, agents, teams) from root level to `.cursor/shared/` subfolder. Keep automation-repo-only folders (projects, infrastructure, personal) at root. Update all path references, symlink targets, and documentation to use the new nested structure.
todos:
  - id: create-structure
    content: Create `.cursor/shared/` directory structure with all subdirectories
    status: completed
  - id: move-folders
    content: Move only agents, skills, and teams folders to `.cursor/shared/` (keep projects, infrastructure, personal at root)
    status: completed
  - id: update-cursorrules
    content: Update `.cursorrules` file to reference `.cursor/shared/` paths instead of root-level paths
    status: completed
  - id: update-setup-project
    content: Update `setup-project.js` to symlink to `.cursor/shared` instead of root, and change variable name from ai-automation to shared
    status: completed
  - id: update-setup-mcp
    content: Verify `setup-mcp.js` still works with infrastructure at root (no changes needed)
    status: completed
  - id: update-readme
    content: Update main README.md with new structure and path references
    status: completed
  - id: update-docs
    content: Update all documentation files (docs/, infrastructure/README.md, projects/README.md, teams/README.md, etc.) with new paths
    status: completed
  - id: update-skill-agent-files
    content: Check and update any internal path references in skills/*.md and agents/*.md files
    status: completed
  - id: test-symlink
    content: Test that symlink works correctly in a sample repo and Cursor can read from `.cursor/shared/`
    status: completed
isProject: false
---

# Refactor Framework to `.cursor/shared/` Structure

## Overview

Move all framework components from the repository root to `.cursor/shared/` to:

- Avoid conflicts with existing Cursor setups
- Allow automation repo to have its own `.cursor/plans/` separate from framework
- Keep framework organized under a clear subfolder
- Maintain symlink compatibility with individual repos

## Structure Changes

### Folders to Move to `.cursor/shared/`

Only move folders that individual repos need via symlink:

- `agents/` → `.cursor/shared/agents/`
- `skills/` → `.cursor/shared/skills/`
- `teams/` → `.cursor/shared/teams/`

### Folders to Keep at Root

Keep automation-repo-only folders at root:

- `projects/` - Used by setup scripts, not needed in individual repos
- `infrastructure/` - Used by setup-mcp.js, not needed in individual repos
- `personal/` - Gitignored, personal overrides (can stay at root or be repo-specific)
- `scripts/` - Setup scripts
- `docs/` - Documentation
- `.cursor/plans/` - Automation repo's own plans (already exists)
- `README.md`, `CONTRIBUTING.md`, `SETUP_COMPLETE.md`, `TODO.md`
- `.env`, `.env.example`
- `.cursorrules` - Will be updated with new paths
- `.gitignore`

## Implementation Steps

### 1. Create `.cursor/shared/` Directory Structure

Create the nested directory structure for folders that will be symlinked:

```bash
mkdir -p .cursor/shared/{agents,skills,teams}
```

### 2. Move Framework Components

Move only the folders needed by individual repos:

- `mv agents .cursor/shared/agents`
- `mv skills .cursor/shared/skills`
- `mv teams .cursor/shared/teams`

**Note:** `projects/`, `infrastructure/`, and `personal/` stay at root level.

### 3. Update `.cursorrules` File

Update [.cursorrules](.cursorrules) to reference new paths:

- Change `skills/` → `.cursor/shared/skills/`
- Change `agents/` → `.cursor/shared/agents/`
- Change `teams/` → `.cursor/shared/teams/`
- Update Framework Structure section
- Update Configuration Hierarchy section - remove `projects/{project}/` from hierarchy (it's automation-repo-only)
- Update Examples section with new paths

Key changes:

- Line 7: Update structure description (remove projects, infrastructure, personal from shared structure)
- Line 18-22: Update example paths to `.cursor/shared/`
- Line 30-34: Update hierarchy - remove `projects/{project}/` since it's not in shared
- Line 84: Remove or update project configs reference (projects stay at root)
- Line 90-99: Update example file paths to `.cursor/shared/`

### 4. Update `setup-project.js` Script

Update [scripts/setup-project.js](scripts/setup-project.js):

- Line 8: Update comment to reference `.cursor/shared`
- Line 188: Change `'ai-automation'` → `'shared'`
- Line 206: Change symlink target from `AUTOMATION_ROOT` to `path.join(AUTOMATION_ROOT, '.cursor', 'shared')`
- Line 208: Update console log message
- Line 431: Update final message to reference `.cursor/shared`

**Note:** `PROJECTS_DIR` stays at root level (line 26) since projects folder is not moved.

### 5. Verify `setup-mcp.js` Script

Verify [scripts/setup-mcp.js](scripts/setup-mcp.js) still works:

- Line 24: `SHARED_CONFIG` path stays as `infrastructure/mcp-config.template.json` (infrastructure stays at root)
- No changes needed since infrastructure is not moved

### 6. Update Documentation Files

Update all documentation to reflect new paths:

**README.md:**

- Update structure section (lines 7-11)
- Update symlink references (line 149, 158, 186, 199-204, 250-251)
- Update configuration hierarchy examples
- Update all path references throughout

**docs/COMPLETE_SETUP_GUIDE.md:**

- Update clone location references
- Update symlink creation commands
- Update path examples in verification steps
- Update priority order examples

**docs/AUTOMATION_SETUP.md:**

- Update all path references

**infrastructure/README.md** (stays at root `infrastructure/README.md`):

- Update path references to reflect that infrastructure is at root, not in shared
- Update setup instructions

**projects/README.md** (stays at root `projects/README.md`):

- Update to clarify that projects folder is automation-repo-only
- Remove references to symlink (projects not symlinked)
- Update path examples

**teams/README.md** (will be at `.cursor/shared/teams/README.md`):

- Update path references

**skills/README.md** (will be at `.cursor/shared/skills/README.md`):

- Update path references if any

**agents/README.md** (will be at `.cursor/shared/agents/README.md`):

- Update path references if any

**scripts/README.md:**

- Update path references

**SETUP_COMPLETE.md:**

- Update clone location and path references

**CONTRIBUTING.md:**

- Update path references if any

**TODO.md:**

- Update path references if any

### 7. Update Individual Skill/Agent Files

Check and update any internal path references in:

- `skills/*.md` files
- `agents/*.md` files

These may reference other skills/agents or project configs.

### 8. Verify Symlink Behavior

After changes, verify that:

- Individual repos can symlink `.cursor/shared` → `~/repos/ai-automation/.cursor/shared`
- Paths resolve correctly: `.cursor/shared/skills/pr-creation/SKILL.md`
- `.cursorrules` in repos can reference `.cursor/shared/skills/` correctly

## Testing Checklist

- All folders moved successfully
- `.cursorrules` updated and paths work
- `setup-project.js` creates correct symlink to `.cursor/shared`
- `setup-mcp.js` still finds config template at root `infrastructure/` location
- All documentation updated
- Test symlink in a sample repo
- Verify Cursor can read skills from `.cursor/shared/skills/`
- Verify MCP config generation still works

## Migration Notes

- Existing repos with old symlinks will need to update their symlinks
- Users may need to re-run `setup-project.js` or manually update symlinks
- Consider adding a migration note in README for existing users

