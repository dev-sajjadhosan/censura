"use client";

import { getAllMedia } from "@/services/media.service";
import HeroSection from "@/components/Modules/Home/HeroSection";
import SearchBar from "@/components/Modules/Home/SearchBar";
import MediaStrip from "@/components/Modules/Home/MediaStrip";
import PricingSection from "@/components/Modules/Home/PricingSection";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["media"],
    queryFn: () => getAllMedia(),
  });
  const mediaList = data?.data.data || ([] as any);
  const totalPages = data?.data.meta?.totalPages;

  const featuredMedia = mediaList?.length > 0 ? mediaList[0] : null;

  const topRated = [...mediaList]
    .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
    .slice(0, 10);
  const newlyAdded = [...mediaList].slice(0, 10);
  const editorsPicks = [...mediaList].reverse().slice(0, 10);

  return (
    <div className="min-h-screen font-sans bg-background text-foreground pb-12">
      <HeroSection featuredMedia={featuredMedia} />
      <SearchBar />
      <div className="space-y-4 mt-12">
        <MediaStrip
          title="Top Rated This Week"
          mediaList={topRated}
          exploreLink="/explore?sort=rating"
        />

        <MediaStrip
          title="Newly Added"
          mediaList={newlyAdded}
          exploreLink="/explore?sort=newest"
        />

        <MediaStrip
          title="Editor's Picks"
          mediaList={editorsPicks}
          exploreLink="/explore?sort=editors"
        />
      </div>

      <div className="mt-20 border-t border-white/5 pt-10">
        <PricingSection />
      </div>
    </div>
  );
}
