---
name: ROU-12575 Carousel Prev/Next Slides
overview: "Plan for implementing Jira story ROU-12575: Carousel feature to partially show previous/next slides, with branches in both repos, implementation and Storybook tests in widgets-js, WidgetLibrary property definitions, and XIF preparation at version 1.0.391."
todos: []
isProject: false
---

# ROU-12575: Carousel – Show previous/next slides (plan)

## 1. Story summary (from Jira)

- **Key**: ROU-12575  
- **Summary**: [MobileUI] Carousel - Add feature to partially show the previous/next slide  
- **Status**: In Progress  
- **Labels**: MobileUI, NewIonicWidgets  
- **Component**: Mobile UI

**Requirements**

- New **“Show Prev/Next Slides”** property:
  - **Options:** No, Yes  
  - **Default:** No
- When **Yes**, two dependent properties:
  - **Slide Gap**: horizontal spacing between slides; implemented as enum with token labels (see §8 Implementation notes).
  - **Prev/Next Slides %**: how much of prev/next slides are visible; implemented **10–25%** to match Figma. **Default:** 15.
- Feature must work with images and other content (e.g. cards).

**DoD**

- Meets acceptance criteria  
- Test page created/updated  
- Automated tests implemented and spreadsheet updated  
- Release notes draft filled (and any breaking change called out)

**Figma**

- [Improvements section](https://www.figma.com/design/xSk9vrYWTlLO1uLn12Wf4Q/-GA--Mobile-UI---Dev-Experience?node-id=12557-5753) (node 12557:5753 – section “Improvements”). Use for visual/UX reference; carousel-specific specs may live in the same file or linked frames.

---

## 2. Repos and branches


| Repo                          | Default branch | Feature branch |
| ----------------------------- | -------------- | -------------- |
| **runtime-mobile-widgets-js** | `main`         | `ROU-12575`    |
| **OutSystems.WidgetLibrary**  | `dev`          | `ROU-12575`    |


Create both branches from their default branches (per [branch-naming](.cursor/skills/shared/branch-naming/SKILL.md): name format `ROU-XXXX` only.

---

## 3. Work distribution to subagents

### 3.1 Phase 1 – agent:widgets-js (runtime-mobile-widgets-js)

**Scope**

- Create branch `ROU-12575` from `main`.
- Implement Carousel “show prev/next slides” behaviour and new props.
- Add/update Storybook story and automated tests.
- Build, run tests, commit and push.

**Implementation outline**

- **New props (align with Widgets.xml):**
  - `showPrevNextSlides: boolean` (default `false`)
  - `slideGap: string` (enum: token-gap-0/100/200/400 → 0/4/8/16px) – horizontal gap between slides
  - `prevNextSlidesPercent: number` (**10–25**, default 15) – percentage of prev/next slide visible (clamped to match Figma)
- **Files to touch (representative):**
  - [src/scripts/Components/Carousel/types.ts](runtime-mobile-widgets-js/src/scripts/Components/Carousel/types.ts) – extend props if needed.
  - [src/generated/Carousel.Generated.ts](runtime-mobile-widgets-js/src/generated/Carousel.Generated.ts) – add the three properties to `ICarouselProperties` (if this file is generated from WidgetLibrary, regenerate or sync after WidgetLibrary changes; otherwise update manually).
  - [src/scripts/Components/Carousel/Provider/EmblaCarousel.tsx](runtime-mobile-widgets-js/src/scripts/Components/Carousel/Provider/EmblaCarousel.tsx) – accept new props and pass to Embla (e.g. alignment/containScroll, gap, and “peek” amount). Use Embla Carousel API (e.g. `containScroll`, slide sizing/alignment) to show a portion of adjacent slides and apply gap.
  - [src/scripts/Components/Carousel/AbstractCarousel.tsx](runtime-mobile-widgets-js/src/scripts/Components/Carousel/AbstractCarousel.tsx) – read new props from `this.props` and pass to `EmblaCarousel`; apply `slideGap` (e.g. CSS variable or style) and ensure `prevNextSlidesPercent` drives the visible portion of prev/next.
  - Carousel SCSS/Theme – **actual**: used **padding + negative margin** (Embla-style) for gap/peek; **no** CSS `gap` and no loop-only workaround (see [src/scss](runtime-mobile-widgets-js/src/scss) component SCSS).
- **Storybook**
  - [src/scripts/Components/Carousel/tests/Carousel.stories.tsx](runtime-mobile-widgets-js/src/scripts/Components/Carousel/tests/Carousel.stories.tsx) – add a story that demonstrates “Show Prev/Next Slides” with:
    - Yes + Slide Gap (e.g. token-gap-400 and one alternative) + Prev/Next Slides % (e.g. 15 and another value).
    - Content: images and cards so the DoD (“works with images and other elements”) is visible.
- **Tests**
  - [src/scripts/Components/Carousel/tests/Carousel.spec.tsx](runtime-mobile-widgets-js/src/scripts/Components/Carousel/tests/Carousel.spec.tsx) (and design-time if relevant) – add tests for the new behaviour (e.g. when `showPrevNextSlides` is true, adjacent slides are partially visible; gap and percent affect layout). Update test spreadsheet as per DoD.
- **Design**
  - Optional: use [design-verification](.cursor/skills/shared/design-verification/SKILL.md) against the Figma link above once carousel-specific frames are identified.

**Deliverables**

- Branch `ROU-12575` created and pushed.
- Implementation + Storybook story showing the new functionality.
- Automated tests covering the new feature.
- `npm run bundle` and tests passing; Jira “What I Did” updated (e.g. via [jira-updates](.cursor/skills/shared/jira-updates/SKILL.md)).

---

### 3.2 Phase 2 & 3 – agent:widget-library (OutSystems.WidgetLibrary)

**Scope**

- Create branch `ROU-12575` from `dev`.
- Add the three Carousel properties to Widgets.xml (and any design-time behaviour so Slide Gap has suggestions).
- Update widgets-js from local (after Phase 1 is built).
- Prepare XIF with version **1.0.391**.

**Implementation outline**

- **Widgets.xml** ([Common/Widgets.xml](OutSystems.WidgetLibrary/Common/Widgets.xml) – Carousel widget ~lines 490–529):
  - Add **Show Prev/Next Slides**: `BooleanProperty` (e.g. Group="Appearance"), DisplayName "Show Prev/Next Slides", DefaultValue `false`, AffectsPreview `true`.
  - Add **Slide Gap**: **actual** `EnumProperty` (TokenGap0/100/200/400), DisplayValue = token labels (token-gap-0, token-gap-100, token-gap-200, token-gap-400), DefaultValue `TokenGap400`.
  - Add **Prev/Next Slides %**: `ExpressionProperty` RuntimeType Integer, DefaultValue `15`, description "10–25%". **Actual**: Carousel.cs `PropertyIsVisible` + `ValidatePrevNextSlidesPercentProperty`.
- **Version for XIF**
  - **Actual**: Script in skill [prepare_xif.js](.cursor/skills/mobile-ui-prepare-xif-from-local/scripts/prepare_xif.js). In WidgetLibrary symlink to `scripts/prepare_xif.js`; run `node scripts/prepare_xif.js`. Enter **1.0.390** → **1.0.391**.
- **Workflow**
  - Run [skill:widget-library-update-widgets-js](.cursor/skills/widget-library-update-widgets-js/SKILL.md) in **local** mode (after Phase 1 bundle in runtime-mobile-widgets-js).
  - Run [skill:widget-library-xif](.cursor/skills/widget-library-xif/SKILL.md): from WidgetLibrary root `node scripts/prepare_xif.js`; answer **1.0.390** → XIF **1.0.391**.

**Deliverables**

- Branch `ROU-12575` created and pushed.
- Carousel properties in Widgets.xml.
- WidgetLibrary updated from local widgets-js and XIF prepared at 1.0.391 (manual ODC publish and Slack steps per skill).

---

## 4. Execution order and handoffs

```mermaid
sequenceDiagram
  participant Orchestrator
  participant WidgetsJs as agent_widgets_js
  participant WidgetLib as agent_widget_library

  Orchestrator->>WidgetsJs: Create branch ROU-12575 from main
  Orchestrator->>WidgetLib: Create branch ROU-12575 from dev

  Orchestrator->>WidgetsJs: Implement Carousel + Storybook + tests
  WidgetsJs->>Orchestrator: Branch pushed, build OK, tests OK

  Orchestrator->>WidgetLib: Add properties to Widgets.xml
  WidgetLib->>WidgetLib: Update widgets-js from local (copy-from-local)
  WidgetLib->>WidgetLib: prepare-xif (version 1.0.390 -> 1.0.391)
  WidgetLib->>Orchestrator: XIF 1.0.391 ready
```



- **Branches**: Can be created in parallel in both repos.
- **Phase 1 (widgets-js)** must be done and bundled before **Phase 2 (WidgetLibrary)** “update from local” and XIF preparation.
- **Widgets.xml** property names and types must match what widgets-js expects (e.g. `ShowPrevNextSlides`, `SlideGap`, `PrevNextSlidesPercent` or the exact names generated for `ICarouselProperties`).

---

## 5. XIF version 1.0.391

- Run from WidgetLibrary root: `node scripts/prepare_xif.js` (script symlinked from skill; no npm script).
- When the script asks for “latest published version”, enter **1.0.390** so it bumps to **1.0.391**.
- After the script runs, the XIF will be **MobileUI-1.0.391.xif**; manual steps (ODC publish, Slack) as in [widget-library-xif](.cursor/skills/widget-library-xif/SKILL.md).

---

## 6. Post-implementation (optional in this plan)

- **Jira**: Update “What I Did”, verification steps, and release notes draft (e.g. [jira-updates](.cursor/skills/shared/jira-updates/SKILL.md), [release-notes](.cursor/skills/shared/release-notes/SKILL.md)).
- **ODC**: Create/update test app and verify Carousel with Show Prev/Next Slides (e.g. [odc-testing](.cursor/skills/shared/odc-testing/SKILL.md)).
- **PRs**: Create PRs per [pr-creation](.cursor/skills/shared/pr-creation/SKILL.md) when ready (title format `ROU-12575: <subject>`, labels, context/impacts).

---

## 7. References

Links that were relevant for implementing this story (information gathering, design alignment, and API usage).


| Reference              | Link                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Jira story**         | [ROU-12575](https://outsystemsrd.atlassian.net/browse/ROU-12575) (cloudId: 3755dbe1-fa22-4c37-956e-59bea84af9cf)                                                                                                                                 |
| **Figma**              | [GA Mobile UI / Dev Experience – Improvements](https://www.figma.com/design/xSk9vrYWTlLO1uLn12Wf4Q/-GA--Mobile-UI---Dev-Experience?node-id=12557-5753) (node 12557-5753 – Carousel specs, Show Prev/Next Slides, Slide Gap tokens, Prev/Next %)  |
| **Embla Carousel API** | [API docs](https://www.embla-carousel.com/api/) – options, methods, events; used for alignment, containScroll, and inViewMargin for prev/next peek                                                                                               |
| **Embla Slide Gaps**   | [Slide Gaps guide](https://www.embla-carousel.com/guides/slide-gaps/#gap-or-margin) – padding approach (padding on slides + negative margin on container); inViewMargin to match horizontal padding. Implementation follows this (no CSS `gap`). |


**Framework / agents** (automation repo):

- [.cursor/agents/mobile-ui.md](.cursor/agents/mobile-ui.md) – Mobile UI orchestrator
- [.cursor/agents/widgets-js.md](.cursor/agents/widgets-js.md) – Widgets-js agent
- [.cursor/agents/widget-library.md](.cursor/agents/widget-library.md) – Widget-Library agent

---

## 8. Implementation notes (actual vs plan)

Summary of what was done differently during implementation, for future reference.


| Area                         | Plan                                                          | Actual                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prev/Next Slides % range** | 0–50%                                                         | **10–25%** to match Figma; clamped in AbstractCarousel and Storybook; WidgetLibrary validation in Carousel.cs (`ValidatePrevNextSlidesPercentProperty`) with error "must be between 10 and 25".                                                                                                                                        |
| **Slide Gap**                | ExpressionProperty with token suggestions                     | **EnumProperty** (TokenGap0/100/200/400) with **DisplayValue** = token labels (token-gap-0, token-gap-100, token-gap-200, token-gap-400) so ODC dropdown shows token names, not pixels.                                                                                                                                                |
| **Carousel styling**         | "CSS variables or classes for gap and peek"                   | **Padding + negative margin** (Embla-style); no CSS `gap`; no loop-only workaround. SCSS in component (e.g. _emblaCarousel.scss).                                                                                                                                                                                                      |
| **Conditional visibility**   | "if supported; otherwise document"                            | **Carousel.cs** `PropertyIsVisible`: SlideGap and PrevNextSlidesPercent only visible when ShowPrevNextSlides is true.                                                                                                                                                                                                                  |
| **Prepare XIF script**       | WidgetLibrary `scripts/prepare_xif.js`, `npm run prepare-xif` | Script **moved into skill** [mobile-ui-prepare-xif-from-local](.cursor/skills/mobile-ui-prepare-xif-from-local/SKILL.md) at `scripts/prepare_xif.js`. In WidgetLibrary: symlink only the script to `scripts/prepare_xif.js`; run `node scripts/prepare_xif.js` (no npm script in package.json). Avoids duplicate skill in Skills list. |
| **Skill: skip build**        | Not in plan                                                   | Skill supports **skipping widgets-js build** (WidgetLibrary-only iteration) or skip bundle only; see skill doc.                                                                                                                                                                                                                        |


---

## 9. Testing notes

Manual/Storybook checks to run before release; these can be added as Storybook story variants or test cases later.

**Visual / no cut-off**

- **Slides must not appear cut off** – first and subsequent slides should show **full rounded corners** (no clipping on left or right). Gap is implemented with **margin-inline: calc(var(--gap) / 2)** on every slide so corners are not clipped and, when **Loop** is on, space is even on both sides. **Align**: when Show Prev/Next Slides is on, **Loop off** → align start (current slide full, next peeks right); **Loop on** → align center (current centered, gap split both sides).

**Combinations to cover**


| Dimension                 | Values to test                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| **Show Prev/Next Slides** | On, Off                                                                                       |
| **Prev/Next Slides %**    | **Min 10**, **Max 25**, and e.g. 15 (default)                                                 |
| **Slide Gap**             | All gap values: **0, 4, 8, 16 px** (token-gap-0, token-gap-100, token-gap-200, token-gap-400) |
| **Loop**                  | On, Off                                                                                       |


**Suggested flow**

- With **Show Prev/Next Slides = Off**: confirm full-width slide, no gap applied, no cut-off.
- With **Show Prev/Next Slides = On**: for each **Slide Gap** and for **Prev/Next %** at 10, 15, 25, confirm no cut-off (rounded corners visible), correct peek and spacing; repeat with **Loop** on and off.

---

## 10. Design verification (Story + Figma)

Double-check against the Storybook story and Figma. Verified as of implementation.

### Storybook (Carousel.stories.tsx)


| Item                      | Story                                                                                     | Implementation                                                            | Match |
| ------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----- |
| **Show Prev/Next Slides** | Boolean; default false; story "Show Prev/Next Slides" and "Show Prev/Next Slides (Cards)" | `showPrevNextSlides` prop, default false                                  | Yes   |
| **Slide Gap**             | Select: 0px, 4px, 8px, 16px (TokenGap0/100/200/400)                                       | `_slideGapToPx`: 0, 4, 8, 16 px                                           | Yes   |
| **Prev/Next Slides %**    | Number min 10, max 25; default 15                                                         | Clamped 10–25 in AbstractCarousel; default 15                             | Yes   |
| **Loop**                  | Boolean; stories "Loop", "Show Prev/Next Slides"                                          | `loop` prop; align center when loop+showPrevNext, else start              | Yes   |
| **Shape**                 | Round, Rectangular, Soft                                                                  | `tokens.$token-round-xl`, `token-soft-xl`, `token-rectangular-xl` in SCSS | Yes   |
| **Stories**               | BasicUsage, ShowPrevNextSlides, ShowPrevNextSlidesWithCards, CarouselWithLoop, etc.       | All use same Carousel component and args                                  | Yes   |


### Figma (GA Mobile UI / Dev Experience – node 12557:5753)


| Item                   | Figma                                                                                                         | Implementation                                                | Match |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----- |
| **Property name**      | "Show Prev/Next Slides" (also "Show Adjacent Slide" in description)                                           | ShowPrevNextSlides                                            | Yes   |
| **Slide Gap**          | Dropdown with token labels: token-gap-0, token-gap-100, token-gap-200, token-gap-400; default "token-gap-400" | Enum TokenGap0/100/200/400 → 0/4/8/16 px; default TokenGap400 | Yes   |
| **Prev/Next Slides %** | Label "Prev/Next Slides %"; example value 15; description "10–25% recommended"                                | prevNextSlidesPercent, default 15, clamped 10–25              | Yes   |
| **Gap tokens**         | token-gap-0 … token-gap-400                                                                                   | 0, 4, 8, 16 px (standard scale)                               | Yes   |


### Codebase tokens (widgets-js)


| Token                           | Codebase value                                    | Usage in Carousel                                                                |
| ------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Default gap (SCSS fallback)** | `$token-space-400` → 16px (scale-400)             | `--gap` in _emblaCarousel.scss; overridden by inline style from AbstractCarousel |
| **Slide gap (runtime)**         | 0, 4, 8, 16 px from _slideGapToPx                 | Set via style `--gap`; only when showPrevNextSlides                              |
| **Round shape**                 | `$token-round-xl` → border-radius-400 (e.g. 16px) | .embla__shape--round                                                             |
| **Soft shape**                  | `$token-soft-xl` → border-radius-200              | .embla__shape--soft                                                              |


**Conclusion:** Story and Figma align with the implementation. Property names, token labels (token-gap-0/100/200/400), default (token-gap-400, 15%), and 10–25% range match. Visually confirm in Storybook with the testing matrix in §9.