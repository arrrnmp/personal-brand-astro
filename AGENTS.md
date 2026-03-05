# AGENTS.md

## Project Overview

Personal brand and blog site for Aaron Mompié — a software engineer and writer. Built with Astro 5, Tailwind CSS 4, and MDX. The site is a statically generated personal website with a scroll-snap homepage (hero, image carousel, featured blog posts, about section), a blog powered by Astro content collections, an about page, and an RSS feed.

Key technologies: Astro 5, Tailwind CSS 4 (via `@tailwindcss/vite`), MDX, TypeScript (strict mode), Sharp for image processing.

## Setup Commands

- **Install dependencies:** `pnpm install`
- **Start dev server:** `pnpm dev` (runs at `localhost:4321`)
- **Build for production:** `pnpm build` (outputs to `./dist/`)
- **Preview production build:** `pnpm preview`
- **Run Astro CLI:** `pnpm astro -- <args>`
- **Type-check:** `pnpm astro -- check`

Always use `pnpm` — the repo is pinned to pnpm via `packageManager` in `package.json`.

## Development Workflow

- The dev server supports hot reload via Astro's built-in Vite integration.
- No dedicated `test` or `lint` scripts exist yet. Validate changes with `pnpm build` and `pnpm astro -- check`.
- After making changes, run `pnpm build` to confirm the production build succeeds.

## Project Structure

```
src/
├── assets/              # Images processed by astro:assets
├── components/          # Reusable .astro components
│   ├── BaseHead.astro   # <head> SEO/OG metadata, global CSS, view transitions
│   ├── Header.astro     # Site header (transition:persist)
│   ├── HeaderLink.astro # Nav link with active-state detection
│   ├── Footer.astro     # Site footer
│   └── FormattedDate.astro
├── content/
│   └── blog/            # Blog posts in .md/.mdx
├── content.config.ts    # Content collection schema (Zod validation)
├── consts.ts            # Site-wide constants (title, URLs, feature flags)
├── layouts/
│   ├── BlogPost.astro   # Blog article layout
│   └── Page.astro       # General page layout
├── pages/
│   ├── index.astro      # Homepage (scroll-snap, carousel, featured posts)
│   ├── about.astro      # About page
│   ├── blog/
│   │   ├── index.astro  # Blog listing
│   │   └── [...slug].astro  # Dynamic blog post routes
│   └── rss.xml.js       # RSS feed
└── styles/
    └── global.css       # Tailwind import, design tokens, animations
```

## Code Style

### General

- `.astro` components use typed `Props` interfaces with `Astro.props` destructuring.
- Site-level copy and profile links live in `src/consts.ts` — always import from there, never hardcode.
- Use pure ES modules. No CommonJS.
- TypeScript strict mode with `strictNullChecks`.

### CSS and Styling

- Tailwind is imported via `@import "tailwindcss"` in `global.css`, but the site uses **hand-written CSS classes with CSS custom properties** — not Tailwind utility classes in markup. Follow this pattern.
- Design tokens are CSS custom properties on `:root` (`--bg`, `--text`, `--accent`, `--line`, etc.). Use these instead of hardcoded colors.
- Typography: `Archivo` (sans-serif) for body, `Instrument Serif` for the brand name.

### Animations

Two animation systems, both respecting `prefers-reduced-motion`:

1. **CSS entrance animations** (`anim-fade-up`, `anim-fade-down`, `anim-slide-right`): controlled via `--delay` custom property. Skipped on SPA back-navigation via a `has-visited` class set in `BaseHead.astro`.
2. **Scroll reveal** (`.reveal` → `.is-visible`): driven by `IntersectionObserver` in `index.astro`.

When editing animations, preserve the `has-visited` skip logic and the `prefers-reduced-motion` overrides at the end of `global.css`.

### TypeScript

- Target TypeScript 5.x / ES2022.
- Avoid `any`; prefer `unknown` plus narrowing.
- Use PascalCase for types/interfaces/enums, camelCase for everything else.
- Use kebab-case for filenames (e.g., `user-session.ts`).
- Add JSDoc to public APIs.

## Blog Content

- Blog posts live in `src/content/blog/*.{md,mdx}`.
- Schema is defined in `src/content.config.ts` with Zod:
  - **Required:** `title`, `description`, `pubDate`
  - **Optional:** `updatedDate`, `heroImage`, `draft`
  - `heroImage` uses Astro's `image()` schema helper (imported asset references, not URL strings).
  - Dates use `z.coerce.date()`.
- Posts with `draft: true` are filtered out of the blog listing and homepage featured strip.
- Images use `astro:assets` (`Image`/`Picture`). Blog list and detail views share `transition:name={\`post-image-${post.id}\`}` for view transition continuity — keep these in sync.

## Build and Deployment

- `pnpm build` generates the static site to `./dist/`.
- The site URL is `https://aaronmompie.com` (set in `astro.config.mjs`).
- Integrations: `@astrojs/mdx`, `@astrojs/sitemap`.
- Prefetching is enabled site-wide with hover strategy.

## Key Conventions

- `Header.astro` uses `transition:persist` — it survives view-transition navigations. Preserve the `astro:before-swap` cleanup in `index.astro` when editing header or scroll listener logic.
- `HeaderLink.astro` computes `isActive` by comparing normalized pathnames (handles exact and prefix matches for nested routes).
- The homepage featured strip shows up to 3 non-draft posts sorted by `pubDate` descending.
- The carousel on the homepage is toggled via `CAROUSEL_ENABLED` in `src/consts.ts` and is disabled on mobile (<760px).

## Debugging and Troubleshooting

- If the build fails with image errors, ensure `heroImage` frontmatter values are valid asset paths relative to the content file (e.g., `../../assets/blog-placeholder-1.jpg`).
- If type-checking fails, run `pnpm astro -- check` for detailed diagnostics.
- If styles aren't applying, verify you're using CSS custom properties from `global.css` and not Tailwind utility classes in markup.
