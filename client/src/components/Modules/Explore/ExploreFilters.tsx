"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Star,
  ThumbsUp,
  Film,
  Tv,
  SlidersHorizontal,
  X,
  Clapperboard,
  Loader2,
  Tag,
} from "lucide-react";
import { MEDIA_TYPES } from "@/Constant/media.const";
import { useQuery } from "@tanstack/react-query";
import { getAllPlatforms, getAllGenres } from "@/services/admin.service";
import { Genre, Platform } from "@/types/media.types";

const GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Animation",
  "Documentary",
  "Fantasy",
];

const PLATFORMS = [
  { label: "Netflix", value: "NETFLIX" },
  { label: "Disney+", value: "DISNEY_PLUS" },
  { label: "HBO", value: "HBO" },
  { label: "Amazon Prime", value: "AMAZON_PRIME" },
  { label: "Apple TV+", value: "APPLE_TV_PLUS" },
  { label: "Hulu", value: "HULU" },
];

const RATING_RANGES = [
  { label: "9+", value: "9" },
  { label: "8+", value: "8" },
  { label: "7+", value: "7" },
  { label: "6+", value: "6" },
];

const SORT_OPTIONS = [
  { label: "Recent", value: "recent", icon: Clock },
  { label: "Top Rated", value: "rating", icon: Star },
  { label: "Most Liked", value: "likes", icon: ThumbsUp },
];

export default function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
        // Reset page on any filter change
        if (key !== "page") params.set("page", "1");
      });
      return params.toString();
    },
    [searchParams],
  );

  const push = (updates: Record<string, string | null>) => {
    router.push(`/explore?${createQueryString(updates)}`);
  };

  const { data: genresData, isLoading: genreLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getAllGenres(),
  });

  const { data: platformsData, isLoading: platformLoading } = useQuery({
    queryKey: ["platforms"],
    queryFn: () => getAllPlatforms(),
  });

  console.log("platformsData", platformsData);

  const genres = genresData?.data?.data;
  const platfroms = platformsData?.data?.data;

  const current = {
    sort: searchParams.get("sort") || "recent",
    type: searchParams.get("type") || "",
    genre: searchParams.get("genre") || "",
    platform: searchParams.get("platform") || "",
    minRating: searchParams.get("minRating") || "",
  };

  const hasActiveFilters =
    current.type || current.genre || current.platform || current.minRating;

  const clearAll = () => {
    router.push(`/explore?sort=${current.sort}&page=1`);
  };

  return (
    <aside className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-bold">
          <SlidersHorizontal className="size-5 text-primary" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
          >
            <X className="size-3" /> Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sort By
        </p>
        <div className="flex flex-wrap gap-3">
          {SORT_OPTIONS.map(({ label, value, icon: Icon }) => (
            <Button
              key={value}
              size={"lg"}
              onClick={() => push({ sort: value })}
              variant={current.sort === value ? "default" : "secondary"}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {MEDIA_TYPES.map((type) => (
            <Button
              key={type}
              size={"lg"}
              onClick={() =>
                push({ type: current.type === type ? null : type })
              }
              variant={current.type === type ? "default" : "secondary"}
            >
              <Film /> {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Genre
        </p>
        <div className="flex flex-wrap gap-2">
          {genreLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            genres?.map((genre: Genre) => (
              <Button
                key={genre.id}
                size={"lg"}
                onClick={() =>
                  push({ genre: current.genre === genre.id ? null : genre.id })
                }
                variant={current.genre === genre.id ? "default" : "secondary"}
              >
                <Tag />
                {genre.name}
                {/* <Badge>{genre.}</Badge> */}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Min Rating */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Min Rating
        </p>
        <div className="flex flex-wrap gap-2">
          {RATING_RANGES.map(({ label, value }) => (
            <Button
              key={value}
              size={"lg"}
              onClick={() =>
                push({ minRating: current.minRating === value ? null : value })
              }
              variant={current.minRating === value ? "default" : "secondary"}
            >
              <Star
                className={`w-3.5 h-3.5 ${current.minRating === value ? "fill-secondary text-secondary" : ""}`}
              />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Streaming Platform */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Platform
        </p>
        <div className="flex flex-wrap gap-2">
          {platfroms?.map((platform: Platform) => (
            <Button
              key={platform.id}
              size={"lg"}
              onClick={() =>
                push({
                  platform:
                    current.platform === platform.name ? null : platform.name,
                })
              }
              variant={current.platform === platform.name ? "default" : "secondary"}
            >
              {/* <Image src={label.image} alt={label} width={20} height={20} /> */}
              <Clapperboard />
              {platform.name}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
