import { Heart, Instagram, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-24">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GAURAVANIME
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your Personal Otaku Library. Discover, track, and organize the stories you love.
            </p>
          </div>

          <div className="md:text-center">
            <p className="text-sm font-semibold text-foreground">Explore</p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <Link to="/anime" className="hover:text-foreground transition-colors">Anime</Link>
              <Link to="/manga" className="hover:text-foreground transition-colors">Manga</Link>
              <Link to="/manhwa" className="hover:text-foreground transition-colors">Manhwa</Link>
              <Link to="/novels" className="hover:text-foreground transition-colors">Novels</Link>
              <Link to="/calendar" className="hover:text-foreground transition-colors">Calendar</Link>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-sm font-semibold text-foreground">Contact & Support</p>
            <a
              href="https://www.instagram.com/zoro_.nx/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/25 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/20 transition-all"
            >
              <Instagram className="h-4 w-4 text-accent" />
              @zoro_.nx
            </a>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Data sourced from <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Jikan API</a> (MyAnimeList).
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/70">
          <p>© {new Date().getFullYear()} GauravAnime. Built for the otaku community.</p>
          <p className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
            Made with React, Tailwind & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
