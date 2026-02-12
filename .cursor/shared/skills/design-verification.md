# Skill: Design Verification

**ID**: `skill:design-verification`  
**Version**: `1.0.0`  
**MCPs Required**: `figma`

## CRITICAL: Always Follow These Rules

### Figma File Information
- **File Key**: `p8xYRIBjILWM1zG6AJtkAb`
- **Design System**: OutSystems Mobile UI Kit
- **URL Format**: `https://www.figma.com/design/p8xYRIBjILWM1zG6AJtkAb/...`

### Design Token Mapping

**Color Tokens**:
- Figma `bg/neutral/subtlest/press` → Codebase `$token-bg-neutral-subtlest-press` = `#EAE9E9`
- Figma `icon/default` → Codebase `$token-icon-default` = `#242424`

**Spacing Tokens**:
- Figma spacing values → Codebase `$token-space-XXX` variables

**Shape Tokens**:
- Figma `shape/xs` → Codebase `$token-soft-xs` = `8px`
- Figma `shape/sm` → Codebase `$token-soft-sm`
- Figma `shape/md` → Codebase `$token-soft-md`

### Verification Process

1. **Fetch Figma Specs**:
   - Get component design from Figma
   - Extract design tokens (colors, spacing, border radius)
   - Note any special states (hover, pressed, disabled)

2. **Compare with Codebase**:
   - Read codebase token values from `src/scss/_variables.scss`
   - Compare Figma values with SCSS tokens
   - Flag any mismatches

3. **Visual Verification**:
   - Open Storybook
   - Test component in relevant viewport
   - Compare rendered output with Figma design

### Common Token Mismatches

**Border Radius**:
- Figma may show `999px` (pill shape) for buttons
- Codebase may use `8px` for semantic `shape/xs`
- **Resolution**: Verify with design team which is correct

**Icon Colors**:
- Figma may show resolved color (e.g., `#FFFFFF`)
- Codebase uses semantic token (e.g., `icon/default`)
- **Resolution**: Verify token resolves to correct color

### AI Instructions

When verifying design, the AI MUST:
1. Get Figma file key and node ID from context
2. Fetch component design from Figma MCP
3. Extract design token values (colors, spacing, shapes)
4. Read codebase token values from `_variables.scss`
5. Compare values and flag discrepancies
6. Provide clear comparison table
7. Suggest fixes if mismatches found

### Verification Checklist

- [ ] Figma component fetched successfully
- [ ] Design tokens extracted
- [ ] Codebase tokens read
- [ ] Values compared
- [ ] Discrepancies flagged
- [ ] Visual verification suggested (Storybook)

### Reference
- Figma File: https://www.figma.com/design/p8xYRIBjILWM1zG6AJtkAb/OutSystems-Mobile-UI-Kit
