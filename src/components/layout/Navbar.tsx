import { useState } from "react";
import { Search, Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export default function Navbar({ onSearchChange, searchValue }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 group" id="nav-logo">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AnimeHub
          </span>
        </a>

        {/* Desktop Search */}
        <div className="hidden md:flex relative max-w-md flex-1" id="search-desktop">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search anime, genres, studios…"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full h-10 rounded-xl border border-border/60 bg-secondary/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {["Catalogue", "Top Rated", "Stats"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/60"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary/60 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all border-t border-border/30",
          mobileOpen ? "max-h-64 py-4" : "max-h-0 py-0"
        )}
      >
        <div className="container space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search…"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full h-10 rounded-xl border border-border/60 bg-secondary/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          {["Catalogue", "Top Rated", "Stats"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
