import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, DollarSign, Play, Star } from "lucide-react";
import { Media } from "@/types/media.types";

export default function MediaCard({ media }: { media: Media }) {
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
            {media.pricing === "FREE" ? (
              <Button size="sm">
                {" "}
                <Play /> Watch Now
              </Button>
            ) : (
              <Button size="sm">
                {" "}
                <DollarSign /> Buy Now
              </Button>
            )}
            <Link href={`/media/${media.slug}`}>
              <Button size="sm">
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
