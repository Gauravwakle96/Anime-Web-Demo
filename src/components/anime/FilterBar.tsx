import {
  Filter,
  ArrowUpDown,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { allGenres, allStudios, allYears } from "@/data/anime";
import type { FilterState, SortOption } from "@/data/types";
import { useState } from "react";

interface FilterBarProps {
  filter: FilterState;
  activeCount: number;
  onToggleGenre: (genre: string) => void;
  onToggleStudio: (studio: string) => void;
  onToggleYear: (year: string) => void;
  onSort: (sortBy: SortOption) => void;
  onReset: () => void;
  resultCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "score", label: "Score" },
  { value: "year", label: "Year" },
  { value: "title", label: "Title" },
  { value: "episodes", label: "Episodes" },
];

export default function FilterBar({
  filter,
  activeCount,
  onToggleGenre,
  onToggleStudio,
  onToggleYear,
  onSort,
  onReset,
  resultCount,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4" id="filter-bar">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
              expanded
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
            id="filter-toggle"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                expanded && "rotate-180"
              )}
            />
          </button>

          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              id="filter-reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear all
            </button>
          )}
        </div>

        {/* Sort + count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{resultCount}</span>{" "}
            results
          </span>

          <div className="flex items-center gap-1 rounded-xl border border-border/50 bg-secondary/40 p-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSort(opt.value)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filter.sortBy === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                {opt.label}
                {filter.sortBy === opt.value && (
                  <ArrowUpDown className="inline ml-1 h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded filters */}
      <div
        className={cn(
          "overflow-hidden transition-all",
          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-5 p-5 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm">
          {/* Genres */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Genres
            </h4>
            <div className="flex flex-wrap gap-2">
              {allGenres.map((g) => {
                const active = filter.genres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => onToggleGenre(g)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      active
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "bg-secondary/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {g}
                    {active && <X className="inline ml-1.5 h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Studios */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Studios
            </h4>
            <div className="flex flex-wrap gap-2">
              {allStudios.map((s) => {
                const active = filter.studios.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => onToggleStudio(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      active
                        ? "bg-accent/15 border-accent/30 text-accent"
                        : "bg-secondary/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {s}
                    {active && <X className="inline ml-1.5 h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Years */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Year
            </h4>
            <div className="flex flex-wrap gap-2">
              {allYears.map((y) => {
                const active = filter.years.includes(y);
                return (
                  <button
                    key={y}
                    onClick={() => onToggleYear(y)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      active
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-secondary/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {y}
                    {active && <X className="inline ml-1.5 h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
