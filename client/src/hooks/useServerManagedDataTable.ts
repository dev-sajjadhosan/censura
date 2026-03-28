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

  // Safety fallback for searchParams
  const params = useMemo(() => searchParams || new URLSearchParams(), [searchParams]);

  const updateParams = useCallback(
    (nextParams: Record<string, string | string[] | undefined>) => {
      const p = new URLSearchParams(params.toString());

      Object.entries(nextParams).forEach(([key, value]) => {
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          p.delete(key);
        } else if (Array.isArray(value)) {
          p.delete(key);
          value.forEach((v) => p.append(key, v));
        } else {
          p.set(key, value);
        }
      });

      const nextQueryString = p.toString();
      const currentQueryString = params.toString();

      if (nextQueryString === currentQueryString) {
        return;
      }

      startTransition(() => {
        router.push(`${pathname}?${nextQueryString}`);
      });
    },
    [params, pathname, router],
  );

  const optimisticSortingState = useMemo<SortingState>(() => {
    const sortBy = params.get("sortBy");
    const sortOrder = params.get("sortOrder");

    if (!sortBy) return [];

    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [params]);

  const optimisticPaginationState = useMemo<PaginationState>(() => {
    const page = Number(params.get("page")) || defaultPage;
    const limit = Number(params.get("limit")) || defaultLimit;

    return {
      pageIndex: page - 1,
      pageSize: limit,
    };
  }, [params, defaultPage, defaultLimit]);

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
    queryStringFromUrl: params.toString(),
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  };
};
