# Agent: PR Creation

**ID**: `agent:pr-creation`  
**Version**: `1.0.0`  
**Skills Used**: 
  - `skill:pr-creation`
  - `skill:branch-naming` (for validation)
  - `skill:jira-updates` (for linking)

**MCPs Required**: `github`, `jira`

## Workflow

### 1. Validate Branch
**Skills**: `skill:branch-naming`

**Steps**:
1. Get current branch name
2. Validate branch name follows convention
3. Extract Jira issue ID from branch name
4. Verify branch is pushed to remote

**Validation**:
- Branch name format is correct
- Jira issue ID extracted
- Branch exists on remote

### 2. Get Jira Context
**Skills**: `skill:jira-updates`

**Steps**:
1. Search for Jira issue using extracted ID
2. Get issue summary for PR title
3. Get issue description for PR context
4. Check if "What I Did" section is filled

**Validation**:
- Jira issue found
- Issue summary retrieved
- Context available for PR

### 3. Create PR
**Skills**: `skill:pr-creation`

**Steps**:
1. Format PR title: `<jira-issue>: <subject>`
2. Fill Context section:
   - Why change is needed
   - What problem it solves
3. Fill Impacts section:
   - Check applicable boxes
4. Determine label from branch name
5. Create PR via GitHub CLI
6. Set label on PR
7. Link PR to Jira issue

**Validation**:
- PR title follows format
- Context section filled
- Impacts section filled
- Label is set
- PR created successfully

## Configuration

**Parameters**:
- `base-branch` - Base branch for PR (default: `main`)
- `draft` - Create as draft PR (default: false)
- `auto-label` - Auto-set label from branch (default: true)
- `link-jira` - Link PR to Jira issue (default: true)

## Error Handling

**Branch Validation Fails**:
- Check branch name format
- Verify branch exists
- Ensure branch is pushed

**Jira Context Fails**:
- Verify Jira issue exists
- Check authentication
- Retry with different search

**PR Creation Fails**:
- Verify GitHub authentication
- Check PR title format
- Verify label exists
- Check for duplicate PRs

## Success Criteria

- [ ] Branch validated
- [ ] Jira context retrieved
- [ ] PR title formatted correctly
- [ ] PR template sections filled
- [ ] Label set
- [ ] PR created successfully
- [ ] PR linked to Jira issue
