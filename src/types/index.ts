export type TitleType = "anime" | "manga" | "manhwa" | "manhua" | "novel";

export type TitleStatus =
  | "Finished Airing"
  | "Currently Airing"
  | "Not yet aired"
  | "Publishing"
  | "Completed"
  | "On Hold"
  | "Dropped";

export interface Title {
  id: string;
  mal_id: number;
  type: TitleType;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  image: string;
  banner?: string;
  score: number;
  year: number | null;
  episodes: number | null;
  chapters: number | null;
  volumes: number | null;
  status: TitleStatus;
  genres: string;
  studios: string;
  author: string;
  rating: string;
  season: string | null;
  duration: string;
  synopsis: string;
  popularity: number;
  source?: string;
  aired?: string;
  published?: string;
}

export type SortOption = "score" | "year" | "title" | "episodes" | "popularity";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  search: string;
  genres: string[];
  studios: string[];
  years: string[];
  types: TitleType[];
  statuses: TitleStatus[];
  minScore: number;
  sortBy: SortOption;
  sortDir: SortDirection;
}

export type LibraryStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_read"
  | "reading";

export interface LibraryEntry {
  titleId: string;
  status: LibraryStatus;
  favorite: boolean;
  userRating: number;
  progress: number;
  totalProgress: number;
  addedAt: string;
  updatedAt: string;
}

export interface UserProfile {
  username: string;
  avatar?: string;
  bio: string;
  joinedAt: string;
}

export interface EpisodeMetadata {
  mal_id: number;
  title: string;
  episode: number;
  aired: string;
  duration: string;
  synopsis: string;
  watched: boolean;
}

export interface ChapterMetadata {
  mal_id: number;
  title: string;
  chapter: number;
  published: string;
  read: boolean;
}

export interface SeasonData {
  season_name: string;
  season_year: number;
  anime: Title[];
}

export interface SearchResult {
  titles: Title[];
  total: number;
  hasMore: boolean;
}
