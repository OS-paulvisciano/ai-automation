# Mobile UI Lifecycle Reference: TODO to DONE

> **Note**: This is a reference document, not an agent. For actual workflow automation, use `agent:mobile-ui`.

**Example Story**: ROU-12461 - Card - Implement Android close button pressed state

## Overview

This document provides a complete reference of the Mobile UI change workflow from picking up a story in "TO DO" to moving it to "DONE", showing automated vs manual steps. It serves as a comprehensive guide to understand the full lifecycle and automation status.

**For workflow automation, use**: `agent:mobile-ui` (orchestrator)

**Agent Architecture**:
- **Orchestrator**: `agent:mobile-ui` (in automation repo) - Coordinates end-to-end workflow
- **Repo-Specific Agents**:
  - `agent:widgets-js` (in `runtime-mobile-widgets-js/.cursor/agents/`) - Handles Phase 1 (implementation)
  - `agent:widget-library` (in `OutSystems.WidgetLibrary/.cursor/agents/`) - Handles Phase 2 & 3 (WidgetLibrary + XIF)
- **Skills**: Shared skills (in automation repo) and repo-specific skills (in respective repos)

---

## Recommended story flow (information → plan → verify → run → verify → commit)

Use this order so the plan and implementation can be verified before anything is committed or reported to Jira.

| Step | What | Tools / actions |
|------|------|------------------|
| 1. **Information gathering** | Get story and design context; no code changes | **Jira MCP**: fetch story (summary, description, acceptance criteria, DoD, Figma links). **Figma MCP**: when story has Figma, fetch specs, tokens, component properties. |
| 2. **Create a plan** | Write an implementation plan from gathered info | Plan in `.cursor/plans/`: branches, widgets-js outline, WidgetLibrary outline, XIF version, execution order. |
| 3. **Manual verification of plan** | User approves or adjusts the plan | User reviews plan; do not run implementation until user confirms. |
| 4. **Run the plan** | Execute implementation | Branches, code, build, WidgetLibrary update, prepare XIF, Storybook/ODC testing as needed. **Do not commit, push, or update Jira yet.** |
| 5. **Manual verification of implementation** | User checks that the result is correct | User verifies in Storybook and/or ODC. |
| 6. **Commit, Jira, PR** | Persist and report only after verification | Commit & push; `skill:jira-updates` ("What I Did", verification steps); `skill:release-notes`; `skill:pr-creation` when ready. |

**Summary**: Gather (Jira + Figma) → Plan → User verifies plan → Run (no commit/Jira) → User verifies implementation → Then commit, update Jira, create PR.

---

## Phase 1: TO DO → IN PROGRESS

### 1.1 Pick Up Story

**Status**: ✅ **Automated** (via Jira MCP)

**Steps**:
1. Search Jira for stories in "TO DO" status
2. Identify next story to work on (e.g., ROU-12461)
3. Get story details (summary, description, Figma link if available)
4. Assign story to yourself
5. Move story to "IN PROGRESS" status

**Automation**: Jira MCP can search, fetch details, assign, and transition status

---

### 1.2 Create Feature Branch

**Status**: ✅ **Automated** (via `skill:branch-naming`)

**Steps**:
1. Extract Jira issue ID: `ROU-12461`
2. Create branch using `skill:branch-naming`:
   - Format: `ROU-12461` (just the Jira ID)
   - Branch from `main` (runtime-mobile-widgets-js)
3. Switch to new branch

**Repositories**:
- `runtime-mobile-widgets-js`: Create branch `ROU-12461` from `main`
- `OutSystems.WidgetLibrary`: Create branch `ROU-12461` from `dev` (if needed)

**Automation**: Branch naming skill enforces correct format

---

## Phase 2: IN PROGRESS → Implementation

### 2.1 Implement Changes

**Status**: ⚠️ **Manual** (developer implementation)

**Steps**:
1. Make widget changes in `runtime-mobile-widgets-js`
   - Example: Add Android pressed state styling for Card close button
   - Files: Component files, SCSS styles, Storybook stories
2. Build: `npm run bundle`
   - **Current**: Full build required for every JS change
   - **Future Enhancement**: Migrate to Vite for faster, incremental builds
   - **Benefit**: Only rebuild changed files, significantly faster development cycle
3. Test in Storybook: `npm run storybook`
4. Verify changes match design (if Figma file exists)

**Design Verification**: ✅ **Automated** (via `skill:design-verification` + Figma MCP)
- Fetch Figma specs
- Compare design tokens with codebase
- Flag discrepancies

**Automation**: Design verification can be automated, implementation is manual

---

### 2.2 Update Jira: "What I Did"

**Status**: ✅ **Automated** (via `skill:jira-updates`)

**When**: Only **after** manual verification of the implementation when following the [Recommended story flow](#recommended-story-flow-information--plan--verify--run--verify--commit). Do not update Jira until the user has verified the changes.

**Steps**:
1. Use `skill:jira-updates` to update Jira story
2. Update "What I Did" section with:
   - Implementation summary
   - Technical details
   - Verification steps (Storybook testing)
3. Add comment if significant decisions made

**Automation**: Jira MCP updates custom fields and comments

**Current Limitation**: ⚠️ Formatting is lost when MCP updates "What I Did" section
- **Issue**: Markdown formatting (headers, lists, code blocks) may not be preserved
- **Workaround**: Manual formatting may be needed after automated update
- **Future Enhancement**: Improve ADF formatting to preserve markdown structure

---

### 2.3 Commit and Push Changes

**Status**: ✅ **Automated** (via git commands)

**When**: Only **after** manual verification of the implementation when following the [Recommended story flow](#recommended-story-flow-information--plan--verify--run--verify--commit). Do not commit or push until the user has verified the changes.

**Steps**:
1. Commit changes to feature branch
2. Push branch to remote

**Automation**: Git operations can be automated

---

## Phase 3: IN PROGRESS → Consume Changes

### 3.1 Update Runtime Widgets in WidgetLibrary

**Status**: ⚠️ **Partially Automated** (via npm script, but has limitation)

**Steps**:
1. Navigate to `OutSystems.WidgetLibrary/ServiceStudio`
2. Run: `npm run update-runtime-widgets`
   - **Current**: Pulls latest widgetjs lib from npm
   - **Issue**: Changes from feature branch aren't published to npm yet
   - **Workaround**: Need to manually link local package or publish to npm first
   - Copies runtime and design-time resources
3. Verify changes are present

**Current Limitation**: ⚠️ Script pulls from npm, but feature branch changes aren't published yet
- **Problem**: `update-runtime-widgets` uses `npm i @outsystems/runtime-mobile-widgets-js@latest`, which only gets published versions
- **Workaround Options**:
  1. Use `npm link` to link local widgetjs package
  2. Publish feature branch to npm (with pre-release version)
  3. Manually copy files from widgetjs to WidgetLibrary
- **Future Enhancement**: 
  - Support local package linking in the script
  - Or publish feature branches to npm with pre-release tags
  - Or modify script to accept local path parameter

**Automation**: Script automates resource copying, but package source needs to be resolved

---

### 3.2 Prepare XIF File

**Status**: ✅ **Partially Automated** (via `npm run prepare-xif`)

**Steps**:
1. Navigate to `OutSystems.WidgetLibrary/ServiceStudio`
2. Run: `npm run prepare-xif`
   - ✅ Automatically pulls from `dev` branch
   - ✅ Automatically bumps version
   - ✅ Automatically builds solution
   - ✅ Automatically copies XIF to ODC folder
   - ⚠️ **Manual**: Post to Slack (`<version> :loading:`)
   - ⚠️ **Manual**: Publish XIF in ODC Studio (Support menu → Publish xif)
   - ⚠️ **Manual**: Update Slack message (`<version> :check:`)

**Current Automation**: Script handles version bumping, building, and copying

**Future Automation** (In Progress):
- **Slack MCP**: 🔄 Working on Slack MCP integration to automate Slack posting
  - Will automate posting `<version> :loading:` before build
  - Will automate updating to `<version> :check:` after publishing
- **ODC XIF Publishing**: 🔄 Investigating pulling in ODC source code
  - Goal: Automate XIF publishing by calling ODC's internal publishing logic
  - Would eliminate manual ODC Studio UI interaction
  - Could integrate directly into `prepare-xif` script

**Automation**: Script handles most steps; Slack and ODC publishing automation in progress

---

## Phase 4: IN PROGRESS → Create Test App

### 4.1 Create/Update Test App in ODC

**Status**: ⚠️ **Manual** (high automation potential)

**Steps**:
1. Open ODC Studio
2. Create new app or update existing app
   - **Naming Convention**: Name app based on story ID (e.g., `ROU-12461` or `ROU-12461-android-cls-btn`)
   - **Purpose**: Makes it easy to identify which story the app belongs to
3. Use newly published XIF when creating/updating
4. Verify MobileUI version in Themes > MobileUI matches published version

**Future Automation**: ODC API/CLI could automate app creation with story ID-based naming
- **Benefit**: Predictable app URLs based on story ID
- **Example**: Story `ROU-12461` → App URL would be predictable (e.g., `ROU-12461.odc.outsystems.com` or similar)
- **Advantage**: Makes it easy to generate test app links automatically in Jira comments

---

### 4.2 Configure App for Testing

**Status**: ⚠️ **Manual** (high automation potential)

**Steps**:
1. Select Home screen in UI Flows tree
2. Set Authorization > Accessible by: "Everyone"
3. Drag widget component onto Home screen
4. Configure widget to test specific functionality

**Future Automation**: ODC API/CLI could automate configuration

---

### 4.3 Publish Test App

**Status**: ⚠️ **Manual** (high automation potential)

**Steps**:
1. Publish the app in ODC Studio
2. Test in browser using "Open in browser"
3. For device-specific changes, create native build
4. Test on actual device if required

**Future Automation**: ODC API/CLI could automate publishing

---

### 4.4 Update Jira: Test App Link

**Status**: ✅ **Automated** (via `skill:jira-updates`)

**Steps**:
1. Use `skill:jira-updates` to add comment
2. Include test app link and details
3. Format:
   ```
   Test app created and published:
   - App Name: ROU-12461-android-cls-btn
   - Location: [ODC URL]
   - Version: 1.0.380
   ```

**Automation**: Jira MCP can add comments automatically

---

## Phase 5: IN PROGRESS → REVIEW

### 5.1 Update Release Notes

**Status**: ✅ **Automated** (via `skill:release-notes`)

**Steps**:
1. Use `skill:release-notes` to update Release Notes field
2. Write user-focused description (not technical)
3. Use ADF format for API updates
4. Example: "Added pressed state styling for the Card close button on Android devices, providing visual feedback when the button is tapped."

**Automation**: Jira MCP updates custom field with ADF format

---

### 5.2 Create Pull Request

**Status**: ✅ **Automated** (via `skill:pr-creation`)

**Steps**:
1. Use `skill:pr-creation` to create PR
2. Format title: `ROU-12461: Card - Implement Android close button pressed state`
3. Fill Context section
4. Fill Impacts section
5. Set appropriate label (determined from Jira issue type)
6. Link PR to Jira issue

**Repositories**:
- `runtime-mobile-widgets-js`: PR from `ROU-12461` to `main`
- `OutSystems.WidgetLibrary`: PR from `ROU-12461` to `dev`

**Automation**: GitHub CLI/MCP can create PRs with proper format

---

### 5.3 Move Story to REVIEW

**Status**: ✅ **Automated** (via Jira MCP)

**Steps**:
1. Transition Jira story to "REVIEW" status
2. Story is now ready for code review
3. PR gets reviewed by one of the other devs on the team

**Current Process**: Manual reviewer assignment or team member picks up review

**Future Automation Opportunity**: 
- Automatically select appropriate reviewer based on:
  - Availability (workload, current reviews in progress)
  - Knowledge area (component expertise, recent changes to similar code)
  - Code ownership (if applicable)
- Could integrate with GitHub PR reviewer assignment
- Could use team rotation or load balancing algorithms

**Automation**: Jira MCP can transition status; reviewer selection could be automated

---

## Phase 6: REVIEW → WAITING FOR MERGE

### 6.1 Code Review and PR Checks

**Status**: ⚠️ **Manual** (reviewer action) + ✅ **Automated** (GitHub checks)

**Steps**:
1. Reviewer (team dev) reviews PR code
2. May provide feedback or request changes
3. PR must pass GitHub checks (automated tests, linting, etc.)
4. Reviewer approves PR once satisfied
5. Address any feedback if changes requested

**GitHub Checks**: ✅ **Automated** (but has bottleneck)

**Checks Include**:
- Automated tests run on PR
- Linting and code quality checks
- Build verification
- **Chromatic visual regression tests** (⚠️ **Bottleneck**)
- PR cannot be merged until all checks pass

**Current Bottleneck**: ⚠️ Chromatic Tests
- **Issue**: High flakiness in Chromatic visual regression tests
- **Impact**: Significant back and forth with Bernardo to get Chromatic builds approved
- **Problem**: Tests fail frequently, requiring manual intervention and re-runs
- **Effect**: Delays PR approval and merge, creates workflow bottleneck
- **Future Enhancement**: 
  - Improve Chromatic test stability
  - Reduce false positives
  - Automate retry logic for flaky tests
  - Better test configuration to reduce flakiness

**Automation**: Code review is manual, but GitHub checks are automated (though Chromatic tests are a current bottleneck)

---

### 6.2 Address Review Feedback (if needed)

**Status**: ⚠️ **Manual** (developer action)

**Steps**:
1. Make requested changes based on reviewer feedback
2. Update PR
3. Re-request review
4. Ensure all GitHub checks pass

**Automation**: Git operations can be automated, but changes are manual

---

### 6.3 Move to WAITING FOR MERGE

**Status**: ✅ **Automated** (via Jira MCP)

**Steps**:
1. After PR approval and all checks pass, transition story to "WAITING FOR MERGE"
2. PR is ready to merge

**Automation**: Jira MCP can transition status (could be triggered by PR approval + checks passing webhook)

---

## Phase 7: WAITING FOR MERGE → TESTING

### 7.1 Merge PRs

**Status**: ✅ **Automated** (via GitHub MCP/CLI)

**Steps**:
1. Merge PR in `runtime-mobile-widgets-js` (to `main`)
2. Merge PR in `OutSystems.WidgetLibrary` (to `dev`)
3. Delete feature branches

**Automation**: GitHub CLI/MCP can merge PRs and clean up branches

---

### 7.2 Move to TESTING

**Status**: ✅ **Automated** (via Jira MCP)

**Steps**:
1. After PRs merged, transition story to "TESTING"
2. Story is now ready for final testing
3. **Gonzalo picks up story at this point** for final verification

**Automation**: Jira MCP can transition status (could be triggered by merge webhook)

---

## Phase 8: TESTING → PO ACCEPTANCE

### 8.1 Final Testing

**Status**: ⚠️ **Manual** (Gonzalo performs final verification)

**Steps**:
1. Gonzalo picks up story from TESTING column
2. Uses test app link from Jira comments
3. Verifies changes work as expected in ODC
4. Tests end-to-end functionality
5. Confirms no regressions

**Automation**: Testing is manual, but test app link makes verification easier

---

### 8.2 Move to PO ACCEPTANCE

**Status**: ✅ **Automated** (via Jira MCP)

**Steps**:
1. After testing passes, transition to "PO ACCEPTANCE"
2. Story ready for Product Owner acceptance

**Automation**: Jira MCP can transition status

---

## Phase 9: PO ACCEPTANCE → DONE

### 9.1 Product Owner Acceptance

**Status**: ⚠️ **Manual** (PO action)

**Steps**:
1. Product Owner reviews and accepts story
2. Story is complete

**Automation**: Acceptance is manual

---

### 9.2 Move to DONE

**Status**: ✅ **Automated** (via Jira MCP) + ⚠️ **Manual** (app deletion)

**Steps**:
1. Delete test app in ODC (app named based on story ID, e.g., `ROU-12461`)
2. Transition story to "DONE" status
3. Story is complete

**Current Process**: Manual app deletion in ODC Studio

**Future Automation**: 
- ODC API/CLI could automate app deletion
- Could be triggered automatically when story moves to DONE
- Would clean up test apps automatically after story completion

**Automation**: Jira MCP can transition status; app deletion could be automated with ODC integration

---

## Automation Summary

### ✅ Fully Automated Steps

1. **Jira Operations**:
   - Search and fetch story details
   - Assign story
   - Update "What I Did" section
   - Update Release Notes
   - Add comments
   - Transition status between columns

2. **Git Operations**:
   - Create branches (with correct naming)
   - Commit changes
   - Push branches
   - Merge PRs
   - Delete branches

3. **GitHub Operations**:
   - Create PRs with proper format
   - Set labels
   - Link PRs to Jira

4. **WidgetLibrary Scripts**:
   - Update runtime widgets (`npm run update-runtime-widgets`)
   - Prepare XIF (`npm run prepare-xif` - most steps)

5. **Design Verification**:
   - Fetch Figma specs
   - Compare with codebase
   - Flag discrepancies

### ⚠️ Manual Steps (Automation Opportunities)

1. **Slack Communication**:
   - Post version with `:loading:` emoji
   - Update to `:check:` emoji after publishing
   - **Future**: Slack MCP integration

2. **ODC Studio Operations**:
   - Publish XIF file (Support menu → Publish xif)
   - Create/update test app
   - Configure app (set Home screen to "Everyone")
   - Publish test app
   - **Future**: ODC API/CLI integration

3. **Development**:
   - Implement code changes
   - Test in Storybook
   - **Note**: Core development is manual, but tooling is automated

4. **Review Process**:
   - Code review
   - Test app verification
   - **Note**: Review is manual, but automation makes it easier

5. **Testing**:
   - QA testing
   - Product Owner acceptance
   - **Note**: Human verification is required

---

## Current Automation Focus

**Completed**:
- ✅ Jira updates (What I Did, Release Notes, comments, status transitions)
- ✅ Git operations (branch creation, commits, PRs)
- ✅ XIF preparation script (version bumping, building, copying)
- ✅ Design verification (Figma comparison)

**In Progress**:
- ⚠️ XIF preparation (Slack posting still manual)
- ⚠️ ODC integration (all steps manual)

**Future Opportunities**:
- 🔮 Slack MCP integration (automate Slack posting)
- 🔮 ODC API/CLI integration (automate app creation, publishing)
- 🔮 Webhook automation (auto-transition Jira on PR merge/approval)
- 🔮 Cross-layer testing automation
- 🔮 Breaking change detection

---

## Workflow Efficiency

**Current State**:
- ~60% automated (Jira, Git, GitHub, WidgetLibrary scripts)
- ~40% manual (Slack, ODC operations, development, review)

**With ODC Automation**:
- ~80% automated
- ~20% manual (development, review, testing - human judgment required)

**Key Manual Bottlenecks**:
1. ODC operations (XIF publishing, app creation/publishing)
2. Slack communication
3. Development (core work, but tooling is automated)

---

## Example: ROU-12461 Journey

**TO DO** → **IN PROGRESS**
- ✅ Automated: Story assignment, branch creation

**IN PROGRESS** → **Implementation**
- ⚠️ Manual: Implement Android close button pressed state
- ✅ Automated: Design verification (if Figma exists)
- ✅ Automated: Jira "What I Did" update
- ✅ Automated: Commit and push

**IN PROGRESS** → **Consume Changes**
- ✅ Automated: Update runtime widgets
- ✅ Automated: Prepare XIF (version bump, build, copy)
- ⚠️ Manual: Post to Slack, publish XIF in ODC

**IN PROGRESS** → **Test App**
- ⚠️ Manual: Create test app in ODC
- ⚠️ Manual: Configure and publish test app
- ✅ Automated: Add test app link to Jira

**IN PROGRESS** → **REVIEW**
- ✅ Automated: Update Release Notes
- ✅ Automated: Create PRs
- ✅ Automated: Move to REVIEW status

**REVIEW** → **WAITING FOR MERGE**
- ⚠️ Manual: Reviewer verification
- ✅ Automated: Move to WAITING FOR MERGE

**WAITING FOR MERGE** → **TESTING**
- ✅ Automated: Merge PRs
- ✅ Automated: Move to TESTING

**TESTING** → **PO ACCEPTANCE** → **DONE**
- ⚠️ Manual: Testing and PO acceptance
- ✅ Automated: Status transitions

---

## Next Steps for Automation

1. **High Priority**: ODC API/CLI integration
   - Automate XIF publishing
   - Automate app creation and publishing
   - Would eliminate major manual bottlenecks

2. **Medium Priority**: Slack MCP integration
   - Automate version posting
   - Reduce manual Slack communication

3. **Low Priority**: Webhook automation
   - Auto-transition Jira on PR events
   - Further reduce manual status management
