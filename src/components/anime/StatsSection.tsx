import { motion } from "framer-motion";
import { Star, BarChart3, Palette, Building2 } from "lucide-react";
import { animeList, allGenres, allStudios, displayTitle } from "@/data/anime";
import { cn } from "@/lib/utils";
import PosterImage from "@/components/common/PosterImage";

export default function StatsSection() {
  // Score distribution
  const scoreBuckets = [
    { label: "9.0+", min: 9, max: 10, color: "bg-amber-400" },
    { label: "8.5–9.0", min: 8.5, max: 9, color: "bg-emerald-400" },
    { label: "8.0–8.5", min: 8, max: 8.5, color: "bg-blue-400" },
    { label: "7.0–8.0", min: 7, max: 8, color: "bg-purple-400" },
    { label: "<7.0", min: 0, max: 7, color: "bg-red-400" },
  ].map((b) => ({
    ...b,
    count: animeList.filter((a) => a.score >= b.min && a.score < b.max).length,
  }));
  const maxBucket = Math.max(...scoreBuckets.map((b) => b.count));

  // Genre popularity (top 8)
  const genreCounts = allGenres
    .map((g) => ({
      name: g,
      count: animeList.filter((a) => a.genres.split("|").includes(g)).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const maxGenre = Math.max(...genreCounts.map((g) => g.count));

  // Studio leaderboard
  const studioCounts = allStudios
    .map((s) => ({
      name: s,
      count: animeList.filter((a) => a.studios.split("|").includes(s)).length,
      avgScore: (() => {
        const matching = animeList.filter((a) =>
          a.studios.split("|").includes(s)
        );
        return matching.reduce((sum, a) => sum + a.score, 0) / matching.length;
      })(),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Top 5 anime list
  const top5 = [...animeList].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <section className="py-16" id="stats">
      <div className="container space-y-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Collection Stats
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A data-driven look at our anime catalogue
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold">
                Score Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {scoreBuckets.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-muted-foreground text-right font-mono">
                    {b.label}
                  </span>
                  <div className="flex-1 h-7 rounded-lg bg-secondary/40 overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-lg", b.color)}
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(b.count / maxBucket) * 100}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="w-6 text-xs font-bold text-foreground">
                    {b.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Genre Popularity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <Palette className="h-5 w-5 text-accent" />
              <h3 className="font-display text-lg font-bold">
                Top Genres
              </h3>
            </div>
            <div className="space-y-2.5">
              {genreCounts.map((g, i) => (
                <div key={g.name} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-muted-foreground truncate">
                    {g.name}
                  </span>
                  <div className="flex-1 h-5 rounded-md bg-secondary/40 overflow-hidden">
                    <motion.div
                      className="h-full rounded-md bg-gradient-to-r from-primary/80 to-accent/80"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(g.count / maxGenre) * 100}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 * i }}
                    />
                  </div>
                  <span className="w-6 text-xs font-bold text-foreground">
                    {g.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Studio Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-lg font-bold">
                Studios
              </h3>
            </div>
            <div className="space-y-3">
              {studioCounts.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30 border border-border/20"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.count} title{s.count !== 1 && "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      {s.avgScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top 5 Ranking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm"
            id="top-rated"
          >
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <h3 className="font-display text-lg font-bold">
                Top 5 Rated
              </h3>
            </div>
            <div className="space-y-3">
              {top5.map((anime, i) => {
                const t = displayTitle(anime);
                const medals = ["🥇", "🥈", "🥉", "4", "5"];
                return (
                  <div
                    key={anime.key}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/40 transition-colors"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-bold">
                      {medals[i]}
                    </span>
                    <PosterImage
                      src={anime.image}
                      fallbacks={anime.imageFallbacks}
                      alt={t}
                      loading="lazy"
                      className="h-10 w-8 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {anime.studios.split("|")[0]} · {anime.year}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-amber-300">
                        {anime.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
