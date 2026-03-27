

export interface PathInfo {
  pathname: string;
  searchParams: URLSearchParams;
  query: Record<string, string | string[] | undefined>;
  fullPath: string;
  get: (key: string) => string | null;
  getAll: (key: string) => string[];
  has: (key: string) => boolean;
}

export function parsePathInfo(urlStr: string): PathInfo {
  try {
    const url = new URL(urlStr, "http://localhost"); // fallback origin if needed
    const searchParams = url.searchParams;
    
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
      pathname: url.pathname,
      searchParams: searchParams,
      query: query,
      fullPath: `${url.pathname}${url.search}`,
      get: (key: string) => searchParams.get(key),
      getAll: (key: string) => searchParams.getAll(key),
      has: (key: string) => searchParams.has(key),
    };
  } catch (e) {
    // Fallback for invalid URLs or just simple paths
    return {
      pathname: urlStr.split("?")[0] || "/",
      searchParams: new URLSearchParams(),
      query: {},
      fullPath: urlStr,
      get: () => null,
      getAll: () => [],
      has: () => false,
    };
  }
}
