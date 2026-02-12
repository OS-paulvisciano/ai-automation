# Skill: Release Notes

**ID**: `skill:release-notes`  
**Version**: `1.0.0`  
**MCPs Required**: `jira`  
**Reference**: [Confluence Guidelines](https://outsystemsrd.atlassian.net/wiki/spaces/RRT/pages/111313011/Guidelines+to+write+Release+Notes)

## CRITICAL: Always Follow These Rules

### Release Notes Section in Jira Stories

**When to Add**:
- After completing implementation
- Before creating PR
- When story is ready for review
- **MUST** be included in all user-facing changes (bugs, features, improvements)

**Location in Jira**:
- **MUST** use the dedicated "Release Note" custom field (`customfield_12701`)
- This is a separate field in Jira, NOT part of the description
- The field appears in the Jira issue UI as "Release Note"

### Release Note Format

**Required Structure**:
1. **Content**: Clear, user-focused description (no title needed - field name is the title)
2. **Hide from Release Notes** (optional): Use the "Hide from Release Notes" custom field (`customfield_12203`) if note should be hidden from certain audiences

**Content Guidelines**:
- Write from the **user's perspective** (not technical)
- Focus on **what was fixed/improved** and **why it matters**
- Explain **when/where the issue occurred** (if applicable)
- Describe the **impact** on users
- Use clear, non-technical language
- Be concise but informative

**Format Example**:
```
Fixed an issue that caused dropdown items to be cut off and inaccessible at runtime. This occurred when a list was too long to fit within the viewport and the component failed to trigger a scrollbar, preventing users from seeing or selecting items at the bottom.
```

**Note**: The field name "Release Note" is already provided by Jira, so you only need to enter the content text.

### Content Patterns

**For Bug Fixes**:
- Start with "Fixed an issue that..."
- Describe what was broken
- Explain when/where it occurred
- Describe the impact on users

**For Features**:
- Start with "Added..." or "Improved..."
- Describe the new capability
- Explain the benefit to users

**For Improvements**:
- Start with "Improved..." or "Enhanced..."
- Describe what was better
- Explain the benefit to users

### Writing Guidelines

**DO**:
- ✅ Write in user-friendly language
- ✅ Focus on user impact and benefits
- ✅ Explain the problem clearly
- ✅ Be specific about when/where issues occurred
- ✅ Keep it concise (1-3 sentences typically)

**DON'T**:
- ❌ Use technical jargon or implementation details
- ❌ Reference code, files, or technical terms
- ❌ Write from developer perspective
- ❌ Include "What I Did" content (that's a separate section)
- ❌ Be vague about the issue or fix

### AI Instructions

When adding release notes to a Jira story, the AI MUST:
1. Read the Jira issue description to understand the story
2. Review "What I Did" section to understand what was implemented
3. Write release note from **user perspective** (not technical)
4. Update the "Release Note" custom field (`customfield_12701`) with the content
5. Ensure content is clear, concise, and user-focused (no title needed - field name is the title)
6. Set "Hide from Release Notes" field (`customfield_12203`) if applicable (check Confluence guidelines)

### Integration with Other Skills

**With `skill:jira-updates`**:
- Release notes should be added when updating "What I Did" section
- Both sections serve different purposes:
  - "What I Did" = Technical implementation details (for developers)
  - "Release Note" = User-facing description (for end users)

**With `skill:pr-creation`**:
- Release notes help inform PR reviewers about user impact
- Can be referenced in PR description if needed

### Common Mistakes to Avoid

1. **Too Technical**
   - ❌ "Fixed scrollbar CSS overflow property in Dropdown component"
   - ✅ "Fixed an issue that caused dropdown items to be cut off and inaccessible at runtime"

2. **Missing Context**
   - ❌ "Fixed dropdown issue"
   - ✅ "Fixed an issue that caused dropdown items to be cut off when the list was too long to fit within the viewport"

3. **Developer Perspective**
   - ❌ "Implemented scrollbar functionality"
   - ✅ "Fixed an issue that prevented users from seeing or selecting items at the bottom of long dropdown lists"

4. **Incomplete Information**
   - ❌ "Fixed dropdown"
   - ✅ "Fixed an issue that caused dropdown items to be cut off and inaccessible at runtime. This occurred when a list was too long to fit within the viewport and the component failed to trigger a scrollbar, preventing users from seeing or selecting items at the bottom."

### Reference
- Confluence Guidelines: https://outsystemsrd.atlassian.net/wiki/spaces/RRT/pages/111313011/Guidelines+to+write+Release+Notes
- Jira Project: `ROU`
- Format: User-focused, clear, concise
