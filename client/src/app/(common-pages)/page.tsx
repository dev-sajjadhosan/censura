

import { getAllMedia } from "@/services/media.service";
import HeroSection from "@/components/Modules/Home/HeroSection";
import SearchBar from "@/components/Modules/Home/SearchBar";
import MediaStrip from "@/components/Modules/Home/MediaStrip";
import PricingSection from "@/components/Modules/Home/PricingSection";

const MOCK_MEDIA = [
  {
    id: "mock-hero",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    slug: "dune-part-two",
    posterUrl: "https://images.unsplash.com/photo-1542204172-658a09b60509?w=1600&q=80", // Premium backdrop placeholder
    avgRating: 9.2,
    releaseYear: 2024,
    type: "MOVIE",
  },
  {
    id: "mock-1",
    title: "The Silent Shadows",
    slug: "silent-shadows",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    avgRating: 8.5,
    releaseYear: 2023,
    type: "MOVIE",
  },
  {
    id: "mock-2",
    title: "Nightfall Chronicles",
    slug: "nightfall-chronicles",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    avgRating: 7.9,
    releaseYear: 2024,
    type: "SERIES",
  },
  {
    id: "mock-3",
    title: "Beyond the Horizon",
    slug: "beyond-horizon",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    avgRating: 9.2,
    releaseYear: 2022,
    type: "MOVIE",
  },
  {
    id: "mock-4",
    title: "Digital Echoes",
    slug: "digital-echoes",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    avgRating: 6.8,
    releaseYear: 2023,
    type: "SERIES",
  },
  {
    id: "mock-5",
    title: "Urban Legends",
    slug: "urban-legends",
    posterUrl: "https://images.unsplash.com/photo-1542204172-658a09b60509?w=400&q=80",
    avgRating: 8.1,
    releaseYear: 2024,
    type: "MOVIE",
  },
  {
    id: "mock-6",
    title: "Neon Genesis",
    slug: "neon-genesis",
    posterUrl: "https://images.unsplash.com/photo-1554147090-e1221a04a025?w=400&q=80",
    avgRating: 9.5,
    releaseYear: 2023,
    type: "SERIES",
  },
  {
    id: "mock-7",
    title: "The Last Frontier",
    slug: "the-last-frontier",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    avgRating: 7.4,
    releaseYear: 2025,
    type: "MOVIE",
  }
];

export default async function Home() {
  let mediaList: any[] = [];
  
  try {
    const res = await getAllMedia();
    mediaList = (res as any)?.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch media for home page", error);
  }

  // Use mock data if the API returns empty
  if (mediaList.length === 0) {
    mediaList = MOCK_MEDIA;
  }

  // Slicing and sorting logic for variations
  const featuredMedia = mediaList.length > 0 ? mediaList[0] : null;
  
  // Sort by rating for top rated
  const topRated = [...mediaList].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)).slice(0, 10);
  
  // Newest (assuming first in list or we can sort by id/createdAt)
  const newlyAdded = [...mediaList].slice(0, 10);
  
  // Editor's picks - just slicing a different part or randomizing for now
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
