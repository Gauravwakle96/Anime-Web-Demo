/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { LibraryEntry, LibraryStatus, Title } from "@/types";

const STORAGE_KEY = "gauravanime:library";
const LIBRARY_TABLE = "user_library";

type StorageMode = "local" | "cloud";

interface RemoteLibraryEntry {
  user_id: string;
  title_id: string;
  status: LibraryStatus;
  favorite: boolean;
  user_rating: number;
  progress: number;
  total_progress: number;
  added_at: string;
  updated_at: string;
}

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
  isSyncing: boolean;
  syncError: string | null;
  storageMode: StorageMode;
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

function storageKeyForUser(userId: string) {
  return `${STORAGE_KEY}:${userId}`;
}

function loadEntries(key = STORAGE_KEY): LibraryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LibraryEntry[];
  } catch {
    return [];
  }
}

function persist(entries: LibraryEntry[], key = STORAGE_KEY) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
  } catch {
    // The in-memory library remains usable when browser storage is unavailable.
  }
}

function makeEntry(title: Title, overrides?: Partial<LibraryEntry>): LibraryEntry {
  const now = new Date().toISOString();
  return {
    titleId: title.id,
    status: overrides?.status ?? (title.type === "anime" ? "plan_to_watch" : "plan_to_read"),
    favorite: overrides?.favorite ?? false,
    userRating: overrides?.userRating ?? 0,
    progress: overrides?.progress ?? 0,
    totalProgress: overrides?.totalProgress ?? (title.episodes ?? title.chapters ?? 0),
    addedAt: overrides?.addedAt ?? now,
    updatedAt: overrides?.updatedAt ?? now,
  };
}

function fromRemote(row: RemoteLibraryEntry): LibraryEntry {
  return {
    titleId: row.title_id,
    status: row.status,
    favorite: row.favorite,
    userRating: row.user_rating,
    progress: row.progress,
    totalProgress: row.total_progress,
    addedAt: row.added_at,
    updatedAt: row.updated_at,
  };
}

function toRemote(userId: string, entry: LibraryEntry): RemoteLibraryEntry {
  return {
    user_id: userId,
    title_id: entry.titleId,
    status: entry.status,
    favorite: entry.favorite,
    user_rating: entry.userRating,
    progress: entry.progress,
    total_progress: entry.totalProgress,
    added_at: entry.addedAt,
    updated_at: entry.updatedAt,
  };
}

function mergeEntries(...collections: LibraryEntry[][]): LibraryEntry[] {
  const merged = new Map<string, LibraryEntry>();

  for (const collection of collections) {
    for (const entry of collection) {
      const existing = merged.get(entry.titleId);
      if (!existing || new Date(entry.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()) {
        merged.set(entry.titleId, entry);
      }
    }
  }

  return Array.from(merged.values());
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [entries, setEntries] = useState<LibraryEntry[]>(() => loadEntries());
  const [activeStorageKey, setActiveStorageKey] = useState(STORAGE_KEY);
  const [cloudReady, setCloudReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const pendingGuestMigration = useRef(false);

  const storageMode: StorageMode = user && supabase ? "cloud" : "local";

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    setCloudReady(false);
    setSyncError(null);

    if (!user || !supabase) {
      pendingGuestMigration.current = false;
      setActiveStorageKey(STORAGE_KEY);
      setEntries(loadEntries(STORAGE_KEY));
      setIsSyncing(false);
      return;
    }

    const client = supabase;
    const userStorageKey = storageKeyForUser(user.id);
    const guestEntries = loadEntries(STORAGE_KEY);
    const cachedEntries = loadEntries(userStorageKey);
    const localEntries = mergeEntries(cachedEntries, guestEntries);

    pendingGuestMigration.current = guestEntries.length > 0;
    setActiveStorageKey(userStorageKey);
    setEntries(localEntries);
    setIsSyncing(true);

    void (async () => {
      const { data, error } = await client
        .from(LIBRARY_TABLE)
        .select("user_id,title_id,status,favorite,user_rating,progress,total_progress,added_at,updated_at")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        setSyncError("Cloud sync is temporarily unavailable. Changes are still saved on this device.");
        setCloudReady(true);
        setIsSyncing(false);
        return;
      }

      const remoteEntries = ((data ?? []) as RemoteLibraryEntry[]).map(fromRemote);
      const merged = mergeEntries(remoteEntries, cachedEntries, guestEntries);
      persist(merged, userStorageKey);
      setEntries(merged);
      setCloudReady(true);
      setIsSyncing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  useEffect(() => {
    persist(entries, activeStorageKey);
  }, [activeStorageKey, entries]);

  useEffect(() => {
    if (!cloudReady || !user || !supabase) return;

    const client = supabase;
    const userId = user.id;
    const snapshot = entries;
    const timer = window.setTimeout(() => {
      if (snapshot.length === 0) return;

      setIsSyncing(true);
      void client
        .from(LIBRARY_TABLE)
        .upsert(snapshot.map((entry) => toRemote(userId, entry)), {
          onConflict: "user_id,title_id",
        })
        .then(({ error }) => {
          if (error) {
            setSyncError("Cloud sync failed. Your latest changes remain saved on this device.");
          } else {
            setSyncError(null);
            if (pendingGuestMigration.current) {
              window.localStorage.removeItem(STORAGE_KEY);
              pendingGuestMigration.current = false;
            }
          }
          setIsSyncing(false);
        });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [cloudReady, entries, user]);

  const addEntry = useCallback(
    (title: Title, overrides?: Partial<LibraryEntry>): LibraryEntry => {
      const entry = makeEntry(title, overrides);
      setEntries((prev) => {
        const existing = prev.find((item) => item.titleId === entry.titleId);
        if (existing) {
          return prev.map((item) =>
            item.titleId === entry.titleId
              ? { ...existing, ...overrides, updatedAt: entry.updatedAt }
              : item
          );
        }
        return [...prev, entry];
      });
      return entry;
    },
    []
  );

  const removeEntry = useCallback(
    (titleId: string) => {
      setEntries((prev) => prev.filter((entry) => entry.titleId !== titleId));

      if (user && supabase) {
        const client = supabase;
        setIsSyncing(true);
        void client
          .from(LIBRARY_TABLE)
          .delete()
          .eq("user_id", user.id)
          .eq("title_id", titleId)
          .then(({ error }) => {
            setSyncError(error ? "The title was removed locally, but cloud deletion needs to be retried." : null);
            setIsSyncing(false);
          });
      }
    },
    [user]
  );

  const updateStatus = useCallback((titleId: string, status: LibraryStatus) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.titleId === titleId
          ? { ...entry, status, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  }, []);

  const toggleFavorite = useCallback((titleId: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.titleId === titleId
          ? { ...entry, favorite: !entry.favorite, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  }, []);

  const setRating = useCallback((titleId: string, userRating: number) => {
    const clamped = Math.max(0, Math.min(10, userRating));
    setEntries((prev) =>
      prev.map((entry) =>
        entry.titleId === titleId
          ? { ...entry, userRating: clamped, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  }, []);

  const setProgress = useCallback((titleId: string, progress: number) => {
    const clamped = Math.max(0, progress);
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.titleId !== titleId) return entry;
        const totalProgress = entry.totalProgress || 0;
        const nextProgress = totalProgress > 0 ? Math.min(clamped, totalProgress) : clamped;
        return {
          ...entry,
          progress: nextProgress,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const getEntry = useCallback(
    (titleId: string): LibraryEntry | undefined => entries.find((entry) => entry.titleId === titleId),
    [entries]
  );

  const isInLibrary = useCallback(
    (titleId: string): boolean => entries.some((entry) => entry.titleId === titleId),
    [entries]
  );

  const favorites = useMemo(() => entries.filter((entry) => entry.favorite), [entries]);

  const libraryTitles = useMemo(
    () => [...entries].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()),
    [entries]
  );

  const continueItems = useMemo(
    () =>
      entries
        .filter((entry) => entry.progress > 0 && (entry.totalProgress <= 0 || entry.progress < entry.totalProgress))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
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

    for (const entry of entries) {
      byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
      if (entry.favorite) favoritesCount++;
      totalEpisodes += entry.totalProgress ?? 0;
      watchedEpisodes += entry.progress ?? 0;
      if (entry.userRating > 0) {
        ratingSum += entry.userRating;
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
    isSyncing,
    syncError,
    storageMode,
    stats,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
