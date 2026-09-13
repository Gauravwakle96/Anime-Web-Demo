import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Flame, Heart, Play, Sparkles, Star, Tv } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  allTitles,
  getCurrentlyAiring,
  getPopular,
  getTitlesByType,
  getTopRated,
} from "@/data/catalog";
import { useLibrary } from "@/contexts/LibraryContext";
import EmptyState from "@/components/common/EmptyState";
import GenreChips from "@/components/common/GenreChips";
import SectionHeader from "@/components/common/SectionHeader";
import SkeletonGrid from "@/components/common/SkeletonGrid";
import TitleCard from "@/components/common/TitleCard";
import TypeTabs from "@/components/common/TypeTabs";
import { displayTitle, typeLabel } from "@/lib/title";
import type { TitleType } from "@/types";

export default function HomePage() {
  const navigate = useNavigate();
  const { continueItems } = useLibrary();
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(allTitles[0]);
  const [randomPick, setRandomPick] = useState(allTitles[0]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = getTopRated("anime", 1)[0] || allTitles[0];
    const random = allTitles[Math.floor(Math.random() * allTitles.length)];
    setFeatured(hero);
    setRandomPick(random);
  }, []);

  const trending = useMemo(() => getTopRated("anime", 12), []);
  const topRated = useMemo(() => getTopRated("anime", 12), []);
  const currentlyAiring = useMemo(() => getCurrentlyAiring("anime").slice(0, 12), []);
  const popularReading = useMemo(() => getPopular("manga", 12), []);
  const genres = useMemo(
    () => Array.from(new Set(allTitles.flatMap((title) => title.genres.split("|").filter(Boolean)))).slice(0, 18),
    []
  );

  const handleRandomPick = () => {
    const next = allTitles[Math.floor(Math.random() * allTitles.length)];
    setRandomPick(next);
    navigate(`/${next.type}/${next.id}`);
  };

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/15 via-background to-background">
        <div className="absolute inset-0 opacity-20 blur-3xl" aria-hidden="true">
          <div className="h-72 w-72 rounded-full bg-primary/30" />
          <div className="ml-auto h-72 w-72 rounded-full bg-accent/20" />
        </div>
        <div className="container relative grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4" /> Your next story starts here
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Discover anime,<br />manga, manhwa,<br />and novels.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Build your personal library, track progress, and find your next favorite story across every format.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/browse" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5">
                Explore catalogue <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/library" className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-6 py-3.5 text-sm font-bold transition hover:bg-secondary">
                Open your library
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-muted-foreground">
              <div><strong className="font-display text-2xl text-foreground">{allTitles.length}</strong><span className="ml-2">titles</span></div>
              <div><strong className="font-display text-2xl text-foreground">4</strong><span className="ml-2">formats</span></div>
              <div><strong className="font-display text-2xl text-foreground">100%</strong><span className="ml-2">local-first</span></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-accent/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <img src={featured.image} alt={displayTitle(featured)} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Tv className="h-4 w-4" /> {typeLabel(featured.type)}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{displayTitle(featured)}</h2>
                  <p className="mt-2 text-sm leading-5 text-white/75 line-clamp-3">{featured.synopsis}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-white/80">
                    <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current text-amber-400" /> {featured.score.toFixed(1)}</span>
                    <span>{featured.year || "Unknown year"}</span>
                    <span>{featured.episodes ? `${featured.episodes} eps` : featured.chapters ? `${featured.chapters} ch` : "Ongoing"}</span>
                  </div>
                  <button onClick={() => navigate(`/${featured.type}/${featured.id}`)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:bg-white/85">
                    <Play className="h-3.5 w-3.5 fill-current" /> View details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeader title="Explore by format" description="Move between animated stories and reading formats without losing your place." action={<TypeTabs active="all" />} />
        {loading ? <SkeletonGrid count={6} /> : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { type: "anime", icon: Tv, color: "from-violet-500/20 to-primary/10", label: "Anime" },
              { type: "manga", icon: BookOpen, color: "from-emerald-500/20 to-accent/10", label: "Manga" },
              { type: "manhwa", icon: BookOpen, color: "from-sky-500/20 to-primary/10", label: "Manhwa" },
              { type: "manhua", icon: BookOpen, color: "from-amber-500/20 to-accent/10", label: "Manhua" },
              { type: "novel", icon: BookOpen, color: "from-rose-500/20 to-primary/10", label: "Novels" },
              { type: "all", icon: Sparkles, color: "from-primary/20 to-accent/20", label: "All titles" },
            ].map((item) => {
              const Icon = item.icon;
              const href = item.type === "all" ? "/browse" : `/${item.type}`;
              return (
                <Link key={item.type} to={href} className={`group rounded-2xl border border-border/50 bg-gradient-to-br ${item.color} p-5 text-left transition hover:-translate-y-1 hover:border-primary/40`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 text-primary shadow-sm"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 font-display font-bold">{item.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.type === "all" ? allTitles.length : getTitlesByType(item.type as TitleType).length} titles</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">Browse <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" /></span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="container py-12">
        <SectionHeader title="Trending now" description="Highly rated stories worth adding to your watchlist or reading queue." action={<Link to="/anime" className="text-sm font-semibold text-primary hover:underline">View all anime <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
          {loading ? <SkeletonGrid count={6} /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{trending.map((title) => <TitleCard key={title.id} title={title} />)}</div>}
      </section>

      <section className="container py-12">
        <SectionHeader title="Top rated" description="Community favorites with scores that keep readers and viewers coming back." action={<Link to="/browse?sort=score" className="text-sm font-semibold text-primary hover:underline">See rankings <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? <SkeletonGrid count={6} /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{topRated.map((title, index) => <TitleCard key={title.id} title={title} index={index} />)}</div>}
      </section>

      <section className="container py-12">
        <SectionHeader title="Continue where you left off" description="Pick up the next episode or chapter from your local library." action={<Link to="/library" className="text-sm font-semibold text-primary hover:underline">Open library <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {continueItems.length === 0 ? (
          <EmptyState icon="heart" title="Nothing in progress yet" description="Add a title to your library and update your progress to see it here." actionLabel="Browse titles" actionHref="/browse" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{continueItems.slice(0, 6).map((entry, index) => {
            const title = allTitles.find((item) => item.id === entry.titleId);
            return title ? <TitleCard key={entry.titleId} title={title} index={index} /> : null;
          })}</div>
        )}
      </section>

      <section className="container py-12">
        <SectionHeader title="Currently airing" description="Keep up with new episodes from stories that are still on the air." action={<Link to="/calendar" className="text-sm font-semibold text-primary hover:underline">View calendar <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? <SkeletonGrid count={6} /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{currentlyAiring.map((title, index) => <TitleCard key={title.id} title={title} index={index} />)}</div>}
      </section>

      <section className="container py-12">
        <SectionHeader title="Popular reading" description="Manga, manhwa, manhua, and novels with strong community scores." action={<Link to="/browse?type=manga" className="text-sm font-semibold text-primary hover:underline">Browse reading <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>} />
        {loading ? <SkeletonGrid count={6} /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{popularReading.map((title, index) => <TitleCard key={title.id} title={title} index={index} />)}</div>}
      </section>

      <section className="container py-12">
        <SectionHeader title="Explore genres" description="Find the mood, world, or story shape that fits your next binge." />
        <GenreChips genres={genres} limit={18} />
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
