"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Crown,
  DollarSign,
  Play,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Media } from "@/types/media.types";
import { getUserMediaAccess } from "@/lib/access";
import { IProfileResponse } from "@/types/auth.types";

export default function MediaCard({
  media,
  user,
}: {
  media: Media;
  user?: IProfileResponse | null;
}) {
  const { hasAccess } = getUserMediaAccess(
    media,
    user?.subscription || null,
    user?.purchases || null,
  );

  // Check if user already owns it (to hide Buy/Rent buttons)
  const hasPurchased = user?.purchases?.some(
    (p) => p.mediaId === media.id && p.type === "BUY",
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-muted">
      <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
        <Badge variant="secondary" className="gap-1">
          <Star className="size-3 fill-yellow-500 text-yellow-500" />
          {media.avgRating?.toFixed(1) || "N/A"}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {media.type.toLowerCase()}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-video mx-4 overflow-hidden rounded-xl">
          <Image
            src={
              media.posterUrl || "https://placehold.co/400x600?text=No+Poster"
            }
            alt={media.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{media.title}</h3>
          <p className="text-sm text-muted-foreground">{media.releaseYear}</p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {/* 1. WATCH ACCESS (The Priority Action) */}
            {hasAccess ? (
              <Button asChild className="flex-1 bg-primary">
                <Link href={`/watch/${media.slug}`}>
                  <Play className="mr-2 size-4 fill-current" /> Watch Now
                </Link>
              </Button>
            ) : (
              <>
                {/* 2. PREMIUM/SUBSCRIPTION BLOCK */}
                {media.pricing === "PREMIUM" && (
                  <Button variant="secondary" asChild className="flex-1">
                    <Link href="/subscription">
                      <Crown className="mr-2 size-4" /> Subscribe
                    </Link>
                  </Button>
                )}

                {/* 3. TRANSACTIONAL BLOCK (Rental/Buy) */}
                {media.pricing === "RENTAL" && !hasPurchased && (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link
                        href={`/payment/media-checkout?mediaId=${media.id}&type=RENTAL`}
                      >
                        <DollarSign className="mr-1 size-3" /> Rent
                      </Link>
                    </Button>
                    {/* Added Buy option to satisfy assignment requirement */}
                    {media.buyPrice && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1"
                      >
                        <Link
                          href={`/payment/media-checkout?mediaId=${media.id}&type=BUY`}
                        >
                          <ShoppingCart className="mr-1 size-3" /> Buy
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 4. ALWAYS SHOW VIEW DETAILS */}
            <Button size="icon" variant="ghost" asChild title="View Details">
              <Link href={`/media/${media.slug}`}>
                <ChevronRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
