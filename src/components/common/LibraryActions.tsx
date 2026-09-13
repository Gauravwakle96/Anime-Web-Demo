import { Heart, Trash2, Star } from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useShowToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
import type { LibraryStatus, Title } from "@/types";

interface LibraryActionsProps {
  title: Title;
  onStatusChange?: (status: LibraryStatus) => void;
}

const animeStatuses: LibraryStatus[] = ["plan_to_watch", "watching", "completed", "on_hold", "dropped"];
const readingStatuses: LibraryStatus[] = ["plan_to_read", "reading", "completed", "on_hold", "dropped"];

export default function LibraryActions({ title, onStatusChange }: LibraryActionsProps) {
  const { getEntry, removeEntry, toggleFavorite, updateStatus, setRating } = useLibrary();
  const showToast = useShowToast();
  const entry = getEntry(title.id);
  const statuses = title.type === "anime" ? animeStatuses : readingStatuses;

  const handleRemove = () => {
    removeEntry(title.id);
    showToast({ title: "Removed from library", description: title.title_english || title.title, variant: "info" });
  };

  const handleStatus = (status: LibraryStatus) => {
    updateStatus(title.id, status);
    onStatusChange?.(status);
    showToast({ title: "Status updated", description: `${title.title_english || title.title} → ${status.replace(/_/g, " ")}`, variant: "success" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {entry ? (
        <>
          <select
            value={entry.status}
            onChange={(event) => handleStatus(event.target.value as LibraryStatus)}
            className="h-9 rounded-lg border border-border/60 bg-secondary/70 px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Library status"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button
            onClick={() => toggleFavorite(title.id)}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-semibold transition-colors",
              entry.favorite
                ? "bg-accent/15 text-accent border-accent/40"
                : "bg-secondary/60 text-muted-foreground border-border/50 hover:text-foreground"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", entry.favorite && "fill-current")} />
            {entry.favorite ? "Favorited" : "Favorite"}
          </button>
          <button
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/50 bg-secondary/60 text-xs font-semibold text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/15 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
          <div className="flex items-center gap-1 ml-auto">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const rating = entry.userRating === value * 2 ? 0 : value * 2;
                  setRating(title.id, rating);
                  showToast({ title: "Rating updated", description: rating ? `${rating}/10` : "Cleared", variant: "info" });
                }}
                aria-label={`Rate ${value * 2} out of 10`}
                className={cn(
                  "p-1 transition-colors",
                  entry.userRating === value * 2 ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"
                )}
              >
                <Star className={cn("h-4 w-4", entry.userRating >= value * 2 && "fill-current")} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <button
          onClick={() => {
            onStatusChange?.(title.type === "anime" ? "plan_to_watch" : "plan_to_read");
          }}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
        >
          + Add to Library
        </button>
      )}
    </div>
  );
}
