---
name: Refactor shared skills Cursor format
overview: Refactor all six shared skills in ai-automation from single .md files to the Cursor-native format (directory + SKILL.md with YAML frontmatter) so Cursor discovers them. The existing .cursor/shared symlink into other repos stays unchanged and will automatically expose the new structure.
todos: []
isProject: false
---

# Refactor shared skills for Cursor discovery

## Current state

- **Shared skills** live in [ai-automation/.cursor/shared/skills/](ai-automation/.cursor/shared/skills/) as single files: `pr-creation.md`, `jira-updates.md`, `branch-naming.md`, `design-verification.md`, `release-notes.md`, `odc-testing.md`.
- **Linking**: Other repos (e.g. runtime-mobile-widgets-js, OutSystems.WidgetLibrary) symlink `.cursor/shared` to `ai-automation/.cursor/shared`, so they already see whatever is under `shared/skills/`. No change to the symlink strategy—only the contents under `shared/skills/` are refactored.
- **Reference**: The already-refactored skill [mobile-ui-prepare-xif-from-local/SKILL.md](ai-automation/.cursor/skills/mobile-ui-prepare-xif-from-local/SKILL.md) shows the target format (YAML frontmatter with `name` and `description`, then existing body).

## Target structure

After refactor, each shared skill is a directory with one file:

```
.cursor/shared/skills/
  pr-creation/
    SKILL.md
  jira-updates/
    SKILL.md
  branch-naming/
    SKILL.md
  design-verification/
    SKILL.md
  release-notes/
    SKILL.md
  odc-testing/
    SKILL.md
  README.md          (stays at shared/skills/ root)
```

Each `SKILL.md` must have:

- **Frontmatter**: `name` (lowercase, hyphens, &lt; 64 chars) and `description` (third person, WHAT + WHEN, trigger terms so Cursor can match natural language).
- **Body**: Current skill content (metadata block + rules, validation, examples) unchanged.

## Implementation steps

### 1. Refactor each shared skill (6 skills)

For each of the six skills:

- Create directory `.cursor/shared/skills/<skill-name>/`.
- Add `SKILL.md` with:
  - YAML frontmatter: `name: <skill-name>`, `description: <one sentence what it does>. Use when <trigger phrases>.`
  - Body: existing content from the current `<skill-name>.md` (keep **ID**, **Version**, **MCPs Required**, rules, validation, examples).
- Remove the old single file `.cursor/shared/skills/<skill-name>.md`.

**Skill-specific descriptions (trigger terms to include):**


| Skill               | Suggested description focus / triggers                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| pr-creation         | Create pull requests; PR title format, labels, template. Use when: create PR, open PR, make a PR. |
| jira-updates        | Update Jira issues; "What I Did", verification. Use when: update Jira, update story, what I did.  |
| branch-naming       | Branch naming rules (ROU-XXXX). Use when: create branch, branch name, new branch.                 |
| design-verification | Verify UI against Figma; tokens, specs. Use when: match Figma, design check, verify design.       |
| release-notes       | Release notes in Jira (custom field). Use when: release notes, RN, Confluence.                    |
| odc-testing         | ODC Studio test app workflow after XIF. Use when: test in ODC, create test app, ODC testing.      |


### 2. Update all references to shared skill paths

Replace every reference from `.cursor/shared/skills/<name>.md` to `.cursor/shared/skills/<name>/SKILL.md` in:

- [.cursorrules](ai-automation/.cursorrules): Natural Language Examples and any Key Rules that point at files (e.g. "Use `.cursor/shared/skills/pr-creation.md`" → `.../pr-creation/SKILL.md`).
- [.cursor/shared/skills/README.md](ai-automation/.cursor/shared/skills/README.md): "Located in" paths, "Adding New Skills" (use `{skill-name}/SKILL.md`), team override example path if it mentions a shared skill file.
- [README.md](ai-automation/README.md): Usage examples and configuration hierarchy that reference shared skill files.
- [CONTRIBUTING.md](ai-automation/CONTRIBUTING.md): Any path like `.cursor/shared/skills/{skill-name}.md`.
- [docs/COMPLETE_SETUP_GUIDE.md](ai-automation/docs/COMPLETE_SETUP_GUIDE.md): Paths under shared skills (e.g. `ls .cursor/shared/skills/` and any example file paths).
- Any other docs or plans that reference `shared/skills/*.md` (e.g. [.cursor/plans/](ai-automation/.cursor/plans/) or team override examples).

### 3. Document linking (no code change)

- In [.cursor/shared/skills/README.md](ai-automation/.cursor/shared/skills/README.md), under "Adding New Skills", state that new shared skills use the directory form: `.cursor/shared/skills/<skill-name>/SKILL.md` (with frontmatter), and that repos using the framework see these via the existing `.cursor/shared` symlink.
- Optionally add one line in the main [README.md](ai-automation/README.md) "Shared Framework" or setup section: shared skills are in `shared/skills/<name>/SKILL.md`; other repos get them by symlinking `.cursor/shared` to this repo’s `.cursor/shared`.

### 4. Team overrides (optional, document only)

- Team overrides today are `.cursor/teams/{team}/skills/{skill-name}.md` (single file). No structural change required for this refactor.
- If you later want overrides to mirror the same format, teams could use `teams/{team}/skills/{skill-name}/SKILL.md`; document that in the README only if you adopt it.

## Linking summary

- **No change to how shared skills are linked.** Other repos keep symlinking `.cursor/shared` to `ai-automation/.cursor/shared`.
- After refactor, they will see `shared/skills/pr-creation/SKILL.md` etc. through the same symlink; path in rules/docs is just `shared/skills/<name>/SKILL.md` instead of `shared/skills/<name>.md`.

## Files to create/remove


| Action | Path                                                                                                                                                      |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create | 6 directories + 6 SKILL.md files under `.cursor/shared/skills/`                                                                                           |
| Delete | 6 single-file skills: `pr-creation.md`, `jira-updates.md`, `branch-naming.md`, `design-verification.md`, `release-notes.md`, `odc-testing.md`             |
| Edit   | .cursorrules, .cursor/shared/skills/README.md, README.md, CONTRIBUTING.md, docs/COMPLETE_SETUP_GUIDE.md, and any other references to `shared/skills/*.md` |


## Verification

- All 6 skills exist only as `<skill-name>/SKILL.md` with valid frontmatter.
- Grep for `shared/skills/.*\.md` (single-file pattern) finds no remaining references; all point to `.../SKILL.md` or `.../skill-name/SKILL.md`.
- Repos that already have `.cursor/shared` symlinked will see the new paths without any symlink change.

