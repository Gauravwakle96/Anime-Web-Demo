import { useMemo } from "react";
import { CalendarDays, Clock, Flame, Tv } from "lucide-react";
import { getCurrentlyAiring } from "@/data/catalog";
import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import TitleCard from "@/components/common/TitleCard";
import { displayTitle, typeLabel } from "@/lib/title";

export default function CalendarPage() {
  const airing = useMemo(() => getCurrentlyAiring("anime"), []);
  const currentSeason = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const season = month >= 2 && month <= 4 ? "Spring" : month >= 5 && month <= 7 ? "Summer" : month >= 8 && month <= 10 ? "Fall" : "Winter";
    return `${season} ${now.getFullYear()}`;
  }, []);

  return (
    <main className="container py-12">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Release calendar</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">What is airing now</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Follow currently airing anime and keep your watchlist ready for the next episode.</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-5">
        <CalendarDays className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-semibold">Current season</p>
          <p className="text-xs text-muted-foreground">{currentSeason}</p>
        </div>
        <div className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-primary"><Flame className="h-4 w-4" /> {airing.length} currently airing titles</div>
      </div>

      {airing.length === 0 ? (
        <EmptyState icon="search" title="No airing titles found" description="The current catalogue does not include any currently airing anime." actionLabel="Browse all anime" actionHref="/anime" />
      ) : (
        <>
          <div className="grid gap-4">
            {airing.map((title) => (
              <article key={title.id} className="grid gap-4 rounded-2xl border border-border/50 bg-card/40 p-4 shadow-lg shadow-black/5 sm:grid-cols-[100px_1fr_auto]">
                <img src={title.image} alt={displayTitle(title)} className="h-32 w-24 rounded-xl object-cover" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={title.status} />
                    <span className="rounded-md bg-secondary/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">{typeLabel(title.type)}</span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold">{displayTitle(title)}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{title.synopsis}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Tv className="h-3.5 w-3.5" /> {title.episodes || "?"} episodes</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {title.duration || "Duration unknown"}</span>
                    <span>{title.year || "Unknown year"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end"><span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Airing</span><span className="text-xs text-muted-foreground">Score {title.score.toFixed(1)}</span></div>
              </article>
            ))}
          </div>
          <section className="pt-12"><SectionHeader title="Keep exploring" description="More anime from the catalogue." />            {airing.slice(0, 6).map((title) => <TitleCard key={title.id} title={title} />)}</section>
        </>
      )}
    </main>
  );
}
