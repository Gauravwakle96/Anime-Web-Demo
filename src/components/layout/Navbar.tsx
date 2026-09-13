import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Compass,
  Heart,
  Home,
  Library,
  Menu,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse", href: "/browse", icon: Compass },
  { label: "Anime", href: "/anime", icon: Sparkles },
  { label: "Manga", href: "/manga", icon: Library },
  { label: "Manhwa", href: "/manhwa", icon: Library },
  { label: "Novels", href: "/novels", icon: Library },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "My Library", href: "/library", icon: Heart },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setMobileOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="GauravAnime home"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            GAURAVANIME
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                isActive(href)
                  ? "text-foreground bg-secondary/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search titles, genres, creators…"
              aria-label="Search titles"
              className="w-64 h-10 rounded-xl border border-border/60 bg-secondary/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            />
          </form>
          <Link
            to="/library"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Favorites and library"
          >
            <Heart className="h-4 w-4" />
          </Link>
          <Link
            to="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-secondary/60 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all border-t border-border/30",
          mobileOpen ? "max-h-[70vh] py-4" : "max-h-0 py-0"
        )}
      >
        <div className="container space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search titles, genres, creators…"
              aria-label="Search titles"
              className="w-full h-10 rounded-xl border border-border/60 bg-secondary/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive(href)
                    ? "text-foreground bg-secondary/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/library"
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-border/60 bg-secondary/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Library
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-border/60 bg-secondary/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
