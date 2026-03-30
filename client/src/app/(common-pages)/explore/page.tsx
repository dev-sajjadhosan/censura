import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ExploreSidebar } from "@/components/Modules/Explore/ExploreSidebar";
import MediaGrid from "@/components/Modules/Media/MediaGrid";
import { MediaGridSkeleton } from "@/components/Modules/Media/MediaGridSkeleton";

type Params = { [key: string]: string | string[] | undefined };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <ExploreSidebar />
        <SidebarInset className="bg-background/91">
          <main className="container mx-auto px-4 md:px-8">
            <Suspense
              fallback={
                <MediaGridSkeleton count={Number(params?.limit) || 8} />
              }
            >
              <MediaGrid params={params} />
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
