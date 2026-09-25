import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { getTopRated } from "@/data/catalog";

export default function HeroSection() {
  const featuredAnime = getTopRated("anime", 12);
  const images = featuredAnime.map((title) => title.image);

  return (
    <AnimatedMarqueeHero
      tagline="YOUR NEXT ANIME ADVENTURE STARTS HERE"
      title="Discover Your Next Favorite Anime"
      description="Explore thousands of anime, discover trending series, track your favorites, and find your next obsession."
      ctaText="Explore Anime"
      ctaHref="/browse"
      images={images}
      className="min-h-[80vh] md:min-h-screen"
    />
  );
}
