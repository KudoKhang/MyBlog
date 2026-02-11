# Agentic Coding Guidelines for MyBlog (Hexo)

This repository contains a personal blog built with [Hexo](https://hexo.io/) using the [Chic](https://github.com/Siricee/hexo-theme-Chic) theme.

## 1. Development & Operations

### Build & Deploy Commands
Hexo commands should be run from the root directory.

- **Start Development Server:** `npm run server` (runs `hexo server`)
- **Generate Static Files:** `npm run build` (runs `hexo generate`)
- **Clean Generated Files:** `npm run clean` (runs `hexo clean`)
- **Deploy to Git:** `npm run deploy` (runs `hexo deploy`)
- **Create New Post:** `npx hexo new post "Title"`
- **Create New Page:** `npx hexo new page "PageName"`

### Testing
This project does not have a formal test suite. Verification is done by:
1. Running `hexo clean && hexo generate` to ensure no build errors.
2. Running `hexo server` and inspecting the local preview.

## 2. Code Style & Guidelines

### File Structure
- `source/_posts/`: Markdown files for blog posts.
- `themes/Chic/`: The active theme.
- `themes/Chic/source/css/custom.styl`: Recommended location for custom styling.
- `themes/Chic/source/js/`: Location for custom client-side JavaScript.

### Markdown & Content
- **Front-matter:** All posts must have YAML front-matter (title, date, tags, categories).
- **Images:** 
  - Use GFM `![alt](url)` for standard images.
  - Use Hexo tag `{% img class /path/to/image width height '"alt" "title"' %}` to display a title caption below the image.
- **Math:** Enable MathJax in front-matter with `mathjax: true` if needed. Use `$formula$` for inline and `$$formula$$` for blocks.

### JavaScript (Client-side)
- Use ES6+ syntax where supported by targeted browsers.
- Follow the established `document.ready` pattern in `themes/Chic/source/js/script.js`.
- Prefer `const` and `let` over `var`.
- Use arrow functions for callbacks.

### CSS / Styling (Stylus)
- Use [Stylus](https://stylus-lang.com/) for theme styles.
- Avoid modifying `style.styl` directly; use `custom.styl` for overrides.
- Indentation: 2 spaces.
- Naming: Kebab-case for classes (e.g., `.post-title`).

### HTML / Templates (EJS)
- Use [EJS](https://ejs.co/) for layout files in `themes/Chic/layout/`.
- Maintain consistent indentation (usually 2 spaces).
- Keep logic in EJS templates minimal; prefer Hexo helpers for complex logic.

### Naming Conventions
- **Posts:** Use Kebab-case for filenames: `YYYY-MM-DD-title-in-kebab-case.md`.
- **Variables/Functions:** CamelCase for JavaScript logic.
- **Classes:** Kebab-case for CSS.

### Error Handling
- Use `try...catch` blocks in JavaScript for operations that might fail (e.g., localStorage access).
- In Hexo plugins or scripts, use `hexo.log` for logging errors and information.

## 3. Configuration Management
- Primary configuration is in `_config.yml` (Root) and `themes/Chic/_config.yml` (Theme).
- When modifying configuration, ensure the YAML syntax is valid (strict indentation).

## 4. Cursor & Copilot Instructions
- No specific `.cursorrules` or `.github/copilot-instructions.md` found. 
- Follow general Best Practices for Hexo and EJS development.
