"use client";

import * as React from "react";
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
  ChevronRight,
  Compass,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPlatforms, getAllGenres } from "@/services/admin.service";
import { Genre, Platform } from "@/types/media.types";
import { MEDIA_TYPES } from "@/Constant/media.const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SORT_OPTIONS = [
  { label: "Recent", value: "recent", icon: Clock },
  { label: "Top Rated", value: "rating", icon: Star },
  { label: "Most Liked", value: "likes", icon: ThumbsUp },
];

const RATING_RANGES = [
  { label: "9+ Stars", value: "9" },
  { label: "8+ Stars", value: "8" },
  { label: "7+ Stars", value: "7" },
  { label: "6+ Stars", value: "6" },
];

export function ExploreSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
    queryFn: () => getAllGenres({page:1,limit:100}),
  });

  const { data: platformsData, isLoading: platformLoading } = useQuery({
    queryKey: ["platforms"],
    queryFn: () => getAllPlatforms({page:1,limit:100}),
  });

  const genres = genresData?.data?.data;
  const platforms = platformsData?.data?.data;

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
    router.push(`/explore?page=1`);
  };

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border/50 py-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 font-bold transition-all">
            <SidebarTrigger className="-ml-1" />
            <span className=" group-data-[collapsible=icon]:opacity-0 ">
              Explore
            </span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 px-2 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden"
            >
              <X className="mr-1 size-3" /> Clear
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel>Sort By</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SORT_OPTIONS.map((option) => (
                <SidebarMenuItem key={option.value}>
                  <SidebarMenuButton
                    isActive={current.sort === option.value}
                    onClick={() => push({ sort: option.value })}
                    tooltip={option.label}
                  >
                    <option.icon className="size-4" />
                    <span>{option.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Type Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Media Type</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MEDIA_TYPES.map((type) => (
                <SidebarMenuItem key={type}>
                  <SidebarMenuButton
                    isActive={current.type === type}
                    onClick={() =>
                      push({ type: current.type === type ? null : type })
                    }
                    tooltip={type}
                  >
                    <Film className="size-4" />
                    <span>{type}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Genre Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Genres</SidebarGroupLabel>
          <SidebarGroupContent>
            {genreLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <SidebarMenu>
                <div className="grid grid-cols-1 gap-1 px-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {genres?.length === 0 && (
                      <div className="flex items-center gap-2 py-4">
                        <Tag className="size-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          No genres found
                        </p>
                      </div>
                    )}
                    {genres?.map((genre: Genre) => (
                      <Badge
                        key={genre.id}
                        variant={
                          current.genre === genre.slug ? "default" : "outline"
                        }
                        className="cursor-pointer py-3"
                        onClick={() =>
                          push({
                            genre: current.genre === genre.slug ? null : genre.slug,
                          })
                        }
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Fallback for collapsed state */}
                <div className="hidden group-data-[collapsible=icon]:block">
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Genres">
                      <Tag className="size-4" />
                      <span>Genres</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Rating Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Rating</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {RATING_RANGES.map((range) => (
                <SidebarMenuItem key={range.value}>
                  <SidebarMenuButton
                    isActive={current.minRating === range.value}
                    onClick={() =>
                      push({
                        minRating:
                          current.minRating === range.value
                            ? null
                            : range.value,
                      })
                    }
                    tooltip={range.label}
                  >
                    <Star
                      className={`size-4 ${current.minRating === range.value ? "fill-primary" : ""}`}
                    />
                    <span>{range.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Platform Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            {platformLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <SidebarMenu>
                <div className="grid grid-cols-1 gap-1 px-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {platforms?.length === 0 && (
                      <div className="flex items-center gap-2 py-4">
                        <Tv className="size-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          No platforms found
                        </p>
                      </div>
                    )}
                    {platforms?.map((platform: Platform) => (
                      <Badge
                        key={platform.id}
                        variant={
                          current.platform === platform.slug
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer py-3"
                        onClick={() =>
                          push({
                            platform:
                              current.platform === platform.slug
                                ? null
                                : platform.slug,
                          })
                        }
                      >
                        {platform.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="hidden group-data-[collapsible=icon]:block">
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Platforms">
                      <Clapperboard className="size-4" />
                      <span>Platforms</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
