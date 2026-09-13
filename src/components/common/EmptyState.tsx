import { SearchX, HeartCrack, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: "search" | "heart" | "inbox";
}

export default function EmptyState({ title, description, actionLabel, actionHref, icon = "inbox" }: EmptyStateProps) {
  const Icon = icon === "search" ? SearchX : icon === "heart" ? HeartCrack : Inbox;

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-border/60 bg-secondary/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
