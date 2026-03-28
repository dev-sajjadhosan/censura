import { getAllMedia } from "@/services/media.service";
import MediaCard from "@/components/Modules/Media/MediaCard";
import ExploreFilters from "@/components/Modules/Explore/ExploreFilters";
import ExplorePagePagination from "@/components/Modules/Explore/ExplorePagePagination";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_MEDIA = [
  {
    id: "mock-1",
    title: "The Silent Shadows",
    slug: "silent-shadows",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    avgRating: 8.5,
    releaseYear: 2023,
    type: "MOVIE",
    genre: "Thriller",
    platform: "NETFLIX",
    likes: 1240,
    createdAt: "2024-01-15",
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
    genre: "Drama",
    platform: "HBO",
    likes: 980,
    createdAt: "2024-03-10",
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
    genre: "Sci-Fi",
    platform: "AMAZON_PRIME",
    likes: 3200,
    createdAt: "2022-08-20",
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
    genre: "Action",
    platform: "DISNEY_PLUS",
    likes: 450,
    createdAt: "2023-11-05",
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
    genre: "Horror",
    platform: "NETFLIX",
    likes: 1560,
    createdAt: "2024-02-28",
  },
  {
    id: "mock-6",
    title: "Neon Genesis",
    slug: "neon-genesis",
    posterUrl:
      "https://images.unsplash.com/photo-1554147090-e1221a04a025?w=400&q=80",
    avgRating: 9.5,
    releaseYear: 2023,
    type: "SERIES",
    genre: "Animation",
    platform: "NETFLIX",
    likes: 5400,
    createdAt: "2023-07-01",
  },
  {
    id: "mock-7",
    title: "The Last Frontier",
    slug: "the-last-frontier",
    posterUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    avgRating: 7.4,
    releaseYear: 2025,
    type: "MOVIE",
    genre: "Sci-Fi",
    platform: "APPLE_TV_PLUS",
    likes: 730,
    createdAt: "2025-01-10",
  },
  {
    id: "mock-8",
    title: "Crimson Tide Rising",
    slug: "crimson-tide-rising",
    posterUrl:
      "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80",
    avgRating: 8.8,
    releaseYear: 2023,
    type: "MOVIE",
    genre: "Drama",
    platform: "HBO",
    likes: 2100,
    createdAt: "2023-09-12",
  },
  {
    id: "mock-9",
    title: "Phantom Circuit",
    slug: "phantom-circuit",
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    avgRating: 7.6,
    releaseYear: 2024,
    type: "SERIES",
    genre: "Thriller",
    platform: "AMAZON_PRIME",
    likes: 890,
    createdAt: "2024-06-18",
  },
  {
    id: "mock-10",
    title: "Solar Winds",
    slug: "solar-winds",
    posterUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=400&q=80",
    avgRating: 9.0,
    releaseYear: 2022,
    type: "MOVIE",
    genre: "Documentary",
    platform: "NETFLIX",
    likes: 2800,
    createdAt: "2022-04-22",
  },
  {
    id: "mock-11",
    title: "The Obsidian Realm",
    slug: "obsidian-realm",
    posterUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
    avgRating: 8.3,
    releaseYear: 2024,
    type: "SERIES",
    genre: "Fantasy",
    platform: "HBO",
    likes: 1700,
    createdAt: "2024-04-01",
  },
  {
    id: "mock-12",
    title: "Velocity",
    slug: "velocity",
    posterUrl:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
    avgRating: 7.0,
    releaseYear: 2023,
    type: "MOVIE",
    genre: "Action",
    platform: "DISNEY_PLUS",
    likes: 620,
    createdAt: "2023-12-25",
  },
];

const PAGE_SIZE = 8;

type Params = { [key: string]: string | string[] | undefined };

function getString(params: Params, key: string): string {
  const val = params[key];
  return typeof val === "string" ? val : "";
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;

  const sort = getString(params, "sort") || "recent";
  const typeFilter = getString(params, "type");
  const genreFilter = getString(params, "genre");
  const platformFilter = getString(params, "platform");
  const minRatingFilter = getString(params, "minRating");
  const searchQuery = getString(params, "search");
  const page = Math.max(1, parseInt(getString(params, "page") || "1", 10));
  const pageSize = Math.max(1, parseInt(getString(params, "limit") || "8", 10));

  // Try API, fall back to mock
  let mediaList: any[] = [];
  try {
    const res = (await getAllMedia(params)) as any;
    mediaList = res?.data?.data || [];
  } catch {}
  if (mediaList.length === 0) mediaList = MOCK_MEDIA;

  // ─── Client-side filter + sort (since backend may not support all params) ───
  let filtered = mediaList.filter((m) => {
    if (typeFilter && m.type !== typeFilter) return false;
    if (genreFilter && m.genre !== genreFilter) return false;
    if (platformFilter && m.platform !== platformFilter) return false;
    if (minRatingFilter && (m.avgRating || 0) < parseFloat(minRatingFilter))
      return false;
    if (
      searchQuery &&
      !m.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Sort
  if (sort === "rating") {
    filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  } else if (sort === "likes") {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else {
    // recent: newest createdAt first
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );
  }

  // Paginate — use URL `limit` param or default PAGE_SIZE
  const effectivePageSize = pageSize || PAGE_SIZE;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * effectivePageSize,
    currentPage * effectivePageSize,
  );

  const activeFilterCount = [
    typeFilter,
    genreFilter,
    platformFilter,
    minRatingFilter,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-5">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Explore</h1>
          </div>
          {activeFilterCount > 0 && (
            <Badge className="py-4 px-4 ">
              {totalItems > 0
                ? `${totalItems} title${totalItems !== 1 ? "s" : ""} found`
                : "No titles found"}
              {searchQuery && (
                <span>
                  {" "}
                  for &ldquo;
                  <span className="text-white font-medium">{searchQuery}</span>
                  &rdquo;
                </span>
              )}
            </Badge>
          )}
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="w-full lg:w-70 xl:w-xs shrink-0 border-r pr-5">
            <div className="lg:sticky lg:top-24">
              <Suspense>
                <ExploreFilters />
              </Suspense>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {paged.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {paged.map((item: any) => (
                    <MediaCard key={item.id} media={item} />
                  ))}
                </div>

                <Suspense>
                  <ExplorePagePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRows={totalItems}
                    pageSize={effectivePageSize}
                    isSummary={false}
                  />
                </Suspense>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
                <div className="size-17 rounded-full bg-secondary/55 flex items-center justify-center">
                  <Search className="size-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold text-neutral-200">
                    No results found
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm max-w-md">
                    Try adjusting your filters or search query to find what
                    you&apos;re looking for.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
