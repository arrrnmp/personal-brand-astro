# Copilot Instructions

## Build, test, and lint commands

- Install dependencies: `pnpm install`
- Use `pnpm` for package tasks (the repo is pinned to pnpm via `packageManager` and `pnpm-lock.yaml`).
- Run local dev server: `pnpm dev`
- Build production site: `pnpm build`
- Preview production build: `pnpm preview`
- Run Astro CLI tasks: `pnpm astro -- <args>`
- Run Astro project checks: `pnpm astro -- check`
- There are currently no dedicated `test` or `lint` scripts in `package.json`, so there is no single-test command configured yet.

## High-level architecture

- This is an Astro 5 static site using file-based routing, content collections, and Tailwind via `@tailwindcss/vite`.
- `astro.config.mjs` enables `@astrojs/mdx` + `@astrojs/sitemap`, hover prefetching, and Google font provisioning via `fontProviders`.
- Blog content lives in `src/content/blog/*.{md,mdx}` and is validated by `src/content.config.ts`.
- Blog rendering pipeline:
  - `src/pages/blog/index.astro` lists posts sorted by `pubDate` descending.
  - `src/pages/blog/[...slug].astro` uses `getStaticPaths()` + `render()` to build post routes.
  - `src/layouts/BlogPost.astro` provides the shared article layout.
  - `src/pages/rss.xml.js` generates RSS from the same blog collection.
- Shared page shell:
  - `src/components/BaseHead.astro` injects global CSS, SEO metadata, and `ClientRouter`.
  - `Header` and `Footer` are reused across pages/layouts.
- `src/pages/index.astro` is a custom animated landing page with GSAP `ScrollTrigger`, scroll-snap sections, a persistent header transition, and SVG triptych components (`TriptychA/B/C`).

## Key conventions in this repo

- Keep site-level copy and profile links in `src/consts.ts`; import those values rather than hardcoding.
- `.astro` components in this codebase follow typed `Props` interfaces and `Astro.props` destructuring.
- Blog frontmatter must match the collection schema:
  - required: `title`, `description`, `pubDate`
  - optional: `updatedDate`, `heroImage`
  - dates are parsed with `z.coerce.date()`.
- Local images are handled with `astro:assets` (`Image`/`Picture`) and imported asset paths; blog list/detail images share `transition:name` keys.
- On the homepage, section wiring is coupled between section `id`s, the `sectionIds`/`isDarkSection` maps in the GSAP script, and pill nav `data-target` buttons. Update all of them together when changing sections.
- `Header.astro` uses `transition:persist`, and `index.astro` performs `astro:before-swap` cleanup for header/scroll listeners; preserve this cleanup when editing navigation animation logic.
