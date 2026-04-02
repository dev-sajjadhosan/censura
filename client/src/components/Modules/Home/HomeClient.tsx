"use client";

import { getAllMedia } from "@/services/media.service";
import HeroSection from "@/components/Modules/Home/HeroSection";
import SearchBar from "@/components/Modules/Home/SearchBar";
import MediaStrip from "@/components/Modules/Home/MediaStrip";
import PricingSection from "@/components/Modules/Home/PricingSection";
import { useQuery } from "@tanstack/react-query";
import { IProfileResponse } from "@/types/auth.types";
import HeroSkeleton from "./HeroSkeleton";
import NewsletterSection from "./Newsletter";

export default function HomeClient({ user }: { user: IProfileResponse }) {
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["media"],
    queryFn: () => getAllMedia(),
  });
  const mediaList = data?.data || ([] as any);
  // const totalPages = data?.meta?.totalPages;

  const featuredMedia = mediaList?.length > 0 ? mediaList[0] : null;

  const topRated = [...mediaList]
    .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
    .slice(0, 10);
  const newlyAdded = [...mediaList].slice(0, 10);
  const editorsPicks = [...mediaList].reverse().slice(0, 10);

  return (
    <div className="min-h-screen font-sans bg-background text-foreground pb-12">
      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroSection featuredMedia={featuredMedia} user={user} />
      )}
      <SearchBar />
      <div className="space-y-4 mt-12">
        <MediaStrip
          title="Top Rated This Week"
          mediaList={topRated}
          isLoading={isLoading}
          exploreLink="/explore?sort=rating"
          user={user}
        />

        <MediaStrip
          title="Newly Added"
          mediaList={newlyAdded}
          isLoading={isLoading}
          exploreLink="/explore?sort=newest"
          user={user}
        />

        <MediaStrip
          title="Editor's Picks"
          mediaList={editorsPicks}
          isLoading={isLoading}
          exploreLink="/explore?sort=editors"
          user={user}
        />
      </div>
      <NewsletterSection />
      <div className="mt-20 border-t border-white/5 pt-10">
        <PricingSection user={user} />
      </div>
    </div>
  );
}
