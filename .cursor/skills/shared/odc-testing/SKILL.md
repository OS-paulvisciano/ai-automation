---
name: odc-testing
description: Guides ODC Studio test app workflow after XIF publishing (create app, verify version, test widget, document in Jira). Use when the user says test in ODC, create test app, ODC testing, or wants to test after publishing XIF.
---

# Skill: ODC Testing

**ID**: `skill:odc-testing`  
**Version**: `1.0.0`  
**MCPs Required**: `jira` (for documenting test app in story)

## CRITICAL: Always Follow These Rules

### When to Use This Skill

Use this skill after:
- XIF file has been prepared and published in ODC Studio
- You need to test widget changes in a full integration environment
- You need to create/update a test app for verification

### End-to-end ODC steps (order matters)

1. **Prepare the XIF** (e.g. via `skill:mobile-ui-prepare-xif-from-local`).
2. **Publish the XIF** in ODC Studio (Support → Publish XIF; manual).
3. **Create a new app** in ODC (or use an existing one).
4. **Update dependencies** so the app pulls in the latest XIF (verify under Themes > MobileUI).
5. **Create the sample** so it demonstrates the new behavior (e.g. drag the widget onto Home, configure to show the feature).
6. **Publish the app** using the **Publish** button in ODC.
7. **After publish**, the button becomes **Open in browser**. That opens the preview URL:
   - `https://eng-starter-apps.outsystems.dev/preview/application?id={appId}&stageid={stageId}&screen=Home`
8. **Shareable shorter link** for the same app in the browser:
   - `https://eng-starter-apps-dev.outsystems.app/{appSlug}` (app slug has no hyphens, e.g. `ROU12461androidclsbtn`).
9. **Native binary (when needed):** Create it from the app’s mobile distribution page:
   - `https://eng-starter-apps.outsystems.dev/apps/application?id={appId}&stageid={stageId}&tab=mobiledistribution&mobileoption=android` (use `mobileoption=ios` for iOS).

### Complete ODC Testing Workflow (detailed)

#### 1. Create/Update Test App in ODC

**If creating new app:**
- Create a new app in ODC Studio
- Use the newly published XIF when creating the app
- This ensures the app uses the latest MobileUI library version

**If updating existing app:**
- Open the existing app in ODC Studio
- Update the app to point to the latest XIF
- This updates the MobileUI library to the new version

#### 2. Verify MobileUI Version

**Required Step:**
- In ODC Studio, check the left panel under **Themes > MobileUI**
- Confirm the version matches the one you just published (e.g., `1.0.380`)
- This verifies the app is using the correct XIF version
- **If version doesn't match**: The app is not using the latest XIF - update the app reference

#### 3. Configure Home Screen for Testing

**Required Configuration:**
- Select the **Home** screen in the UI Flows tree (left panel)
- In the right panel, find the **Authorization** section
- Set **Accessible by** to **"Everyone"**
- This allows testing without authentication, making it easier to access the home screen
- **Why**: Avoids authentication requirements during testing

#### 4. Create Test for Your Widget

**Steps:**
- Drag the widget component you worked on onto the Home screen
- Configure the widget as needed to test the specific functionality
- For platform-specific changes (e.g., Android styles):
  - Test on actual device using native build
  - Browser testing may not show platform-specific behavior
- For general UI changes:
  - Browser testing is sufficient

**Example (ROU-12461):**
- Widget: Card component
- Feature: Close button on Android
- Test: Drag Card component onto Home screen, verify close button appears and is dismissable

#### 5. Publish the App

**Steps:**
- Click **"Publish"** in ODC Studio. After publishing, the button changes to **"Open in browser"**.
- **Open in browser** opens: `https://eng-starter-apps.outsystems.dev/preview/application?id={appId}&stageid={stageId}&screen=Home`
- The app is also viewable via the shorter shareable link: `https://eng-starter-apps-dev.outsystems.app/{appSlug}` (slug has no hyphens).

**Native binary (final step when required):**
- Create the native binary from: `https://eng-starter-apps.outsystems.dev/apps/application?id={appId}&stageid={stageId}&tab=mobiledistribution&mobileoption=android` (or `mobileoption=ios`).
- Some stories require native builds (e.g., Android-specific styles). Test on actual device to verify.

**Browser Testing (when sufficient):**
- For general UI changes, browser testing is sufficient
- Faster iteration and easier to share with reviewers
- **When to use**: General styling, layout changes, non-platform-specific features

#### 6. Verify Full Integration

**Required Verification:**
- Test the complete workflow in ODC
- Verify the XIF, widget library, and runtime components work together correctly
- This ensures full integration, not just isolated component testing
- **Why**: Storybook tests widget layer + runtime integration (using actual runtime packages), but ODC testing verifies WidgetLibrary integration (labels, properties, design-time) and end-to-end ODC workflows

#### 7. Document in Jira Story

**Required Documentation:**

1. **Move Story to Review Status**
   - Transition the story to **"Review"** status in Jira
   - This signals the story is ready for reviewer verification

2. **Add Test App Link in Comments**
   - Add a comment with the **link to the test app** in ODC
   - Include app name and location
   - Format: `Test app: [App Name] - [ODC URL or app identifier]`
   - This allows reviewers (typically Gonzalo) to verify changes without setting up their own environment

3. **Update Release Notes**
   - Update the **Release Notes** field in the Jira story
   - Use user-focused description (not technical implementation details)
   - Focus on what users will see/experience
   - Format: Clear, concise, user-facing language

**Example Comment:**
```
Test app created and published:
- App Name: ROU-12461-android-cls-btn
- Shareable URL: https://eng-starter-apps-dev.outsystems.app/ROU12461androidclsbtn
- Version: 1.0.380

Ready for verification. The app includes a Card component with the new Android close button styling. 
Test by opening the app and dismissing the card to see the pressed state.
For native Android build: use ODC app page → Mobile Distribution → Android.
```

## Validation Criteria

### Must Verify:
- ✅ MobileUI version in Themes > MobileUI matches published version
- ✅ Home screen is set to "Accessible by Everyone"
- ✅ Widget test is created and functional
- ✅ App is published and accessible
- ✅ Full integration is verified (XIF + widget library + runtime)
- ✅ Story is moved to Review status
- ✅ Test app link is added to story comments
- ✅ Release Notes are updated with user-focused description

### Common Mistakes to Avoid

❌ **Skipping version verification** - Always check Themes > MobileUI version  
❌ **Forgetting to set Home screen to Everyone** - Makes testing harder  
❌ **Only testing in Storybook** - Must test full integration in ODC  
❌ **Not documenting test app** - Reviewers need the link to verify  
❌ **Technical Release Notes** - Must be user-focused, not implementation details  
❌ **Browser testing for device-specific changes** - Use native build when needed

## AI Instructions

When the user requests ODC testing or mentions testing after XIF publishing:

1. **Guide through the workflow** step by step
2. **Verify each step** is completed before moving to next
3. **Check MobileUI version** - This is critical for verification
4. **Remind about Home screen configuration** - Often forgotten
5. **Determine testing method** - Native build vs browser based on story requirements
6. **Document in Jira** - Move to Review, add app link, update Release Notes
7. **Use skill:jira-updates** - For updating Jira story fields and comments

## Integration with Other Skills

- **skill:jira-updates** - Use when updating Jira story comments and Release Notes
- **skill:pr-creation** - ODC testing typically happens before PR creation
- **XIF Preparation** - This skill follows XIF publishing in ODC Studio

## Examples

### Good Example Workflow

```
1. ✅ Created test app "ROU-12461-test" in ODC
2. ✅ Verified MobileUI version: 1.0.380 (matches published XIF)
3. ✅ Set Home screen to "Accessible by Everyone"
4. ✅ Dragged Card component onto Home screen
5. ✅ Tested close button dismiss functionality
6. ✅ Published app and tested in browser
7. ✅ Verified full integration works correctly
8. ✅ Moved story to Review status
9. ✅ Added test app link in story comments
10. ✅ Updated Release Notes with user-focused description
```

### Bad Example (Missing Steps)

```
❌ Created test app but didn't verify MobileUI version
❌ Forgot to set Home screen to Everyone (requires auth)
❌ Only tested in Storybook, not in ODC
❌ Didn't document test app in Jira story
❌ Release Notes contain technical implementation details
```

## Notes

- **Native builds** are required for device-specific testing (Android styles, iOS features)
- **Browser testing** is sufficient for general UI changes
- **Version verification** is critical - ensures app uses correct XIF
- **Test app documentation** allows reviewers to verify without setup
- **Gonzalo** typically performs final verification using the test app reference
