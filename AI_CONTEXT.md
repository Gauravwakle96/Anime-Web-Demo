# Project Context — AnimeHub

## Project Purpose
AnimeHub / GAURAVANIME is a **client-side anime discovery and browsing application** with a curated collection of 416 titles (180 anime + 236 reading entries). Features include catalog browsing, filtering, search, detailed title pages, local-first library tracking, and Supabase authentication with Google OAuth.

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
- `react-router-dom` — Client-side routing with public/anon browsing and protected routes
- `framer-motion` — Declarative animations + 21st.dev AnimatedMarqueeHero
- `lucide-react` — Icon system
- `@supabase/supabase-js` — Authentication (email/password + Google OAuth via Supabase)
- `@radix-ui/*` — Accessible UI primitives
- `class-variance-authority`, `clsx`, `tailwind-merge` — Class composition

**Dev:**
- `typescript` 5.6
- `vite` 5.4 + `@vitejs/plugin-react`
- `tailwindcss` 3.4 + `tailwindcss-animate` + `autoprefixer` + `postcss`
- `eslint` 9 + plugins

## Frontend Architecture
- **Single-page application** (SPA) with client-side routing via React Router v6
- **Component-based** architecture:
  - Layout: `Navbar` (with genre mega-menu + user dropdown), `Footer`
  - Anime: `HeroSection` (AnimatedMarqueeHero), `AnimeSpotlightCard` (GlowCard wrapper), `AnimeDetailModal`, `StatsSection`, `FilterBar`
  - Common: `GenreChips`, `SectionHeader`, `SkeletonGrid`, `StatusBadge`, `TitleCard`, `TypeTabs`
  - UI: `spotlight-card.tsx` (21st.dev GlowCard), `hero-3.tsx` (21st.dev AnimatedMarqueeHero)
- **State management**: React `useState`/`useMemo`/`useEffect` + Context API (LibraryContext, AuthContext, ToastContext)
- **Data**: Static TS data in `src/data/` — 180 anime entries + 236 reading entries, combined into unified `allTitles` catalogue via `catalog.ts`
- **No backend API calls** — all data is bundled; Supabase used only for auth

## Backend Architecture
**Supabase Auth only.** Client-side app with Supabase for authentication (email/password + Google OAuth). No Supabase database/storage used. Library data stored in localStorage.

## Database
**None.** Title data is static TypeScript. Library entries stored in `localStorage` under key `gauravanime:library`.

## Authentication
**Supabase Auth** with:
- `AuthProvider` (`src/contexts/AuthContext.tsx`) — manages `user`, `session`, `isLoading`, `signOut`
- `AuthPage` (`src/pages/AuthPage.tsx`) — email/password login + signup + Google OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Supabase client: env-var driven (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), safely nulls when unconfigured
- Protected routes via `ProtectedRoute` wrapper for `/library`, `/profile`, `/admin/users`

## Important APIs
**Runtime data:** Static TS arrays in `src/data/` (no API calls).
**Auth:** `@supabase/supabase-js` — email/password sign-in/sign-up + Google OAuth via `signInWithOAuth`.
**Build-time:** Anime data was originally sourced via Jikan API (https://jikan.moe).

## Important Conventions
- **Path alias**: `@/` maps to `src/` (vite.config.ts)
- **Class composition**: Use `cn()` from `@/lib/utils` for all className merging
- **Colors**: Defined as HSL CSS variables in `src/index.css` (dark theme only)
- **Fonts**: `font-display` (Poppins) for headings, `font-sans` (Inter) for body
- **Animations**: Framer Motion `motion` components with `initial`/`animate`/`exit`/`whileInView`/`whileHover`
- **TypeScript**: Strict mode, interfaces in `src/data/types.ts`
- **Responsive**: Mobile-first, breakpoints at `md:` (768px) and `lg:` (1024px)

## Major Architectural Decisions
1. **Static data over API** — 416 titles bundled, zero runtime data dependencies
2. **Client-side filtering** — All titles in memory, instant filter/sort
3. **Radix UI + Tailwind + 21st.dev components** — Accessible primitives with utility styling
4. **CSS variables for theming** — Golden palette (primary=gold HSL 42, accent=bronze HSL 35, secondary=deep purple HSL 260)
5. **Context API for state** — LibraryContext (localStorage), AuthContext (Supabase), ToastContext
6. **Dark mode only** — Design decision, no light theme toggle
7. **Code splitting** — `React.lazy` + `Suspense` per route, `manualChunks` in vite.config.ts
8. **Global cursor tracker** — Single `pointermove` listener with `requestAnimationFrame` for 21st.dev GlowCard performance across many cards
9. **No hardcoded Supabase keys** — env-var driven with safe null fallback