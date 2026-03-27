import { getMyWatchlist, removeFromWatchlist } from "@/services/media.service";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function WatchlistPage() {
  const { data: watchlist } = await getMyWatchlist() as any;

  const mockWatchlist = [
    {
      id: "mock-wl-1",
      media: {
        id: "mock-1",
        title: "The Silent Shadows",
        slug: "silent-shadows",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
        avgRating: 8.5,
        releaseYear: 2023,
        type: "MOVIE",
      }
    },
    {
      id: "mock-wl-2",
      media: {
        id: "mock-2",
        title: "Nightfall Chronicles",
        slug: "nightfall-chronicles",
        posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
        avgRating: 7.9,
        releaseYear: 2024,
        type: "SERIES",
      }
    }
  ];

  const displayWatchlist = [...(watchlist || []), ...mockWatchlist];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayWatchlist.map((item: any) => (
          <div key={item.id} className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-primary/50 transition-all">
            <Link href={`/media/${item.media.slug}`}>
              <div className="aspect-2/3 relative">
                <Image
                  src={item.media.posterUrl || "https://placehold.co/400x600?text=No+Poster"}
                  alt={item.media.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-yellow-500">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  {item.media.avgRating?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{item.media.title}</h3>
                <div className="flex items-center justify-between mt-1 text-sm text-neutral-400">
                  <span>{item.media.releaseYear}</span>
                  <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                    {item.media.type}
                  </span>
                </div>
              </div>
            </Link>
            <div className="p-4 pt-0">
               {/* In a real app, this should be a client component for interactivity */}
               <Button variant="destructive" size="sm" className="w-full gap-2">
                 <Trash2 className="w-4 h-4" />
                 Remove
               </Button>
            </div>
          </div>
        ))}
      </div>

      {displayWatchlist.length === 0 && (
        <div className="py-20 text-center bg-neutral-900/10 rounded-2xl border border-dashed border-neutral-800">
          <p className="text-neutral-500 mb-4 text-lg">Your watchlist is empty.</p>
          <Link href="/explore">
            <Button>Explore Movies & Shows</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
