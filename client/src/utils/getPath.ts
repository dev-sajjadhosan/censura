import { headers } from "next/headers";

/**
 * Universal utility for Server Components to access pathname and search parameters.
 * Dependency: Requires middleware to inject x-pathname and x-search headers.
 * 
 * @example
 * const { pathname, query } = await getPath();
 */
export async function getPath() {
  const headerList = await headers();
  
  const pathname = headerList.get("x-pathname") || "/";
  const search = headerList.get("x-search") || "";
  
  const searchParams = new URLSearchParams(search);
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

  return {
    pathname,
    searchParams,
    query,
    fullPath: search ? `${pathname}${search}` : pathname,
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
  };
}
