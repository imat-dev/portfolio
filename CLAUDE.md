# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # next-remote-watch: dev server that hot-reloads when content/**/*.md changes
npm run build      # next build; postbuild runs next-sitemap
npm run start      # serve the production build
npm run lint       # next lint (dirs: pages, components, lib, layouts, utils)
ANALYZE=true npm run build   # bundle analyzer
```

There is no test suite. Copy `.env.example` to `.env.local` for local secrets (SendGrid, GitHub token, ConvertKit). Deployed on Vercel.

Formatting is Prettier (with `prettier-plugin-tailwindcss` for class ordering), enforced as ESLint warnings.

## Architecture

This is a Next.js 13 **pages-router** site driven entirely by Markdown files in `content/`. It is built on a commercial portfolio/blog template, so some features (blog, services, Home-2/3/4 layouts, newsletter, tip jar) exist but are disabled.

### Routing: one catch-all page

`pages/[[...slug]].js` is the only page route. At build time it:
1. Globs every `content/**/*.md` into a slug (`content/projects/1ateneo.md` → `/projects/1ateneo`, `index.md` → `/`). See `lib/mdx-files.js`.
2. Parses the file with `lib/mdx.js` / `lib/mdx-parser.js` and renders the component named by the frontmatter `layout:` field, looked up in `layouts/index.js`. A new layout must be registered there.
3. Falls back to `content/not-found.md` when no file matches.

`pages/api/` holds the only server code: `contact-form.js` (SendGrid) and `subscribe.js` (ConvertKit).

### Markdown file format: frontmatter + named sections

Content files use gray-matter **sections**. After the main frontmatter and body, blocks like:

```
---main
images: [...]
---
MDX body for this section
```

become a prop named `main` on the layout, with its YAML as fields and its body serialized as MDX in `.content`. A key like `item[0]` becomes an array prop. Each layout expects specific section names, so read the layout before editing its content file.

MDX bodies can use the components mapped in `components/MDX.jsx` (`<Button>`, `<Sep>`, `<Typewriter>`, `<PageTitle>`, `<Youtube>`, etc.). Raw JSX expressions in Markdown are evaluated, so keep them valid.

### Computed fields

`lib/computed-fields/` defines resolvers that run on any frontmatter/section key with a matching name, at build time:
- `collection` takes `{ path, sortBy, filterBy, limit, recordsPerPage, infinitePaging }`, loads the frontmatter of every file under that content path, and filters with `sift` (Mongo-style queries).
- `repositories` fetches GitHub repo data, and returns null without `GITHUB_TOKEN`.
- `tags`, `image(s)`, `icon(s)` resolve tag pages, image dimensions, and icon names.

Collection pages are paginated as `/<collection>/page/<n>`, generated in `getPaths()`.

### Site configuration

`theme.config.js` is the central config: main menu and social links, contact form recipient/sender (inputs come from `content/contact-form.json`), SEO metadata, and `mdxConfig`. `mdxConfig.collections` lists the paths that get RSS feeds written to `public/feed/` and collection-specific MDX handling. Only `/projects` is enabled now. Re-enabling the blog means adding `/blog` there and uncommenting the Articles menu item.

### Styling

Tailwind with a custom theme plugin (`utils/tailwindcss-plugin-theme.js`). Color themes live in `styles/theme.*.js`, and the active one is the `default` export in `styles/themes.js`. Dark mode is class-based. The `@/` import alias maps to the repo root.

### Release

`release.config.js` configures semantic-release on the `master` branch, but this repo works on `main` with PRs from `develop`.
