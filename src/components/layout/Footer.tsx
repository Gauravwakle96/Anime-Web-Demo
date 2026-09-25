import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Footer() {
  const { user } = useAuth();

  const exploreLinks = [
    { label: "Anime", href: "/anime" },
    { label: "Manga", href: "/manga" },
    { label: "Manhwa", href: "/manhwa" },
    { label: "Manhua", href: "/manhua" },
    { label: "Novels", href: "/novels" },
    { label: "Genres", href: "/genres" },
    { label: "Calendar", href: "/calendar" },
  ];

  const communityLinks = [
    { label: "My Library", href: "/library" },
    { label: "Profile", href: user ? "/profile" : "/login" },
    { label: "Watchlist", href: "/library" },
  ];

  return (
    <footer className="border-t border-border/50 bg-background/50 mt-24">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <Sparkles className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                GAURAVANIME
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover anime, manga, manhwa, manhua and novels.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Explore</p>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Community</p>
            <ul className="mt-3 space-y-2">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Support</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/zoro_.nx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Made with <Heart className="inline h-3.5 w-3.5 fill-accent text-accent" />
                  </span>{" "}
                </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} GAURAVANIME.</p>
          <p className="flex items-center gap-1">
            Local-first anime library
          </p>
        </div>
      </div>
    </footer>
  );
}
