export const dynamic = 'force-dynamic';

import { getMyWatchlist, getBookmarked, getMyFavorites } from "@/services/collections.service";
import { getCurrentUser } from "@/services/user.service";
import CollectionsTabs from "@/components/Modules/Profile/CollectionsTabs";


export default async function CollectionsPage() {
  const [watchlistRes, bookmarksRes, favoritesRes, user] = await Promise.all([
    getMyWatchlist(),
    getBookmarked(),
    getMyFavorites(),
    getCurrentUser(),
  ]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-white mb-8">My Collections</h1>
      <CollectionsTabs
        watchlist={(watchlistRes as any).data}
        bookmarks={(bookmarksRes as any).data}
        favorites={(favoritesRes as any).data}
        user={user}
      />
    </div>
  );
}