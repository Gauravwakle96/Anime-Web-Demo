# AI Agent Instructions — AnimeHub

This file provides permanent instructions for AI coding agents (Cline, Roo Code, Kilo Code, Claude Code, etc.) working on this project.

## Mandatory Startup Sequence

When starting work on this project, you MUST:

1. **Read AGENTS.md** (this file) — Understand the workflow and rules
2. **Read AI_CONTEXT.md** — Learn the project's stable knowledge
3. **Read AI_TASK.md** — Understand the current task state
4. **Read AI_CHANGELOG.md** (latest entries) — Know recent changes
5. **Read AI_ARCHITECTURE.md** (when architecture is relevant) — Understand system design

## Core Rules

### Repository Interaction
- **Never scan the entire repository unnecessarily**
- **Inspect only files relevant to the current task**
- Use `glob`/`grep` with specific patterns instead of broad searches
- Do not read files "just to be safe" — read with purpose

### Code Changes
- **Preserve existing architecture and working functionality**
- **Avoid unnecessary rewrites** — prefer targeted edits
- Follow existing code conventions, naming, and patterns
- Use existing libraries and utilities (e.g., `cn()` from `@/lib/utils`)
- Match the project's TypeScript/React/Tailwind style

### Memory Maintenance
- **Keep AI memory files updated** (this is the persistent communication layer)
- **Record important decisions** in AI_CHANGELOG.md
- **Record files changed** in AI_CHANGELOG.md
- **Record errors and attempted fixes** in AI_CHANGELOG.md
- **Update AI_TASK.md** when task state changes
- **Update AI_CONTEXT.md** when stable project knowledge changes
- **Update AI_ARCHITECTURE.md** when architecture changes
- Do not update these files for every trivial edit

### Context Exhaustion Handoff
When approaching your context/token limit:
1. **Save the current work** (commit or stage changes)
2. **Verify the project is in a consistent state** (build passes, no broken code)
3. **Update AI_TASK.md** with exact current state
4. **Update AI_CHANGELOG.md** with recent changes
4. **Document important decisions** in AI_CHANGELOG.md
5. **List every relevant file modified** in AI_CHANGELOG.md
6. **Record unresolved errors** in AI_TASK.md and AI_CHANGELOG.md
7. **Record what was already attempted** in AI_CHANGELOG.md
8. **Write the exact next action** for the next AI agent in AI_TASK.md

The next agent must be able to continue **without access to your previous conversation**.

## Agent Takeover Behavior

When another AI agent starts, it will:
```
AGENTS.md
↓
AI_CONTEXT.md
↓
AI_TASK.md
↓
AI_CHANGELOG.md (latest)
↓
AI_ARCHITECTURE.md (if needed)
↓
ONLY relevant source files
```

It will **NOT** automatically scan the entire repository.

## Project-Specific Conventions

### File Structure
```
src/
├── components/
│   ├── layout/       # Navbar, Footer
│   └── anime/        # HeroSection, FilterBar, AnimeCard, AnimeDetailModal, StatsSection
├── data/
│   ├── anime.ts      # Static anime data + derived helpers
│   └── types.ts      # TypeScript interfaces
├── hooks/
│   └── useAnimeFilter.ts  # Filter/sort logic
├── lib/
│   └── utils.ts      # cn(), formatCompactNumber, clamp
├── main.tsx          # Entry point
└── index.css         # Tailwind + design tokens
```

### Key Technologies
- React 18 + TypeScript + Vite
- Tailwind CSS (with CSS variables for theming)
- Framer Motion for animations
- React Router v6
- Radix UI primitives (dialog, dropdown, select, tabs, toast, etc.)
- lucide-react for icons
- clsx + tailwind-merge for class composition

### Data Flow
- Static anime data in `src/data/anime.ts` (24 titles)
- Filter/sort state managed by `useAnimeFilter` hook
- Components receive filtered data and callbacks via props
- No backend, no API calls, no database

### Styling
- Uses `@` path alias (configured in vite.config.ts)
- CSS variables for all colors (see `src/index.css`)
- `font-display` (Poppins) for headings, `font-sans` (Inter) for body
- Dark mode only (`.dark` class on `<html>`)
- Utility classes: `cn()` for merging, `formatCompactNumber()`, `clamp()`

## Quality Gates
Before considering work complete:
- `npm run build` must succeed
- `npm run lint` must pass
- No TypeScript errors
- No console errors in browser
- Responsive design works (mobile/tablet/desktop)

## Quick Reference Commands
```bash
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```