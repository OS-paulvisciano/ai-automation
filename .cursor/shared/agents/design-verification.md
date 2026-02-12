# Agent: Design Verification

**ID**: `agent:design-verification`  
**Version**: `1.0.0`  
**Skills Used**: 
  - `skill:design-verification`

**MCPs Required**: `figma`, `browser` (optional)

## Workflow

### 1. Fetch Design Specs
**Skills**: `skill:design-verification`

**Steps**:
1. Get Figma file key and node ID from context
2. Use Figma MCP to fetch component design
3. Extract design tokens:
   - Colors (background, text, icons)
   - Spacing (padding, margins)
   - Shapes (border radius)
   - Typography (if applicable)

**Validation**:
- Figma data fetched successfully
- Design tokens extracted
- All required tokens present

### 2. Compare with Codebase
**Skills**: `skill:design-verification`

**Steps**:
1. Read codebase token values from `src/scss/_variables.scss`
2. Compare Figma values with SCSS tokens
3. Create comparison table
4. Flag any mismatches

**Validation**:
- Codebase tokens read successfully
- Comparison completed
- Mismatches identified

### 3. Visual Verification (Optional)
**Skills**: `skill:design-verification`

**Steps**:
1. Open Storybook (if available)
2. Navigate to component story
3. Take screenshot of component
4. Compare with Figma design visually
5. Note any visual discrepancies

**Validation**:
- Storybook accessible
- Component rendered correctly
- Visual comparison completed

## Configuration

**Parameters**:
- `figma-file-key` - Figma file key (default: from project config)
- `figma-node-id` - Specific node ID to verify
- `skip-visual-verification` - Skip browser verification (default: false)
- `tokens-file-path` - Path to tokens file (default: `src/scss/_variables.scss`)

## Output Format

**Comparison Table**:
```
| Property | Figma Value | Codebase Token | Codebase Value | Match? |
|----------|------------|----------------|----------------|--------|
| Background | #EAE9E9 | $token-bg-neutral-subtlest-press | #EAE9E9 | ✅ |
| Icon Color | #242424 | $token-icon-default | #242424 | ✅ |
| Border Radius | 8px | $token-soft-xs | 8px | ✅ |
```

## Error Handling

**Figma Fetch Fails**:
- Verify Figma API key is set
- Check file key is correct
- Verify node ID exists
- Check API rate limits

**Token Comparison Fails**:
- Verify tokens file path is correct
- Check token names match
- Verify SCSS syntax is valid

**Visual Verification Fails**:
- Check Storybook is running
- Verify component story exists
- Check browser MCP connection

## Success Criteria

- [ ] Figma specs fetched
- [ ] Design tokens extracted
- [ ] Codebase tokens read
- [ ] Comparison completed
- [ ] Mismatches flagged (if any)
- [ ] Visual verification completed (if enabled)
