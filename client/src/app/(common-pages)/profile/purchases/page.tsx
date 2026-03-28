import { getMyMediaPurchases } from "@/services/media.service";
import { Button } from "@/components/ui/button";
import { Play, PlayCircle, Grid, List } from "lucide-react";
import Link from "next/link";
import PurchasesCard from "@/components/Modules/Purchases/purchasesCard";

export default async function PurchasesPage() {
  let purchases: any[] = [];
  try {
    const res = (await getMyMediaPurchases()) as any;
    purchases = res?.data || [];
  } catch (error) {
    console.error("Failed to fetch purchases:", error);
  }

  const mockPurchases = [
    {
      id: "mock-pur-1",
      type: "PURCHASE",
      amount: 14.99,
      expiryDate: new Date(
        Date.now() + 100 * 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
      mediaId: "mock-1",
      media: {
        id: "mock-1",
        title: "The Silent Shadows",
        slug: "silent-shadows",
        posterUrl:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
        avgRating: 8.5,
        releaseYear: 2023,
        type: "MOVIE",
        streamingUrl: "#",
      },
    },
    {
      id: "mock-pur-2",
      type: "RENTAL",
      amount: 4.99,
      expiryDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Active rental
      createdAt: new Date().toISOString(),
      mediaId: "mock-2",
      media: {
        id: "mock-2",
        title: "Nightfall Chronicles",
        slug: "nightfall-chronicles",
        posterUrl:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
        avgRating: 7.9,
        releaseYear: 2024,
        type: "SERIES",
        streamingUrl: "#",
      },
    },
    {
      id: "mock-pur-3",
      type: "RENTAL",
      amount: 4.99,
      expiryDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Expired rental
      createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      mediaId: "mock-3",
      media: {
        id: "mock-3",
        title: "Beyond the Horizon",
        slug: "beyond-horizon",
        posterUrl:
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
        avgRating: 9.2,
        releaseYear: 2022,
        type: "MOVIE",
        streamingUrl: "#",
      },
    },
  ];

  const displayPurchases = [...purchases];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl mb-8">My Purchases</h1>

        <div className="flex items-center gap-1">
          <Button size="icon-lg" variant="secondary">
            <Grid />
          </Button>
          <Button size="icon-lg" variant="ghost" disabled>
            <List />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {displayPurchases.map((item: any) => {
          return <PurchasesCard key={item.id} item={item} />;
        })}
      </div>

      {displayPurchases.length === 0 && (
        <div className="w-9/12 h-96 mt-15 mx-auto py-20 text-center bg-neutral-900/60 rounded-2xl flex flex-col items-center justify-center">
          <Play className="size-11 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4 text-lg">
            You haven't purchased or rented any media yet.
          </p>
          <Link href="/explore">
            <Button size="xl">
              <PlayCircle />
              Explore Movies & Shows
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
