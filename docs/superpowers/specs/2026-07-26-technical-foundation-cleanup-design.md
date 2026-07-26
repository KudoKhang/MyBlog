# Technical Foundation Cleanup — Design

Date: 2026-07-26
Status: Approved

## Context

The blog (Hexo + custom "Chic" theme, deployed to GitHub Pages) has good content but several technical gaps identified in a source audit:

- An 11MB unused font (`lanting`) is shipped in the theme, bloating every page load.
- Site-wide SEO metadata (`description`, `subtitle`, `keywords`) is empty, and there are no Open Graph / Twitter Card tags, so shared links show no preview.
- `package.json`/`package-lock.json`/`_config.yml` have an uncommitted Hexo 6.2.0 → 8.1.2 upgrade and a deploy-remote change, unverified against a real build.
- There is no sitemap, `robots.txt`, or RSS feed, hurting discoverability and preventing readers from subscribing.

The user's stated philosophy: keep Hexo for simplicity, content is the primary value, but the technical/visual details should still be polished. This spec covers the technical-foundation subset (previously scoped as items "Cao" + "Trung bình" from the audit) — it does not cover typography/reading-experience redesign or comments/analytics, which are separate future sub-projects.

## Goals

1. Remove the unused `lanting` font.
2. Add site-wide SEO metadata and Open Graph / Twitter Card tags, with a per-post override.
3. Verify the pending Hexo 8.1.2 upgrade builds cleanly, then commit it.
4. Add sitemap, `robots.txt`, and RSS feed generation.

## Non-goals

- Visual/typography redesign (separate sub-project).
- Comments, analytics, CI/CD deploy automation (separate sub-projects).
- Replacing the placeholder OG banner with a final image — the user will supply this later.

## Design

### 1. Remove unused `lanting` font

Delete `themes/Chic/source/fonts/lanting/` (~11MB). Confirmed via grep that no `.styl`/`.ejs` file references `lanting` in any `@font-face` or `font-family` declaration, so removal has no visual effect. Verify with a clean `hexo generate` that no build step or CSS reference breaks.

### 2. SEO metadata + Open Graph / Twitter Card

- `_config.yml`: set `subtitle`, `description`, and `keywords` (content approved by the user).
- Add a placeholder banner image at `source/images/og-banner.jpg` — a temporary copy of the existing `avatar.jpeg`, clearly to be replaced later by the user with a real banner.
- Add `theme.og_image` (default `/images/og-banner.jpg`) to `themes/Chic/_config.yml` so the theme has one place to configure the fallback social image.
- Edit `themes/Chic/layout/_partial/head.ejs` to add, alongside the existing `<meta name="description">` etc.:
  - `og:type` (`website` for non-post pages, `article` for post pages)
  - `og:title`, `og:description`, `og:url`, `og:site_name`
  - `og:image` — resolves to `page.cover` (new optional post front-matter field) if present, else `theme.og_image`
  - `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- Document the new `cover:` front-matter field in `docs/WRITING_POSTS.md` so future posts can opt into a custom social image.

### 3. Verify and commit the Hexo 8.1.2 upgrade

- Run `hexo clean && hexo generate`, confirm no errors/warnings introduced by the version bump.
- Spot-check with `hexo server`: homepage, one post, `/archives`, `/about`, `/projects`.
- Commit in logical groups rather than one giant commit: e.g. `chore: upgrade hexo to 8.1.2`, then separate commits for the font removal, SEO/OG work, and sitemap/feed work (see Testing/Rollout below).

### 4. Sitemap, robots.txt, RSS feed

- `npm install hexo-generator-sitemap hexo-generator-feed --save`.
- `_config.yml` additions:
  ```yaml
  sitemap:
    path: sitemap.xml
  feed:
    type: atom
    path: atom.xml
    limit: 20
  ```
- Create `source/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: http://kudokhang.github.io/sitemap.xml
  ```
- Add `<link rel="alternate" type="application/atom+xml" title="..." href="...">` to `head.ejs` so feed readers/browsers auto-discover the feed.

## Testing / Verification

- `hexo clean && hexo generate` must complete with no errors after each change.
- `hexo server` manual check of homepage, a post page (verify OG tags via view-source), `/archives`, `/about`, `/projects`, `/sitemap.xml`, `/atom.xml`, `/robots.txt`.
- Confirm `themes/Chic/source/fonts/lanting` is gone from the built `public/` output and total `public/` size drops accordingly.
- No formal automated test suite exists for this project (per `AGENTS.md`); verification is build + manual preview, consistent with existing project convention.

## Rollout

Land as a small sequence of focused commits (font removal, Hexo upgrade, SEO/OG, sitemap/feed) rather than one large commit, so each is independently revertible. No deploy is triggered automatically — `hexo deploy` remains a manual, separate step the user runs when ready.
