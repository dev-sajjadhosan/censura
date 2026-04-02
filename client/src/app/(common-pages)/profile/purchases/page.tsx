
import { ShoppingCart, Clock, CheckCircle, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMyMediaPurchases } from "@/services/media.service";

export default async function PurchasesPage() {
  const res = await getMyMediaPurchases();
  const purchases = res?.data ?? [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });

  const isExpired = (expiresAt: string | null) =>
    expiresAt ? new Date(expiresAt) < new Date() : false;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <ShoppingCart className="w-6 h-6 text-primary" />
        Purchase History
      </h1>
      <p className="text-neutral-400 mb-8">Your rented and purchased titles</p>

      {purchases.length === 0 ? (
        <div className="h-72 rounded-xl bg-secondary/20 border border-secondary/30 flex flex-col items-center justify-center gap-4">
          <Film className="w-10 h-10 text-neutral-600" />
          <p className="text-neutral-500">No purchases yet</p>
          <Button asChild size="sm">
            <Link href="/explore">Browse titles</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase: any) => {
            const expired = isExpired(purchase.expiresAt);
            const isRental = purchase.type === "RENTAL";

            return (
              <Card key={purchase.id} className="border-secondary/30 bg-secondary/10">
                <CardContent className="flex items-center gap-5 p-5">
                  {/* Poster */}
                  <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={purchase.media?.posterUrl || "https://placehold.co/64x96"}
                      alt={purchase.media?.title}
                      width={64}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white truncate">
                        {purchase.media?.title}
                      </h3>
                      <Badge
                        className={
                          isRental
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/20"
                            : "bg-green-500/20 text-green-300 border-green-500/20"
                        }
                      >
                        {isRental ? "Rental" : "Purchased"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mt-2">
                      <span>Paid ${Number(purchase.price).toFixed(2)}</span>
                      <span>•</span>
                      <span>Bought on {formatDate(purchase.createdAt)}</span>
                      {isRental && purchase.expiresAt && (
                        <>
                          <span>•</span>
                          <span className={expired ? "text-red-400" : "text-green-400"}>
                            {expired
                              ? `Expired ${formatDate(purchase.expiresAt)}`
                              : `Expires ${formatDate(purchase.expiresAt)}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {!expired || purchase.type === "BUY" ? (
                      <Button size="sm" asChild>
                        <Link href={`/media/${purchase.media?.slug}`}>
                          Watch
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/media/${purchase.media?.slug}`}>
                          Rent Again
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}