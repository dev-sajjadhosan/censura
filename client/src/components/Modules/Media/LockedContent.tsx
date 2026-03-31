// components/Modules/Media/LockedContent.tsx
import { Lock, Crown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Media } from "@/types/media.types";

export default function LockedContent({ media }: { media: Media }) {
  return (
    <div className="w-full aspect-video bg-neutral-900 rounded-xl flex flex-col items-center justify-center gap-4 border border-neutral-800">
      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
        <Lock className="w-7 h-7 text-neutral-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-white">
          {media.pricing === "PREMIUM" ? "Premium Content" : "Rental Content"}
        </h3>
        <p className="text-neutral-400 text-sm mt-1">
          {media.pricing === "PREMIUM"
            ? "Subscribe to watch this title"
            : "Rent this title to watch"}
        </p>
      </div>
      {media.pricing === "PREMIUM" ? (
        <Button asChild>
          <Link href="/subscription">
            <Crown className="w-4 h-4 mr-2" /> Subscribe Now
          </Link>
        </Button>
      ) : (
        <Button variant="outline" asChild>
          <Link href={`/payment/media-checkout?mediaId=${media.id}&type=RENTAL`}>
            <DollarSign className="w-4 h-4 mr-2" /> Rent Now
          </Link>
        </Button>
      )}
    </div>
  );
}