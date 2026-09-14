/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LibraryEntry, LibraryStatus, Title } from "@/types";

const STORAGE_KEY = "gauravanime:library";

interface LibraryContextValue {
  entries: LibraryEntry[];
  addEntry: (title: Title, overrides?: Partial<LibraryEntry>) => LibraryEntry;
  removeEntry: (titleId: string) => void;
  updateStatus: (titleId: string, status: LibraryStatus) => void;
  toggleFavorite: (titleId: string) => void;
  setRating: (titleId: string, userRating: number) => void;
  setProgress: (titleId: string, progress: number) => void;
  getEntry: (titleId: string) => LibraryEntry | undefined;
  isInLibrary: (titleId: string) => boolean;
  favorites: LibraryEntry[];
  libraryTitles: LibraryEntry[];
  continueItems: LibraryEntry[];
  stats: {
    total: number;
    byStatus: Record<LibraryStatus, number>;
    favorites: number;
    totalEpisodes: number;
    watchedEpisodes: number;
    averageRating: number;
  };
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

function loadEntries(): LibraryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LibraryEntry[];
  } catch {
    return [];
  }
}

function persist(entries: LibraryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage errors
  }
}

function makeEntry(title: Title, overrides?: Partial<LibraryEntry>): LibraryEntry {
  const now = new Date().toISOString();
  return {
    titleId: title.id,
    status: overrides?.status ?? "plan_to_watch",
    favorite: overrides?.favorite ?? false,
    userRating: overrides?.userRating ?? 0,
    progress: overrides?.progress ?? 0,
    totalProgress: overrides?.totalProgress ?? (title.episodes ?? title.chapters ?? 0),
    addedAt: overrides?.addedAt ?? now,
    updatedAt: overrides?.updatedAt ?? now,
  };
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LibraryEntry[]>(loadEntries);

  useEffect(() => {
    persist(entries);
  }, [entries]);

  const addEntry = useCallback(
    (title: Title, overrides?: Partial<LibraryEntry>): LibraryEntry => {
      const entry = makeEntry(title, overrides);
      setEntries((prev) => {
        const existing = prev.find((e) => e.titleId === entry.titleId);
        if (existing) {
          return prev.map((e) =>
            e.titleId === entry.titleId
              ? { ...e, ...entry, updatedAt: entry.updatedAt }
              : e
          );
        }
        return [...prev, entry];
      });
      return entry;
    },
    []
  );

  const removeEntry = useCallback((titleId: string) => {
    setEntries((prev) => prev.filter((e) => e.titleId !== titleId));
  }, []);

  const updateStatus = useCallback(
    (titleId: string, status: LibraryStatus) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.titleId === titleId
            ? { ...e, status, updatedAt: new Date().toISOString() }
            : e
        )
      );
    },
    []
  );

  const toggleFavorite = useCallback((titleId: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.titleId === titleId
          ? { ...e, favorite: !e.favorite, updatedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const setRating = useCallback(
    (titleId: string, userRating: number) => {
      const clamped = Math.max(0, Math.min(10, userRating));
      setEntries((prev) =>
        prev.map((e) =>
          e.titleId === titleId
            ? { ...e, userRating: clamped, updatedAt: new Date().toISOString() }
            : e
        )
      );
    },
    []
  );

  const setProgress = useCallback(
    (titleId: string, progress: number) => {
      const clamped = Math.max(0, progress);
      setEntries((prev) =>
        prev.map((e) => {
          if (e.titleId !== titleId) return e;
          const totalProgress = e.totalProgress || 0;
          const nextProgress = totalProgress > 0 ? Math.min(clamped, totalProgress) : clamped;
          return {
            ...e,
            progress: nextProgress,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const getEntry = useCallback(
    (titleId: string): LibraryEntry | undefined => {
      return entries.find((e) => e.titleId === titleId);
    },
    [entries]
  );

  const isInLibrary = useCallback(
    (titleId: string): boolean => {
      return entries.some((e) => e.titleId === titleId);
    },
    [entries]
  );

  const favorites = useMemo(
    () => entries.filter((e) => e.favorite),
    [entries]
  );

  const libraryTitles = useMemo(
    () => [...entries].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    ),
    [entries]
  );

  const continueItems = useMemo(
    () =>
      entries
        .filter((e) => e.progress > 0 && (e.totalProgress <= 0 || e.progress < e.totalProgress))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [entries]
  );

  const stats = useMemo(() => {
    const byStatus: Record<LibraryStatus, number> = {
      plan_to_watch: 0,
      watching: 0,
      completed: 0,
      on_hold: 0,
      dropped: 0,
      plan_to_read: 0,
      reading: 0,
    };
    let favoritesCount = 0;
    let totalEpisodes = 0;
    let watchedEpisodes = 0;
    let ratingSum = 0;
    let ratedCount = 0;

    for (const e of entries) {
      byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
      if (e.favorite) favoritesCount++;
      totalEpisodes += e.totalProgress ?? 0;
      watchedEpisodes += e.progress ?? 0;
      if (e.userRating > 0) {
        ratingSum += e.userRating;
        ratedCount++;
      }
    }

    return {
      total: entries.length,
      byStatus,
      favorites: favoritesCount,
      totalEpisodes,
      watchedEpisodes,
      averageRating: ratedCount > 0 ? ratingSum / ratedCount : 0,
    };
  }, [entries]);

  const value: LibraryContextValue = {
    entries,
    addEntry,
    removeEntry,
    updateStatus,
    toggleFavorite,
    setRating,
    setProgress,
    getEntry,
    isInLibrary,
    favorites,
    libraryTitles,
    continueItems,
    stats,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return ctx;
}