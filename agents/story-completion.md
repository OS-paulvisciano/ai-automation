# Agent: Story Completion

**ID**: `agent:story-completion`  
**Version**: `1.0.0`  
**Skills Used**: 
  - `skill:branch-naming`
  - `skill:jira-updates`
  - `skill:pr-creation`
  - `skill:design-verification` (optional)

**MCPs Required**: `jira`, `github`, `figma` (optional)

## Workflow

### 1. Start Story
**Skills**: `skill:branch-naming`

**Steps**:
1. Search Jira for in-progress stories assigned to user
2. Identify next unworked story
3. Extract Jira issue ID (e.g., `ROU-12461`)
4. Get Jira issue summary
5. Create branch using `skill:branch-naming`:
   - Format: `<issue-type>/<jira-issue-number>-<short-name>`
   - Branch from `main`
6. Switch to new branch

**Validation**:
- Branch name follows convention
- Branch created from `main`
- Branch checked out successfully

### 2. Implementation
**Skills**: `skill:design-verification` (optional)

**Steps**:
1. Developer implements feature
2. (Optional) Use `skill:design-verification`:
   - Fetch Figma specs for component
   - Compare with codebase tokens
   - Flag any discrepancies

**Validation**:
- Code compiles without errors
- Tests pass (if applicable)
- Design tokens match (if verified)

### 3. Documentation
**Skills**: `skill:jira-updates`

**Steps**:
1. Use `skill:jira-updates` to update Jira story
2. Update "What I Did" section with:
   - Implementation summary
   - Technical details
   - Verification steps
3. Add comment if significant decisions made
4. (Optional) Transition status to "In Review"

**Validation**:
- "What I Did" section updated
- Implementation details included
- Verification steps documented

### 4. PR Creation
**Skills**: `skill:pr-creation`

**Steps**:
1. Use `skill:pr-creation` to create PR:
   - Extract Jira issue ID from branch
   - Format title: `<jira-issue>: <subject>`
   - Fill Context section
   - Fill Impacts section
   - Set appropriate label
2. Verify PR follows all requirements
3. Link PR to Jira issue

**Validation**:
- PR title follows format
- PR includes all template sections
- Label is set
- PR checks pass

## Configuration

**Parameters**:
- `skip-design-verification` - Skip Figma verification (default: false)
- `auto-transition-jira` - Auto-transition Jira to "In Review" (default: false)
- `skip-tests` - Skip running tests (default: false)

## Error Handling

**Branch Creation Fails**:
- Verify Jira issue exists
- Check branch name format
- Ensure starting from `main`

**Jira Update Fails**:
- Verify Jira authentication
- Check issue permissions
- Retry with different format

**PR Creation Fails**:
- Verify GitHub authentication
- Check branch is pushed
- Verify PR title format
- Check label exists

## Success Criteria

- [ ] Branch created and checked out
- [ ] Code implemented and tested
- [ ] Jira story updated with "What I Did"
- [ ] PR created with correct format
- [ ] PR has appropriate label
- [ ] All checks pass
