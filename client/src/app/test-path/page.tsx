import { getPath } from "@/utils/getPath";
import TestPathClient from "@/components/TestPathClient";

export default async function TestPathPage() {
  const pathInfo = await getPath();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Universal Path Verification</h1>
      
      <section className="p-4 border rounded-lg bg-muted/50">
        <h2 className="text-xl font-semibold mb-2">Server Component (getPath)</h2>
        <pre className="p-2 bg-black text-white rounded overflow-auto">
          {JSON.stringify({
            pathname: pathInfo.pathname,
            query: pathInfo.query,
            fullPath: pathInfo.fullPath
          }, null, 2)}
        </pre>
      </section>

      <section className="p-4 border rounded-lg bg-muted/50">
        <h2 className="text-xl font-semibold mb-2">Client Component (usePath)</h2>
        <TestPathClient />
      </section>
    </div>
  );
}
