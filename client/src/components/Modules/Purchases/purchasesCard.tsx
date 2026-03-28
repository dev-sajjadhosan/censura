import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PurchasesCard({ item }: { item: any }) {
  const isRental = item.type === "RENTAL";
  const expiryDate = new Date(item.expiryDate);
  const isExpired = isRental && expiryDate < new Date();

  return (
    <>
      <Card key={item.id} className="bg-secondary/45 hover:bg-secondary/60">
        <CardHeader className="flex items-center pt-2">
          <Badge
            className=" uppercase font-bold text-xs py-3"
            variant="default"
          >
            {item.type}
          </Badge>
          <Badge className="py-3">
            <Star className="w-3 h-3 fill-secondary" />
            {item.media.avgRating?.toFixed(1) || "N/A"}
          </Badge>
          {isExpired && (
            <Badge variant="destructive" className="py-3 ml-auto">
              Expired
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <Link href={`/media/${item.media.slug}`} className="flex-1 flex">
            <div className=" relative">
              <Image
                width={400}
                height={600}
                src={
                  item.media.posterUrl ||
                  "https://placehold.co/400x600?text=No+Poster"
                }
                alt={item.media.title}
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-bold text-lg truncate">{item.media.title}</h3>
              <div className="flex items-center justify-between mt-1 text-sm text-neutral-400">
                <span>{item.media.releaseYear}</span>
                <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                  {item.media.type}
                </span>
              </div>

              <div className="mt-3 text-xs text-neutral-500 flex items-center gap-2">
                <CalendarDays className="w-3 h-3" />
                <span>
                  Purchased: {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              {isRental && (
                <div
                  className={`mt-1 text-xs font-semibold ${isExpired ? "text-red-500" : "text-amber-500"}`}
                >
                  {isExpired
                    ? "Expired"
                    : `Expires: ${expiryDate.toLocaleDateString()} ${expiryDate.toLocaleTimeString()}`}
                </div>
              )}
            </div>
          </Link>
        </CardContent>

        <div className="p-4 pt-0 mt-auto ml-auto">
          <Link
            href={
              isExpired
                ? `/media/${item.media.slug}`
                : item.media.streamingUrl || "#"
            }
          >
            <Button
              size={"lg"}
              variant={isExpired ? "secondary" : "default"}
              className={`px-6`}
            >
              <PlayCircle className="w-4 h-4" />
              {isExpired ? "Rent Again" : "Watch Now"}
            </Button>
          </Link>
        </div>
      </Card>
    </>
  );
}
