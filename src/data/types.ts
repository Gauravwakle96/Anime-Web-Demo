export interface Anime {
  key: string;
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  image: string;
  score: number;
  year: number | null;
  episodes: number | null;
  status: string;
  genres: string;
  studios: string;
  type: string;
  rating: string;
  season: string | null;
  duration: string;
  synopsis: string;
}

export type SortOption = "score" | "year" | "title" | "episodes";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  search: string;
  genres: string[];
  studios: string[];
  years: string[];
  sortBy: SortOption;
  sortDir: SortDirection;
}
