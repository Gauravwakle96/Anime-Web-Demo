import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { TitleType } from "@/types";

const tabs: Array<{ type: TitleType | "all"; label: string; href: string }> = [
  { type: "all", label: "All", href: "/browse" },
  { type: "anime", label: "Anime", href: "/anime" },
  { type: "manga", label: "Manga", href: "/manga" },
  { type: "manhwa", label: "Manhwa", href: "/manhwa" },
  { type: "manhua", label: "Manhua", href: "/manhua" },
  { type: "novel", label: "Novels", href: "/novels" },
];

interface TypeTabsProps {
  active?: TitleType | "all";
}

export default function TypeTabs({ active = "all" }: TypeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Content type">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          to={tab.href}
          role="tab"
          aria-selected={active === tab.type}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold border transition-colors",
            active === tab.type
              ? "bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-lg shadow-primary/20"
              : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground hover:bg-secondary/80"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
