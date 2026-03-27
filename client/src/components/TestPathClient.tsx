"use client";

import { usePath } from "@/hooks/usePath";

export default function TestPathClient() {
  const pathInfo = usePath();

  return (
    <pre className="p-2 bg-black text-white rounded overflow-auto">
      {JSON.stringify({
        pathname: pathInfo.pathname,
        query: pathInfo.query,
        fullPath: pathInfo.fullPath
      }, null, 2)}
    </pre>
  );
}
