import type { Title, TitleStatus, TitleType } from "@/types";

const statusLabels: Record<TitleStatus, string> = {
  "Finished Airing": "Finished",
  "Currently Airing": "Airing",
  "Not yet aired": "Upcoming",
  Publishing: "Publishing",
  Completed: "Completed",
  "On Hold": "On Hold",
  Dropped: "Dropped",
};

export function displayTitle(
  title: Pick<Title, "title" | "title_english">
): string {
  return title.title_english || title.title;
}

export function genreList(title: Pick<Title, "genres">): string[] {
  return title.genres
    .split("|")
    .map((genre) => genre.trim())
    .filter(Boolean);
}

export function typeLabel(type: TitleType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function statusLabel(status: TitleStatus): string {
  return statusLabels[status];
}

export function formatYear(year: number | null): string {
  return year === null ? "Unknown" : String(year);
}

export function isReadingType(type: TitleType): boolean {
  return type !== "anime";
}

export function progressLabel(
  progress: number,
  totalProgress: number | null | undefined
): string {
  if (totalProgress === null || totalProgress === undefined || totalProgress <= 0) {
    return String(progress);
  }

  return `${progress}/${totalProgress}`;
}
