import { getAllMedia } from "@/services/media.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import MediaCard from "@/components/Modules/Media/MediaCard";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { data: media } = (await getAllMedia(params)) as any;

  const mockMedia = [
    {
      id: "mock-1",
      title: "The Silent Shadows",
      slug: "silent-shadows",
      posterUrl:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
      avgRating: 8.5,
      releaseYear: 2023,
      type: "MOVIE",
    },
    {
      id: "mock-2",
      title: "Nightfall Chronicles",
      slug: "nightfall-chronicles",
      posterUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
      avgRating: 7.9,
      releaseYear: 2024,
      type: "SERIES",
    },
    {
      id: "mock-3",
      title: "Beyond the Horizon",
      slug: "beyond-horizon",
      posterUrl:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
      avgRating: 9.2,
      releaseYear: 2022,
      type: "MOVIE",
    },
    {
      id: "mock-4",
      title: "Digital Echoes",
      slug: "digital-echoes",
      posterUrl:
        "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
      avgRating: 6.8,
      releaseYear: 2023,
      type: "SERIES",
    },
    {
      id: "mock-5",
      title: "Urban Legends",
      slug: "urban-legends",
      posterUrl:
        "https://images.unsplash.com/photo-1542204172-658a09b60509?w=400&q=80",
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
            <h2 className="text-lg mb-4">Filters</h2>
            {/* Simple Filter UI for demonstration */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <div className="flex gap-2 mt-2">
                  <Link href="/explore?type=MOVIE">
                    <Button
                      variant={params.type === "MOVIE" ? "default" : "outline"}
                    >
                      Movies
                    </Button>
                  </Link>
                  <Link href="/explore?type=SERIES">
                    <Button
                      variant={params.type === "SERIES" ? "default" : "outline"}
                    >
                      Series
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Pricing</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link href="/explore?pricing=FREE">
                    <Button
                      variant={
                        params.pricing === "FREE" ? "default" : "outline"
                      }
                    >
                      Free
                    </Button>
                  </Link>
                  <Link href="/explore?pricing=RENTAL">
                    <Button
                      variant={
                        params.pricing === "RENTAL" ? "default" : "outline"
                      }
                    >
                      Rental
                    </Button>
                  </Link>
                  <Link href="/explore?pricing=PREMIUM">
                    <Button
                      variant={
                        params.pricing === "PREMIUM" ? "default" : "outline"
                      }
                    >
                      Premium
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Media Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
