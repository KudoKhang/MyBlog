# Projects Page Data Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Projects page's content out of hand-written HTML (`source/projects/index.md`) and a duplicate, title-string-keyed JS object (`script.js`), into a single Hexo data file (`source/_data/projects.yml`) rendered by a new EJS template, with an optional per-project cover image that falls back to the existing hand-built CSS illustration.

**Architecture:** Hexo data file → EJS layout (`projects.ejs`) + two partials (`project-card.ejs`, `project-media.ejs`) render the card grid and a modal-data JSON blob embedded per card. `script.js`'s modal code reads that embedded JSON instead of a separate hardcoded object. No test framework exists (per `AGENTS.md`); verification is `hexo clean && hexo generate`, a `get_page_text` diff against a pre-refactor baseline, and a manual filter/modal check via the Browser tool.

**Tech Stack:** Hexo 8.1.2, EJS, Stylus, Hexo data files (`source/_data/`), vanilla JS.

## Global Constraints

- **No content rewrites.** All 10 projects' titles, dates, orgs, links, and illustrations must be ported verbatim (see the exact source text quoted in each task below) — this is an architecture change only.
- **`kind` (filter values) and `badges` (displayed labels) are separate fields** — do not derive one from the other. Several projects show a badge label that differs from its category name (e.g. "Mentoring" styled `badge-application`, not "Application").
- **`stack` is a single list per project** — use the fuller of the current card/modal lists (documented per-project in Task 1). No separate card-stack vs. modal-stack.
- **`summary` is a single field** — use the current *card* wording (shorter blurb), not the modal's alternate phrasing. Documented per-project in Task 1.
- All 10 existing projects have empty `cover` and a valid `media` id — they must render pixel-identical to today (same illustration, same layout).
- `source/projects/index.md` becomes front-matter only, using `layout: projects` to select the new template.
- Preserve the existing wrapper markup (`<div class="container"><article class="post-wrap page projects-layout">...`) so all current CSS selectors (`.projects-page`, `.post-wrap.page.projects-layout`) keep applying without CSS changes to structure.
- No automated test suite exists (per `AGENTS.md`) — verification is `hexo clean && hexo generate` plus manual/browser checks.
- Commit in 4 groups, matching the spec's rollout: (1) data file, (2) template layer, (3) `script.js` simplification, (4) CSS additions.

---

### Task 1: Project data file — `source/_data/projects.yml`

**Files:**
- Create: `source/_data/projects.yml`

**Interfaces:**
- Consumes: nothing
- Produces: `site.data.projects` (array of 10 objects, each with keys `id, title, kind, badges, org, date, summary, highlights, stack, link, linkText, cover, media`) — consumed by Task 2's templates

- [ ] **Step 1: Create the data file with all 10 projects, exactly as below**

```yaml
- id: soccer-match-analysis
  title: Soccer Match Analysis
  kind: [application, engineering]
  badges:
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
  cover:
  media: video

- id: lecturehub
  title: LectureHub
  kind: [application, engineering]
  badges:
    - {type: application, label: Application}
    - {type: featured, label: Featured}
  org: Personal project
  date: Jun 2025 - Present
  summary: Full-stack web platform for looking up competitive programming solutions from multiple online judges, deployed as a production-ready product.
  highlights:
    - Designed and implemented the full web application with a structured, production-oriented codebase.
    - Built CI/CD and deployed the system on AWS with self-managed cloud configuration.
    - Owned product planning, implementation, deployment, and iteration independently.
  stack: [Full-stack, AWS, CI/CD, Product Engineering, Competitive Programming]
  link: https://www.lecturehub.tech/
  linkText: Open website
  cover:
  media: lecturehub

- id: api-long-running-tasks
  title: API Services for Long-Running Tasks
  kind: [application, engineering]
  badges:
    - {type: engineering, label: Engineering}
    - {type: application, label: Application}
  org: FTECH
  date: Sep 2023 - Jan 2025
  summary: Microservices API platform for resource-intensive video generation tasks with immediate responses, fault tolerance, monitoring, and GPU cost optimization.
  highlights:
    - Designed a scalable microservices architecture for long-running CPU/GPU/memory-heavy workloads.
    - Added CI/CD, monitoring, alerting, and error tracking with Prometheus, Grafana, and Sentry.
    - Optimized GPU usage with sleep/wake-up behavior and in-memory caching for intermittent workloads.
    - Improved fault tolerance and operational visibility for production processing.
  stack: [Microservices, GPU, CI/CD, Prometheus, Grafana, Sentry]
  link:
  linkText:
  cover:
  media: tasks

- id: image-video-merging
  title: Automatic Image and Video Merging
  kind: [application, research]
  badges:
    - {type: application, label: Application}
    - {type: research, label: Research}
  org: FTECH
  date: Sep 2023 - Jan 2025
  summary: Deep learning and image processing module for automatically merging images and videos into templates, including green-screen video workflows.
  highlights:
    - Engineered a high-performance module for green-screen video merging with strong speed and resource constraints.
    - Managed deployment strategy with rolling updates and production monitoring.
    - Tracked model performance, CPU/GPU utilization, and availability.
    - Mentored a junior engineer on Git, Docker, performance reporting, and delivery practice.
  stack: [Deep Learning, Image Processing, MLOps, Docker, Monitoring]
  link:
  linkText:
  cover:
  media: green

- id: qa-chatbot
  title: Advanced Q&A Chatbot
  kind: [application, engineering]
  badges:
    - {type: application, label: Application}
    - {type: engineering, label: Engineering}
  org: LectureHub feature
  date: PoC
  summary: RAG-based chatbot for in-depth conversational queries about programming problems, using a pre-computed vector database to reduce hallucinations.
  highlights:
    - Designed a complete RAG pipeline backed by a pre-computed vector database.
    - Improved retrieval latency and answer precision for complex problem-specific questions.
    - Reduced hallucinations compared with a non-RAG baseline by grounding answers in curated knowledge.
  stack: [RAG, Vector Database, LLM, Retrieval, Prompting]
  link: https://github.com/LectureHubTeam/lecturehub-chatbox
  linkText: Open repository
  cover:
  media: rag

- id: codemath-solver
  title: CodeMath Solver
  kind: [application, engineering]
  badges:
    - {type: application, label: Application}
    - {type: engineering, label: Engineering}
  org: Personal project
  date: Apr 2025 - Present
  summary: Autonomous problem-solving agent for programming challenges, built with a multi-stage prompt engineering framework and Selenium automation.
  highlights:
    - Designed a multi-stage prompt framework for accurate solution generation and stable output formatting.
    - Built resilient Selenium automation with exception handling for long-running operation.
    - Reached #1 rank on codemath.vn within 24 hours of deployment.
  stack: [LLM, Prompt Engineering, Selenium, Automation, Python]
  link: https://github.com/LectureHubTeam/codemath-solver
  linkText: Open repository
  cover:
  media: agent

- id: programming-educator
  title: Programming Educator & Mentor
  kind: [education, application]
  badges:
    - {type: education, label: Education}
    - {type: application, label: Mentoring}
  org: Freelance
  date: May 2024 - Present
  summary: Programming curriculum for primary and secondary students, covering Scratch, Python, computational thinking, and competition preparation.
  highlights:
    - Simplified Python syntax and core algorithms into interactive, age-appropriate lessons.
    - Designed exercises to build logical thinking and problem-solving habits.
    - Mentored students toward strong results in the Tin Hoc Tre competition.
  stack: [Python, Scratch, Algorithms, Curriculum Design, Mentoring]
  link:
  linkText:
  cover:
  media: education

- id: boom-mail
  title: Boom Mail
  kind: [engineering, application]
  badges:
    - {type: engineering, label: Engineering}
    - {type: application, label: Backend}
  org: Freelance
  date: Dec 2022 - Jul 2023
  summary: Backend service for email automation with Python, MySQL, API design, and frontend integration requirements.
  highlights:
    - Designed and implemented backend APIs for an email automation workflow.
    - Collaborated with frontend developers through clear integration requirements.
    - Gained deeper experience in backend-to-frontend architecture and delivery.
  stack: [Python, MySQL, Backend, API Design, Integration]
  link: https://github.com/KudoKhang/boom_mail
  linkText: Open repository
  cover:
  media: email

- id: license-plate-recognition
  title: License Plate Recognition
  kind: [research, application]
  badges:
    - {type: research, label: Research}
    - {type: application, label: Deployment}
  org: Freelance
  date: Jul 2022 - Sep 2022
  summary: Factory-deployed license plate recognition system with Dockerized API, 97% private-test accuracy, and ATiGB 2022 publication.
  highlights:
    - Developed and deployed an automated license plate recognition system in a factory setting.
    - Reached 97% accuracy on a private real-world test dataset.
    - Built Docker image and API for convenient deployment.
    - Published the research in the ATiGB 2022 conference proceedings.
  stack: [CNN, OCR, Docker, API, Computer Vision]
  link: https://github.com/KudoKhang/LPR
  linkText: Open repository
  cover:
  media: plate

- id: product-classification
  title: Product Classification System
  kind: [research, engineering]
  badges:
    - {type: research, label: Research}
    - {type: engineering, label: Hardware}
  org: University project
  date: May 2022
  summary: Graduation thesis on orange classification using deep learning, Jetson Nano video processing, conveyor design, and robotic arms.
  highlights:
    - Designed a conveyor system and two robotic arms for product classification.
    - Used Jetson Nano to process camera video and control robotic arms.
    - Achieved A+ in the graduation thesis defense, the highest score in class.
  stack: [Jetson Nano, Deep Learning, Robotics, Computer Vision, Embedded AI]
  link:
  linkText:
  cover:
  media: classifier
```

- [ ] **Step 2: Verify the YAML parses and Hexo exposes it**

```bash
hexo clean && hexo generate 2>&1 | tail -5
node -e "console.log(require('js-yaml').load(require('fs').readFileSync('source/_data/projects.yml', 'utf8')).length)"
```

Expected: `hexo generate` completes with no errors (the site doesn't use this data yet, so output is otherwise unchanged), and the node command prints `10`.

- [ ] **Step 3: Commit**

```bash
git add source/_data/projects.yml
git commit -m "feat(projects): add single-source project data file"
```

---

### Task 2: Template layer — render the page from the data file

**Files:**
- Create: `themes/Chic/layout/_partial/project-media.ejs`
- Create: `themes/Chic/layout/_partial/project-card.ejs`
- Create: `themes/Chic/layout/projects.ejs`
- Modify: `source/projects/index.md` (replace entire file — front-matter only)

**Interfaces:**
- Consumes: `site.data.projects` (array, shape from Task 1)
- Produces: rendered `/projects/` page whose extracted text content must match the pre-refactor baseline captured in Step 1 below

- [ ] **Step 1: Capture the pre-refactor baseline (before touching any template file)**

```bash
hexo clean && hexo generate
npx hexo server &
SERVER_PID=$!
sleep 2
```

Use the Browser tool: `preview_start` (or reuse a running dev server), `navigate` to `http://localhost:4000/projects/`, then call `get_page_text` and save its full output to `.superpowers/sdd/projects-baseline.txt`. This is the exact text baseline the refactored page must reproduce.

```bash
kill $SERVER_PID
```

- [ ] **Step 2: Create the media/illustration partial**

Create `themes/Chic/layout/_partial/project-media.ejs`:

```ejs
<%
var initials = project.title.split(' ').filter(function(w){ return w.length; }).slice(0, 2).map(function(w){ return w[0]; }).join('').toUpperCase();
%>
<div class="showcase-media media-<%= project.media || 'default' %>">
<% if (project.cover) { %>
    <img src="<%- url_for(project.cover) %>" alt="<%= project.title %>" loading="lazy">
<% } else if (project.media === 'video') { %>
    <div class="camera-frame frame-left"></div>
    <div class="camera-frame frame-right"></div>
    <div class="tracking-box"></div>
    <div class="media-path"></div>
<% } else if (project.media === 'lecturehub') { %>
    <div class="media-window">
    <span></span><span></span><span></span>
    </div>
    <div class="media-node node-a">OJ</div>
    <div class="media-node node-b">Search</div>
    <div class="media-node node-c">Solutions</div>
<% } else if (project.media === 'tasks') { %>
    <div class="task-panel panel-main"></div>
    <div class="task-panel panel-worker"></div>
    <div class="task-gpu">GPU</div>
    <div class="task-pulse"></div>
<% } else if (project.media === 'green') { %>
    <div class="template-frame"></div>
    <div class="subject-cutout"></div>
    <div class="green-screen"></div>
<% } else if (project.media === 'rag') { %>
    <div class="rag-core">RAG</div>
    <div class="rag-doc doc-one">Problem</div>
    <div class="rag-doc doc-two">Code</div>
    <div class="rag-doc doc-three">Solution</div>
<% } else if (project.media === 'agent') { %>
    <div class="agent-terminal"></div>
    <div class="agent-rank">#1</div>
    <div class="agent-line line-one"></div>
    <div class="agent-line line-two"></div>
<% } else if (project.media === 'education') { %>
    <div class="lesson-card lesson-one">Scratch</div>
    <div class="lesson-card lesson-two">Python</div>
    <div class="trophy-mark">A+</div>
<% } else if (project.media === 'email') { %>
    <div class="mail-card mail-one"></div>
    <div class="mail-card mail-two"></div>
    <div class="mail-server">API</div>
<% } else if (project.media === 'plate') { %>
    <div class="factory-line"></div>
    <div class="plate-card">51A-2022</div>
    <div class="scan-line"></div>
<% } else if (project.media === 'classifier') { %>
    <div class="orange-item orange-one"></div>
    <div class="orange-item orange-two"></div>
    <div class="robot-arm arm-left"></div>
    <div class="robot-arm arm-right"></div>
<% } else { %>
    <div class="media-fallback"><%= initials %></div>
<% } %>
</div>
```

- [ ] **Step 3: Create the card partial**

Create `themes/Chic/layout/_partial/project-card.ejs`:

```ejs
<%
var kindAttr = project.kind.join(' ');
var modalMeta = [project.badges[0].label, project.org, project.date];
var modalData = {
    title: project.title,
    meta: modalMeta,
    summary: project.summary,
    highlights: project.highlights,
    stack: project.stack,
    link: project.link || '',
    linkText: project.linkText || ''
};
%>
<article class="showcase-card project-reveal" data-project-kind="<%= kindAttr %>">
<%- partial('_partial/project-media', {project: project}) %>
<div class="showcase-body">
<div class="showcase-topline">
<div class="showcase-badges">
<% project.badges.forEach(function(badge){ %>
<span class="badge badge-<%= badge.type %>"><%= badge.label %></span>
<% }); %>
</div>
<% if (project.link) { %>
<a class="showcase-icon-link" href="<%= project.link %>" target="_blank" rel="noopener" aria-label="Open <%= project.title %>">🚀</a>
<% } %>
</div>
<h2><%- project.title %></h2>
<p><%= project.summary %></p>
<div class="showcase-meta">
<span><%= project.org %></span>
<span><%= project.date %></span>
</div>
<div class="showcase-stack">
<% project.stack.forEach(function(item){ %>
<span><%= item %></span>
<% }); %>
</div>
</div>
<script type="application/json" class="project-data"><%- JSON.stringify(modalData) %></script>
</article>
```

- [ ] **Step 4: Create the top-level layout**

Create `themes/Chic/layout/projects.ejs`:

```ejs
<%
var kindOrder = ['research', 'application', 'engineering', 'education'];
var kindLabels = {research: 'Research', application: 'Application', engineering: 'Engineering', education: 'Education'};
var kinds = kindOrder.filter(function(k){
    return site.data.projects.some(function(project){ return project.kind.indexOf(k) !== -1; });
});
%>
<div class="container">
<article class="post-wrap page projects-layout">
<section class="post-content">
<div class="projects-page">
<section class="projects-hero project-reveal">
<p class="about-kicker"><%= page.kicker %></p>
<h1><%= page.heading %></h1>
<p><%= page.intro %></p>
</section>
<div class="project-filters project-reveal" aria-label="Project filters">
<button class="project-filter is-active" type="button" data-project-filter="all">All Projects</button>
<% kinds.forEach(function(k){ %>
<button class="project-filter" type="button" data-project-filter="<%= k %>"><%= kindLabels[k] || k %></button>
<% }); %>
</div>
<section class="project-showcase" aria-label="Project list">
<% site.data.projects.forEach(function(project){ %>
<%- partial('_partial/project-card', {project: project}) %>
<% }); %>
</section>
<div class="project-modal" id="project-modal" aria-hidden="true">
<div class="project-modal-backdrop" data-project-modal-close></div>
<section class="project-modal-panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
<button class="project-modal-close" type="button" data-project-modal-close aria-label="Close project details">×</button>
<p class="project-modal-kicker" id="project-modal-kicker"></p>
<h2 id="project-modal-title"></h2>
<p class="project-modal-summary" id="project-modal-summary"></p>
<div class="project-modal-meta" id="project-modal-meta"></div>
<div class="project-modal-grid">
<div>
<h3>Highlights</h3>
<ul class="project-modal-list" id="project-modal-highlights"></ul>
</div>
<div>
<h3>Stack</h3>
<div class="project-modal-stack" id="project-modal-stack"></div>
<a class="project-modal-link" id="project-modal-link" href="#" target="_blank" rel="noopener">Open link</a>
</div>
</div>
</section>
</div>
</div>
</section>
</article>
</div>
```

Note: `kindOrder` is the fixed canonical order matching today's Research/Application/Engineering/Education buttons; `kinds` filters it down to only values actually present in the data (so a kind with zero projects doesn't get a dead button), without depending on data entry order — verify the button order in Step 6.

- [ ] **Step 5: Replace `source/projects/index.md`**

```markdown
---
title:
date: 2026-06-04 21:58:00
layout: projects
kicker: Portfolio
heading: Projects
intro: A curated collection of production AI systems, research prototypes, freelance products, and personal tools I have built or led.
---
```

- [ ] **Step 6: Rebuild and diff against baseline**

```bash
hexo clean && hexo generate 2>&1 | tail -20
```

Expected: no errors. Then start the server, navigate to `/projects/` with the Browser tool, call `get_page_text` again, and diff its output against `.superpowers/sdd/projects-baseline.txt`:

```bash
diff .superpowers/sdd/projects-baseline.txt .superpowers/sdd/projects-after.txt
```

Expected: no differences (or only whitespace). If there's a real content difference, find which project/field it traces to and fix Task 1's data or this task's templates — do not "fix" the baseline.

- [ ] **Step 7: Interactive check (Browser tool)**

With the dev server running and `/projects/` loaded:
1. Click the "Engineering" filter button — confirm only cards with `engineering` in `data-project-kind` remain visible (use `read_page` or `javascript_tool` to check computed visibility, not just a screenshot).
2. Click "All Projects" to reset.
3. Click the "Soccer Match Analysis" card — confirm the modal opens showing title "Soccer Match Analysis", a "Watch demo" link, and 4 highlight bullets (use `get_page_text` on the modal or `read_page`).
4. Close the modal (Escape key or close button) — confirm it's hidden again.

Record the results (pass/fail per check) in the report.

- [ ] **Step 8: Commit**

```bash
git add themes/Chic/layout/_partial/project-media.ejs themes/Chic/layout/_partial/project-card.ejs themes/Chic/layout/projects.ejs source/projects/index.md
git commit -m "feat(projects): render Projects page from data file instead of hand-written HTML"
```

---

### Task 3: Simplify modal JS — `themes/Chic/source/js/script.js`

**Files:**
- Modify: `themes/Chic/source/js/script.js`

**Interfaces:**
- Consumes: `.project-data` JSON `<script>` block embedded per card by Task 2's `project-card.ejs` (shape: `{title, meta: [string,string,string], summary, highlights: string[], stack: string[], link, linkText}`)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Locate and remove the `projectDetails` object**

In `themes/Chic/source/js/script.js`, delete the entire `const projectDetails = { ... };` block (currently lines 129–254, from `const projectDetails = {` through the closing `};` right before `const titleEl = document.getElementById('project-modal-title');`).

- [ ] **Step 2: Rewrite `openModal` to read the card's embedded JSON**

Find:
```js
    const openModal = (card) => {
        const title = card.querySelector('h2') && card.querySelector('h2').innerText;
        const detail = projectDetails[title];
        if (!detail) return;

        titleEl.innerText = title;
        kickerEl.innerText = detail.kicker;
        summaryEl.innerText = detail.summary;
        metaEl.innerHTML = '';
        detail.kicker.split(' · ').forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            metaEl.appendChild(span);
        });
        highlightsEl.innerHTML = '';
        detail.highlights.forEach((item) => {
            const li = document.createElement('li');
            li.innerText = item;
            highlightsEl.appendChild(li);
        });
        stackEl.innerHTML = '';
        detail.stack.forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            stackEl.appendChild(span);
        });

        if (detail.link) {
            linkEl.href = detail.link;
            linkEl.innerText = detail.linkText || 'Open link';
            linkEl.style.display = 'inline-flex';
        } else {
            linkEl.style.display = 'none';
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.querySelector('.project-modal-close').focus();
    };
```

Replace with:
```js
    const openModal = (card) => {
        const dataEl = card.querySelector('.project-data');
        if (!dataEl) return;
        const detail = JSON.parse(dataEl.textContent);

        titleEl.innerText = detail.title;
        kickerEl.innerText = detail.meta.join(' · ');
        summaryEl.innerText = detail.summary;
        metaEl.innerHTML = '';
        detail.meta.forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            metaEl.appendChild(span);
        });
        highlightsEl.innerHTML = '';
        detail.highlights.forEach((item) => {
            const li = document.createElement('li');
            li.innerText = item;
            highlightsEl.appendChild(li);
        });
        stackEl.innerHTML = '';
        detail.stack.forEach((item) => {
            const span = document.createElement('span');
            span.innerText = item;
            stackEl.appendChild(span);
        });

        if (detail.link) {
            linkEl.href = detail.link;
            linkEl.innerText = detail.linkText || 'Open link';
            linkEl.style.display = 'inline-flex';
        } else {
            linkEl.style.display = 'none';
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.querySelector('.project-modal-close').focus();
    };
```

(The `kickerEl.innerText` line keeps the exact same `" · "`-joined display text as before — only its source changed, from a hand-typed string to `detail.meta.join(' · ')`.)

- [ ] **Step 3: Rebuild and re-run the Task 2 interactive check**

```bash
hexo clean && hexo generate 2>&1 | tail -10
```

Then repeat Task 2 Step 7's modal check (open "Soccer Match Analysis", confirm title/highlights/link/kicker text all correct, close it) using the Browser tool. This is the only behavioral test for this task — confirm it passes before committing.

- [ ] **Step 4: Commit**

```bash
git add themes/Chic/source/js/script.js
git commit -m "refactor(projects): read modal data from embedded card JSON, drop duplicated JS object"
```

---

### Task 4: CSS for real cover images and the generic fallback

**Files:**
- Modify: `themes/Chic/source/css/custom.styl`

**Interfaces:**
- Consumes: `.showcase-media img` and `.showcase-media .media-fallback` markup produced by Task 2's `project-media.ejs`
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add the rules**

In `themes/Chic/source/css/custom.styl`, immediately after the existing `.showcase-media` rule block (the one starting at the line with `.showcase-media` and ending after its nested `&:before` block — currently around line 723-736), add:

```stylus
.showcase-media img
  position relative
  width 100%
  height 100%
  min-height 190px
  object-fit cover
  display block

.showcase-media .media-fallback
  position relative
  width 100%
  height 100%
  min-height 190px
  display flex
  align-items center
  justify-content center
  font-size 2.6rem
  font-weight 800
  letter-spacing 0.04em
  color #fff
  background linear-gradient(135deg, var(--project-accent), var(--project-purple))
```

`var(--project-accent)` and `var(--project-purple)` are already defined on `.projects-page` (lines 456-458) and are in scope here since `.showcase-media` is always a descendant of `.projects-page`.

- [ ] **Step 2: Verify with the Browser tool**

Rebuild, open `/projects/`, and use `javascript_tool` to temporarily confirm the fallback renders correctly without a real project (since none of the 10 current projects trigger it): 

```js
document.querySelector('.showcase-card .showcase-media').outerHTML = '<div class="showcase-media"><div class="media-fallback">XY</div></div>'
```

Screenshot the result — confirm the fallback shows a centered "XY" on a gradient background filling the media box, no layout shift vs. other cards. This is a debug-only DOM edit to visually verify the CSS; do not commit anything based on it, and reload the page afterward to discard the change.

Also confirm no visual regression on the 10 real cards (screenshot `/projects/` and compare against the Task 2 Step 7 screenshots — illustrations should be pixel-identical, since none of them use `<img>` or `.media-fallback`).

- [ ] **Step 3: Commit**

```bash
git add themes/Chic/source/css/custom.styl
git commit -m "style(projects): add cover-image and generic-fallback styles"
```

---

## Final verification (after all 4 tasks)

- [ ] **Full rebuild and end-to-end check**

```bash
hexo clean && hexo generate 2>&1 | tail -10
```

Then, with the Browser tool: load `/projects/`, confirm all 10 cards render with their original illustrations, run the filter check and modal check from Task 2 Step 7 once more against the fully-merged state, and confirm `git status` shows a clean tree:

```bash
git status
git log --oneline -4
```

Expected: working tree clean, 4 commits from this plan present (cover/fallback CSS, JS simplification, template layer, data file — newest first).

## Explicitly out of scope (do not do these as part of this plan)

- Sourcing or adding real cover photos for any of the 10 projects — the `cover` field exists and is documented, but stays empty; the user fills it in later.
- Changing which categories a project filters under, or making the "Application" filter more selective.
- Any change to modal open/close animation, keyboard handling, or the reveal-on-scroll behavior beyond what Task 3 requires to read the new data source.
- Editing highlight/summary/stack wording beyond the card/modal consolidation documented in Task 1 and the Global Constraints.
