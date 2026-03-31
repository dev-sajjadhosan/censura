import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import WatchlistButton from "../Media/WatchlistButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function WatchlistCard({
  item,
  user,
}: {
  item: any;
  user: any;
}) {
  return (
    <>
      <Card key={item.id}>
        <CardHeader>
          <Badge className="py-3">
            <Star className="fill-secondary" />
            {item.media.avgRating?.toFixed(1) || "N/A"}
          </Badge>
        </CardHeader>
        <CardContent>
          <Image
            width={350}
            height={300}
            src={
              item.media.posterUrl ||
              "https://placehold.co/400x600?text=No+Poster"
            }
            className="h-50! w-full! object-cover rounded-2xl"
            alt={item.media.title}
          />

          <div className="p-4">
            <h3 className="font-bold text-lg truncate">{item.media.title}</h3>
            <div className="flex items-center justify-between mt-1 text-sm text-neutral-400">
              <span>{item.media.releaseYear}</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                {item.media.type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/media/${item.media.slug}`}>
              <Button size="lg" className="px-5">
                View Details
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <WatchlistButton
              mediaId={item.media.id}
              user={user}
              removeOnly={true}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
