import { cn } from "@/lib/utils";
import type { LibraryStatus, TitleStatus } from "@/types";

const statusClasses: Record<string, string> = {
  "Currently Airing": "bg-green-500/15 text-green-300 border-green-500/30",
  "Finished Airing": "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "Not yet aired": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  Publishing: "bg-green-500/15 text-green-300 border-green-500/30",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "On Hold": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Dropped: "bg-destructive/15 text-destructive-foreground border-destructive/30",
};

export function StatusBadge({ status }: { status: TitleStatus | LibraryStatus }) {
  const label = status.replace(/_/g, " ");
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusClasses[status] || "bg-secondary/70 text-muted-foreground border-border/40")}>
      {label}
    </span>
  );
}
