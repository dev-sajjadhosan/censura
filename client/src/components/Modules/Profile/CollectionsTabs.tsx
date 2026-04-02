"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Heart, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WatchlistCard from "@/components/Modules/Watchlist/watchlistCard";

interface CollectionsTabsProps {
  watchlist: any[];
  bookmarks: any[];
  favorites: any[];
  user: any;
}

function EmptyState({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="py-20 md:w-9/12 mx-auto h-80 flex flex-col items-center justify-center text-center bg-secondary/45 rounded-2xl">
      <Icon className="size-7 mb-3 text-muted-foreground" />
      <p className="text-neutral-500 mb-4 text-lg">Your {label} is empty.</p>
      <Link href="/explore">
        <Button size="lg">Explore Movies & Shows</Button>
      </Link>
    </div>
  );
}

export default function CollectionsTabs({
  watchlist,
  bookmarks,
  favorites,
  user,
}: CollectionsTabsProps) {
  return (
    <Tabs defaultValue="watchlist">
      <TabsList
        className="mb-8 bg-secondary/40 py-6 px-5"
      >
        <TabsTrigger value="watchlist" className="gap-2 py-4 px-3">
          <History />
          Watchlist
          {watchlist.length > 0 && (
            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {watchlist.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="gap-2 py-4 px-3">
          <Bookmark />
          Bookmarks
          {bookmarks.length > 0 && (
            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {bookmarks.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="favorites" className="gap-2 py-4 px-3">
          <Heart />
          Favorites
          {favorites.length > 0 && (
            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="watchlist">
        {watchlist.length === 0 ? (
          <EmptyState icon={History} label="watchlist" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((item: any) => (
              <WatchlistCard key={item.id} item={item} user={user} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="bookmarks">
        {bookmarks.length === 0 ? (
          <EmptyState icon={Bookmark} label="bookmarks" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((item: any) => (
              <WatchlistCard key={item.id} item={item} user={user} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="favorites">
        {favorites.length === 0 ? (
          <EmptyState icon={Heart} label="favorites" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item: any) => (
              <WatchlistCard key={item.id} item={item} user={user} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
