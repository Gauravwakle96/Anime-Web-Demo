import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Calendar,
  Tv,
  Clock,
  Film,
  Shield,
  ExternalLink,
} from "lucide-react";
import type { Anime } from "@/data/types";
import { displayTitle } from "@/data/anime";
import PosterImage from "@/components/common/PosterImage";

interface AnimeDetailModalProps {
  anime: Anime | null;
  onClose: () => void;
}

export default function AnimeDetailModal({
  anime,
  onClose,
}: AnimeDetailModalProps) {
  if (!anime) return null;
  const title = displayTitle(anime);
  const genres = anime.genres.split("|");
  const studios = anime.studios.split("|");

  return (
    <AnimatePresence>
      {anime && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          id="anime-detail-modal"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border/50 shadow-2xl shadow-black/40 scrollbar-thin"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white backdrop-blur-sm transition-colors"
              aria-label="Close"
              id="modal-close-btn"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Hero banner */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <PosterImage
                src={anime.image}
                fallbacks={anime.imageFallbacks}
                alt={title}
                loading="eager"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

              {/* Title overlay */}
              <div className="absolute bottom-6 left-6 right-16">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                  {title}
                </h2>
                {anime.title_japanese && (
                  <p className="mt-1 text-sm text-white/60">
                    {anime.title_japanese}
                  </p>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Score + Meta */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="text-xl font-bold text-amber-300">
                    {anime.score.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {anime.year && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/30">
                      <Calendar className="h-3.5 w-3.5" />
                      {anime.year}
                      {anime.season && (
                        <span className="capitalize">· {anime.season}</span>
                      )}
                    </span>
                  )}
                  {anime.episodes && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/30">
                      <Tv className="h-3.5 w-3.5" />
                      {anime.episodes} episodes
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/30">
                    <Clock className="h-3.5 w-3.5" />
                    {anime.duration}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/30">
                    <Film className="h-3.5 w-3.5" />
                    {anime.type}
                  </span>
                </div>
              </div>

              {/* Status + Rating */}
              <div className="flex flex-wrap gap-3">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    anime.status === "Currently Airing"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      anime.status === "Currently Airing"
                        ? "bg-green-400 animate-pulse"
                        : "bg-blue-400"
                    }`}
                  />
                  {anime.status}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/60 text-muted-foreground border border-border/30">
                  <Shield className="h-3.5 w-3.5" />
                  {anime.rating}
                </span>
              </div>

              {/* Genres */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Studios */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Studios
                </h4>
                <div className="flex flex-wrap gap-2">
                  {studios.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent border border-accent/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Synopsis
                </h4>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {anime.synopsis}
                </p>
              </div>

              {/* MAL Link */}
              <a
                href={`https://myanimelist.net/anime/${anime.mal_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
                id="mal-link"
              >
                View on MyAnimeList
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
