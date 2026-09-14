import { useMemo, useState } from "react";
import { BookOpenCheck, Flame, Heart, Library, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { allTitles } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import EmptyState from "@/components/common/EmptyState";
import LibraryActions from "@/components/common/LibraryActions";
import SectionHeader from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import PosterImage from "@/components/common/PosterImage";
import { displayTitle, progressLabel, typeLabel } from "@/lib/title";
import type { LibraryEntry, LibraryStatus, Title } from "@/types";

const tabs: Array<{ label: string; value: LibraryStatus | "all" | "favorites" }> = [
  { label: "All", value: "all" },
  { label: "Watching", value: "watching" },
  { label: "Reading", value: "reading" },
  { label: "Plan to watch", value: "plan_to_watch" },
  { label: "Plan to read", value: "plan_to_read" },
  { label: "Completed", value: "completed" },
  { label: "On hold", value: "on_hold" },
  { label: "Dropped", value: "dropped" },
  { label: "Favorites", value: "favorites" },
];

export default function LibraryPage() {
  const { entries, continueItems, favorites, stats } = useLibrary();
  const [activeTab, setActiveTab] = useState<LibraryStatus | "all" | "favorites">("all");

  const entriesWithTitle = useMemo(() => entries
    .map((entry) => ({ entry, title: allTitles.find((title) => title.id === entry.titleId) }))
    .filter((item): item is { entry: LibraryEntry; title: Title } => Boolean(item.title)), [entries]);

  const visible = useMemo(() => {
    if (activeTab === "favorites") return entriesWithTitle.filter(({ entry }) => entry.favorite);
    if (activeTab === "all") return entriesWithTitle;
    return entriesWithTitle.filter(({ entry }) => entry.status === activeTab);
  }, [activeTab, entriesWithTitle]);

  const activeCount = activeTab === "favorites" ? favorites.length : activeTab === "all" ? entries.length : entries.filter((entry) => entry.status === activeTab).length;
  const totalProgress = entries.reduce((sum, entry) => sum + (entry.progress || 0), 0);
  const totalLength = entries.reduce((sum, entry) => sum + (entry.totalProgress || 0), 0);

  return (
    <main className="container py-12">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your collection</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Library</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Keep every story you want to watch, read, revisit, or recommend in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Library className="h-5 w-5 text-primary" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saved titles</p><p className="mt-1 font-display text-3xl font-extrabold">{entries.length}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Heart className="h-5 w-5 text-accent" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favorites</p><p className="mt-1 font-display text-3xl font-extrabold">{favorites.length}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Flame className="h-5 w-5 text-amber-400" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">In progress</p><p className="mt-1 font-display text-3xl font-extrabold">{continueItems.length}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><Star className="h-5 w-5 text-emerald-400" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average rating</p><p className="mt-1 font-display text-3xl font-extrabold">{stats.averageRating ? stats.averageRating.toFixed(1) : "—"}</p></div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5"><BookOpenCheck className="h-5 w-5 text-sky-400" /><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress</p><p className="mt-1 font-display text-3xl font-extrabold">{progressLabel(totalProgress, totalLength || undefined)}</p></div>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" onClick={() => setActiveTab(tab.value)} className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${activeTab === tab.value ? "border-primary bg-primary/15 text-primary" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"}`}>
            {tab.label} <span className="ml-1 opacity-70">{tab.value === "favorites" ? favorites.length : tab.value === "all" ? entries.length : entries.filter((entry) => entry.status === tab.value).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeader title={tabs.find((tab) => tab.value === activeTab)?.label || "Library"} description={`${activeCount} ${activeCount === 1 ? "title" : "titles"} in this view`} />
        <div className="text-xs text-muted-foreground">Stored locally in your browser</div>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon="heart" title="Your library is waiting" description="Save a title from any details page to start building your collection." actionLabel="Browse catalogue" actionHref="/browse" />
      ) : (
        <div className="mt-6 grid gap-4">
          {visible.map(({ entry, title }) => <LibraryRow key={entry.titleId} entry={entry} title={title} />)}
        </div>
      )}
    </main>
  );
}

function LibraryRow({ entry, title }: { entry: LibraryEntry; title: Title }) {
  const { setProgress } = useLibrary();
  const total = entry.totalProgress || title.episodes || title.chapters || 0;
  const isAnime = title.type === "anime";
  const displayName = displayTitle(title);

  return (
    <article className="grid gap-4 rounded-2xl border border-border/50 bg-card/40 p-4 shadow-lg shadow-black/5 sm:grid-cols-[92px_1fr] lg:grid-cols-[120px_1fr_auto]">
      <Link to={`/${title.type}/${title.id}`} className="group block overflow-hidden rounded-xl border border-border/40">
        <PosterImage
          src={title.image}
          fallbacks={title.imageFallbacks}
          alt={displayName}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition group-hover:scale-105"
        />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-secondary/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">{typeLabel(title.type)}</span>
          <StatusBadge status={title.status} />
          {entry.favorite && <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent"><Heart className="h-3.5 w-3.5 fill-current" /> Favorite</span>}
        </div>
        <Link to={`/${title.type}/${title.id}`} className="mt-2 block font-display text-lg font-bold hover:text-primary">{displayName}</Link>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{title.synopsis}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current text-amber-400" /> {title.score.toFixed(1)}</span>
          <span>{title.year || "Unknown year"}</span>
          <span>{isAnime ? `${title.episodes || "?"} episodes` : `${title.chapters || "?"} chapters`}</span>
          <span className="font-semibold text-foreground">{progressLabel(entry.progress, total || undefined)} {isAnime ? "watched" : "read"}</span>
        </div>
        {total > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <input type="range" min="0" max={total} value={entry.progress} onChange={(event) => setProgress(title.id, Number(event.target.value))} className="h-2 w-full max-w-xs cursor-pointer accent-primary" aria-label={`${isAnime ? "Episode" : "Chapter"} progress for ${displayName}`} />
            <span className="w-14 text-right text-xs font-semibold tabular-nums">{entry.progress}/{total}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <LibraryActions title={title} />
        <span className="text-[10px] text-muted-foreground">Added {new Date(entry.addedAt).toLocaleDateString()}</span>
      </div>
    </article>
  );
}
