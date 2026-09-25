import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, Flame, Search, SlidersHorizontal } from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { allTitles } from "@/data/catalog";
import EmptyState from "@/components/common/EmptyState";
import GenreChips from "@/components/common/GenreChips";
import SectionHeader from "@/components/common/SectionHeader";
import AnimeSpotlightCard from "@/components/anime/AnimeSpotlightCard";
import TypeTabs from "@/components/common/TypeTabs";
import { displayTitle, genreList } from "@/lib/title";
import type { TitleType } from "@/types";

const typeOptions: Array<{ value: TitleType | "all"; label: string }> = [
  { value: "all", label: "All formats" },
  { value: "anime", label: "Anime" },
  { value: "manga", label: "Manga" },
  { value: "manhwa", label: "Manhwa" },
  { value: "manhua", label: "Manhua" },
  { value: "novel", label: "Novels" },
];

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const { genre: routeGenre = "" } = useParams();
  const navigate = useNavigate();
  const pathType = location.pathname.split("/").filter(Boolean)[0] || "";
  const routeType = pathType === "novels" ? "novel" : ["anime", "manga", "manhwa", "manhua", "novel"].includes(pathType) ? pathType as TitleType : "";
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState(params.get("sort") || "score");
  const [direction, setDirection] = useState<"asc" | "desc">(params.get("dir") === "asc" ? "asc" : "desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedGenre = routeGenre.replace(/-/g, " ");

  const type = (routeType as TitleType | null) || (params.get("type") as TitleType | null) || "all";
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = allTitles.filter((title) => {
      if (type !== "all" && title.type !== type) return false;
      if (selectedGenre && !genreList(title).some((item) => item.toLowerCase() === selectedGenre.toLowerCase())) return false;
      if (normalized) {
        const haystack = [title.title, title.title_english, title.title_japanese, ...genreList(title)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalized)) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      let comparison = 0;
      if (sort === "title") comparison = displayTitle(a).localeCompare(displayTitle(b));
      if (sort === "year") comparison = (a.year || 0) - (b.year || 0);
      if (sort === "popularity") comparison = a.popularity - b.popularity;
      if (sort === "episodes") comparison = (a.episodes || a.chapters || 0) - (b.episodes || b.chapters || 0);
      if (sort === "score") comparison = a.score - b.score;
      return direction === "asc" ? comparison : -comparison;
    });
  }, [direction, query, selectedGenre, sort, type]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const selectType = (value: TitleType | "all") => {
    navigate(value === "all" ? "/browse" : value === "novel" ? "/novels" : `/${value}`);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateParam("q", query.trim());
  };

  const activeType = type || "all";
  const activeTab = activeType === "all" ? "all" : activeType;

  return (
    <main className="container py-12">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Browse every story</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Search and filter the GAURAVANIME catalogue across anime, manga, manhwa, manhua, and novels.</p>
      </div>

      <div className="mb-8">
        <TypeTabs active={activeTab} />
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/50 bg-card/40 p-4 shadow-lg shadow-black/5 lg:grid-cols-[1fr_auto]">
        <form onSubmit={submitSearch} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, author, or genre..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
          {query && <button type="button" onClick={() => { setQuery(""); updateParam("q", ""); }} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Clear</button>}
        </form>
        <button type="button" onClick={() => setFiltersOpen((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:border-primary/40 lg:min-w-[170px]">
          <SlidersHorizontal className="h-4 w-4" /> Filters <ChevronDown className={`h-3.5 w-3.5 transition ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {filtersOpen && (
        <div className="mt-4 grid gap-5 rounded-2xl border border-border/50 bg-secondary/20 p-5 lg:grid-cols-[1fr_1fr]">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Format</label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button key={option.value} type="button" onClick={() => selectType(option.value)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${activeType === option.value ? "border-primary bg-primary/15 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort by</label>
            <div className="flex flex-wrap items-center gap-2">
              <select value={sort} onChange={(event) => { setSort(event.target.value); updateParam("sort", event.target.value); }} className="h-10 rounded-lg border border-border bg-background px-3 text-xs font-semibold outline-none">
                <option value="score">Score</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
                <option value="popularity">Popularity</option>
                <option value="episodes">Length</option>
              </select>
              <button type="button" onClick={() => { const next = direction === "asc" ? "desc" : "asc"; setDirection(next); updateParam("dir", next); }} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2.5 text-xs font-semibold">
                {direction === "asc" ? <ArrowUpAZ className="h-3.5 w-3.5" /> : <ArrowDownAZ className="h-3.5 w-3.5" />} {direction === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeader title={selectedGenre ? selectedGenre : typeOptions.find((option) => option.value === activeType)?.label || "All titles"} description={`${filtered.length} ${filtered.length === 1 ? "title" : "titles"} found`} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Flame className="h-4 w-4 text-primary" /> {query || selectedGenre || activeType !== "all" ? "Filtered results" : "Curated catalogue"}</div>
      </div>

      {selectedGenre && <div className="mb-8"><GenreChips genres={[selectedGenre]} limit={1} /></div>}

      {filtered.length === 0 ? (
        <EmptyState icon="search" title="No stories found" description="Try a different search, genre, or format to see more results." actionLabel="Clear filters" actionHref="/browse" />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((title, index) => <AnimeSpotlightCard key={title.id} title={title} index={index} />)}
        </div>
      )}
    </main>
  );
}
