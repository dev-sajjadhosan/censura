import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Crown, DollarSign, Play, Star } from "lucide-react";
import { Media } from "@/types/media.types";
import { getUserMediaAccess } from "@/lib/access";
import { IProfileResponse } from "@/types/auth.types";

export default function MediaCard({
  media,
  user,
}: {
  media: Media;
  user?: IProfileResponse;
}) {
  const { hasAccess } = getUserMediaAccess(
    media,
    user?.subscription || null,
    user?.purchases || null,
  );
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Badge className="py-3">
          <Star className="fill-secondary" />
          {media.avgRating?.toFixed(1) || "N/A"}
        </Badge>
        <Badge className="py-3 px-3">{media.type}</Badge>
      </CardHeader>
      <CardContent>
        <Image
          src={media.posterUrl || "https://placehold.co/400x600?text=No+Poster"}
          alt={media.title}
          className="object-cover w-full h-40! rounded-xl"
          width={400}
          height={400}
        />

        <div className="p-3">
          <h3 className="font-bold text-lg truncate">{media.title}</h3>
          <div className="flex items-center justify-between mt-1 text-sm text-neutral-400">
            <span>{media.releaseYear}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            {user ? (
              hasAccess ? (
                <Button size="lg" disabled={!user}>
                  <Play /> Watch Now
                </Button>
              ) : media.pricing === "PREMIUM" ? (
                <Button size="lg" variant="secondary" asChild disabled={!user}>
                  <Link href="/subscription">
                    <Crown />{" "}
                    {user && user?.subscription.status === "active"
                      ? "Subscribed"
                      : "Subscribe"}
                  </Link>
                </Button>
              ) : media.pricing === "RENTAL" ? (
                <Button size="lg" variant="outline" asChild disabled={!user}>
                  <Link
                    href={`/payment/media-checkout?mediaId=${media.id}&type=RENTAL`}
                  >
                    <DollarSign /> Rent Now
                  </Link>
                </Button>
              ) : null
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">
                  <Crown /> Login to Watch
                </Link>
              </Button>
            )}

            <Link href={`/media/${media.slug}`}>
              <Button size="lg">
                View
                <ChevronRight />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
