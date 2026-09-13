import { animeList } from "./anime";
import { readingCatalog } from "./reading";
import type { Title, TitleType } from "@/types";

export const animeCatalog: Title[] = animeList.map((a) => ({
  id: String(a.mal_id),
  mal_id: a.mal_id,
  type: "anime",
  title: a.title,
  title_english: a.title_english,
  title_japanese: a.title_japanese,
  image: a.image,
  score: a.score,
  year: a.year,
  episodes: a.episodes,
  chapters: null,
  volumes: null,
  status: a.status as Title["status"],
  genres: a.genres,
  studios: a.studios,
  author: "",
  rating: a.rating,
  season: a.season,
  duration: a.duration,
  synopsis: a.synopsis,
  popularity: a.mal_id,
}));

export const allTitles: Title[] = [...animeCatalog, ...readingCatalog];

export function getTitlesByType(type: TitleType): Title[] {
  return allTitles.filter((title) => title.type === type);
}

export function getTitlesByGenre(genre: string, type?: TitleType): Title[] {
  const normalized = genre.toLowerCase();
  return allTitles.filter((title) => {
    if (type && title.type !== type) return false;
    return title.genres
      .split("|")
      .some((item) => item.toLowerCase() === normalized);
  });
}

export function getRecentlyAdded(type?: TitleType): Title[] {
  return getTitlesByType(type || "anime").slice(-12).reverse();
}

export function getCurrentlyAiring(type?: TitleType): Title[] {
  return allTitles.filter((title) => {
    if (type && title.type !== type) return false;
    return title.status === "Currently Airing" || title.status === "Publishing";
  });
}

export function getTopRated(type?: TitleType, limit = 12): Title[] {
  return getTitlesByType(type || "anime")
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getPopular(type?: TitleType, limit = 12): Title[] {
  return getTitlesByType(type || "anime")
    .sort((a, b) => a.popularity - b.popularity)
    .slice(0, limit);
}
