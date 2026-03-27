"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Universal hook for Client Components to access pathname and search parameters.
 * 
 * @example
 * const { pathname, query, getParam } = usePath();
 */
export function usePath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useMemo(() => {
    const query: Record<string, string | string[] | undefined> = {};
    searchParams.forEach((value, key) => {
      if (query[key]) {
        if (Array.isArray(query[key])) {
          (query[key] as string[]).push(value);
        } else {
          query[key] = [query[key] as string, value];
        }
      } else {
        query[key] = value;
      }
    });

    const fullPath = searchParams.size > 0 
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    return {
      pathname,
      searchParams,
      query,
      fullPath,
      /** Get a single value for a param key */
      get: (key: string) => searchParams.get(key),
      /** Get all values for a param key (for multiple params with same name) */
      getAll: (key: string) => searchParams.getAll(key),
      /** Check if a param exists */
      has: (key: string) => searchParams.has(key),
    };
  }, [pathname, searchParams]);
}

export default usePath;