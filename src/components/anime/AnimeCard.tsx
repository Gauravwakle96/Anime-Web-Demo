import { motion } from "framer-motion";
import { Star, Play, Calendar, Tv } from "lucide-react";
import type { Anime } from "@/data/types";
import { displayTitle } from "@/data/anime";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime;
  index: number;
  onClick: (anime: Anime) => void;
}

export default function AnimeCard({ anime, index, onClick }: AnimeCardProps) {
  const title = displayTitle(anime);
  const genres = anime.genres.split("|").slice(0, 3);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card/60 border border-border/40 backdrop-blur-sm cursor-pointer shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-primary/10 transition-shadow"
      onClick={() => onClick(anime)}
      id={`anime-card-${anime.key}`}
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Score badge */}
        <div className="absolute top-3 right-3">
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border",
              anime.score >= 9
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : anime.score >= 8.5
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
            )}
          >
            <Star className="h-3 w-3 fill-current" />
            {anime.score.toFixed(2)}
          </div>
        </div>

        {/* Status badge */}
        {anime.status === "Currently Airing" && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Airing
            </span>
          </div>
        )}

        {/* Hover play icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm shadow-xl shadow-primary/30">
            <Play className="h-6 w-6 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Bottom info on poster */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
            {title}
          </h3>
          {anime.title_japanese && (
            <p className="mt-0.5 text-[11px] text-white/60 line-clamp-1">
              {anime.title_japanese}
            </p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2.5 p-3.5 flex-1">
        {/* Genres */}
        <div className="flex flex-wrap gap-1.5">
          {genres.map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary/80 text-muted-foreground border border-border/30"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-auto">
          {anime.year && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {anime.year}
            </span>
          )}
          {anime.episodes && (
            <span className="flex items-center gap-1">
              <Tv className="h-3 w-3" />
              {anime.episodes} eps
            </span>
          )}
          <span className="ml-auto text-[10px] font-medium text-primary/70">
            {anime.studios.split("|")[0]}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
