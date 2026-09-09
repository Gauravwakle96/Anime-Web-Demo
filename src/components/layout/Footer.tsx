import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-24">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AnimeHub
            </span>
          </div>

          {/* Info */}
          <p className="text-sm text-muted-foreground text-center">
            Data sourced from{" "}
            <a
              href="https://jikan.moe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Jikan API
            </a>{" "}
            (MyAnimeList). Built with React, Tailwind & Framer Motion.
          </p>

          {/* Year */}
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} AnimeHub
          </p>
        </div>
      </div>
    </footer>
  );
}
