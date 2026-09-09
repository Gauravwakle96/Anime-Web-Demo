import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/anime/HeroSection";
import FilterBar from "@/components/anime/FilterBar";
import AnimeCard from "@/components/anime/AnimeCard";
import AnimeDetailModal from "@/components/anime/AnimeDetailModal";
import StatsSection from "@/components/anime/StatsSection";
import { useAnimeFilter } from "@/hooks/useAnimeFilter";
import type { Anime } from "@/data/types";

export default function App() {
  const {
    filter,
    filtered,
    setSearch,
    toggleGenre,
    toggleStudio,
    toggleYear,
    setSort,
    resetFilters,
    activeFilterCount,
  } = useAnimeFilter();

  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const handleAnimeClick = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onSearchChange={setSearch}
        searchValue={filter.search}
      />

      <main className="flex-1">
        <HeroSection onAnimeClick={handleAnimeClick} />

        <section className="py-10" id="catalogue">
          <div className="container space-y-6">
            <FilterBar
              filter={filter}
              activeCount={activeFilterCount}
              onToggleGenre={toggleGenre}
              onToggleStudio={toggleStudio}
              onToggleYear={toggleYear}
              onSort={setSort}
              onReset={resetFilters}
              resultCount={filtered.length}
            />

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              id="anime-grid"
              role="list"
              aria-label="Anime catalogue"
            >
              {filtered.map((anime, index) => (
                <AnimeCard
                  key={anime.key}
                  anime={anime}
                  index={index}
                  onClick={handleAnimeClick}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium">No anime found</p>
                  <p className="mt-1 text-sm">Try adjusting your filters or search</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <StatsSection />
      </main>

      <Footer />

      <AnimeDetailModal
        anime={selectedAnime}
        onClose={handleCloseModal}
      />
    </div>
  );
}