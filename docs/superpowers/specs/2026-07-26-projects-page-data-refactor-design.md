# Projects Page Data Refactor — Design

Date: 2026-07-26
Status: Approved

## Context

`source/projects/index.md` currently contains ~300 lines of hand-authored raw HTML: 10 project "cards" plus a modal skeleton. Each card's short description lives in this markdown file; the modal's fuller detail (highlights, stack, link) lives in a *separate* hardcoded JS object (`themes/Chic/source/js/script.js`, `projectDetails`), matched to its card at runtime by an exact string match on the card's `<h2>` title text. Adding or editing a project currently means hand-editing HTML in one file and a JS object in another, keeping a title string in sync between them.

Each card's cover visual is a bespoke, hand-tuned CSS illustration (unique inner `<div>`s + `.styl` rules per project — e.g. `.camera-frame`, `.rag-core`, `.agent-terminal`) with no reusable structure across projects.

The user wants two things from this refactor:
1. Project content should live in one place, easy to read and to add/update without touching template code.
2. A way to use a real cover photo per project, falling back to the existing CSS illustration when no photo is set.

## Goals

1. Single source of truth for all project content (card + modal), as a Hexo data file.
2. A template that renders both the card grid and the modal content from that data — no more hand-written per-project HTML or a separate JS content object.
3. An optional `cover` image field per project; when set, it replaces the CSS illustration in the same visual slot. When unset, the project's existing bespoke illustration still renders (this refactor must not change what any of the current 10 projects look like).
4. Filter buttons (Research/Application/Engineering/Education) derived from the data instead of hardcoded, so a new project's filter value doesn't require a second manual edit.

## Non-goals

- Rewriting or editing any project's actual copy (titles, descriptions, highlights, stack, dates) — this is an architecture change, content is ported verbatim.
- Sourcing or designing real cover photos — the mechanism is built now; photos are added later by the user, per project, by editing the data file.
- Changing the "Application" filter's near-universal applicability (noted in an earlier audit) — that's a content/tagging decision out of scope here.
- Changing modal open/close behavior, animations, or keyboard handling in `script.js` beyond what's needed to read from the new data source instead of the old object.

## Data Model — `source/_data/projects.yml`

Hexo automatically exposes any file under `source/_data/` as `site.data.<filename>` in templates. One list, one entry per project:

```yaml
- id: soccer-match-analysis
  title: Soccer Match Analysis
  kind: [application, engineering]      # data-project-kind values, used by the existing filter JS
  badges:                                # displayed badges — NOT derived from `kind`, see below
    - {type: application, label: Application}
    - {type: featured, label: Featured}
  org: UpWork freelance
  date: Apr 2025 - Jun 2025
  summary: Cross-platform desktop application for football tactical analysis, built with video stitching, player tracking, and intelligent auto-focus.
  highlights:
    - Built a robust video stitching pipeline with camera calibration and lens distortion correction for wide-angle footage.
    - Fine-tuned an object detection model and clustering logic to identify player groups and simulate camera-operator style focus.
    - Delivered a complete GUI application across operating systems, including product packaging and client handoff.
    - Managed the full freelance lifecycle and reached the first $1,000 UpWork milestone.
  stack: [Computer Vision, Video Stitching, Camera Calibration, Object Detection, GUI]
  link: https://www.youtube.com/watch?v=ZNacjRtL9JQ
  linkText: Watch demo
  cover:            # empty for now — user fills in later, e.g. /images/projects/soccer-match-analysis.jpg
  media: video      # legacy illustration id, used only while cover is empty
```

**Why `badges` is a separate field from `kind`:** auditing the current markup shows they are NOT the same thing. `kind` drives the filter buttons (`data-project-kind`) and can include a category with no visible badge (e.g. Soccer Match Analysis and LectureHub both filter under "engineering" but show only an "Application" + "Featured" badge, no visible "Engineering" badge). Conversely, several badge labels are more specific than their category — "Programming Educator & Mentor" shows a badge styled `badge-application` but labeled "Mentoring", not "Application"; similarly "Backend" (Boom Mail), "Deployment" (License Plate Recognition), "Hardware" (Product Classification System, styled `badge-engineering`). So `badges` needs its own `{type, label}` pairs — `type` selects the existing CSS color class (`badge-<type>`), `label` is the exact display text — independent of `kind`.

**`stack` consolidation:** the current card HTML and the current JS `projectDetails` object show slightly different stack lists for the same project (e.g. card shows 4 tags for Soccer Match Analysis, modal's JS object shows 5, including "Camera Calibration" that the card omits). This refactor uses one `stack` list per project — the fuller of the two existing lists — shown on both card and modal. No information is dropped; the shorter of the two current lists is superseded by the fuller one.

**`link`/`linkText`:** optional. When present, both the card's top-right icon link and the modal's "Open link" button render; when absent, both are omitted — this already matches current behavior (verified: every project with a card icon link also has a populated `detail.link` in the current JS object, and vice versa).

**Legacy illustration migration map** (`media` field for all 10 existing projects, ported verbatim from the current markup, no visual changes):

| id | title | media |
|---|---|---|
| soccer-match-analysis | Soccer Match Analysis | video |
| lecturehub | LectureHub | lecturehub |
| api-long-running-tasks | API Services for Long-Running Tasks | tasks |
| image-video-merging | Automatic Image and Video Merging | green |
| qa-chatbot | Advanced Q&A Chatbot | rag |
| codemath-solver | CodeMath Solver | agent |
| programming-educator | Programming Educator & Mentor | education |
| boom-mail | Boom Mail | email |
| license-plate-recognition | License Plate Recognition | plate |
| product-classification | Product Classification System | classifier |

## Cover Image / Illustration Fallback Logic

Rendering order for a project's media slot (same fixed-size box the CSS illustrations already render into):

1. `cover` is set → render `<img src="<%- url_for(project.cover) %>" alt="<%= project.title %>" loading="lazy">`, styled `object-fit: cover` to fill the existing box — no layout change from today.
2. `cover` is empty and `media` matches one of the 10 known legacy illustration ids → render that project's existing bespoke decorative markup verbatim (ported into a lookup, not regenerated).
3. `cover` is empty and `media` is empty/unrecognized (this only applies to *future* projects added to the data file without a hand-built illustration) → render a simple generic fallback: the project's initials over a gradient background, using the same box dimensions. This avoids forcing every future project addition to also require bespoke CSS artwork.

All 10 current projects hit case 2 today (empty `cover`, valid `media`) and must render pixel-identical to today.

## Template Architecture

- `source/projects/index.md` shrinks to front-matter only: `title`, `date`, `layout: projects`, plus optional `kicker` / `heading` / `intro` fields so the hero copy is editable without touching template code. No body content.
- `themes/Chic/layout/projects.ejs` — new top-level layout Hexo resolves via `layout: projects`. Reads `site.data.projects`, renders:
  - the hero section (from the page's front-matter fields, falling back to the current hardcoded copy if a field is absent)
  - filter buttons: `All Projects` plus one button per **unique** `kind` value found across all projects (order: first-seen order, matching current visual order for the existing 4 values)
  - the card grid (loop, delegating each card to a partial)
  - the modal skeleton (unchanged structure/IDs from today)
- `themes/Chic/layout/_partial/project-card.ejs` — renders one `<article class="showcase-card">`: badges, media slot (delegates to project-media partial), title, summary, meta, stack, and a `<script type="application/json" class="project-data">` block embedding `{title, kicker fields, summary, highlights, stack, link, linkText}` for the modal to read.
- `themes/Chic/layout/_partial/project-media.ejs` — implements the 3-case fallback logic above for one project.

## JS Simplification — `themes/Chic/source/js/script.js`

- Delete the `projectDetails` object entirely (~130 lines of duplicated content).
- `openModal(card)` changes from `projectDetails[title-string-match]` to `JSON.parse(card.querySelector('.project-data').textContent)` — reads the data the template already embedded in the clicked card. No cross-file lookup, no string-matching fragility.
- The current modal `kicker` string (e.g. `"Application · UpWork freelance · Apr 2025 - Jun 2025"`) is built in JS by splitting on ` · `. Verified across all 10 current entries: the kicker's first segment always equals `badges[0].label`, and the remaining segments are always `org` then `date`. So the template computes the modal meta directly as the array `[badges[0].label, org, date]` and embeds it in the card's JSON block — no string is built and re-split. This is separate from the card's own meta line, which continues to render `org` and `date` directly as two spans (unchanged from today, and unrelated to the modal's 3-part array).
- Filter button click handling and card reveal-on-scroll animation are untouched.

## CSS — `themes/Chic/source/css/custom.styl`

- Add rules for `.showcase-media img` (`object-fit: cover`, fill the box, rounded corners matching the existing box treatment).
- Add a small generic-fallback style (initials + gradient) for the case-3 fallback. This is new visual territory (no current project uses it) — kept minimal and consistent with the existing card's visual language (same border-radius, same box size).
- No changes to the 10 existing illustration rules — they're ported as-is.

## Testing / Verification

No automated test suite exists for this project. Verification is:
- `hexo clean && hexo generate`, no errors.
- Render `/projects/` and diff the extracted page text (`get_page_text`) against the pre-refactor baseline captured before starting — must be textually identical (same 10 titles, summaries, meta, stack tags, in the same order).
- Visually confirm (screenshot) that all 10 cards still show their original CSS illustration (case 2 of the fallback), filters still narrow the grid, and clicking a card still opens the modal with correct highlights/stack/link.
- Manually verify one filter click and one modal open/close cycle in the browser (interactive behavior a text diff can't catch).

## Rollout

Land as a small number of focused, revertible commits: (1) add the data file, (2) add the new layout/partials + wire up `index.md`, (3) simplify `script.js` and remove `projectDetails`, (4) CSS additions for image cover + generic fallback. Exact commit boundaries are decided in the implementation plan. No deploy is triggered — `hexo deploy` stays a manual, separate step.
