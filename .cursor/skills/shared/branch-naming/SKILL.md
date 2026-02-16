---
name: branch-naming
description: Enforces branch naming rules (ROU-XXXX format, no prefix or suffix). Use when the user says create branch, branch name, new branch, or wants to create a feature branch.
---

# Skill: Branch Naming

**ID**: `skill:branch-naming`  
**Version**: `1.0.0`

## CRITICAL: Always Follow These Rules

### Branch Name Format

**REQUIRED FORMAT**: `ROU-XXXX` (simple format, just the Jira issue ID)

**Components**:
- `<jira-issue-number>` - REQUIRED (e.g., `ROU-12461`, `ROU-12451`)
- No prefix (no `feature/`, `bugfix/`, etc.)
- No description suffix

### Valid Issue Types

**Note**: Issue types are no longer part of branch names. The simple format `ROU-XXXX` is used for all issue types. Labels on PRs will be determined from the Jira issue type instead.

### Examples

**Valid Branch Names**:
- ✅ `ROU-12451`
- ✅ `ROU-12461`
- ✅ `ROU-12345`

**Invalid Branch Names**:
- ❌ `feature/ROU-12451-pause-carousel` (has prefix and description)
- ❌ `ROU-12451-pause-carousel` (has description suffix)
- ❌ `12451` (missing ROU- prefix)
- ❌ `card-dismiss-pressed-state` (missing Jira ID)
- ❌ `feature/ROU-12451` (has prefix)

### Branch Creation Rules

1. **Always create from `main`**
   - Never branch from other feature branches
   - Always start fresh from `main`

2. **Include Jira Issue ID**
   - Enables automatic PR linking
   - Enables automatic label assignment
   - Required for traceability
   - Format: `ROU-XXXX` (just the Jira ID, nothing else)

### Label Auto-Assignment

Since branch names are just `ROU-XXXX`, labels are determined from the Jira issue type:
- Story/Feature → `feature` label
- Bug → `bugfix` label
- Task/Chore → `chore` label
- Dependency updates → `dependency` label

**Important**: Labels must be set manually or determined from Jira issue type. Always verify labels are set on the PR.

### AI Instructions

When creating a branch, the AI MUST:
1. Extract Jira issue ID from context
2. Format as: `ROU-XXXX` (just the Jira issue ID, no prefix, no description)
3. Create branch from `main`
4. Verify branch name follows convention (must be exactly `ROU-XXXX` format)

### Common Mistakes to Avoid

1. **Adding Prefix or Description**
   - ❌ `feature/ROU-12461-pause-carousel` (has prefix and description)
   - ❌ `ROU-12461-pause-carousel` (has description)
   - ✅ `ROU-12461` (correct format)

2. **Missing Jira Prefix**
   - ❌ `12461` (missing ROU- prefix)
   - ✅ `ROU-12461`

3. **Branching from Wrong Base**
   - ❌ Branching from `ROU-other-branch`
   - ✅ Always branch from `main`
