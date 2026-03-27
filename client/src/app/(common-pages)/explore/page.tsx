import { getAllMedia } from "@/services/media.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";



export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { data: media } = await getAllMedia(params) as any;

  const mockMedia = [
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
  ];

  const displayMedia = [...(media?.data || []), ...mockMedia];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            {/* Simple Filter UI for demonstration */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <div className="flex gap-2 mt-2">
                  <Link href="/explore?type=MOVIE">
                    <Button variant={params.type === "MOVIE" ? "default" : "outline"} size="sm">Movies</Button>
                  </Link>
                  <Link href="/explore?type=SERIES">
                    <Button variant={params.type === "SERIES" ? "default" : "outline"} size="sm">Series</Button>
                  </Link>
                </div>
              </div>
              
              {/* Genre and Year filters could be dynamic, but I'll add placeholders for now */}
              <div>
                <label className="text-sm font-medium">Pricing</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                   <Link href="/explore?pricing=FREE">
                    <Button variant={params.pricing === "FREE" ? "default" : "outline"} size="xs">Free</Button>
                  </Link>
                  <Link href="/explore?pricing=PREMIUM">
                    <Button variant={params.pricing === "PREMIUM" ? "default" : "outline"} size="xs">Premium</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Media Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayMedia.map((item: any) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
          {displayMedia.length === 0 && (
            <div className="py-20 text-center text-neutral-500">
              No media found matching your filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function MediaCard({ media }: { media: any }) {
  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-primary/50 transition-all">
      <Link href={`/media/${media.slug}`}>
        <div className="aspect-2/3 relative">
          <img
            src={media.posterUrl || "https://placehold.co/400x600?text=No+Poster"}
            alt={media.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-yellow-500">
            <Star className="w-3 h-3 fill-yellow-500" />
            {media.avgRating?.toFixed(1) || "N/A"}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{media.title}</h3>
          <div className="flex items-center justify-between mt-1 text-sm text-neutral-400">
            <span>{media.releaseYear}</span>
            <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              {media.type}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
