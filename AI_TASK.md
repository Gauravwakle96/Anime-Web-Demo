# Current Task — GAURAVANIME Poster Image Fix

## Objective
Fix broken poster images across AnimeHub without redesigning the UI or removing titles.

## Status
**Completed** — stale/dead poster URLs were corrected, reading seeds now have title-specific posters, and all poster render sites use a reusable resilient image component.

## Root Cause
- `src/data/anime.ts` contained stale MyAnimeList CDN paths for 18 anime posters; those URLs returned HTTP 404.
- Three anime records also had incorrect MAL IDs: Lycoris Recoil, Bocchi the Rock!, and Odd Taxi.
- `src/data/reading.ts` omitted image fields, so every reading title used the generic MAL question-mark placeholder.
- Existing `<img>` elements had no fallback or failed-request handling, so dead URLs exposed browser broken-image icons and alt text.

## Implemented
- Corrected all 18 stale anime poster URLs and fixed the three incorrect MAL IDs.
- Added title-specific MAL poster URLs to all 12 reading seeds.
- Added `imageFallbacks` to `Anime` and `Title` models.
- Added fallback derivation for static catalogue images and Jikan API image variants.
- Added `src/components/common/PosterImage.tsx` with lazy loading, failed-request source rotation, missing-URL handling, and a clean placeholder only after every valid source fails.
- Replaced poster rendering in Home, catalogue cards, details, library, profile, calendar, legacy anime cards, hero, modal, and stats components.

## Verification
- `npm run build` — passes.
- `npm run lint` — zero errors; three existing React Fast Refresh warnings remain.
- Validated every primary anime and reading poster URL plus generated standard/large fallback variants with HTTP checks; no broken URLs found.
- Dev server route smoke tests returned HTTP 200 for `/`, `/browse`, `/anime/52991`, and `/manga`.
- Confirmed source contains no direct `<img>` poster renders outside `PosterImage.tsx`.

## Remaining
- Optional browser interaction testing beyond route smoke tests.
- Optional removal/refactor of existing Fast Refresh warnings in context modules.

## Relevant Files
- `src/components/common/PosterImage.tsx`
- `src/components/common/TitleCard.tsx`
- `src/components/anime/AnimeCard.tsx`
- `src/components/anime/AnimeDetailModal.tsx`
- `src/components/anime/HeroSection.tsx`
- `src/components/anime/StatsSection.tsx`
- `src/data/anime.ts`
- `src/data/reading.ts`
- `src/data/catalog.ts`
- `src/data/types.ts`
- `src/types/index.ts`
- `src/lib/api/jikan.ts`
- `src/pages/HomePage.tsx`
- `src/pages/DetailsPage.tsx`
- `src/pages/LibraryPage.tsx`
- `src/pages/ProfilePage.tsx`
- `src/pages/CalendarPage.tsx`
