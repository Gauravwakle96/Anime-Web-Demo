import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, ChevronRight, Clock, Play, Star, Tv, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { allTitles, getPopular, getTopRated } from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import { useShowToast } from "@/contexts/ToastContext";
import EmptyState from "@/components/common/EmptyState";
import GenreChips from "@/components/common/GenreChips";
import SectionHeader from "@/components/common/SectionHeader";
import SkeletonGrid from "@/components/common/SkeletonGrid";
import { StatusBadge } from "@/components/common/StatusBadge";
import TitleCard from "@/components/common/TitleCard";
import LibraryActions from "@/components/common/LibraryActions";
import PosterImage from "@/components/common/PosterImage";
import { displayTitle, formatYear, genreList, progressLabel, typeLabel } from "@/lib/title";
import type { LibraryStatus, TitleType } from "@/types";

export default function DetailsPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { addEntry, getEntry, setProgress } = useLibrary();
  const [loading, setLoading] = useState(true);
  const normalizedType = (type as TitleType | undefined) || "anime";
  const title = useMemo(() => allTitles.find((item) => item.id === id && item.type === normalizedType), [id, normalizedType]);
  const entry = title ? getEntry(title.id) : undefined;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, [id, type]);

  const related = useMemo(() => {
    if (!title) return [];
    const sameGenre = allTitles.filter((item) => item.id !== title.id && genreList(item).some((genre) => genreList(title).includes(genre)));
    return [...sameGenre, ...getTopRated(title.type, 12).filter((item) => item.id !== title.id)]
      .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
      .slice(0, 8);
  }, [title]);

  const recommended = useMemo(() => {
    if (!title) return [];
    return getPopular(title.type, 8).filter((item) => item.id !== title.id);
  }, [title]);

  if (loading) {
    return <main className="container py-12"><SkeletonGrid count={4} /></main>;
  }

  if (!title) {
    return <main className="container py-24"><EmptyState icon="search" title="Title not found" description="This title may have moved or is not available in the current catalogue." actionLabel="Back to catalogue" actionHref="/browse" /></main>;
  }

  const displayName = displayTitle(title);
  const totalProgress = entry?.totalProgress || title.episodes || title.chapters || 0;
  const progress = entry?.progress || 0;
  const genres = genreList(title);
  const isAnime = title.type === "anime";
  const initialStatus: LibraryStatus = isAnime ? "plan_to_watch" : "plan_to_read";

  const handleAdd = (status: LibraryStatus) => {
    if (!entry) {
      addEntry(title, { status });
      showToast({ title: "Added to library", description: displayName, variant: "success" });
    }
  };

  const handleProgress = (value: number) => {
    setProgress(title.id, value);
    showToast({ title: "Progress updated", description: progressLabel(value, totalProgress), variant: "info" });
  };

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/10 to-background">
        <div className="absolute inset-0 opacity-25 blur-3xl" aria-hidden="true">
          <div className="ml-auto h-80 w-80 rounded-full bg-primary/20" />
          <div className="h-80 w-80 rounded-full bg-accent/15" />
        </div>
        <div className="container relative grid min-h-[500px] items-end gap-8 py-12 lg:grid-cols-[220px_1fr] lg:py-16">
          <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
            <PosterImage
              src={title.image}
              fallbacks={title.imageFallbacks}
              alt={displayName}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative max-w-4xl">
            <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Back</button>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={title.status} />
              <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{typeLabel(title.type)}</span>
              {title.year && <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-[11px] font-semibold text-muted-foreground">{formatYear(title.year)}</span>}
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-300"><Star className="h-3.5 w-3.5 fill-current" /> {title.score.toFixed(2)}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{displayName}</h1>
            {title.title_japanese && <p className="mt-2 text-sm text-muted-foreground">{title.title_japanese}</p>}
            <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">{title.synopsis}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">{isAnime ? <Tv className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />} {title.episodes ? `${title.episodes} episodes` : title.chapters ? `${title.chapters} chapters` : "Length unknown"}</span>
              {title.volumes && <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {title.volumes} volumes</span>}
              {title.author && <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {title.author}</span>}
              {title.duration && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {title.duration}</span>}
              {title.aired && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {title.aired}</span>}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LibraryActions title={title} onStatusChange={handleAdd} />
              {!entry && <button onClick={() => handleAdd(initialStatus)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5"><Play className="h-4 w-4 fill-current" /> {isAnime ? "Start watching" : "Start reading"}</button>}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <SectionHeader title="Genres" description="Explore more stories with a similar feel." />
        <GenreChips genres={genres} limit={12} />
      </section>

      {entry && (
        <section className="container py-8">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-5 shadow-lg shadow-black/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your progress</p>
                <h2 className="mt-1 font-display text-xl font-bold">{progressLabel(progress, totalProgress)} {isAnime ? "episodes" : "chapters"} completed</h2>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min="0" max={totalProgress || 0} value={progress} onChange={(event) => handleProgress(Number(event.target.value))} className="h-2 w-48 cursor-pointer accent-primary" aria-label={`${isAnime ? "Episode" : "Chapter"} progress`} />
                <span className="w-16 text-right text-sm font-semibold tabular-nums">{progress}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container py-12">
        <SectionHeader title="You may also like" description="Related titles selected from the same genres and formats." />
        {related.length === 0 ? <EmptyState title="No recommendations yet" description="There are no related titles in this catalogue yet." /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{related.map((item, index) => <TitleCard key={item.id} title={item} index={index} />)}</div>}</section>

      <section className="container pb-24 pt-12">
        <SectionHeader title="Popular in this format" description="Community favorites from the same content type." action={<Link to={`/browse?type=${title.type}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Browse all {title.type}s <ChevronRight className="h-3.5 w-3.5" /></Link>} />
        {recommended.length === 0 ? <EmptyState title="No titles yet" description="This format does not have additional recommendations right now." /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{recommended.map((item, index) => <TitleCard key={item.id} title={item} index={index} />)}</div>}</section>
    </main>
  );
}
