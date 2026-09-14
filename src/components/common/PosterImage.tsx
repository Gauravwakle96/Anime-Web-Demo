import { useEffect, useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PosterImageProps {
  src?: string | null;
  fallbacks?: string[] | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

function isUsableSource(source: string | null | undefined): source is string {
  return Boolean(source && /^https?:\/\//i.test(source.trim()));
}

export default function PosterImage({
  src,
  fallbacks,
  alt,
  className,
  loading = "lazy",
}: PosterImageProps) {
  const sources = useMemo(
    () => Array.from(new Set([src, ...(fallbacks || [])].filter(isUsableSource))),
    [fallbacks, src]
  );
  const sourceKey = sources.join("|");
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [loadedSources, setLoadedSources] = useState<string[]>([]);

  const failedKey = failedSources.join("|");
  const loadedKey = loadedSources.join("|");

  useEffect(() => {
    setFailedSources([]);
    setLoadedSources([]);
  }, [sourceKey]);

  const currentIndex = Math.min(failedSources.length, Math.max(sources.length - 1, 0));
  const currentSource = sources[currentIndex];
  const exhausted = sources.length === 0 || failedSources.length >= sources.length;

  const handleError = () => {
    if (!currentSource || failedSources.includes(currentSource)) return;
    setFailedSources((previous) => [...previous, currentSource]);
  };

  const handleLoad = () => {
    if (!currentSource || loadedSources.includes(currentSource)) return;
    setLoadedSources((previous) => [...previous, currentSource]);
  };

  return (
    <div className={cn("relative", className)}>
      {exhausted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-secondary/60 border border-border/40 text-muted-foreground" aria-label={`${alt} poster unavailable`}>
          <ImageOff className="h-7 w-7 opacity-70" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Poster unavailable</span>
        </div>
      ) : (
        <img
          key={`${currentSource}-${failedKey}-${loadedKey}`}
          src={currentSource}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={handleError}
          onLoad={handleLoad}
          className={cn("h-full w-full object-cover", className)}
        />
      )}
    </div>
  );
}
