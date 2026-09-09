# AnimeHub — Anime Discovery App

A modern, animated anime browsing application built with React, TypeScript, Tailwind CSS, and Framer Motion. Features a curated collection of 24 popular anime with advanced filtering, sorting, and detailed views.

![AnimeHub Preview](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## 🎯 Features

- **Curated Anime Collection** — 24 hand-picked popular anime with scores, genres, studios, and synopses
- **Advanced Filtering** — Filter by genre, studio, year with multi-select support
- **Flexible Sorting** — Sort by score, year, title, or episodes (asc/desc)
- **Real-time Search** — Search across titles, genres, and studios
- **Animated UI** — Framer Motion page transitions, hover effects, scroll animations
- **Detail Modal** — Full anime details with score, metadata, genres, studios, synopsis
- **Statistics Dashboard** — Score distribution, genre popularity, studio leaderboard, top 5
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Dark Theme** — Beautiful purple/pink gradient dark mode
- **Accessible** — Radix UI primitives for proper ARIA support

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3.4 (CSS variables, dark mode) |
| **Animations** | Framer Motion 11 |
| **Routing** | React Router DOM 6 |
| **UI Primitives** | Radix UI (Dialog, Dropdown, Select, Tabs, Toast, etc.) |
| **Icons** | lucide-react |
| **Class Utilities** | clsx + tailwind-merge |
| **Linting** | ESLint 9 (flat config) + TypeScript ESLint |

## 📁 Project Structure

```
anime-hub/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   └── anime/          # HeroSection, FilterBar, AnimeCard, AnimeDetailModal, StatsSection
│   ├── data/
│   │   ├── anime.ts        # Static anime data (24 entries) + derived helpers
│   │   └── types.ts        # TypeScript interfaces
│   ├── hooks/
│   │   └── useAnimeFilter.ts  # Filter/sort/search logic
│   ├── lib/
│   │   └── utils.ts        # cn(), formatCompactNumber(), clamp()
│   ├── main.tsx            # Entry point
│   ├── App.tsx             # Root component (wires everything together)
│   └── index.css           # Global styles + design tokens
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / .app.json / .node.json
├── postcss.config.js
├── components.json         # shadcn/ui config
├── eslint.config.js
└── .gitignore
```

## 🤖 AI Handoff System

This project includes a **persistent multi-agent handoff system** allowing AI coding agents (Cline, Roo Code, Kilo Code, Claude Code, etc.) to work sequentially without losing context.

### Memory Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Permanent instructions for AI agents |
| `AI_CONTEXT.md` | Project context: purpose, stack, conventions |
| `AI_ARCHITECTURE.md` | Detailed architecture: components, data flow, config |
| `AI_TASK.md` | Current task tracking |
| `AI_CHANGELOG.md` | Change history |

### How It Works

When an AI agent starts work:
1. Reads `AGENTS.md` → `AI_CONTEXT.md` → `AI_TASK.md` → `AI_CHANGELOG.md` → `AI_ARCHITECTURE.md`
2. Works on the task, updating memory files as it goes
3. Before context exhaustion, creates a complete handoff in `AI_TASK.md` and `AI_CHANGELOG.md`
4. Next agent picks up exactly where the previous one left off

**No conversation history needed** — everything important is in the memory files.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Gauravwakle96/Anime-Web-Demo.git
cd Anime-Web-Demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🏗 Architecture Overview

### Data Flow

```
src/data/anime.ts (24 anime)
         │
         ▼
src/hooks/useAnimeFilter.ts
         │
         ├── filter state (FilterState)
         ├── filtered: Anime[] (memoized)
         └── actions: setSearch, toggleGenre, toggleStudio, toggleYear, setSort, resetFilters
         │
         ▼
App.tsx passes:
  ├── filtered → AnimeCard[] (catalogue grid)
  ├── filter + actions → FilterBar
  └── selectedAnime + onClose → AnimeDetailModal
```

### State Management

**Local component state only** — no Context, Redux, or external state libraries.
- `useAnimeFilter` owns all filter/sort state
- `Navbar` owns mobile menu state
- `FilterBar` owns expanded/collapsed state
- `AnimeDetailModal` controlled by `App.tsx`

### Key Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Sticky header with logo, search, nav links, mobile menu |
| `HeroSection` | Featured anime (top 3), CTAs, quick stats |
| `FilterBar` | Collapsible filters (genre/studio/year), sort buttons, result count |
| `AnimeCard` | Poster, score badge, status, genres, meta — animated |
| `AnimeDetailModal` | Full detail view with hero banner, metadata, synopsis |
| `StatsSection` | Score distribution, genre popularity, studio leaderboard, top 5 |
| `Footer` | Brand, Jikan API attribution, copyright |

## 🎨 Design System

All colors defined as HSL CSS variables in `src/index.css`:

```css
:root {
  --background: 240 10% 4%;
  --foreground: 0 0% 98%;
  --primary: 262 83% 63%;      /* Purple */
  --accent: 330 81% 60%;       /* Pink */
  --radius: 0.85rem;
  /* ... */
}
```

Fonts:
- **Display**: Poppins (headings)
- **Sans**: Inter (body)

## 📦 Data Source

Anime data sourced from **MyAnimeList via Jikan API** (https://jikan.moe) at build time. Images served from MyAnimeList CDN.

## 🔧 Configuration

### Path Aliases (`vite.config.ts`)
```ts
resolve: {
  alias: { "@": path.resolve(__dirname, "./src") }
}
```

### Tailwind (`tailwind.config.ts`)
- Dark mode: `class` strategy
- CSS variables for all colors
- Custom animations (fade-in, shimmer, accordion)
- Plugin: `tailwindcss-animate`

### TypeScript
- Strict mode enabled
- ES2022 target
- Bundler module resolution
- Path aliases: `@/*` → `src/*`

## 📝 Recent Changes

See `AI_CHANGELOG.md` for complete history. Highlights:
- Created missing `src/App.tsx` (was imported but didn't exist)
- Fixed TypeScript config for Node.js globals
- Set up ESLint 9 flat config for TS/JSX
- Built AI handoff system (5 memory files)
- Verified build + lint pass

## 🤝 Contributing

This is a demo/portfolio project. The AI handoff system makes it easy for multiple agents to contribute:

1. Read the memory files (`AGENTS.md` first)
2. Check `AI_TASK.md` for current work
3. Make changes, update memory files
4. Run `npm run build && npm run lint` before finishing

## 📄 License

MIT — Feel free to use for learning or as a starter template.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe) for anime data
- [MyAnimeList](https://myanimelist.net) for images
- [shadcn/ui](https://ui.shadcn.com) for component patterns
- [Radix UI](https://radix-ui.com) for accessible primitives
- [Framer Motion](https://framer.com/motion) for animations
- [Tailwind CSS](https://tailwindcss.com) for styling