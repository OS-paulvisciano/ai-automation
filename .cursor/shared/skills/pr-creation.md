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
- [ ] Branch created from `main`
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

### AI Instructions

When creating a PR, the AI MUST:
1. Extract Jira issue ID from branch name or context
2. Get Jira issue summary for PR title subject
3. Remove component prefixes like `[MobileUI]`, `[ComponentName]`, etc. from Jira summary
4. Format title as: `<jira-issue>: <subject>`
5. Include colon after Jira issue
6. Fill Context section with why change is needed
7. Fill Impacts section, checking applicable boxes
8. Determine label from Jira issue type (Story/Feature → `feature`, Bug → `bugfix`, etc.)
9. Set at least one label
10. Verify all requirements are met before creating

### Reference Links
- PR Conventions: https://outsystemsrd.atlassian.net/wiki/spaces/RCP/pages/1544487638/Pull+Requests
