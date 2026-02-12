# Skill: Jira Updates

**ID**: `skill:jira-updates`  
**Version**: `1.0.0`  
**MCPs Required**: `jira`

## CRITICAL: Always Follow These Rules

### Jira Issue Format
**Issue IDs**: Format is `ROU-XXXXX` (e.g., `ROU-12461`)
- Always use uppercase
- No `#` prefix
- Include project prefix `ROU-`

### "What I Did" Section Updates

**When to Update**:
- After completing implementation
- Before creating PR
- When story is ready for review

**Required Content**:
1. **Implementation Summary**
   - What was implemented
   - Key changes made
   - Files modified

2. **Technical Details**
   - Approach taken
   - Design decisions
   - Any notable patterns or conventions followed

3. **Verification Steps**
   - How to test the changes
   - Storybook steps (if applicable)
   - Manual testing instructions
   - **ODC App URL** (if applicable): Include link to ODC app for testing
     - Format: `ODC App: https://eng-starter-apps-dev.outsystems.app/{app-name}/Home`
     - Example: `ODC App: https://eng-starter-apps-dev.outsystems.app/ROU12451carouselpause/Home`

**Format Example**:
```markdown
## What I Did

### Implementation
- Added pressed state styling for Card dismiss button on Android
- Implemented using Ionic CSS variables (--background-activated, --color-activated, --border-radius)
- Used design tokens: $token-bg-neutral-subtlest-press, $token-icon-default, $token-soft-xs

### Technical Details
- Added platform-specific SCSS in .plt-android block
- Matches ghost button pressed state styling
- Border radius uses semantic token $token-soft-xs (8px)

### Verification
- Tested in Storybook with Android viewport (Pixel, Nexus)
- Verified colors match Figma specs:
  - Background: #EAE9E9 ✓
  - Icon color: #242424 ✓
  - Border radius: 8px ✓
- ODC App: https://eng-starter-apps-dev.outsystems.app/{app-name}/Home (if applicable)
```

### Comment Updates

**When to Add Comments**:
- Significant implementation decisions
- Blockers encountered and resolved
- Questions for reviewers
- Links to related PRs or discussions

**Comment Format**:
- Be concise but informative
- Include relevant context
- Link to code or documentation when helpful

### Issue Status Transitions

**Common Workflows**:
- `In Progress` → `In Review` (when PR is created)
- `In Review` → `Done` (when PR is merged)
- `In Progress` → `Blocked` (if blocker encountered)

**Rules**:
- Only transition when appropriate
- Add comment explaining status change
- Link to PR when moving to "In Review"

### Search Conventions

**Finding Stories**:
- Search by status: `status = "In Progress"`
- Search by assignee: `assignee = currentUser()`
- Search by project: `project = ROU`
- Combine: `project = ROU AND status = "In Progress" AND assignee = currentUser()`

**JQL Examples**:
```
project = ROU AND status = "In Progress" AND assignee = currentUser()
project = ROU AND issuekey = ROU-12461
```

### Release Notes

**When to Add**:
- After completing implementation
- Before creating PR
- When story is ready for review
- **MUST** be included in all user-facing changes (bugs, features, improvements)

**Location**:
- Use the dedicated "Release Note" custom field (`customfield_12701`)
- This is a separate field in Jira, NOT part of the description
- See `skill:release-notes` for detailed guidelines

**Integration with "What I Did"**:
- "What I Did" = Technical implementation details (for developers)
- "Release Note" = User-facing description (for end users)
- Both should be updated together when completing a story

### AI Instructions

When updating Jira, the AI MUST:
1. Extract Jira issue ID from context (branch name, PR title, etc.)
2. Search for issue to verify it exists
3. Read current issue description
4. Update "What I Did" section with:
   - Implementation summary
   - Technical details
   - Verification steps (including ODC App URL if applicable)
5. Update "Release Note" custom field (`customfield_12701`) with user-focused description (see `skill:release-notes`)
6. Add comment if significant decisions were made
7. Use clear, professional language
8. Include relevant links (PR, Figma, ODC App URL, etc.)

### Common Mistakes to Avoid

1. **Wrong Issue ID Format**
   - ❌ `#ROU-12461`
   - ❌ `rou-12461`
   - ✅ `ROU-12461`

2. **Incomplete "What I Did" Section**
   - Must include implementation details
   - Must include verification steps

3. **Missing Context**
   - Always explain why changes were made
   - Include technical rationale

### Reference
- Jira Project: `outsystemsrd`
- Cloud ID: `outsystemsrd`
