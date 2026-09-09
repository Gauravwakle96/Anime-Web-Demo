# Project Context — AnimeHub

## Project Purpose
AnimeHub is a **client-side anime discovery and browsing application**. It presents a curated collection of 24 popular anime titles with filtering, sorting, and detail views. Built as a portfolio/demo project showcasing React, TypeScript, Tailwind CSS, and Framer Motion.

## Technology Stack
| Layer | Technology |
|-------|------------|
| Framework | React 18 (with TypeScript) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3.4 (CSS variables, dark mode only) |
| Animations | Framer Motion 11 |
| Routing | React Router DOM 6 |
| UI Primitives | Radix UI (dialog, dropdown-menu, select, tabs, toast, label, separator, avatar, progress, slot) |
| Icons | lucide-react |
| Class Utilities | clsx + tailwind-merge |
| Linting | ESLint 9 + TypeScript ESLint |

## Programming Languages
- TypeScript (strict mode)
- TSX (React components)
- CSS (Tailwind + custom properties)

## Package Manager
- npm (package-lock.json present)

## Important Dependencies
**Runtime:**
- `react`, `react-dom` — Core framework
- `react-router-dom` — Client-side routing (currently unused, only BrowserRouter in main.tsx)
- `framer-motion` — Declarative animations
- `lucide-react` — Icon system
- `@radix-ui/*` — Accessible UI primitives
- `class-variance-authority`, `clsx`, `tailwind-merge` — Class composition

**Dev:**
- `typescript` 5.6
- `vite` 5.4 + `@vitejs/plugin-react`
- `tailwindcss` 3.4 + `tailwindcss-animate` + `autoprefixer` + `postcss`
- `eslint` 9 + plugins

## Frontend Architecture
- **Single-page application** (SPA) with client-side routing
- **Component-based** architecture with clear separation:
  - Layout: `Navbar`, `Footer`
  - Features: `HeroSection`, `FilterBar`, `AnimeCard`, `AnimeDetailModal`, `StatsSection`
- **State management**: React `useState` + `useMemo` in custom hook `useAnimeFilter`
- **Data**: Static JSON-like array in `src/data/anime.ts` (24 anime objects)
- **No backend/API** — all data is bundled

## Backend Architecture
**None.** This is a purely client-side application.

## Database
**None.** Static data in TypeScript files.

## Authentication
**None.** No user accounts, no auth.

## Important APIs
**External:** None used at runtime.
**Build-time:** MyAnimeList data was sourced via Jikan API (https://jikan.moe) to create the static dataset.

## Important Conventions
- **Path alias**: `@/` maps to `src/` (vite.config.ts)
- **Class composition**: Use `cn()` from `@/lib/utils` for all className merging
- **Colors**: Defined as HSL CSS variables in `src/index.css` (dark theme only)
- **Fonts**: `font-display` (Poppins) for headings, `font-sans` (Inter) for body
- **Animations**: Framer Motion `motion` components with `initial`/`animate`/`exit`/`whileInView`/`whileHover`
- **TypeScript**: Strict mode, interfaces in `src/data/types.ts`
- **Responsive**: Mobile-first, breakpoints at `md:` (768px) and `lg:` (1024px)

## Major Architectural Decisions
1. **Static data over API** — Simplifies deployment, zero runtime dependencies
2. **Client-side filtering** — All 24 items in memory, instant filter/sort
3. **Radix UI + Tailwind** — Accessible primitives with utility styling (shadcn/ui pattern)
4. **CSS variables for theming** — Enables easy theme changes without rebuilding
5. **No global state library** — React built-ins sufficient for this scale
6. **Dark mode only** — Design decision, no light theme toggle