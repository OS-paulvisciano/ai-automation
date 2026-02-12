# Skill: Branch Naming

**ID**: `skill:branch-naming`  
**Version**: `1.0.0`

## CRITICAL: Always Follow These Rules

### Branch Name Format
**REQUIRED FORMAT**: `<issue-type>/<jira-issue-number>-<short-name?>`

**Components**:
- `<issue-type>` - REQUIRED (see valid types below)
- `<jira-issue-number>` - REQUIRED (e.g., `ROU-12461`)
- `<short-name>` - OPTIONAL but recommended for feature branches

### Valid Issue Types

**For Features**:
- `feature` - Implementing new features
- `task` - General tasks
- `feat` - Alternative for features

**For Bug Fixes**:
- `bugfix` - Fixing bugs
- `bug` - Alternative for bugs
- `fix` - Alternative for fixes

**For Maintenance**:
- `chore` - Non-runtime changes (docs, build scripts, etc.)
- `imp` - Improvements

**For Dependencies**:
- `dependency` - Bumping dependency versions
- `dep` - Alternative for dependencies

**Special Types** (auto-generated):
- `bump` - Package version bumps (auto-created)
- `release` - Release branches

### Examples

**Valid Branch Names**:
- ✅ `feature/ROU-12461-card-dismiss-pressed-state`
- ✅ `bugfix/ROU-12345-dropdown-positioning`
- ✅ `chore/ROU-12000-update-docs`
- ✅ `ROU-12461` (minimal, but not recommended)
- ✅ `feature/ROU-12461` (acceptable, short-name optional)

**Invalid Branch Names**:
- ❌ `ROU-12461` (missing issue-type)
- ❌ `card-dismiss-pressed-state` (missing issue-type and Jira ID)
- ❌ `feature/12461` (missing ROU- prefix)
- ❌ `feat/ROU-12461-card-dismiss-pressed-state` (wrong separator, should be `/`)

### Branch Creation Rules

1. **Always create from `main`**
   - Never branch from other feature branches
   - Always start fresh from `main`

2. **Include Jira Issue ID**
   - Enables automatic PR linking
   - Enables automatic label assignment
   - Required for traceability

3. **Use Descriptive Short Names**
   - Especially important for feature branches (long-lived)
   - Makes branch purpose clear
   - Helps with branch management

### Label Auto-Assignment

Branch name determines PR label:
- `feature/`, `task/`, `feat/` → `feature` label
- `bugfix/`, `bug/`, `fix/` → `bugfix` label
- `chore/`, `imp/` → `chore` label
- `dependency/`, `dep/` → `dependency` label

**Important**: Labels are auto-added, but you MUST verify they're set on the PR.

### AI Instructions

When creating a branch, the AI MUST:
1. Extract Jira issue ID from context
2. Determine issue type from Jira issue or context:
   - Feature/story → `feature`
   - Bug → `bugfix`
   - Maintenance → `chore`
3. Create descriptive short-name from Jira summary
4. Format as: `<issue-type>/<jira-issue-number>-<short-name>`
5. Create branch from `main`
6. Verify branch name follows convention

### Common Mistakes to Avoid

1. **Missing Issue Type**
   - ❌ `ROU-12461-card-dismiss`
   - ✅ `feature/ROU-12461-card-dismiss`

2. **Wrong Separator**
   - ❌ `feature_ROU-12461` (underscore)
   - ✅ `feature/ROU-12461` (slash)

3. **Missing Jira Prefix**
   - ❌ `feature/12461-card-dismiss`
   - ✅ `feature/ROU-12461-card-dismiss`

4. **Branching from Wrong Base**
   - ❌ Branching from `feature/other-branch`
   - ✅ Always branch from `main`
