# AI-Powered Development Process Automation

## Overview

This document outlines the AI automation setup for streamlining the development process. The goal is to automate process-heavy tasks (Jira updates, PR creation, design verification) so developers can focus on what matters: writing code.

## Philosophy

> "The process is fine, it just shouldn't be humans dealing with all that since it's a distraction from the actual valuable thing."

Instead of removing process requirements, we're automating them using AI assistants with MCP (Model Context Protocol) integrations.

## Current Integrations

### 1. Jira Integration (Atlassian MCP)

**Status**: ✅ Working

**Configuration**: 
- MCP Server: Atlassian Cloud
- Cloud ID: `${ATLASSIAN_CLOUD_ID}` (set in environment or personal config)
- Email: `${ATLASSIAN_EMAIL}` (set in environment or personal config)

**Capabilities**:
- Search for Jira issues
- Get issue details
- Update issue descriptions ("What I Did" sections)
- Add comments to issues
- Create issues
- Transition issue status
- Search using JQL

**Use Cases**:
- Automatically updating story descriptions after implementation
- Searching for in-progress stories
- Adding implementation notes to issues
- Creating follow-up tasks

**Example Workflow**:
1. Complete implementation
2. AI automatically updates Jira story with "What I Did" section
3. AI adds relevant comments with implementation details

### 2. GitHub CLI Integration

**Status**: ✅ Working

**Capabilities**:
- Create pull requests with proper titles (`<jira-issue>: <subject>`)
- Set labels on PRs
- Manage branches
- Create commits with proper messages

**Use Cases**:
- Automatically creating PRs after implementation
- Ensuring PR titles follow team conventions
- Adding appropriate labels (chore, feature, bug, etc.)
- Following PR template requirements

**Example Workflow**:
1. Complete code changes
2. AI creates branch with Jira issue ID
3. AI commits changes
4. AI creates PR with proper title, description, and labels
5. PR follows team template requirements

### 3. Figma MCP Integration

**Status**: ✅ Working

**Configuration**:
- MCP Server: Framelink MCP for Figma
- API Key: Configured in `mcp.json`

**Capabilities**:
- Fetch Figma file data
- Get component specifications
- Extract design tokens (colors, spacing, border radius)
- Compare Figma specs with codebase tokens
- Download Figma images

**Use Cases**:
- Verifying implementation matches Figma designs
- Extracting design token values
- Comparing codebase tokens with Figma specs
- Visual verification of component states

**Example Workflow**:
1. Implement component based on Jira story
2. AI fetches Figma design specs for the component
3. AI compares implemented values with Figma specs
4. AI flags any discrepancies (colors, spacing, etc.)
5. Developer can verify visually in Storybook

**Figma File**:
- File Key: `p8xYRIBjILWM1zG6AJtkAb`
- Design System: OutSystems Mobile UI Kit

### 4. Browser MCP

**Status**: ⚠️ Working (but flaky)

**Configuration**:
- MCP Server: `@browsermcp/mcp@latest`

**Capabilities**:
- Navigate to URLs
- Take screenshots
- Interact with web pages
- Capture accessibility snapshots
- Test rendered components in Storybook

**Use Cases**:
- Visual verification of components in Storybook
- Testing component interactions
- Verifying responsive behavior
- Cross-browser testing

**Known Issues**:
- Can be flaky/unreliable
- May need retries for some operations
- Connection stability varies

**Future Improvements**:
- Investigate alternative browser automation tools
- Add retry logic for flaky operations
- Consider Playwright or Puppeteer alternatives

## Workflow Examples

### Complete Story Implementation Workflow

1. **Start Story**:
   - AI searches Jira for in-progress stories
   - AI identifies next unworked story
   - AI creates branch: `<jira-issue-id>`

2. **Implementation**:
   - Developer implements feature
   - AI fetches Figma specs for design verification
   - AI compares implementation with design tokens

3. **Verification**:
   - AI runs Storybook
   - AI uses Browser MCP to verify rendered component
   - AI compares visual output with Figma specs

4. **Documentation**:
   - AI updates Jira story with "What I Did" section
   - AI adds implementation details as comments

5. **PR Creation**:
   - AI creates PR with proper title: `<jira-issue>: <subject>`
   - AI adds appropriate label
   - AI ensures PR follows template

### Design Verification Workflow

1. **Fetch Design Specs**:
   - AI uses Figma MCP to get component design
   - AI extracts design tokens (colors, spacing, etc.)

2. **Compare with Codebase**:
   - AI reads codebase token values
   - AI compares Figma values with SCSS tokens
   - AI flags any mismatches

3. **Visual Verification**:
   - AI opens Storybook in browser
   - AI takes screenshots of component states
   - AI compares with Figma designs

## Configuration Files

### MCP Configuration (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "Atlassian": {
      "url": "https://mcp.atlassian.com/v1/mcp",
      "env": {
        "ATLASSIAN_CLOUD_ID": "${ATLASSIAN_CLOUD_ID}",
        "ATLASSIAN_EMAIL": "${ATLASSIAN_EMAIL}"
      }
    },
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    },
    "Framelink MCP for Figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=<key>", "--stdio"]
    }
  }
}
```

## Benefits

### Time Savings
- **Jira Updates**: ~5-10 minutes saved per story
- **PR Creation**: ~3-5 minutes saved per PR
- **Design Verification**: ~10-15 minutes saved per component
- **Total**: ~20-30 minutes per story automated

### Consistency
- PR titles always follow convention
- Jira updates are comprehensive and consistent
- Design verification catches discrepancies early

### Focus
- Developers focus on code, not process
- AI handles repetitive documentation tasks
- Less context switching between tools

## Challenges & Solutions

### Challenge: Browser MCP Flakiness
**Solution**: Add retry logic, consider alternatives

### Challenge: Figma API Rate Limits
**Solution**: Cache Figma responses, batch requests

### Challenge: Jira Authentication Issues
**Solution**: Verify credentials, check token expiration

### Challenge: PR Template Compliance
**Solution**: AI reads template and ensures all sections are filled

## Future Enhancements

1. **Automated Testing**:
   - Run tests automatically after implementation
   - Update test coverage reports
   - Flag failing tests in PR comments

2. **Code Review Automation**:
   - AI performs initial code review
   - Flags potential issues before human review
   - Suggests improvements

3. **Release Notes Generation**:
   - Automatically generate release notes from PRs
   - Categorize changes by type
   - Link to Jira issues

4. **Design Token Sync**:
   - Automatically sync Figma tokens to codebase
   - Flag when Figma designs change
   - Suggest token updates

5. **Story Estimation**:
   - AI analyzes story complexity
   - Suggests story point estimates
   - Tracks actual vs estimated time

## Documentation Files

- `AUTOMATION_SETUP.md` (this file) - Overview of automation setup
- `FIGMA_MCP_INTEGRATION.md` - Detailed Figma integration guide
- `test-figma-mcp.md` - Figma MCP testing documentation
- `figma-mcp-test.md` - Quick reference for Figma testing

## Demo Preparation

For team demo, focus on:

1. **Before/After Comparison**:
   - Show manual process time
   - Show automated process time
   - Highlight time savings

2. **Live Demo**:
   - Start a new story
   - Show AI creating branch
   - Show AI updating Jira
   - Show AI creating PR
   - Show design verification

3. **Metrics**:
   - Stories completed with automation
   - Time saved per story
   - Consistency improvements
   - Error reduction

## Notes

- All automation is documented in this folder
- MCP configurations are in `~/.cursor/mcp.json`
- Keep documentation updated as new integrations are added
- Test new integrations thoroughly before using in production
