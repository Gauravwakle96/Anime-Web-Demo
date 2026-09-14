# Changelog — AnimeHub

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