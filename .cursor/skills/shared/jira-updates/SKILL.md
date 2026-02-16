---
name: jira-updates
description: Updates Jira issues including "What I Did" format and verification steps. Use when the user says update Jira, update story, what I did, or wants to update a Jira story.
---

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

**CRITICAL: AI MUST NOT Automatically Update This Section**
- **DO NOT** use `editJiraIssue` to update the "What I Did" section directly
- **DO NOT** modify the description field containing "What I Did"
- **REASON**: Automatic updates cause formatting issues in Jira
- **INSTEAD**: Provide the formatted "What I Did" content in the chat for the user to copy/paste manually

**Required Format**:
The "What I Did" section must follow this exact structure:

```markdown
**What I Did**

**Code:**

PR → 

OutSystems → N/A

**Points of Impact:**

- Component/Area affected: Description of impact
- Additional impacts as needed

**Samples:**

Screens → [ODC App URL if applicable]

**Automated Tests:**

PR → 

**Test Cases:**

- **a.** Step 1 description
- **b.** Step 2 description
- **c.** **Expected:** Expected result
- **d.** Step 4 description
- **e.** **Expected:** Expected result
- Continue with additional test steps as needed
```

**Format Rules**:
- Use bullet points with letters (a, b, c, etc.) for test case steps
- Use **Expected:** (bolded) for expected results
- Include ODC App URL in Samples section if available
- Leave PR links empty (→) to be filled by user
- Use "N/A" for OutSystems if not applicable
- Do NOT include "Technical Details" section
- Keep test cases focused on how to manually test the feature

**Example**:
```markdown
**What I Did**

**Code:**

PR → 

OutSystems → N/A

**Points of Impact:**

- Carousel component: Added pause-on-interaction behavior when autoplay is enabled
- Default behavior: When autoplay is enabled, the carousel pauses when a slide is pressed and resumes when the interaction ends

**Samples:**

Screens → https://eng-starter-apps-dev.outsystems.app/ROU12451carouselpause/Home

**Automated Tests:**

PR → 

**Test Cases:**

- **a.** Open Sample
- **b.** Configure the Carousel with `Autoplay = true` and `Is Playing = true`
- **c.** **Expected:** The carousel automatically advances slides at the configured interval
- **d.** Press and hold on any slide in the carousel
- **e.** **Expected:** The carousel pauses and stops advancing slides while the slide is being pressed
- **f.** Release the slide (pointer up)
- **g.** **Expected:** The carousel resumes autoplay and continues advancing slides automatically
```

### Comment Updates

**When to Add Comments**:
- Significant implementation decisions
- Blockers encountered and resolved
- Questions for reviewers
- Links to related PRs or discussions
- **ODC App URLs** (if applicable): Add as a comment when an ODC app is created for testing
  - Format: `ODC App: [URL](URL)` (use markdown link format for clickable link)
  - Example: `ODC App: [https://eng-starter-apps-dev.outsystems.app/ROU12451carouselpause/Home](https://eng-starter-apps-dev.outsystems.app/ROU12451carouselpause/Home)`

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
4. **DO NOT automatically update "What I Did" section** - Instead, provide formatted content in chat for user to copy/paste manually
   - Format according to the "What I Did" section format rules above
   - Include all required sections: Code, Points of Impact, Samples, Automated Tests, Test Cases
   - Use lettered bullet points (a, b, c, etc.) for test cases
   - Include **Expected:** (bolded) for expected results in test cases
   - Include ODC App URL in Samples section if available
5. Update "Release Note" custom field (`customfield_12701`) with user-focused description (see `skill:release-notes`)
6. Add comment if significant decisions were made or if ODC App URL is available
   - **ODC App URLs MUST be added as comments, NOT in the "What I Did" section**
   - Format: `ODC App: [URL](URL)` (use markdown link format for clickable link)
   - Example: `ODC App: [https://eng-starter-apps-dev.outsystems.app/ROU12451carouselpause/Home](https://eng-starter-apps-dev.outsystems.app/ROU12451carouselpause/Home)`
7. Use clear, professional language
8. Include relevant links (PR, Figma, etc.)

### Common Mistakes to Avoid

1. **Wrong Issue ID Format**
   - ❌ `#ROU-12461`
   - ❌ `rou-12461`
   - ✅ `ROU-12461`

2. **Automatically Updating "What I Did" Section**
   - ❌ Using `editJiraIssue` to update description field
   - ✅ Providing formatted content in chat for user to copy/paste manually

3. **Incomplete "What I Did" Section**
   - Must include all required sections: Code, Points of Impact, Samples, Automated Tests, Test Cases
   - Test cases must use lettered format (a, b, c, etc.) with **Expected:** for results

4. **Missing Context**
   - Always explain why changes were made
   - Include impact description in Points of Impact section

### Reference
- Jira Project: `outsystemsrd`
- Cloud ID: `outsystemsrd`
