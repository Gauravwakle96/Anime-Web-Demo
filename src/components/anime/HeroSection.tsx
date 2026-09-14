import { motion } from "framer-motion";
import { Star, Play, TrendingUp } from "lucide-react";
import { animeList, displayTitle } from "@/data/anime";
import type { Anime } from "@/data/types";
import PosterImage from "@/components/common/PosterImage";

interface HeroSectionProps {
  onAnimeClick: (anime: Anime) => void;
}

export default function HeroSection({ onAnimeClick }: HeroSectionProps) {
  // Pick the top 3 anime by score as featured
  const featured = [...animeList].sort((a, b) => b.score - a.score).slice(0, 3);
  const hero = featured[0];

  return (
    <section className="relative overflow-hidden" id="hero-section">
      {/* Background image */}
      <div className="absolute inset-0">
        <PosterImage
          src={hero.image}
          fallbacks={hero.imageFallbacks}
          alt=""
          loading="eager"
          className="h-full w-full object-cover object-top opacity-20 blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      <div className="container relative py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              #1 Highest Rated
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-br from-white via-foreground to-muted-foreground bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Next Obsession
              </span>
            </h1>

            <p className="max-w-lg text-muted-foreground leading-relaxed">
              Explore our curated collection of{" "}
              <span className="text-foreground font-medium">
                {animeList.length} legendary anime
              </span>
              . From timeless classics to modern masterpieces — find scores,
              studios, and everything you need to pick your next binge.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                id="cta-explore"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Explore Catalogue
              </a>
              <a
                href="#top-rated"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-secondary/40 text-foreground font-semibold text-sm hover:bg-secondary/80 transition-all"
                id="cta-toprated"
              >
                <Star className="h-4 w-4" />
                Top Rated
              </a>
            </div>
          </motion.div>

          {/* Featured cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex items-end gap-4 justify-center"
          >
            {featured.map((anime, i) => {
              const t = displayTitle(anime);
              const isCenter = i === 0;
              return (
                <motion.div
                  key={anime.key}
                  whileHover={{ y: -8, scale: 1.03 }}
                  onClick={() => onAnimeClick(anime)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-2xl shadow-black/30 border border-white/10 transition-shadow hover:shadow-primary/20 ${
                    isCenter
                      ? "w-52 h-72 z-10"
                      : "w-40 h-56 opacity-80"
                  }`}
                >
                  <PosterImage
                    src={anime.image}
                    fallbacks={anime.imageFallbacks}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {t}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-bold text-amber-300">
                        {anime.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {isCenter && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/90 text-black rounded-md">
                        ★ #1
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Quick stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Anime Titles",
              value: animeList.length,
              color: "text-primary",
            },
            {
              label: "Avg Score",
              value: (
                animeList.reduce((s, a) => s + a.score, 0) / animeList.length
              ).toFixed(2),
              color: "text-amber-400",
            },
            {
              label: "Total Episodes",
              value: animeList
                .reduce((s, a) => s + (a.episodes ?? 0), 0)
                .toLocaleString(),
              color: "text-emerald-400",
            },
            {
              label: "Studios",
              value: new Set(animeList.flatMap((a) => a.studios.split("|")))
                .size,
              color: "text-accent",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-card/40 border border-border/30 backdrop-blur-sm"
            >
              <p className={`text-2xl font-display font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
