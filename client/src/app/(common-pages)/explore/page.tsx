import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ExploreSidebar } from "@/components/Modules/Explore/ExploreSidebar";
import MediaGrid from "@/components/Modules/Media/MediaGrid";
import { MediaGridSkeleton } from "@/components/Modules/Media/MediaGridSkeleton";
import SearchBar from "@/components/Modules/Home/SearchBar";

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
            <div className="h-60 mt-5 w-full flex items-center justify-center">
              <div className="w-full max-w-4xl ">
                <div className="flex flex-col items-center gap-3 mb-9">
                  <h1 className="text-4xl font-bold text-neutral-200">
                    Explore
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm max-w-md">
                    Search for movies, series, or reviews.
                  </p>
                </div>
                <SearchBar className="w-full py-3 " />
              </div>
            </div>
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
