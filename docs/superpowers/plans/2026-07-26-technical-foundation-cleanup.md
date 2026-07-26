# Technical Foundation Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the unused 11MB `lanting` font, verify and commit the pending Hexo 8.1.2 upgrade, add site-wide SEO/Open Graph/Twitter Card metadata, and add sitemap/robots.txt/RSS feed generation to the Hexo blog.

**Architecture:** This is a static-site (Hexo) config/theme change set — no application code or test framework exists. Every task's "test" is: make the change, run `hexo clean && hexo generate` (and `hexo server` where relevant), and assert on the generated output in `public/` (file presence, grep for expected HTML). This matches the project's existing verification convention documented in `AGENTS.md`.

**Tech Stack:** Hexo 8.1.2, EJS templates (`themes/Chic/layout/`), Stylus, YAML config (`_config.yml`, `themes/Chic/_config.yml`), npm.

## Global Constraints

- Site URL is `http://kudokhang.github.io` (no trailing slash, `http` not `https`) — use this exact value everywhere a full URL is needed; do not silently change the protocol.
- No automated test suite exists (per `AGENTS.md`) — verification is `hexo clean && hexo generate` plus manual/curl checks against generated output, not unit tests.
- Follow existing theme conventions: use `url_for()` / `full_url_for()` Hexo helpers for all asset/page URLs (already used for `theme.favicon` in `head.ejs`), not hand-built string concatenation.
- Commit in the 4 groups below — one commit per task — so each is independently revertible.
- Approved SEO copy (from spec): description/subtitle text is `"AI Engineer viết về AI, kỹ thuật và những bài học nghề nghiệp"`.
- The Open Graph banner is an explicit placeholder (copy of `avatar.jpeg`) — do not attempt to design a "real" banner image; the user will replace it later.

---

### Task 1: Remove unused `lanting` font

**Files:**
- Delete: `themes/Chic/source/fonts/lanting/` (directory, ~11MB: `lanting.TTF`, `lanting.woff2`, `lanting.otf`, `lanting.eot`, `lanting.woff`)

**Interfaces:**
- Consumes: nothing
- Produces: nothing (pure deletion, no other task depends on this directory existing)

- [ ] **Step 1: Confirm the font is genuinely unreferenced**

```bash
grep -rn "lanting" themes/Chic/source/css/ themes/Chic/layout/ themes/Chic/_config.yml
```

Expected: no output (already verified during spec research — this is a final safety check before deleting).

- [ ] **Step 2: Record the current `public/` size for comparison**

```bash
hexo clean && hexo generate
du -sh public
```

Expected: completes with `INFO  Generated: N files` and no errors. Note the printed size (should be around 12M).

- [ ] **Step 3: Delete the font directory**

```bash
rm -rf themes/Chic/source/fonts/lanting
```

- [ ] **Step 4: Rebuild and verify the font is gone from the output**

```bash
hexo clean && hexo generate
test ! -d public/fonts/lanting && echo "PASS: lanting removed from public/"
du -sh public
```

Expected: `PASS: lanting removed from public/` printed, and the `public/` size is roughly 11MB smaller than the Step 2 measurement.

- [ ] **Step 5: Commit**

```bash
git add themes/Chic/source/fonts
git commit -m "chore: remove unused lanting font (-11MB)"
```

---

### Task 2: Verify and commit the pending Hexo 8.1.2 upgrade

**Files:**
- Modify (already pending in working tree, no new edits needed): `package.json`, `package-lock.json`, `_config.yml`

**Interfaces:**
- Consumes: nothing
- Produces: a working Hexo 8.1.2 install that Task 3 and Task 4 build on top of

- [ ] **Step 1: Confirm the pending diff is exactly the expected upgrade**

```bash
git diff package.json _config.yml
```

Expected: `package.json` shows `hexo` bumped from `^6.2.0` to `^8.1.2` and `hexo-renderer-marked` from `^5.0.0` to `^7.0.1`; `_config.yml` shows the `deploy.repo` line changed from the HTTPS URL to `git@github-personal:KudoKhang/kudokhang.github.io.git`. If the diff shows anything else, stop and investigate before proceeding.

- [ ] **Step 2: Sync `node_modules` with the pending lockfile**

```bash
npm install
npx hexo version
```

Expected: no errors, and output includes `hexo: 8.1.2`.

- [ ] **Step 3: Full clean build**

```bash
hexo clean && hexo generate
```

Expected: `INFO  Generated: N files` with no `ERROR` or `WARN` lines about broken renderers/plugins.

- [ ] **Step 4: Smoke-test key pages with a local server**

```bash
npx hexo server &
SERVER_PID=$!
sleep 2
curl -sf http://localhost:4000/ > /dev/null && echo "PASS: homepage"
curl -sf http://localhost:4000/archives/ > /dev/null && echo "PASS: archives"
curl -sf http://localhost:4000/about/ > /dev/null && echo "PASS: about"
curl -sf http://localhost:4000/projects/ > /dev/null && echo "PASS: projects"
curl -sf "http://localhost:4000/$(ls source/_posts/*.md | head -1 | xargs -I{} basename {} .md | tr ' ' '-')/" > /dev/null && echo "post check done (may 404 if slug differs, verify manually if so)"
kill $SERVER_PID
```

Expected: `PASS: homepage`, `PASS: archives`, `PASS: about`, `PASS: projects` all printed. If any curl fails, run `npx hexo server` in the foreground and inspect the failing page manually in a browser before continuing.

- [ ] **Step 5: Commit the pending upgrade**

```bash
git add package.json package-lock.json _config.yml
git commit -m "chore: upgrade hexo to 8.1.2"
```

---

### Task 3: SEO metadata + Open Graph / Twitter Card tags

**Files:**
- Modify: `_config.yml:7-9` (site `subtitle`, `description`, `keywords`)
- Create: `source/images/og-banner.jpg` (placeholder, copied from existing avatar)
- Modify: `themes/Chic/_config.yml` (add `og_image` setting)
- Modify: `themes/Chic/layout/_partial/head.ejs` (add OG/Twitter meta tags)
- Modify: `docs/WRITING_POSTS.md` (document the optional `cover:` front-matter field)

**Interfaces:**
- Consumes: `theme.favicon` pattern already in `head.ejs` (uses `url_for()`) as the precedent for how theme-level asset paths are resolved
- Produces: `theme.og_image` (string, root-relative path, e.g. `/images/og-banner.jpg`) — read by `head.ejs`; `page.cover` (optional post front-matter string) — read by `head.ejs` to override the default OG image per-post

- [ ] **Step 1: Edit root `_config.yml` site metadata**

Current (`_config.yml:5-9`):
```yaml
title: Khang's blogs
subtitle: ''
description: ''
keywords:
author: Kudo Khang
```

Replace with:
```yaml
title: Khang's blogs
subtitle: 'AI Engineer viết về AI, kỹ thuật và những bài học nghề nghiệp'
description: 'AI Engineer viết về AI, kỹ thuật và những bài học nghề nghiệp'
keywords: AI, Technical, Learning, Career, Productivity, Kudo Khang, Blog cá nhân
author: Kudo Khang
```

- [ ] **Step 2: Create the placeholder OG banner**

```bash
mkdir -p source/images
cp themes/Chic/source/image/avatar.jpeg source/images/og-banner.jpg
```

- [ ] **Step 3: Add `og_image` to the theme config**

In `themes/Chic/_config.yml`, find:
```yaml
# favicon
favicon: /favicon.ico
```

Replace with:
```yaml
# favicon
favicon: /favicon.ico

# Open Graph / social preview
## Default image used when a post doesn't set its own `cover:` front-matter field.
## PLACEHOLDER — replace source/images/og-banner.jpg with a real banner when ready.
og_image: /images/og-banner.jpg
```

- [ ] **Step 4: Add Open Graph and Twitter Card tags to `head.ejs`**

In `themes/Chic/layout/_partial/head.ejs`, find the closing of the existing title-computation block and the `<title>` line:
```ejs
<title><% if (title){ %><%= title %> | <% } %><%= config.title %></title>
```

Insert immediately after it:
```ejs

<%
var ogType = is_post() ? 'article' : 'website';
var ogTitle = title ? (title + ' | ' + config.title) : config.title;
var ogDescription = config.description || '';
var ogImage = full_url_for(theme.og_image);
if (is_post() && page.cover) {
    ogImage = full_url_for(page.cover);
}
var ogUrl = full_url_for(page.path);
%>
<meta property="og:type" content="<%= ogType %>">
<meta property="og:site_name" content="<%= config.title %>">
<meta property="og:title" content="<%= ogTitle %>">
<% if (ogDescription) { %>
<meta property="og:description" content="<%= ogDescription %>">
<% } %>
<meta property="og:url" content="<%- ogUrl %>">
<meta property="og:image" content="<%- ogImage %>">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<%= ogTitle %>">
<% if (ogDescription) { %>
<meta name="twitter:description" content="<%= ogDescription %>">
<% } %>
<meta name="twitter:image" content="<%- ogImage %>">
```

- [ ] **Step 5: Document the `cover:` front-matter field**

In `docs/WRITING_POSTS.md`, find section `## 3. Chèn ảnh` and insert a new section immediately after it (before `## 4. Xem trước (Preview)`):

```markdown
## 4. Ảnh cover cho bài viết (tuỳ chọn)

Nếu muốn bài viết có ảnh riêng khi share lên Facebook/Zalo/Slack (thay vì dùng ảnh mặc định của site), thêm field `cover` vào front-matter:

```yaml
---
title: Hướng dẫn học ReactJS cơ bản
date: 2023-10-27 10:00:00
tags: [ReactJS, JavaScript, Frontend]
categories: Programming
cover: /images/reactjs-cover.jpg
---
```

Ảnh cover nên đặt trong `source/images/` giống ảnh chèn trong bài viết.
```

Then renumber the old `## 4. Xem trước (Preview)` heading to `## 5. Xem trước (Preview)`.

- [ ] **Step 6: Build and verify the tags are present**

```bash
hexo clean && hexo generate
grep -o '<meta property="og:title"[^>]*>' public/index.html
grep -o '<meta property="og:image"[^>]*>' public/index.html
grep -o '<meta name="twitter:card"[^>]*>' public/index.html
```

Expected: all three `grep` commands print a matching `<meta ...>` line (non-empty output). The `og:image` line should contain `http://kudokhang.github.io/images/og-banner.jpg`.

- [ ] **Step 7: Verify a post page too**

```bash
POST_HTML=$(find public -path "*2026/06/15*" -name index.html | head -1)
grep -o '<meta property="og:type"[^>]*>' "$POST_HTML"
```

Expected: prints `<meta property="og:type" content="article">`.

- [ ] **Step 8: Commit**

```bash
git add _config.yml themes/Chic/_config.yml themes/Chic/layout/_partial/head.ejs source/images/og-banner.jpg docs/WRITING_POSTS.md
git commit -m "feat: add SEO metadata and Open Graph/Twitter Card tags"
```

---

### Task 4: Sitemap, robots.txt, and RSS feed

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)
- Modify: `_config.yml` (add `sitemap:` and `feed:` config blocks)
- Create: `source/robots.txt`
- Modify: `themes/Chic/layout/_partial/head.ejs` (add feed autodiscovery `<link>`)

**Interfaces:**
- Consumes: `config.url` (`http://kudokhang.github.io`, already set in `_config.yml`)
- Produces: `public/sitemap.xml`, `public/atom.xml`, `public/robots.txt` in the generated site — no other task depends on these

- [ ] **Step 1: Install the plugins**

```bash
npm install hexo-generator-sitemap hexo-generator-feed --save
```

Expected: `package.json` now lists both under `dependencies`.

- [ ] **Step 2: Add sitemap and feed config**

In `_config.yml`, find:
```yaml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: git@github-personal:KudoKhang/kudokhang.github.io.git
```

Replace with:
```yaml
# Sitemap
## Docs: https://github.com/hexojs/hexo-generator-sitemap
sitemap:
  path: sitemap.xml

# RSS Feed
## Docs: https://github.com/hexojs/hexo-generator-feed
feed:
  type: atom
  path: atom.xml
  limit: 20

# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: git@github-personal:KudoKhang/kudokhang.github.io.git
```

- [ ] **Step 3: Create `robots.txt`**

Create `source/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: http://kudokhang.github.io/sitemap.xml
```

- [ ] **Step 4: Add feed autodiscovery link to `head.ejs`**

In `themes/Chic/layout/_partial/head.ejs`, immediately after the `<%# favicon %>` block:
```ejs
<%# favicon %>
<% if (theme.favicon){ %>
    <link rel="icon" href="<%- url_for(theme.favicon) %>">
<% } %>
```

Insert after it:
```ejs

<%# RSS feed autodiscovery %>
<link rel="alternate" type="application/atom+xml" title="<%= config.title %>" href="<%- full_url_for('/atom.xml') %>">
```

- [ ] **Step 5: Build and verify all three outputs**

```bash
hexo clean && hexo generate
test -f public/sitemap.xml && echo "PASS: sitemap.xml generated"
test -f public/atom.xml && echo "PASS: atom.xml generated"
test -f public/robots.txt && echo "PASS: robots.txt generated"
grep "Sitemap: http://kudokhang.github.io/sitemap.xml" public/robots.txt && echo "PASS: robots.txt points to sitemap"
grep -c "<entry>" public/atom.xml
grep -o '<link rel="alternate" type="application/atom+xml"[^>]*>' public/index.html
```

Expected: all four `PASS:` lines print, `grep -c "<entry>"` prints a number equal to the post count (10, or fewer if `feed.limit` truncates — should be 10 since there are only 10 posts), and the last `grep` prints the autodiscovery `<link>` tag.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json _config.yml source/robots.txt themes/Chic/layout/_partial/head.ejs
git commit -m "feat: add sitemap, robots.txt, and RSS feed generation"
```

---

## Final verification (after all 4 tasks)

- [ ] **Full clean rebuild and page-by-page check**

```bash
hexo clean && hexo generate
npx hexo server &
SERVER_PID=$!
sleep 2
curl -sf http://localhost:4000/sitemap.xml > /dev/null && echo "PASS: sitemap.xml served"
curl -sf http://localhost:4000/atom.xml > /dev/null && echo "PASS: atom.xml served"
curl -sf http://localhost:4000/robots.txt > /dev/null && echo "PASS: robots.txt served"
kill $SERVER_PID
git log --oneline -4
```

Expected: three `PASS:` lines, and `git log` shows the 4 commits from this plan in order (sitemap/feed, SEO/OG, hexo upgrade, font removal — newest first).

- [ ] **Confirm nothing is left uncommitted**

```bash
git status
```

Expected: `nothing to commit, working tree clean` (aside from any unrelated pre-existing untracked files like `source/_posts/Hoc-doc-va-viet-trong-thoi-dai-AI.md` noted in the original repo state, which is out of scope for this plan).

## Explicitly out of scope (do not do these as part of this plan)

- Replacing the placeholder OG banner with a final designed image.
- Typography/reading-experience redesign, comments (Giscus), analytics, or CI/CD deploy automation — these are separate future sub-projects per the design spec.
- Running `hexo deploy` — deployment stays a manual, separate step the user triggers themselves.
