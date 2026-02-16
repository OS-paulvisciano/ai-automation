---
name: widgets-js-tests
description: Runs Vitest tests in widgets-js (unit and Storybook projects). Use when the user says run tests, test, vitest, unit tests, storybook tests, or wants to validate tests for PR or CI.
---

# Skill: Widgets-JS Tests

**ID**: `skill:widgets-js-tests`  
**Version**: `1.0.0`  
**Type**: Agent-Specific Skill (for `agent:widgets-js`)  
**Repository**: `runtime-mobile-widgets-js`

## Overview

Running Vitest tests in the widgets-js repository (unit project and Storybook project). Use for PR validation, CI, and pre-commit checks.

## CRITICAL: Always Follow These Rules

### Unit Tests (Vitest project `unit`)

**Commands**:
- `npm test` or `npm run test:watch` — run unit tests in watch mode
- `npm run test:ci` — single run, JUnit output (for CI)
- `npm run test:coverage` — single run with coverage

**When to use**:
- Default for "run tests" and PR/CI validation
- Use `npm run test:ci` for a one-off run or in pipelines

### Storybook Tests (Vitest project `storybook`)

**Commands**:
- `npm run test-storybook` — run Vitest against Storybook (via `@storybook/addon-vitest`)
- `npm run test:storybook:watch` — same with watch mode

**When to use**:
- When validating component behavior in Storybook
- May take longer than unit tests

**Validation**:
- All selected tests pass (exit code 0)
- No failing tests
- For CI: use `npm run test:ci` for unit tests; add `npm run test-storybook` if the pipeline runs Storybook tests

### Where Specs Live

- Component specs: `src/scripts/Components/**/tests/*.spec.tsx`
- Layout specs: `src/scripts/Layout/tests/*.spec.tsx`
- Setup: `vitest.setup.ts`
- Shared helpers: `tests/CommonTests.ts`

## Repository-Specific Knowledge

**Repository**: `runtime-mobile-widgets-js`  
**Location**: `~/repos/runtime-mobile-widgets-js`  
**Test Runner**: Vitest (projects: `unit`, `storybook`)

## Common Issues

- **Tests fail after pull**: Run `npm install`
- **Wrong project runs**: Vitest is configured with projects `unit` and `storybook`; use the correct script for the intended project
- **Flaky or env-dependent tests**: Check Vitest and project config if failures are inconsistent

## AI Instructions

When running tests for widgets-js:

1. **Unit tests**: Run `npm test` (watch) or `npm run test:ci` (single run). Verify exit code 0 and no failing tests.
2. **Storybook tests** (optional): Run `npm run test-storybook` when validating component behavior in Storybook. Verify exit code 0.
3. **Handle failures**: Check test output for errors; ensure dependencies are installed; report specific failure messages to user.

Do not use this skill to start the Storybook dev server; use `skill:widgets-js-storybook` for that. For production bundle, use `skill:widgets-js-build`.

## Related Skills

- `skill:widgets-js-build` - For production bundle (repo-specific)
- `skill:widgets-js-storybook` - For running Storybook dev server (repo-specific)
- `skill:jira-updates` - For updating Jira with verification steps (from shared)

## Related Agents

- `agent:widgets-js` - Uses this skill for test runs
