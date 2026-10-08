# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # next dev (Turbopack). Content edits show on the next request; refresh the browser
npm run build      # next build (Turbopack); postbuild runs next-sitemap
npm run start      # serve the production build
npm run lint       # eslint . (flat config in eslint.config.mjs; `next lint` no longer exists)
npm run analyze    # bundle analyzer; uses `next build --webpack` because the analyzer is webpack-only
```

Requires Node >= 22 (`.npmrc` sets `engine-strict=true`). There is no test suite. Copy `.env.example` to `.env.local` for local secrets (SendGrid, GitHub token, ConvertKit). Deployed on Vercel.

Formatting is Prettier 3 (with `prettier-plugin-tailwindcss`, pointed at `styles/globals.css`), enforced as ESLint warnings. Most source files use CRLF line endings; keep them when editing.

`AGENTS.md` is generated and re-added by `next dev`; leave it committed.

## Architecture

This is a Next.js 16 / React 19 **pages-router** site driven entirely by Markdown files in `content/`. It is built on a commercial portfolio/blog template, so some features (blog, services, Home-2/3/4 layouts, newsletter, tip jar) exist but are disabled.

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

MDX bodies can use the components mapped in `components/MDX.jsx` (`<Button>`, `<Sep>`, `<Typewriter>`, `<PageTitle>`, `<Youtube>`, etc.). Content is compiled by next-mdx-remote 6 (MDX 3) with `blockJS: false` in `lib/mdx-parser.js`, so JSX expressions such as `size={12}` work; without it they are silently stripped. Remark/rehype plugins must target unified 11.

### Computed fields

`lib/computed-fields/` defines resolvers that run on any frontmatter/section key with a matching name, at build time:
- `collection` takes `{ path, sortBy, filterBy, limit, recordsPerPage, infinitePaging }`, loads the frontmatter of every file under that content path, and filters with `sift` (Mongo-style queries).
- `repositories` fetches GitHub repo data, and returns null without `GITHUB_TOKEN`.
- `tags`, `image(s)`, `icon(s)` resolve tag pages, image dimensions, and icon names.

Collection pages are paginated as `/<collection>/page/<n>`, generated in `getPaths()`.

### Site configuration

`theme.config.js` is the central config: main menu and social links, contact form recipient/sender (inputs come from `content/contact-form.json`), SEO metadata, and `mdxConfig`. `mdxConfig.collections` lists the paths that get RSS feeds written to `public/feed/` and collection-specific MDX handling. Only `/projects` is enabled now. Re-enabling the blog means adding `/blog` there and uncommenting the Articles menu item.

### Styling

Tailwind CSS 4 via `@tailwindcss/postcss`. `styles/globals.css` is the entry: it imports `tailwindcss`, then `prism.css`, and loads the legacy JS config with `@config '../tailwind.config.js'` (plugins, typography overrides, animations live there). Custom utilities are `@utility` blocks in `globals.css`. `prism.css` must stay plain CSS: the dev bundler also compiles it outside Tailwind, so `@apply` there errors.

Theme colors come from a custom plugin (`utils/tailwindcss-plugin-theme.js`): each palette in `styles/theme.*.js` becomes `--theme-<color>-<shade>` variables, and utilities like `bg-omega-800/90` read them (Tailwind 4 applies opacity with `color-mix`). The active theme is the `default` export in `styles/themes.js`. Dark mode is class-based. The `@/` import alias maps to the repo root.

### Release

`release.config.js` configures semantic-release on the `master` branch, but this repo works on `main` with PRs from `develop`.
