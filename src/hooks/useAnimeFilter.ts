import { useMemo, useState } from "react";
import { animeList } from "@/data/anime";
import type { Anime, FilterState, SortOption, SortDirection } from "@/data/types";

const DEFAULT_FILTER: FilterState = {
  search: "",
  genres: [],
  studios: [],
  years: [],
  sortBy: "score",
  sortDir: "desc",
};

export function useAnimeFilter() {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const setSearch = (search: string) =>
    setFilter((prev) => ({ ...prev, search }));

  const toggleGenre = (genre: string) =>
    setFilter((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));

  const toggleStudio = (studio: string) =>
    setFilter((prev) => ({
      ...prev,
      studios: prev.studios.includes(studio)
        ? prev.studios.filter((s) => s !== studio)
        : [...prev.studios, studio],
    }));

  const toggleYear = (year: string) =>
    setFilter((prev) => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter((y) => y !== year)
        : [...prev.years, year],
    }));

  const setSort = (sortBy: SortOption) =>
    setFilter((prev) => ({
      ...prev,
      sortBy,
      sortDir:
        prev.sortBy === sortBy
          ? prev.sortDir === "desc"
            ? "asc"
            : "desc"
          : "desc",
    }));

  const setSortDir = (sortDir: SortDirection) =>
    setFilter((prev) => ({ ...prev, sortDir }));

  const resetFilters = () => setFilter(DEFAULT_FILTER);

  const activeFilterCount =
    filter.genres.length +
    filter.studios.length +
    filter.years.length +
    (filter.search ? 1 : 0);

  const filtered = useMemo(() => {
    let list: Anime[] = [...animeList];

    // text search
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.title_english && a.title_english.toLowerCase().includes(q)) ||
          (a.title_japanese && a.title_japanese.includes(q)) ||
          a.genres.toLowerCase().includes(q) ||
          a.studios.toLowerCase().includes(q)
      );
    }

    // genre filter
    if (filter.genres.length) {
      list = list.filter((a) => {
        const g = a.genres.split("|");
        return filter.genres.every((fg) => g.includes(fg));
      });
    }

    // studio filter
    if (filter.studios.length) {
      list = list.filter((a) => {
        const s = a.studios.split("|");
        return filter.studios.some((fs) => s.includes(fs));
      });
    }

    // year filter
    if (filter.years.length) {
      list = list.filter(
        (a) => a.year !== null && filter.years.includes(String(a.year))
      );
    }

    // sort
    const dir = filter.sortDir === "desc" ? -1 : 1;
    list.sort((a, b) => {
      switch (filter.sortBy) {
        case "score":
          return (a.score - b.score) * dir;
        case "year":
          return ((a.year ?? 0) - (b.year ?? 0)) * dir;
        case "episodes":
          return ((a.episodes ?? 0) - (b.episodes ?? 0)) * dir;
        case "title": {
          const ta = (a.title_english || a.title).toLowerCase();
          const tb = (b.title_english || b.title).toLowerCase();
          return ta.localeCompare(tb) * dir;
        }
        default:
          return 0;
      }
    });

    return list;
  }, [filter]);

  return {
    filter,
    filtered,
    setSearch,
    toggleGenre,
    toggleStudio,
    toggleYear,
    setSort,
    setSortDir,
    resetFilters,
    activeFilterCount,
  };
}
