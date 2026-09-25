# Changelog — AnimeHub

## [Unreleased] — Platform Polish: Genre System, Auth, Footer, Homepage (2026-09-20)

### Added
- `src/components/common/GenreMegaMenu.tsx` — Dark translucent mega-menu with 23 genre columns, backdrop blur, keyboard accessibility (Escape/Click-outside), and live title counts per genre.
- `src/pages/GenresPage.tsx` — `/genres` page with genre discovery grid showing top title poster, title count, and score per genre.
- Global cursor tracker in `src/lib/cursor-tracker.ts` (see previous entry).
- `src/lib/cursor-tracker.ts` — Single `pointermove` listener with `requestAnimationFrame` batching for 21st.dev GlowCard cards.
- Google OAuth button in `AuthPage` using Supabase `signInWithOAuth({ provider: 'google' })` (delegates to Google's official OAuth flow, no manual token handling).
- User profile dropdown in `Navbar` — avatar/initials, Profile/My Library/Settings/Sign Out links.
- Homepage "New Releases" section with horizontal scroll (using `getRecentlyAdded`).

### Changed
- `src/components/layout/Navbar.tsx` — Added "GENRES" nav item with mega-menu dropdown; added user profile dropdown replacing the simple User icon; added `Layers`, `LogOut`, `Settings` icon imports; mobile menu now includes all nav items including Genres.
- `src/pages/AuthPage.tsx` — Redesigned as premium centered auth card with Google OAuth button, username field for signup, divider, and gradient CTA button. Keeps existing email/password flow via Supabase.
- `src/components/layout/Footer.tsx` — Redesigned as clean premium footer with Explore/Community/Support link columns; removed "Data sourced from Jikan API" and "Built for the otaku community" text.
- `src/pages/HomePage.tsx` — Added horizontal scroll for Trending section; added New Releases horizontal section; replaced TitleCard with AnimeSpotlightCard across all grid sections.
- `src/App.tsx` — Added `/genres` route (lazy-loaded `GenresPage`).
- `src/components/ui/spotlight-card.tsx` — Uses global cursor tracker; removed `background-attachment: fixed`.

### Files Changed
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/AuthPage.tsx`
- `src/App.tsx`
- `src/components/anime/HeroSection.tsx`

### Files Added
- `src/components/common/GenreMegaMenu.tsx`
- `src/pages/GenresPage.tsx`
- `src/components/ui/spotlight-card.tsx`
- `src/components/ui/hero-3.tsx`
- `src/components/anime/AnimeSpotlightCard.tsx`
- `src/lib/cursor-tracker.ts`

### Verified
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — passes (3.67s, 2028 modules).
- Dev server running at http://localhost:5174.

---

## [Unreleased] — Spotlight Cursor Tracking Performance Fix (2026-09-20)

### Added
- `src/lib/cursor-tracker.ts` — Global singleton cursor tracker. Replaces per-card `pointermove` listeners with a single global window listener that uses `requestAnimationFrame` to batch CSS variable updates to at most 60fps across all tracked cards. Caches `getBoundingClientRect()` and refreshes on scroll/resize (debounced 100ms).

### Changed
- `src/components/ui/spotlight-card.tsx` — Replaced per-card `document.addEventListener('pointermove')` with `trackCard()` from the global cursor tracker. Removed `background-attachment: fixed` from both inline styles and pseudo-element CSS (now uses element-relative coordinates). CSS variable updates are batched via rAF instead of firing synchronously on every raw pointer event.

### Architecture Change
- Before: each GlowCard registered its own `pointermove` listener on `document` → N listeners firing per mouse movement, each doing synchronous `style.setProperty()` calls.
- After: ONE global `pointermove` listener with `passive: true` → captures cursor position → `requestAnimationFrame` batches updates to all tracked cards in a single loop → at most 60 updates/sec regardless of mouse event frequency.

### Verified
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — passes (5.15s, 2028 modules).
- Dev server running at http://localhost:5174.

### Notes
- Genres organized by content type (Anime, Manga, Manhwa, Manhua, Novels) on `/genres` page per user feedback — not a flat separate section.
- Genre links in mega-menu navigate to `/genre/:genre`; GenrePage links include `?type=` parameter for type-filtered browsing.
- Google OAuth uses Supabase's built-in `signInWithOAuth({ provider: 'google' })` — delegates to Google's official OAuth consent screen.

---

## [Unreleased] — Scroll Performance + Genre Reorganization (2026-09-20)

### Changed
- Removed standalone Genres section: deleted `GenreMegaMenu.tsx` + `GenresPage.tsx`, removed "GENRES" nav item. Genres now live inside the Anime section as a filter row.
- HomePage restructured: Hero -> Format → Trending (horizontal) → Popular (grid) → ANIME (genre filter + grid) → New Releases (horizontal) → Continue Watching → Recently Added (horizontal) → Surprise Me.
- Removed `background-attachment: fixed` from body (forced repaint per scroll frame).
- Removed `backdrop-blur-[5px]` from GlowCard (expensive backdrop-filter on every card).
- Added `content-visibility: auto` to Popular section; `@media (hover: none)` to disable spotlight on touch.
- React.memo added to AnimeSpotlightCard with custom id-based comparator.

### Root cause of scroll lag
1. `background-attachment: fixed` on body — forced browser to recompute parallax gradient on every scroll
2. Per-card `pointermove` listeners — 20-100 synchronous `style.setProperty()` calls per mouse move
3. `backdrop-blur-[5px]` on every GlowCard — GPU compositing overhead per card

### Verified
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — passes (15.40s, 2026 modules). CSS reduced 43.42→41.76 kB.
- Dev server running at http://localhost:5174.

---

## [Unreleased] — 21st.dev Integration: AnimatedMarqueeHero + GlowCard (2026-09-20)

### Added
- `src/components/ui/spotlight-card.tsx` — Original 21st.dev GlowCard component (mouse-tracking radial spotlight glow effect). TypeScript compatibility fix applied (numeric CSS vars cast to strings).
- `src/components/ui/hero-3.tsx` — Original 21st.dev AnimatedMarqueeHero component with marquee sliding poster images, staggered text animations, and golden-accent CTA. Minimal integration change: added optional `ctaHref` prop to render CTA as a React Router `Link` instead of standalone button.
- `src/components/anime/AnimeSpotlightCard.tsx` — New adapter component wrapping GlowCard with existing `Title` data, library hooks (`useLibrary`), and ToastContext. Preserves all TitleCard interactivity (navigate to details, quick-add/favorite).
- Updated `HeroSection.tsx` to use AnimatedMarqueeHero with `getTopRated("anime", 12)` for hero images and `/browse` CTA.

### Changed
- `src/pages/HomePage.tsx` — Replaced inline hero section with `<HeroSection />` (AnimatedMarqueeHero). Replaced all `TitleCard` imports/usages with `AnimeSpotlightCard` across 5 grid sections (Trending, Top Rated, Continue Watching, Currently Airing, Popular Reading).
- `src/pages/CatalogPage.tsx` — Replaced `TitleCard` with `AnimeSpotlightCard` in catalogue grid.
- `src/pages/DetailsPage.tsx` — Replaced `TitleCard` with `AnimeSpotlightCard` in related/recommended grids.
- `src/pages/CalendarPage.tsx` — Replaced `TitleCard` with `AnimeSpotlightCard` in "Keep exploring" section.
- `src/pages/ProfilePage.tsx` — Replaced `TitleCard` with `AnimeSpotlightCard` in favorites grid.

### Verified
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — passes (3.55s, 2025 modules). New chunk `AnimeSpotlightCard-Dlpael2L.js` (8.49 kB / 2.96 kB gzipped). Initial load unchanged (~244 kB).
- Dev server running at http://localhost:5173.

---

## [Unreleased] — Golden Color Scheme + Audit Results (2026-09-20)

### Changed
- **Color palette**: Shifted primary from magenta/pink (262 83% 63%) to rich gold (42 93% 58%); accent from pink/red (330 81% 60%) to warm bronze (35 75% 45%); secondary from gray (240 6% 14%) to deep purple (260 70% 35%); foreground from pure white to warm off-white (0 0% 93%); ring/border glow updated to gold.
- **Background gradients**: Updated radial backgrounds in `src/index.css` to use golden glow (hsl(42 93% 28% / 0.35)) at top and deep-purple glow (hsl(260 70% 25% / 0.15)) at right, replacing the old magenta/pink.
- All component gradients (`from-primary to-accent`), text colors (`text-primary`, `text-accent`), ring/border colors, and shadows automatically cascade to the new golden palette via CSS variables.

### Files Changed
- `src/index.css` (lines 7-35, 50-55): Updated all CSS custom properties and background gradients.

### Verified
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — passes (3.45s, same bundle sizes as before CSS change).
- Dev server running at http://localhost:5173; HMR applied CSS changes automatically.

---

## [Unreleased] — Poster Image Root-Cause Fix (2026-09-13)

### Added
- `src/components/common/PosterImage.tsx` — reusable lazy-loading poster component with source fallbacks and a clean final placeholder.
- Title-specific poster URLs for all 12 manga/manhwa/manhua/novel seed entries.
- `imageFallbacks` metadata on anime and unified `Title` records.

### Changed
- Replaced direct poster `<img>` rendering across Home, catalogue cards, details, library, profile, calendar, legacy anime cards, hero, modal, and stats components.
- Added standard/large fallback derivation for static catalogue images.
- Added Jikan JPG/WebP image variants as API fallbacks.

### Fixed
- Corrected 18 stale MyAnimeList CDN poster URLs in `src/data/anime.ts`.
- Corrected MAL IDs for Lycoris Recoil, Bocchi the Rock!, and Odd Taxi.
- Removed the generic question-mark fallback from reading seeds by supplying each title's own poster.
- Prevented browser broken-image icons, raw alt text on failed images, and infinite retry loops.

### Verified
- `npm run build` — passes.
- `npm run lint` — zero errors; three existing React Fast Refresh warnings remain.
- HTTP validation passed for every primary poster URL and generated fallback variant.
- Dev server route checks returned HTTP 200 for `/`, `/browse`, `/anime/52991`, and `/manga`.

---

## [Unreleased] — GAURAVANIME Platform Completion (2026-09-12)

### Added
- Unified anime and reading `Title` catalogue with format filtering and helper functions.
- 12 manga/manhwa/manhua/novel seed entries in `src/data/reading.ts`.
- Routed Home, Browse/Search/Genre, Details, Library, Profile, Calendar, and Not Found pages.
- Local-first library and profile persistence with favorites, status, ratings, progress, continue items, and statistics.
- Reusable common UI components for cards, badges, sections, skeletons, tabs, genre chips, empty states, and library actions.
- React Router provider wiring in `src/App.tsx`.

### Changed
- Expanded `src/data/catalog.ts` to combine anime and reading catalogues.
- Converted internal navigation in `Navbar`, `Footer`, tabs, genre chips, and empty states to React Router links.
- Hardened `LibraryContext` progress handling for titles with unknown totals.
- Replaced `any` types in Jikan episode, season, and genre API responses with typed interfaces.

### Fixed
- TypeScript errors in new routed pages and shared components.
- ESLint errors from unused imports, variables, and explicit `any` types.
- Route handling for `/novels`, `/genre/:genre`, search queries, and detail pages.
- Build and route smoke tests now pass.

### Verified
- `npm run build` — passes.
- `npm run lint` — zero errors; three existing React Fast Refresh warnings remain.
- Dev server route checks returned HTTP 200 for `/`, `/browse`, `/anime/5`, and `/library`.
- Anime and reading MAL ID sets have no collisions.

---

## [Unreleased] — AI Handoff System Setup + App.tsx Creation (2026-09-10)

### Added
- **AGENTS.md** — Permanent instructions for AI coding agents (Cline, Roo Code, Kilo Code, Claude Code, etc.)
- **AI_CONTEXT.md** — Project context: purpose, tech stack, architecture, conventions
- **AI_ARCHITECTURE.md** — Detailed architecture: directories, components, data flow, state, config
- **AI_TASK.md** — Current task tracking
- **AI_CHANGELOG.md** — This file
- **src/App.tsx** — Root component wiring all features together
- **eslint.config.js** — ESLint 9 flat config (TypeScript + React)

### Changed
- **tsconfig.node.json** — Added `"types": ["node"]` for Node.js globals in config files
- **package.json** (implicit) — Added `@types/node`, `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` as dev dependencies

### Fixed
- **Critical**: Created missing `src/App.tsx` — was imported by `main.tsx` but didn't exist
- **Build**: Fixed `vite.config.ts` TypeScript errors (`path` module, `__dirname`)
- **Lint**: Fixed ESLint configuration for TypeScript/JSX parsing
- **Code**: Removed unused imports/variables in `App.tsx` and `HeroSection.tsx`

### Project State (Existing)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (dark mode, CSS variables)
- **Animations**: Framer Motion
- **UI**: Radix UI primitives + lucide-react icons
- **Data**: 24 static anime entries in `src/data/anime.ts`
- **Components** (all complete):
  - `Navbar` — Sticky header with search, mobile menu
  - `Footer` — Brand, attribution, copyright
  - `HeroSection` — Featured anime, CTAs, stats strip
  - `FilterBar` — Collapsible filters (genre/studio/year), sort, result count
  - `AnimeCard` — Poster, score, genres, meta, hover animations
  - `AnimeDetailModal` — Full detail view with animations
  - `StatsSection` — Score distribution, genre popularity, studio leaderboard, top 5
- **Hook**: `useAnimeFilter` — Complete filter/sort/search logic
- **Utils**: `cn()`, `formatCompactNumber()`, `clamp()`
- **Config**: Vite, Tailwind, TypeScript, PostCSS, shadcn/ui

### Verified
- `npm run build` — ✅ Passes (production build ~338KB JS, ~31KB CSS)
- `npm run lint` — ✅ Passes (zero errors)

---

## Format
```
## [Version] — YYYY-MM-DD
### Added / Changed / Fixed / Removed
- Description
```

## [Fixes] — 2026-09-15
- Applied fixes to the expanded GAURAVANIME build.
- Removed the duplicate Naruto Shippuden record.
- Fixed MyAnimeList links and added an official metadata link to routed details.
- Updated remaining HTML/README branding.
- Added keyboard-accessible title cards, Netlify security headers, robots.txt, and sitemap.xml.
