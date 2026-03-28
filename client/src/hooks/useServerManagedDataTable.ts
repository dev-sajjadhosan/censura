"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";

interface UseServerManagedDataTableOptions {
  searchParams: URLSearchParams;
  defaultPage?: number;
  defaultLimit?: number;
}

export const useServerManagedDataTable = ({
  searchParams,
  defaultPage = 1,
  defaultLimit = 10,
}: UseServerManagedDataTableOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isRouteRefreshPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (nextParams: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(nextParams).forEach(([key, value]) => {
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      const nextQueryString = params.toString();
      const currentQueryString = searchParams.toString();

      if (nextQueryString === currentQueryString) {
        return;
      }

      startTransition(() => {
        router.push(`${pathname}?${nextQueryString}`);
      });
    },
    [searchParams, pathname, router],
  );

  const optimisticSortingState = useMemo<SortingState>(() => {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    if (!sortBy) return [];

    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [searchParams]);

  const optimisticPaginationState = useMemo<PaginationState>(() => {
    const page = Number(searchParams.get("page")) || defaultPage;
    const limit = Number(searchParams.get("limit")) || defaultLimit;

    return {
      pageIndex: page - 1,
      pageSize: limit,
    };
  }, [searchParams, defaultPage, defaultLimit]);

  const handleSortingChange = useCallback(
    (sortingState: SortingState) => {
      const sort = sortingState[0];
      if (!sort) {
        updateParams({ sortBy: undefined, sortOrder: undefined });
        return;
      }

      updateParams({
        sortBy: sort.id,
        sortOrder: sort.desc ? "desc" : "asc",
        page: "1", // Reset to page 1 on sort change
      });
    },
    [updateParams],
  );

  const handlePaginationChange = useCallback(
    (paginationState: PaginationState) => {
      updateParams({
        page: String(paginationState.pageIndex + 1),
        limit: String(paginationState.pageSize),
      });
    },
    [updateParams],
  );

  return {
    queryStringFromUrl: searchParams.toString(),
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  };
};
