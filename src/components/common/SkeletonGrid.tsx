export default function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl overflow-hidden border border-border/40 bg-card/60">
          <div className="aspect-[3/4] animate-pulse bg-secondary" />
          <div className="p-3.5 space-y-2.5">
            <div className="h-3 rounded bg-secondary animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-secondary animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-secondary animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
