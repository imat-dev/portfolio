# Upgrade to Next.js 16 and Latest Dependencies — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the portfolio from Next.js 13.1 / React 18 to Next.js 16.4 / React 19 and bring every package in `package.json` to its latest release, with the built site rendering the same as before.

**Architecture:** Stay on the **pages router** (the catch-all `pages/[[...slug]].js` + Markdown pipeline is not being redesigned). Upgrade in dependency layers so each task ends with a green build: data libs → framework + React ecosystem → MDX pipeline → Tailwind 4 → lint/format/release tooling. Each task is verified by `npm run build` plus a regression script that compares generated routes, rendered HTML, and compiled CSS against a baseline captured from the pre-upgrade build.

**Tech Stack:** Next.js 16.4 (Turbopack default), React 19.3, next-mdx-remote 6 (MDX 3 / unified 11), Tailwind CSS 4.3, ESLint 10 flat config, Prettier 3.

**Spec:** User request (2026-10-08): "migrate this repo to the latest version of nextjs available and all library used in package.json to be updated in latest version."

## Global Constraints

- Node: local is v22.19.0; Next 16 requires `>=20.9.0`. Vercel deprecates Node 20 on 2026-10-01 → set `"engines": { "node": ">=22" }`.
- Every dependency pinned with a caret at its latest version as of 2026-10-08 (table below).
- Pages router stays. No App Router migration.
- No visual regressions on `/`, `/about`, `/projects`, `/contact` versus the baseline screenshots.
- Content in `content/**/*.md` is authored by the site owner (trusted). JS expressions in MDX must keep working.

### Target versions

| Package | From | To | Notes |
|---|---|---|---|
| next | 13.1.6 | 16.4.0 | Turbopack default; `next lint` and `next export` removed |
| react / react-dom | 18.2 | 19.3.0 | |
| @next/font | 13.1.6 | **removed** | replaced by built-in `next/font` |
| @next/bundle-analyzer | 13.1.6 | 16.4.0 | webpack-only → `next build --webpack` |
| eslint-config-next | 13.1.6 | 16.4.0 | flat config, needs eslint ≥9 |
| eslint | (transitive) | 10.x | now a direct devDependency |
| next-mdx-remote | 4.2.0 | 6.0.0 | `blockJS` defaults to true |
| @mdx-js/react | (transitive) | 3.1.1 | imported by `_app.js`, now declared |
| remark-gfm / remark-squeeze-paragraphs / remark-unwrap-images | 3 / 5 / 3 | 4.0.1 / 6.0.0 / 5.0.0 | unified 11 |
| rehype-slug / rehype-external-links / rehype-prism-plus / rehype-preset-minify | 5 / 2 / 1.5 / 6 | 6.0.0 / 3.0.0 / 2.0.2 / 7.0.1 | |
| rehype-img-size | 1.0.1 | 1.0.1 | already latest |
| next-seo | 5.15 | 7.3.0 | `NextSeo` → `generateNextSeo` (pages); JSON-LD props renamed |
| next-share | 0.19 | 0.27.0 | |
| react-icons | 4.7 | 5.7.0 | |
| react-inlinesvg | 3.0 | 4.5.0 | |
| react-intersection-observer | 9.4 | 11.0.1 | |
| react-lite-youtube-embed | 2.3 | 3.7.0 | |
| react-portal / pure-react-carousel / react-hook-form | 4.2 / 1.30 / 7.42 | 4.3.0 / 1.35.0 / 7.89.0 | |
| clsx | 1.2 | 2.1.1 | |
| js-yaml | 4.1 | 5.4.3 | no default export |
| image-size | 1.0 | 2.0.4 | no file-path input |
| feed | 4.2 | 6.0.0 | ESM |
| sift | 16 | 17.1.3 | |
| fast-glob / gray-matter / fast-deep-equal | 3.2 / 4.0.3 / 3.1.3 | 3.3.3 / 4.0.3 / 3.1.3 | |
| color | 4.2 | 5.0.3 | ESM-only |
| @sendgrid/mail | 7.7 | 8.1.6 | |
| sharp | 0.31 | 0.35.5 | |
| next-sitemap | 3.1 | 4.2.3 | |
| prism-themes | 1.9.0 | 1.9.0 | already latest |
| tailwindcss | 3.2 | 4.3.3 | CSS-first; PostCSS plugin moved |
| @tailwindcss/postcss | — | 4.3.3 | new |
| @tailwindcss/typography / forms | 0.5.9 / 0.5.3 | 0.5.20 / 0.5.11 | loaded via `@plugin` |
| tailwind-scrollbar | 2.1 | 4.0.2 | Tailwind 4 only |
| @tailwindcss/aspect-ratio | 0.4.2 | **removed** | no Tailwind 4 support; native `aspect-video` replaces its one use |
| autoprefixer | 10.4 | **removed** | Tailwind 4 prefixes via Lightning CSS |
| postcss | 8.4 | 8.5.29 | |
| prettier / prettier-plugin-tailwindcss | 2.8 / 0.2 | 3.9.9 / 0.8.1 | |
| eslint-config-prettier / eslint-plugin-prettier | 8.6 / 4.2 | 10.1.8 / 5.5.6 | |
| @svgr/webpack | 6.5 | 8.1.0 | Turbopack loader rule |
| @semantic-release/changelog / git / npm | 6 / 10 / 9 | 7.0.0 / 11.0.1 / 13.2.0 | |
| next-remote-watch | 2.0.0 | 2.0.0 | already latest; verify it still runs |

## Review Focus

1. **MDX JS expressions silently stripped.** next-mdx-remote 6 removes `{...}` expressions by default, so `<Sep size={12} />` would lose its spacing and the resume button's `onClick` would vanish with no error. Expect identical spacing and a working button → Task 3 checks `my-6 md:my-12` in home HTML.
2. **SEO tags vanish.** next-seo 7 no longer exports `NextSeo` for pages router; a wrong import renders nothing. Expect `<title>`, description, and `og:*` tags on every page → regression script checks home; Task 2 adds the check.
3. **Theme colors with opacity.** Tailwind 4 must still resolve `bg-omega-800/90` from the custom `rgb(var(--color-…) / <alpha-value>)` plugin. Expect translucent menu/backgrounds unchanged → CSS check + screenshot compare in Task 4.
4. **Utility renames in Tailwind 4.** `shadow`, `rounded`, `ring`, `outline-none`, `bg-opacity-*`, `flex-shrink-*` changed meaning. Expect the same look → run the official `@tailwindcss/upgrade` codemod in Task 4, then screenshot compare.
5. **Image dimension resolver.** image-size 2 rejects paths; a silent `catch` would leave images without width/height and break `next/image`. Expect hero images to render with dimensions → Task 1 checks `imat.jpeg` has width/height in built props.

## Known pre-existing bugs (out of scope, report only)

- `/projects/*` and `/blog/*` detail pages throw a client-side exception on the **current** production build: `content/projects/*.md` reference `/projects/project-1..4.png`, which do not exist, the image resolver returns `null`, and the gallery reads `null.src`.
- `generateCollectionRss` in `lib/mdx.js` does not await `mkdir`/`writeFile`, so `public/feed/projects/feed.xml` is never written.

## Verification tooling (not committed)

- Baseline captured from the pre-upgrade build into the session scratchpad: `baseline/routes.txt` (58 HTML routes), `baseline/html/`, `baseline/site.css`, and full-page screenshots `base-{home,about,projects,contact}.png` at 1280×900.
- `verify-build.mjs` (scratchpad) — run from repo root after a build: `node <scratchpad>/verify-build.mjs <scratchpad>/baseline`. It asserts every baseline route is generated, key HTML content/SEO/JSON-LD/MDX output is present, and the compiled CSS contains the theme variables and custom utilities. It passes on the baseline build (RSS check is a warning because of the pre-existing bug).

## File Map

| File | Change |
|---|---|
| `package.json`, `package-lock.json` | versions, scripts, engines |
| `lib/mdx-parser.js` | js-yaml named import; `blockJS: false` |
| `lib/computed-fields/images.js` | image-size 2 buffer API |
| `next.config.js` | drop `eslint` key; Turbopack SVGR rule; `images.qualities` |
| `styles/fonts.js` | `next/font/google` |
| `components/Image.jsx` | `onLoadingComplete` → `onLoad` |
| `components/MDXButton.jsx` | drop `legacyBehavior`/`passHref` |
| `components/Seo.jsx` | `generateNextSeo` inside `next/head` |
| `layouts/Post.jsx` | ArticleJsonLd v7 props |
| `components/ImageGallery.jsx` | `aspect-w-16 aspect-h-9` → `aspect-video` |
| `postcss.config.js` | `@tailwindcss/postcss` |
| `styles/globals.css`, `styles/prism.css` | Tailwind 4 directives (`@import`, `@config`, `@utility`) |
| `tailwind.config.js` | remove aspect-ratio plugin + `corePlugins`; plugins via CSS |
| `utils/tailwindcss-plugin-theme.js` | `color` ESM interop |
| `components/**`, `layouts/**` | class renames from the Tailwind codemod |
| `eslint.config.mjs` (new), `.eslintrc.js` / `.eslintignore` (deleted) | ESLint flat config |
| `prettier.config.js` | Prettier 3 plugin by name + `tailwindStylesheet` |
| `CLAUDE.md`, `README.md` | updated commands/versions |

---

### Task 1: Server-side data libraries

**Files:** Modify `package.json`, `lib/mdx-parser.js:1`, `lib/computed-fields/images.js`

**Interfaces:** Produces unchanged `Parser` and `image`/`images` resolvers (same inputs/outputs).

- [ ] **Step 1: Install**

```bash
npm i js-yaml@^5.4.3 image-size@^2.0.4 feed@^6.0.0 sift@^17.1.3 fast-glob@^3.3.3 gray-matter@^4.0.3 fast-deep-equal@^3.1.3 @sendgrid/mail@^8.1.6 clsx@^2.1.1 next-sitemap@^4.2.3 sharp@^0.35.5
```

- [ ] **Step 2: Run build to see it fail** — `npm run build` → expected failure/warning: `js-yaml` has no default export.

- [ ] **Step 3: Fix js-yaml import** in `lib/mdx-parser.js`

```js
import { load as loadYaml } from 'js-yaml'
// ...
section.data = loadYaml(section.data)
```

- [ ] **Step 4: Fix image-size** in `lib/computed-fields/images.js`

```js
import fs from 'fs'
import { join } from 'path'
import { imageSize } from 'image-size'
// ...
  try {
    const { width, height } = imageSize(fs.readFileSync(filePath))
```

- [ ] **Step 5: Verify** — `npm run build && node <scratchpad>/verify-build.mjs <scratchpad>/baseline` → ALL PASSED. Also `grep -o '"src":"/imat.jpeg","alt":"my photo","width":[0-9]*,"height":[0-9]*' .next/server/pages/index.json` prints a match.

- [ ] **Step 6: Commit** — `chore(deps): upgrade server-side data libraries`

### Task 2: Next.js 16 + React 19 + React ecosystem

**Files:** `package.json`, `next.config.js`, `styles/fonts.js`, `components/Image.jsx`, `components/MDXButton.jsx`, `components/Seo.jsx`, `layouts/Post.jsx`

- [ ] **Step 1: Install** (MDX packages move here too because next-mdx-remote 4 does not accept React 19; their code changes are Task 3)

```bash
npm uninstall @next/font
npm i next@^16.4.0 react@^19.3.0 react-dom@^19.3.0 next-seo@^7.3.0 next-share@^0.27.0 react-icons@^5.7.0 react-inlinesvg@^4.5.0 react-intersection-observer@^11.0.1 react-lite-youtube-embed@^3.7.0 react-portal@^4.3.0 pure-react-carousel@^1.35.0 react-hook-form@^7.89.0 next-mdx-remote@^6.0.0 @mdx-js/react@^3.1.1
npm i -D @next/bundle-analyzer@^16.4.0 @svgr/webpack@^8.1.0
```

- [ ] **Step 2: `package.json`**: `"engines": { "node": ">=22" }`; scripts: remove `"export"` (command removed in Next 14); add `"analyze": "ANALYZE=true next build --webpack"`.

- [ ] **Step 3: `next.config.js`**

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const svgr = { loaders: ['@svgr/webpack'], as: '*.js' }

module.exports = withBundleAnalyzer({
  images: {
    deviceSizes: [428, 540, 640, 768, 1024, 1120],
    // Next 16 only allows quality 75 by default; components/Image.jsx uses 90
    qualities: [75, 90],
  },
  turbopack: {
    rules: { '*.svg': svgr },
  },
  // Kept for `next build --webpack` (bundle analyzer)
  webpack(config) {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] })
    return config
  },
})
```

- [ ] **Step 4: `styles/fonts.js`** — `import { Inter } from 'next/font/google'`.

- [ ] **Step 5: `components/Image.jsx`** — rename handler prop: `onLoad={onLoadingComplete}` (deprecated `onLoadingComplete` removed from docs; `onLoad` fires after the image loads).

- [ ] **Step 6: `components/MDXButton.jsx`** — remove `passHref legacyBehavior` and render the button content as the Link's child with the classes on `Link` (read file; keep markup identical).

- [ ] **Step 7: `components/Seo.jsx`**

```js
import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'
// ...
  return <Head>{generateNextSeo({ ...metaData, openGraph })}</Head>
```

- [ ] **Step 8: `layouts/Post.jsx`** ArticleJsonLd v7

```js
      <ArticleJsonLd
        type="BlogPosting"
        url={pageUrl}
        headline={title}
        image={images.map((img) => siteUrl + img.src)}
        datePublished={date}
        author={authorName}
        description={seo?.description || description}
      />
```

- [ ] **Step 9: Verify** — `npm run build && node verify-build.mjs baseline`. Expect only the MDX-expression check to possibly fail (fixed in Task 3). SEO title/description/og checks must pass.

- [ ] **Step 10: Commit** — `chore(deps): upgrade to Next.js 16 and React 19`

### Task 3: MDX pipeline (next-mdx-remote 6, unified 11 plugins)

**Files:** `package.json`, `lib/mdx-parser.js`, content files only if MDX 3 parse errors appear

- [ ] **Step 1: Install**

```bash
npm i remark-gfm@^4.0.1 remark-squeeze-paragraphs@^6.0.0 remark-unwrap-images@^5.0.0 rehype-slug@^6.0.0 rehype-external-links@^3.0.0 rehype-prism-plus@^2.0.2 rehype-preset-minify@^7.0.1 rehype-img-size@^1.0.1 prism-themes@^1.9.0
```

- [ ] **Step 2: Run verify to see the failure** — expected FAIL: `MDX JS expression props survive (<Sep size={12} />)`.

- [ ] **Step 3: Allow expressions for trusted content** in both `serialize` calls in `lib/mdx-parser.js`:

```js
// Content is authored in this repo (trusted). blockDangerousJS stays on.
const serializeOptions = { blockJS: false }
await serialize(content, { ...serializeOptions, mdxOptions: this.mdxOptions.options })
await serialize(content, { ...serializeOptions, scope: { path: '/blog' }, mdxOptions: this.mdxOptions.options, parseFrontmatter: false })
```

- [ ] **Step 4: Fix any MDX 3 parse errors** reported by the build (HTML comments → `{/* */}`, bare `<` / `{` escaped) in the named content files.

- [ ] **Step 5: Verify** — build + verify script → ALL PASSED. Start `next start` and click "Download Resume" on `/`: browser navigates to `/resume.pdf`.

- [ ] **Step 6: Commit** — `chore(deps): upgrade MDX pipeline to next-mdx-remote 6`

### Task 4: Tailwind CSS 4

**Files:** `package.json`, `postcss.config.js`, `tailwind.config.js`, `styles/globals.css`, `styles/prism.css`, `utils/tailwindcss-plugin-theme.js`, `components/ImageGallery.jsx`, class renames across `components/`, `layouts/`

- [ ] **Step 1:** Replace the one aspect-ratio plugin usage: `components/ImageGallery.jsx` `wrapperClassName="aspect-w-16 aspect-h-9"` → `"aspect-video"`. Remove `require('@tailwindcss/aspect-ratio')` and `corePlugins` from `tailwind.config.js`. `npm uninstall @tailwindcss/aspect-ratio`.
- [ ] **Step 2:** `color` interop in `utils/tailwindcss-plugin-theme.js`: `const Color = require('color').default ?? require('color')`; `npm i color@^5.0.3`.
- [ ] **Step 3:** Commit the prep, then run the official codemod on a clean tree: `npx @tailwindcss/upgrade@latest --force`. It converts `@tailwind` directives to `@import 'tailwindcss'`, keeps the JS config via `@config`, rewrites `@layer utilities` blocks to `@utility`, swaps the PostCSS plugin, and renames changed utilities in templates.
- [ ] **Step 4:** Ensure final versions: `npm i -D tailwindcss@^4.3.3 @tailwindcss/postcss@^4.3.3 @tailwindcss/typography@^0.5.20 @tailwindcss/forms@^0.5.11 tailwind-scrollbar@^4.0.2 postcss@^8.5.29` and `npm uninstall autoprefixer`. `postcss.config.js` must be `{ plugins: { '@tailwindcss/postcss': {} } }`.
- [ ] **Step 5:** Review the codemod diff by hand (`git diff`), especially `globals.css`, `prism.css` (`@apply` in a separate file needs `@reference`), and the plugin options for `@tailwindcss/forms` (`strategy: 'base'`).
- [ ] **Step 6: Verify** — build + verify script → ALL PASSED. Screenshot `/`, `/about`, `/projects`, `/contact` at 1280×900 (scroll first to trigger reveal animations) and compare side by side with the baseline images. Any visible difference is fixed before committing.
- [ ] **Step 7: Commit** — `chore(deps): upgrade to Tailwind CSS 4`

### Task 5: Lint, format, release and dev tooling

**Files:** `package.json`, `eslint.config.mjs` (new), delete `.eslintrc.js` and `.eslintignore`, `prettier.config.js`, `.prettierignore`

- [ ] **Step 1: Install** — `npm i -D eslint@^10 eslint-config-next@^16.4.0 eslint-config-prettier@^10.1.8 eslint-plugin-prettier@^5.5.6 prettier@^3.9.9 prettier-plugin-tailwindcss@^0.8.1 @semantic-release/changelog@^7.0.0 @semantic-release/git@^11.0.1 @semantic-release/npm@^13.2.0 next-remote-watch@^2.0.0`
- [ ] **Step 2: `eslint.config.mjs`** — flat config composing `eslint-config-next/core-web-vitals`, `eslint-plugin-prettier/recommended`, the old rule overrides, and the old ignores (`node_modules`, `public`, `.next`, `.cache`, `.vscode`, lock files, `docs`).
- [ ] **Step 3:** `"lint": "eslint ."` (`next lint` is removed in Next 16).
- [ ] **Step 4: `prettier.config.js`** — `plugins: ['prettier-plugin-tailwindcss']`, `tailwindStylesheet: './styles/globals.css'`.
- [ ] **Step 5: Dev server** — run `npm run dev`, load `/`, edit `content/index.md`, confirm reload. If next-remote-watch fails on Next 16, change `dev` to `next dev` (getStaticProps re-runs per request in dev, so content edits still show on refresh) and note it.
- [ ] **Step 6: Verify** — `npm run lint` exits 0 (warnings acceptable, listed in summary); `npx prettier --check .` reports nothing new beyond formatting the plugin changes.
- [ ] **Step 7: Commit** — `chore(deps): upgrade lint, format and release tooling`

### Task 6: Final verification and docs

- [ ] `rm -rf .next node_modules && npm ci && npm run build && node verify-build.mjs baseline` → ALL PASSED.
- [ ] `npm audit --omit=dev` summary recorded.
- [ ] Smoke-test API: `curl -s -XPOST localhost:3000/api/contact-form -H 'content-type: application/json' -d '{}'` → 400 with "Missing email address" JSON.
- [ ] Update `CLAUDE.md` (Next 16, Tailwind 4, eslint/analyze commands) and `README.md` local dev steps.
- [ ] Whole-branch review by a fresh reviewer.
- [ ] Commit — `docs: update for Next.js 16 upgrade`
