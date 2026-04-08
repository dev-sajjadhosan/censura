"use client";

import { getAllMedia } from "@/services/media.service";
import MediaCard from "@/components/Modules/Media/MediaCard";
import ExplorePagePagination from "@/components/Modules/Explore/ExplorePagePagination";
import { Search as SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../Home/SearchBar";
import { IProfileResponse } from "@/types/auth.types";

type Params = { [key: string]: string | string[] | undefined };

export default function MediaGrid({ params , user }: { params: Params , user?: IProfileResponse | null }) {
  const queryParams = {
    page: params.page || "1",
    limit: params.limit || "10",
    searchTerm: params.search, 
    search: params.search, 
    sortBy: params.sort === "recent" ? "createdAt" : params.sort,
    sortOrder: "desc",
    type: params.type,
    genre: params.genre,
    platform: params.platform,
    minRating: params.minRating,
  };

  const { data, isLoading } = useQuery({

    queryKey: ["media", queryParams], 
    queryFn: () => getAllMedia(queryParams),
  });

  const mediaList = data?.data || [];
  const meta = data?.meta;

  if (isLoading) {
    return <div className="py-32 text-center text-neutral-400">Loading media...</div>;
  }

  if (!mediaList || mediaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
        <div className="size-17 rounded-full bg-secondary/55 flex items-center justify-center">
          <SearchIcon className="size-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xl font-bold text-neutral-200">No results found</p>
          <p className="text-muted-foreground mt-1 text-sm max-w-md">
            Try adjusting your filters or search query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        {mediaList.map((item: any) => (
          <MediaCard key={item.id} media={item} user={user} />
        ))}
      </div>

      {meta && (
        <ExplorePagePagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalRows={meta.total}
          pageSize={meta.limit}
          isSummary={false}
        />
      )}
    </>
  );
}