"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Pagination from "@/components/Modules/Explore/ExplorePagination";

interface ExplorePagePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  isSummary?: boolean;
}

export default function ExplorePagePagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  isSummary,
}: ExplorePagePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => params.set(k, v));
      return `/explore?${params.toString()}`;
    },
    [searchParams]
  );

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalRows={totalRows}
      pageSize={pageSize}
      isSummary={isSummary}
      onPageChange={(page) => router.push(buildUrl({ page: String(page) }))}
      onPageSizeChange={(size) =>
        router.push(buildUrl({ limit: String(size), page: "1" }))
      }
    />
  );
}
