import { getMyWatchlist } from "@/services/collections.service";
import { getCurrentUser } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import Link from "next/link";
import WatchlistCard from "@/components/Modules/Watchlist/watchlistCard";

export default async function WatchlistPage() {
  const { data: watchlist } = (await getMyWatchlist()) as any;
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-xl mb-8">My Watchlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {watchlist.map((item: any) => (
          <WatchlistCard key={item.id} item={item} user={user} />
        ))}
      </div>

      {watchlist.length === 0 && (
        <div className="py-20 w-9/12 mx-auto mt-19 h-80 flex flex-col items-center justify-center text-center bg-secondary/45 rounded-2xl">
          <History className="size-7 mb-3 text-muted-foreground" />
          <p className="text-neutral-500 mb-4 text-lg">
            Your watchlist is empty.
          </p>
          <Link href="/explore">
            <Button size={"lg"}>Explore Movies & Shows</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
