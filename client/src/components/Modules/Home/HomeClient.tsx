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
import CategoriesSection from "./CategoriesSection";
import FeaturesSection from "./FeaturesSection";
import StatisticsSection from "./StatisticsSection";
import TestimonialsSection from "./TestimonialsSection";
import FaqSection from "./FaqSection";
import CTASection from "./CTASection";

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
    <div className="min-h-screen font-sans bg-background text-foreground pb-12 overflow-x-hidden">
      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroSection featuredMedia={featuredMedia} user={user} />
      )}
      
      <div className="relative z-10 -mt-8 mb-20 px-4">
        <SearchBar />
      </div>

      <CategoriesSection />

      <div className="space-y-4 mt-12 bg-linear-to-b from-transparent via-secondary/5 to-transparent py-10">
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

        <FeaturesSection />

        <MediaStrip
          title="Editor's Picks"
          mediaList={editorsPicks}
          isLoading={isLoading}
          exploreLink="/explore?sort=editors"
          user={user}
        />
      </div>

      <StatisticsSection />
      
      <TestimonialsSection />

      <PricingSection user={user} />

      <FaqSection />

      <NewsletterSection />

      <CTASection />
    </div>
  );
}
