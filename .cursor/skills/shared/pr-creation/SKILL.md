---
name: pr-creation
description: Creates pull requests with required PR title format, labels, and template sections. Use when the user says create PR, open PR, make a PR, or wants to create a pull request.
---

# Skill: PR Creation

**ID**: `skill:pr-creation`  
**Version**: `1.0.0`  
**Dependencies**: `skill:branch-naming`, `skill:jira-updates`  
**MCPs Required**: `github`, `jira`

## CRITICAL: Always Follow These Rules

### PR Title Format
**REQUIRED FORMAT**: `<jira-issue>: <subject>`

**Rules**:
- `<jira-issue>` - Issue ID, e.g., `ROU-12461` (NO `#` prefix)
- `<subject>` - Short, concise description (usually the Jira issue summary)
- **MUST** include colon (`:`) after Jira issue
- **MUST** match exactly: `ROU-XXXX: Description here`
- **MUST** remove component prefixes like `[MobileUI]`, `[ComponentName]`, etc. from Jira summary

**Examples**:
- ✅ `ROU-12461: Add pressed state for Card dismiss button`
- ✅ `ROU-12345: Fix dropdown positioning issue`
- ✅ `ROU-12451: Implement behaviour to pause the carousel when a slide is pressed` (removed `[MobileUI]` prefix)
- ❌ `ROU-12451: [MobileUI] Implement behaviour to pause the carousel` (has component prefix)
- ❌ `ROU-12461: [Component] Add pressed state` (has component prefix)
- ❌ `ROU-12461 Add pressed state` (missing colon)
- ❌ `#ROU-12461: Add pressed state` (has # prefix)
- ❌ `Add pressed state` (missing Jira issue)

### PR Template Sections

**MUST include all sections from template**:

1. **Context** (Required)
   - Why is this change required?
   - What problem does it solve?
   - Should be clear and concise

2. **Impacts** (Required)
   - Check all applicable boxes:
     - [ ] Breaking Change
       - [ ] Behavioral breaking change
       - [ ] Breaks existent APIs
     - [ ] Refactor (big refactor on a sensitive asset)
     - [ ] Requires revision of public documentation

### Labels

**CRITICAL**: At least ONE label MUST be set. Labels are auto-added based on branch name, but you MUST verify one exists.

**Valid Labels**:
- `feature` - New feature or increments to a current feature
- `bugfix` - Fix something that isn't working
- `dependency` - Change or add to a dependency
- `chore` - Task not related to runtime behavior (docs, build scripts, etc.)
- `major`, `minor`, `patch`, `prerelease` - Only for version bumps
- `skip-changelog` - Remove PR from release draft
- `fracasso` - For when you screw up 🥶

**Label Mapping from Branch Names**:
- Branch starting with `feature/`, `task/`, `feat/` → `feature` label
- Branch starting with `bugfix/`, `bug/`, `fix/` → `bugfix` label
- Branch starting with `chore/`, `imp/` → `chore` label
- Branch starting with `dependency/`, `dep/` → `dependency` label

**Validation**:
- GitHub checks will FAIL if no label is set
- Always verify label is present before marking PR as ready

### PR Requirements Checklist

Before creating PR, verify:
- [ ] **Pull latest**: Base branch merged into feature branch and conflicts resolved (e.g. `git fetch origin main && git merge origin/main` in widgets-js; `origin/dev` in WidgetLibrary). Pushing and opening the PR only after this avoids CI running twice due to merge conflicts.
- [ ] Branch created from `main` (widgets-js) or `dev` (WidgetLibrary)
- [ ] Code has been tested
- [ ] Test suite passes
- [ ] Code lints without errors
- [ ] PR title follows format: `<jira-issue>: <subject>`
- [ ] PR includes Context section
- [ ] PR includes Impacts section with checkboxes
- [ ] At least one label is set
- [ ] PR is compliant with all PR checks

### Common Mistakes to Avoid

1. **Missing Colon in Title**
   - ❌ `ROU-12461 Add pressed state`
   - ✅ `ROU-12461: Add pressed state`

2. **Missing Label**
   - Always check labels are set
   - GitHub checks will fail without label

3. **Incomplete Template**
   - Must fill Context section
   - Must check Impacts checkboxes

4. **Wrong Branch Base**
   - Always create from `main`
   - Never from feature branches

5. **Creating PR Without Pulling Latest**
   - Merge the base branch into the feature branch before pushing and creating the PR (widgets-js: merge `main`; WidgetLibrary: merge `dev`). Resolve conflicts, then push and create PR. Otherwise CI may run, then conflicts appear, and a second CI run is needed after resolution.

### AI Instructions

When creating a PR, the AI MUST:
1. **Pull latest first** (when publishing branches and creating PRs): In each repo, fetch and merge the base branch into the feature branch, resolve any conflicts, then push. Only then create the PR. This avoids wasting CI runs on a branch that will immediately need conflict resolution.
2. Extract Jira issue ID from branch name or context
3. Get Jira issue summary for PR title subject
4. Remove component prefixes like `[MobileUI]`, `[ComponentName]`, etc. from Jira summary
5. Format title as: `<jira-issue>: <subject>`
6. Include colon after Jira issue
7. Fill Context section with why change is needed
8. Fill Impacts section, checking applicable boxes
9. Determine label from Jira issue type (Story/Feature → `feature`, Bug → `bugfix`, etc.)
10. Set at least one label
11. Verify all requirements are met before creating

### Reference Links
- PR Conventions: https://outsystemsrd.atlassian.net/wiki/spaces/RCP/pages/1544487638/Pull+Requests
