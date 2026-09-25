import React, { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, Heart, Star, Tv, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "@/contexts/LibraryContext";
import { useShowToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
import PosterImage from "@/components/common/PosterImage";
import { GlowCard } from "@/components/ui/spotlight-card";
import type { Title } from "@/types";
import { displayTitle, genreList } from "@/lib/title";

interface AnimeSpotlightCardProps {
  title: Title;
  index?: number;
  compact?: boolean;
}

const typeIcon = {
  anime: Tv,
  manga: BookOpen,
  manhwa: BookOpen,
  manhua: BookOpen,
  novel: BookOpen,
} as const;

const AnimeSpotlightCard = ({ title, index = 0, compact = false }: AnimeSpotlightCardProps) => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { addEntry, toggleFavorite, getEntry } = useLibrary();
  const entry = getEntry(title.id);
  const displayName = displayTitle(title);
  const genres = genreList(title).slice(0, 3);
  const Icon = typeIcon[title.type];

  const handleOpen = () => navigate(`/${title.type}/${title.id}`);

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!entry) {
      addEntry(title, { status: title.type === "anime" ? "plan_to_watch" : "plan_to_read" });
      showToast({ title: "Added to library", description: displayName, variant: "success" });
    } else {
      toggleFavorite(title.id);
      showToast({ title: entry.favorite ? "Removed from favorites" : "Added to favorites", description: displayName, variant: "info" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${displayName}`}
      className="relative"
    >
      <GlowCard
        glowColor="orange"
        customSize
        className={cn(
          "w-full cursor-pointer group transition-shadow hover:shadow-xl",
          compact ? "rounded-xl" : "rounded-2xl",
          !entry && "hover:border-primary/40"
        )}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
          <PosterImage
            src={title.image}
            fallbacks={title.imageFallbacks}
            alt={displayName}
            loading="lazy"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border",
                title.score >= 9
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : title.score >= 8.5
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
              )}
            >
              <Star className="h-3 w-3 fill-current" />
              {title.score.toFixed(2)}
            </span>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/45 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white/90">
              <Icon className="h-3 w-3" />
              {title.type}
            </span>
            {title.status === "Currently Airing" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30 text-[10px] font-semibold text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Airing
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
              {displayName}
            </h3>
            {title.title_japanese && (
              <p className="mt-0.5 text-[11px] text-white/60 line-clamp-1">{title.title_japanese}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <span key={genre} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary/80 text-muted-foreground border border-border/30">
                {genre}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground mt-auto">
            <div className="flex items-center gap-3">
              {title.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {title.year}
                </span>
              )}
              {title.episodes ? (
                <span className="flex items-center gap-1">
                  <Tv className="h-3 w-3" />
                  {title.episodes} eps
                </span>
              ) : title.chapters ? (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {title.chapters} ch
                </span>
              ) : null}
            </div>

            {entry ? (
              <span className="inline-flex items-center gap-1 text-primary/80">
                <Heart className={cn("h-3.5 w-3.5", entry.favorite && "fill-current")} />
                {entry.favorite ? "Faved" : "Saved"}
              </span>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary border border-primary/25 hover:bg-primary/25 transition-colors"
                aria-label={`Add ${displayName} to library`}
              >
                <Heart className="h-3 w-3" />
                Save
              </button>
            )}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
};

export default memo(AnimeSpotlightCard, (prev, next) => {
  return (
    prev.title.id === next.title.id &&
    prev.index === next.index &&
    prev.compact === next.compact
  );
});
