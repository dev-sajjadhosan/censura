import { getAllMedia } from "@/services/media.service";
import MediaCard from "@/components/Modules/Media/MediaCard";
import ExplorePagePagination from "@/components/Modules/Explore/ExplorePagePagination";
import { Search } from "lucide-react";

const PAGE_SIZE = 8;

type Params = { [key: string]: string | string[] | undefined };

function getString(params: Params, key: string): string {
  const val = params[key];
  return typeof val === "string" ? val : "";
}

export default async function MediaGrid({ params }: { params: Params }) {
  const sort = getString(params, "sort") || "recent";
  const typeFilter = getString(params, "type");
  const genreFilter = getString(params, "genre");
  const platformFilter = getString(params, "platform");
  const minRatingFilter = getString(params, "minRating");
  const searchQuery = getString(params, "search");
  const page = Math.max(1, parseInt(getString(params, "page") || "1", 10));
  const pageSize = Math.max(1, parseInt(getString(params, "limit") || "8", 10));

  let mediaList: any[] = [];
  try {
    const res = (await getAllMedia(params)) as any;
    mediaList = res?.data?.data || [];
  } catch {}

  let filtered = mediaList.filter((m) => {
    if (typeFilter && m.type !== typeFilter) return false;
    if (genreFilter && m.genre !== genreFilter) return false;
    if (platformFilter && m.platform !== platformFilter) return false;
    if (minRatingFilter && (m.avgRating || 0) < parseFloat(minRatingFilter)) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sort === "rating") {
    filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  } else if (sort === "likes") {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );
  }

  const effectivePageSize = pageSize || PAGE_SIZE;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * effectivePageSize,
    currentPage * effectivePageSize,
  );

  if (paged.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
        <div className="size-17 rounded-full bg-secondary/55 flex items-center justify-center">
          <Search className="size-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xl font-bold text-neutral-200">No results found</p>
          <p className="text-muted-foreground mt-1 text-sm max-w-md">
            Try adjusting your filters or search query to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {paged.map((item: any) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
      <ExplorePagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalItems}
        pageSize={effectivePageSize}
        isSummary={false}
      />
    </>
  );
}