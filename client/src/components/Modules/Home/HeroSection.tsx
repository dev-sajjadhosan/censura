import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Info, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IProfileResponse } from "@/types/auth.types";

interface HeroSectionProps {
  featuredMedia: any;
  user: IProfileResponse;
}

export default function HeroSection({ featuredMedia, user }: HeroSectionProps) {
  if (!featuredMedia)
    return <div className="h-96 w-full bg-neutral-900 animate-pulse"></div>;

  const title = featuredMedia.title || "Featured Media";
  const desc =
    featuredMedia.description ||
    "In a world where everything changes, one hero must stand tall. Discover the most acclaimed release of the season.";
  const type = featuredMedia.type || "MOVIE";
  const backdropUrl =
    featuredMedia.posterUrl ||
    "https://images.unsplash.com/photo-1542204172-658a09b60509?w=1600&q=80";

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex items-enc overflow-hidden mb-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          width={800}
          height={700}
          src={backdropUrl}
          alt={title}
          priority
          className="object-cover object-top opacity-60 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-20">
        <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div className="flex items-center gap-3">
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground font-bold px-3 py-1"
            >
              {type}
            </Badge>
            {featuredMedia.avgRating && (
              <Badge
                variant="outline"
                className="border-secondary/50 flex items-center gap-1 backdrop-blur-md"
              >
                <Star className="w-3 h-3 fill-secondary text-secondary" />
                <span>{featuredMedia.avgRating.toFixed(1)} Rating</span>
              </Badge>
            )}
            <Badge variant="outline" className="backdrop-blur-md">
              {featuredMedia.releaseYear || new Date().getFullYear()}
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white drop-shadow-lg">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 max-w-xl drop-shadow line-clamp-3">
            {desc}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link href={`/media/${featuredMedia.slug}`}>
              <Button
                disabled={
                  !user ||
                  user.subscription.status !== "active" ||
                  user.role === "ADMIN"
                }
                size="lg"
                className="rounded-full px-8 gap-2 text-md font-semibold h-14"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </Button>
            </Link>
            <Link href={`/media/${featuredMedia.slug}`}>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10 border text-md font-semibold h-14"
              >
                <Info className="w-5 h-5" /> More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
