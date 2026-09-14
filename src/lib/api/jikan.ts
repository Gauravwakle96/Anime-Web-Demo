import type {
  EpisodeMetadata,
  SearchResult,
  SeasonData,
  Title,
  TitleType,
} from "@/types";

const BASE_URL = "https://api.jikan.moe/v4";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

interface JikanImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface JikanAnime {
  mal_id: number;
  url: string;
  images: { jpg: JikanImage; webp: JikanImage };
  trailer: { youtube_id: string | null } | null;
  approved: boolean;
  titles: Array<{ type: string; title: string }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  airing_start: string | null;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: { day: string | null; time: string | null } | null;
  producers: Array<{ mal_id: number; type: string; name: string; url: string }>;
  licensors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  explicit_genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

interface JikanManga {
  mal_id: number;
  url: string;
  images: { jpg: JikanImage; webp: JikanImage };
  approved: boolean;
  titles: Array<{ type: string; title: string }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: { from: string | null; to: string | null; prop: unknown; string: string | null };
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string;
  background: string | null;
  authors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  serializations: Array<{ mal_id: number; type: string; name: string; url: string }>;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  explicit_genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

interface JikanEpisode {
  mal_id: number;
  title: string;
  aired: string | null;
  duration: string | null;
  synopsis: string | null;
}

interface JikanSeasonResponse {
  season_name: string;
  season_year: number;
  data: JikanAnime[];
}

interface JikanResponse<T> {
  data: T;
  pagination: { last_visible_page: number; has_next_page: boolean };
}

interface JikanListResponse<T> {
  data: T[];
  pagination: { last_visible_page: number; has_next_page: boolean };
}

function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`gauravanime:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data as T;
  } catch {
    return null;
  }
}

function cacheSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      `gauravanime:${key}`,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Storage full or unavailable — API still works without cache
  }
}

async function jikanFetch<T>(path: string, cacheKey: string): Promise<T | null> {
  const cached = cacheGet<T>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
      if (response.status === 429) return null; // Rate limited — use cache or empty
      throw new Error(`Jikan API error: ${response.status}`);
    }
    const json = (await response.json()) as T;
    cacheSet(cacheKey, json);
    return json;
  } catch {
    return null;
  }
}

function mapAnime(item: JikanAnime): Title {
  const genres = [...(item.genres || []), ...(item.explicit_genres || [])]
    .map((g) => g.name)
    .filter(Boolean);
  const studios = (item.studios || []).map((s) => s.name).filter(Boolean);

  return {
    id: String(item.mal_id),
    mal_id: item.mal_id,
    type: "anime",
    title: item.title,
    title_english: item.title_english,
    title_japanese: item.title_japanese,
    image: item.images.jpg.large_image_url,
    imageFallbacks: [
      item.images.jpg.image_url,
      item.images.webp.large_image_url,
      item.images.webp.image_url,
    ],
    banner: item.images.jpg.large_image_url,
    score: item.score ?? 0,
    year: item.year,
    episodes: item.episodes,
    chapters: null,
    volumes: null,
    status: item.status as Title["status"],
    genres: genres.join("|"),
    studios: studios.join("|"),
    author: "",
    rating: item.rating || "Not available",
    season: item.season,
    duration: item.duration || "Not available",
    synopsis: item.synopsis || "Not available",
    popularity: item.popularity ?? 999999,
    source: item.source || undefined,
    aired: item.airing_start || undefined,
  };
}

function mapManga(item: JikanManga, type: TitleType): Title {
  const genres = [...(item.genres || []), ...(item.explicit_genres || [])]
    .map((g) => g.name)
    .filter(Boolean);
  const authors = (item.authors || []).map((a) => a.name).filter(Boolean);

  return {
    id: String(item.mal_id),
    mal_id: item.mal_id,
    type,
    title: item.title,
    title_english: item.title_english,
    title_japanese: item.title_japanese,
    image: item.images.jpg.large_image_url,
    imageFallbacks: [
      item.images.jpg.image_url,
      item.images.webp.large_image_url,
      item.images.webp.image_url,
    ],
    banner: item.images.jpg.large_image_url,
    score: item.score ?? 0,
    year: item.published?.from ? new Date(item.published.from).getFullYear() : null,
    episodes: null,
    chapters: item.chapters,
    volumes: item.volumes,
    status: item.status as Title["status"],
    genres: genres.join("|"),
    studios: "",
    author: authors.join(", ") || "Not available",
    rating: "Not available",
    season: null,
    duration: "Not available",
    synopsis: item.synopsis || "Not available",
    popularity: item.popularity ?? 999999,
    published: item.published?.string || undefined,
  };
}

export async function searchTitles(
  query: string,
  type?: TitleType,
  page = 1
): Promise<SearchResult> {
  const cacheKey = `search:${type || "all"}:${query}:${page}`;
  const cached = cacheGet<SearchResult>(cacheKey);
  if (cached) return cached;

  const typePath = type && type !== "manhwa" && type !== "manhua" && type !== "novel"
    ? type
    : type === "manhwa" || type === "manhua"
      ? "manga"
      : undefined;

  const path = `/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true`;
  const mangaPath = `/manga?q=${encodeURIComponent(query)}&page=${page}`;

  const [animeRes, mangaRes] = await Promise.all([
    typePath === "anime" || !typePath ? jikanFetch<JikanListResponse<JikanAnime>>(path, `${cacheKey}:anime`) : Promise.resolve(null),
    typePath === "manga" || !typePath ? jikanFetch<JikanListResponse<JikanManga>>(mangaPath, `${cacheKey}:manga`) : Promise.resolve(null),
  ]);

  const titles: Title[] = [
    ...(animeRes?.data || []).map(mapAnime),
    ...(mangaRes?.data || []).map((m) => mapManga(m, "manga")),
  ];

  const result: SearchResult = {
    titles,
    total: titles.length,
    hasMore: Boolean(animeRes?.pagination.has_next_page || mangaRes?.pagination.has_next_page),
  };
  cacheSet(cacheKey, result);
  return result;
}

export async function getTopTitles(
  type: TitleType,
  page = 1,
  filter: "bypopularity" | "favorite" | "score" | "airing" | "upcoming" = "bypopularity"
): Promise<Title[]> {
  const cacheKey = `top:${type}:${filter}:${page}`;
  const cached = cacheGet<Title[]>(cacheKey);
  if (cached) return cached;

  if (type === "anime") {
    const res = await jikanFetch<JikanListResponse<JikanAnime>>(
      `/top/anime?page=${page}&filter=${filter}&sfw=true`,
      cacheKey
    );
    const result = (res?.data || []).map(mapAnime);
    cacheSet(cacheKey, result);
    return result;
  }

  const res = await jikanFetch<JikanListResponse<JikanManga>>(
    `/top/manga?page=${page}&filter=${filter}`,
    cacheKey
  );
  const result = (res?.data || []).map((m) => mapManga(m, type === "manga" ? "manga" : type));
  cacheSet(cacheKey, result);
  return result;
}

export async function getTitleDetails(id: string, type: TitleType): Promise<Title | null> {
  const cacheKey = `details:${type}:${id}`;
  const cached = cacheGet<Title>(cacheKey);
  if (cached) return cached;

  const path = type === "anime" ? `/anime/${id}/full` : `/manga/${id}/full`;
  const res = await jikanFetch<JikanResponse<JikanAnime | JikanManga>>(path, cacheKey);
  if (!res) return null;

  const result = type === "anime" ? mapAnime(res.data as JikanAnime) : mapManga(res.data as JikanManga, type);
  cacheSet(cacheKey, result);
  return result;
}

export async function getEpisodes(id: string): Promise<EpisodeMetadata[]> {
  const cacheKey = `episodes:${id}`;
  const cached = cacheGet<EpisodeMetadata[]>(cacheKey);
  if (cached) return cached;

  const res = await jikanFetch<JikanListResponse<JikanEpisode>>(`/anime/${id}/episodes`, cacheKey);
  const result = (res?.data || []).map((ep) => ({
    mal_id: ep.mal_id,
    title: ep.title || `Episode ${ep.mal_id}`,
    episode: ep.mal_id,
    aired: ep.aired || "Not available",
    duration: ep.duration || "Not available",
    synopsis: ep.synopsis || "Not available",
    watched: false,
  }));
  cacheSet(cacheKey, result);
  return result;
}

export async function getSeason(
  year: number,
  season: string
): Promise<SeasonData> {
  const cacheKey = `season:${year}:${season}`;
  const cached = cacheGet<SeasonData>(cacheKey);
  if (cached) return cached;

  const res = await jikanFetch<JikanSeasonResponse>(`/seasons/${year}/${season}`, cacheKey);
  const result = {
    season_name: res?.season_name || season,
    season_year: res?.season_year || year,
    anime: (res?.data || []).map(mapAnime),
  };
  cacheSet(cacheKey, result);
  return result;
}

export async function getGenreTitles(
  genre: string,
  type: TitleType,
  page = 1
): Promise<Title[]> {
  const cacheKey = `genre:${genre}:${type}:${page}`;
  const cached = cacheGet<Title[]>(cacheKey);
  if (cached) return cached;

  const path =
    type === "anime"
      ? `/anime?genres=${encodeURIComponent(genre)}&page=${page}&sfw=true`
      : `/manga?genres=${encodeURIComponent(genre)}&page=${page}`;
  const res = await jikanFetch<JikanListResponse<JikanAnime | JikanManga>>(path, cacheKey);
  const result = (res?.data || []).map((item) =>
    type === "anime" ? mapAnime(item as JikanAnime) : mapManga(item as JikanManga, type)
  );
  cacheSet(cacheKey, result);
  return result;
}
