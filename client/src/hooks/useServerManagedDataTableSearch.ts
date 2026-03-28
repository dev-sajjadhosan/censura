"use client";

import { useCallback, useMemo } from "react";

export const useServerManagedDataTableSearch = ({
  searchParams,
  updateParams,
}: {
  searchParams: URLSearchParams;
  updateParams: (params: Record<string, string | undefined>) => void;
}) => {
  const searchTermFromUrl = useMemo(
    () => searchParams.get("searchTerm") || "",
    [searchParams],
  );

  const handleDebouncedSearchChange = useCallback(
    (value: string) => {
      updateParams({
        searchTerm: value || undefined,
        page: "1", // General convention to reset page on search change
      });
    },
    [updateParams],
  );

  return {
    searchTermFromUrl,
    handleDebouncedSearchChange,
  };
};
