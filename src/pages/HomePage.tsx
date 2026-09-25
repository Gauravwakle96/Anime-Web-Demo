import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Flame, Heart, Sparkles, Tv } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  allTitles,
  getPopular,
  getRecentlyAdded,
  getTitlesByType,
  getTopRated,
} from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import SkeletonGrid from "@/components/common/SkeletonGrid";
import AnimeSpotlightCard from "@/components/anime/AnimeSpotlightCard";
import HeroSection from "@/components/anime/HeroSection";
import { displayTitle, genreList } from "@/lib/title";
import type { TitleType } from "@/types";

export default function HomePage() {
  const navigate = useNavigate();
  const { continueItems } = useLibrary();
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [randomPick, setRandomPick] = useState(allTitles[0]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const random = allTitles[Math.floor(Math.random() * allTitles.length)];
    setRandomPick(random);
  }, []);

  const trending = useMemo(() => getTopRated("anime", 16), []);
  const popularTitles = useMemo(() => getTopRated("anime", 12), []);
  const popularReading = useMemo(() => getPopular("manga", 12), []);
  const newReleases = useMemo(() => getRecentlyAdded("anime").slice(0, 12), []);
  const recentlyAdded = useMemo(() => getRecentlyAdded("anime").slice(0, 12), []);

  const allAnime = useMemo(() => getTitlesByType("anime"), []);

  const animeByGenre = useMemo(() => {
    const genreTitles = getTitlesByType("anime").filter((t) =>
      selectedGenre === "All" || genreList(t).some((g) => g === selectedGenre)
    );
    return genreTitles.slice(0, 18);
  }, [selectedGenre]);

  const animeGenres = useMemo(() => {
    const genreCounts = new Map<string, number>();
    allAnime.forEach((t) => {
      genreList(t).forEach((g) => {
        genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1);
      });
    });
    return Array.from(genreCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 16)
      .map(([name]) => name);
  }, [allAnime]);

  const handleRandomPick = () => {
    const next = allTitles[Math.floor(Math.random() * allTitles.length)];
    setRandomPick(next);
    navigate(`/${next.type}/${next.id}`);
  };

  return (
    <main>
      <HeroSection />

      <section className="container py-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { type: "anime" as TitleType, icon: Tv, color: "from-violet-500/20 to-primary/10", label: "Anime" },
            { type: "manga" as TitleType, icon: BookOpen, color: "from-emerald-500/20 to-accent/10", label: "Manga" },
            { type: "manhwa" as TitleType, icon: BookOpen, color: "from-sky-500/20 to-primary/10", label: "Manhwa" },
            { type: "manhua" as TitleType, icon: BookOpen, color: "from-amber-500/20 to-accent/10", label: "Manhua" },
            { type: "novel" as TitleType, icon: BookOpen, color: "from-rose-500/20 to-primary/10", label: "Novels" },
            { type: null as TitleType | null, icon: Sparkles, color: "from-primary/20 to-accent/20", label: "All titles" },
          ].map((item) => {
            const Icon = item.icon;
            const href = !item.type ? "/browse" : `/${item.type}`;
            const count = !item.type ? allTitles.length : getTitlesByType(item.type).length;
            return (
              <Link key={item.label} to={href} className={`group rounded-2xl border border-border/50 bg-gradient-to-br ${item.color} p-5 text-left transition hover:-translate-y-1 hover:border-primary/40`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 text-primary shadow-sm"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-display font-bold">{item.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{count} titles</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">Browse <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container py-12">
        <SectionHeader title="Trending now" description="Highly rated stories worth adding to your watchlist or reading queue." action={<Link to="/anime" className="text-sm font-semibold text-primary hover:underline">View all anime <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-48 shrink-0">
                <SkeletonGrid count={1} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 -mb-4">
            {trending.map((title, index) => (
              <div key={title.id} className="w-48 shrink-0">
                <AnimeSpotlightCard title={title} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container py-12" style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}>
        <SectionHeader title="Popular" description="Community favorites with scores that keep readers and viewers coming back." action={<Link to="/browse?sort=score" className="text-sm font-semibold text-primary hover:underline">See rankings <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? <SkeletonGrid count={6} /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{popularTitles.map((title, index) => <AnimeSpotlightCard key={title.id} title={title} index={index} />)}</div>}
      </section>

      <section className="container py-12">
        <SectionHeader title="Anime" description="Discover anime by genre" />
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedGenre === "All"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {animeGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedGenre === genre
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : animeByGenre.length === 0 ? (
          <EmptyState
            icon="search"
            title="No anime found"
            description={`No anime titles found for the "${selectedGenre}" genre.`}
            actionLabel="View all anime"
            actionHref="/anime"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {animeByGenre.map((title, index) => (
              <AnimeSpotlightCard key={title.id} title={title} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="container py-12">
        <SectionHeader title="New releases" description="Recently catalogued anime and reading — the latest additions to explore." action={<Link to="/browse?sort=popularity" className="text-sm font-semibold text-primary hover:underline">See all <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-48 shrink-0">
                <SkeletonGrid count={1} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 -mb-4">
            {newReleases.map((title, index) => (
              <div key={title.id} className="w-48 shrink-0">
                <AnimeSpotlightCard title={title} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container py-12">
        <SectionHeader title="Continue where you left off" description="Pick up the next episode or chapter from your local library." action={<Link to="/library" className="text-sm font-semibold text-primary hover:underline">Open library <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {continueItems.length === 0 ? (
          <EmptyState icon="heart" title="Nothing in progress yet" description="Add a title to your library and update your progress to see it here." actionLabel="Browse titles" actionHref="/browse" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{continueItems.slice(0, 6).map((entry, index) => {
            const title = allTitles.find((item) => item.id === entry.titleId);
            return title ? <AnimeSpotlightCard key={entry.titleId} title={title} index={index} /> : null;
          })}</div>
        )}
      </section>

      <section className="container py-12">
        <SectionHeader title="Recently added" description="The newest titles to join the GAURAVANIME catalogue." action={<Link to="/browse?sort=popularity" className="text-sm font-semibold text-primary hover:underline">See all <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-48 shrink-0">
                <SkeletonGrid count={1} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 -mb-4">
            {recentlyAdded.map((title, index) => (
              <div key={title.id} className="w-48 shrink-0">
                <AnimeSpotlightCard title={title} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container py-12">
        <SectionHeader title="Popular reading" description="Manga, manhwa, manhua, and novels with strong community scores." action={<Link to="/browse?type=manga" className="text-sm font-semibold text-primary hover:underline">Browse reading <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? <SkeletonGrid count={6} /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{popularReading.map((title, index) => <AnimeSpotlightCard key={title.id} title={title} index={index} />)}</div>}
      </section>

      <section className="container pb-24 pt-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-8 sm:p-12">
          <div className="absolute right-8 top-8 text-primary/20"><Flame className="h-24 w-24" /></div>
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/70 px-3 py-1.5 text-xs font-semibold text-primary"><Heart className="h-3.5 w-3.5 fill-current" /> Surprise me</div>
            <h2 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">Not sure what to choose?</h2>
            <p className="mt-3 text-muted-foreground">Let GAURAVANIME pick a title from the catalogue and open its details.</p>
            <button onClick={handleRandomPick} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5">
              Pick a random title <Sparkles className="h-4 w-4" />
            </button>
            {randomPick && <p className="mt-6 text-sm text-muted-foreground">Try <button onClick={handleRandomPick} className="font-semibold text-primary hover:underline">{displayTitle(randomPick)}</button> from your next random pick.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
