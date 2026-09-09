# Architecture Documentation — AnimeHub

## High-Level Structure

```
anime-hub/
├── public/                 # Static assets (vite.svg)
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   └── anime/          # Feature components
│   ├── data/               # Static data + types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   ├── main.tsx            # App entry point
│   ├── index.css           # Global styles + design tokens
│   └── App.tsx             # MISSING - main.tsx imports but file doesn't exist
├── index.html              # HTML template
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── postcss.config.js
├── components.json         # shadcn/ui config
└── *.md                    # AI memory files (this file, etc.)
```

## Main Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/layout/` | Shell components: Navbar (sticky, search, mobile menu), Footer |
| `src/components/anime/` | Feature components: Hero, FilterBar, AnimeCard, AnimeDetailModal, StatsSection |
| `src/data/` | `anime.ts` (24 anime + helpers), `types.ts` (TypeScript interfaces) |
| `src/hooks/` | `useAnimeFilter.ts` — all filter/sort/search logic |
| `src/lib/` | `utils.ts` — `cn()`, `formatCompactNumber()`, `clamp()` |

## Important Components

### Layout
- **Navbar** (`src/components/layout/Navbar.tsx`)
  - Sticky header with logo, desktop search, nav links, mobile hamburger menu
  - Accepts `onSearchChange` and `searchValue` props
  - Mobile dropdown with search + nav links

- **Footer** (`src/components/layout/Footer.tsx`)
  - Brand, data attribution (Jikan API), copyright year

### Anime Features
- **HeroSection** (`src/components/anime/HeroSection.tsx`)
  - Full-width hero with background image (top-rated anime)
  - Headline, CTAs (Explore Catalogue, Top Rated)
  - 3 featured anime cards (top 3 by score)
  - Quick stats strip (4 metrics)

- **FilterBar** (`src/components/anime/FilterBar.tsx`)
  - Collapsible filter panel with genres, studios, years
  - Sort buttons (Score, Year, Title, Episodes)
  - Active filter count badge, "Clear all" button
  - Result count display

- **AnimeCard** (`src/components/anime/AnimeCard.tsx`)
  - Poster image with gradient overlay, score badge, status badge
  - Hover: scale, play button, y-offset
  - Genres (max 3), meta row (year, episodes, studio)
  - Framer Motion entrance + hover animations

- **AnimeDetailModal** (`src/components/anime/AnimeDetailModal.tsx`)
  - Full-screen modal (AnimatePresence for enter/exit)
  - Hero banner with title overlay
  - Score, meta chips (year/season, episodes, duration, type)
  - Status + rating badges
  - Genres, studios, synopsis
  - MAL external link

- **StatsSection** (`src/components/anime/StatsSection.tsx`)
  - Score distribution bars (5 buckets)
  - Top 8 genres by count
  - Studio leaderboard (top 6 with avg score)
  - Top 5 rated anime list
  - All with scroll-triggered Framer Motion animations

## Data Flow

```
src/data/anime.ts (animeList: Anime[])
         │
         ▼
src/hooks/useAnimeFilter.ts
         │
         ├── filter state (FilterState)
         ├── filtered: Anime[] (memoized)
         └── actions: setSearch, toggleGenre, toggleStudio, toggleYear, setSort, setSortDir, resetFilters
         │
         ▼
Parent component (would be App.tsx) passes:
  ├── filtered → AnimeCard[] (in catalogue section)
  ├── filter + actions → FilterBar
  └── selectedAnime + onClose → AnimeDetailModal
```

## State Management

**Local component state only** — no Context, Redux, Zustand, etc.

- `useAnimeFilter` hook owns all filter/sort state
- `Navbar` owns mobile menu open state
- `FilterBar` owns expanded/collapsed state
- `AnimeDetailModal` controlled by parent (anime prop + onClose)

## API Structure

**None.** No REST/GraphQL APIs. Static data only.

If API were added later:
- Would likely live in `src/api/` or `src/services/`
- Would replace `animeList` import in `useAnimeFilter`

## External Services

| Service | Purpose | Usage |
|---------|---------|-------|
| Jikan API (myanimelist) | Data source | Build-time only (created static dataset) |
| MyAnimeList CDN | Images | Runtime (anime.image URLs) |
| Google Fonts | Typography | Runtime (Inter, Poppins) |

## Important Configuration

### Vite (`vite.config.ts`)
- React plugin
- `@` alias → `./src`

### Tailwind (`tailwind.config.ts`)
- Dark mode: `class` strategy
- Content: `index.html`, `src/**/*.{ts,tsx}`
- CSS variables for all colors
- Custom fonts: `sans` (Inter), `display` (Poppins)
- Animations: accordion, fade-in, fade-in-up, shimmer
- Plugin: `tailwindcss-animate`

### TypeScript (`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`)
- Strict mode
- ES2022 target
- Bundler module resolution
- JSX: react-jsx
- Path aliases: `@/*` → `src/*`

### PostCSS (`postcss.config.js`)
- `tailwindcss`
- `autoprefixer`

### shadcn/ui (`components.json`)
- Style: default
- RSC: false
- Tailwind config/css paths
- Base color: zinc
- CSS variables: true
- Aliases: components, utils, ui

## Design System (CSS Variables in `src/index.css`)

All colors defined as HSL in `:root`:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary` (purple), `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent` (pink), `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--radius`: 0.85rem

Body has fixed radial gradient background.

## Missing / Incomplete

**Critical:** `src/App.tsx` is imported by `main.tsx` but **does not exist**. This will cause a build error.

Expected `App.tsx` would:
- Use `useAnimeFilter` hook
- Render `Navbar`, `HeroSection`, `FilterBar`, anime grid, `StatsSection`, `Footer`
- Manage `AnimeDetailModal` open state