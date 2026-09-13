import { Link } from "react-router-dom";

interface GenreChipsProps {
  genres: string[];
  limit?: number;
}

export default function GenreChips({ genres, limit = 8 }: GenreChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.slice(0, limit).map((genre) => (
        <Link
          key={genre}
          to={`/genre/${encodeURIComponent(genre.toLowerCase())}`}
          className="px-3 py-1.5 rounded-full bg-secondary/60 border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
        >
          {genre}
        </Link>
      ))}
    </div>
  );
}
