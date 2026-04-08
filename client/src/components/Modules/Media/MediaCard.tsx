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
    <Card className="group overflow-hidden shadow flex flex-col p-0 w-full">
      <div className="relative aspect-video overflow-hidden w-full">
        <Image
          src={media.posterUrl || "https://placehold.co/400x600?text=No+Poster"}
          alt={media.title}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="px-3 py-3">
            <Star className="size-3 fill-yellow-500 text-yellow-500" />
            {media.avgRating?.toFixed(1) || "N/A"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-1 w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {media.genres?.map((genre) => (
              <Badge key={genre.id} className="uppercase py-3 px-3">
                {genre.name}
              </Badge>
            ))}
          </div>
          <Badge variant="outline" className="text-[10px] uppercase py-3 px-3">
            {media.type}
          </Badge>
        </div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
            {media.title}
          </h3>
          <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded">
            {media.releaseYear}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {media.synopsis || "No description available for this title."}
        </p>

        <div className="flex items-center text-4xl font-bold text-muted-foreground">
          <DollarSign className="size-8" />
          <span>{media.buyPrice || "0.00"}</span>
        </div>

        <div className="flex items-center justify-start gap-3 pt-4">
          <div className="flex gap-2">
            {hasAccess ? (
              <Button size="lg" asChild className="rounded-full px-4">
                <Link href={`/watch/${media.slug}`}>
                  <Play className="mr-2 size-3.5 fill-current" /> Play
                </Link>
              </Button>
            ) : (
              media.pricing === "RENTAL" &&
              !hasPurchased && (
                <Button
                  size="lg"
                  variant="default"
                  className="rounded-full px-4"
                  asChild
                >
                  <Link
                    href={`/payment/media-checkout?mediaId=${media.id}&type=RENTAL`}
                  >
                    <ShoppingCart className="mr-2 size-3.5" /> Get
                  </Link>
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group/btn"
          >
            <Link href={`/media/${media.slug}`} className="flex items-center">
              Details
              <ChevronRight className="ml-1 size-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
