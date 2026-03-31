"use client";

import { Button } from "@/components/ui/button";
import { Coins, Crown, Loader2, Play, ShoppingCart, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Media } from "@/types/media.types";
import Image from "next/image";
import WatchlistButton from "./WatchlistButton";
import { getUserMediaAccess } from "@/lib/access";
import Link from "next/link";
import { createMediaCheckoutSession } from "@/services/payment.service";

export default function MediaActions({
  media,
  hasPurchasedInitial,
  user,
  initialIsWatchlisted,
}: {
  media: Media;
  hasPurchasedInitial: boolean;
  user: any;
  initialIsWatchlisted: boolean;
}) {
  const [loading, setLoading] = useState<"RENTAL" | "BUY" | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"RENTAL" | "BUY" | null>(
    null,
  );
  const router = useRouter();

  const { hasAccess } = getUserMediaAccess(
    media,
    user?.subscription ?? null,
    user?.purchases ?? null,
  );

  // first available platform URL = media?.mediaPlatforms[0]?.platform?.url
  const watchUrl = "";

  const openDialog = (type: "RENTAL" | "BUY") => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    setSelectedType(type);
    setShowDialog(true);
  };

  const handleCheckout = async () => {
    if (!selectedType) return;
    try {
      setLoading(selectedType);
      const res = (await createMediaCheckoutSession({
        mediaId: media.id,
        type: selectedType,
      })) as any;

      if (res?.data?.data?.session_url) {
        window.location.href = res.data.data.session_url;
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(null);
      setShowDialog(false);
    }
  };

  const isFree = media.pricing === "FREE";
  const actionPrice =
    selectedType === "RENTAL"
      ? `$${Number(media.rentalPrice ?? 0.0).toFixed(2)}`
      : `$${Number(media.buyPrice ?? 0.0).toFixed(2)}`;

  return (
    <>
      <div className="flex flex-wrap gap-4 pt-4">
        {/* Watch Now — free or has access */}
        {(isFree || hasAccess) && (
          <Button
            size="lg"
            className="gap-2 font-semibold rounded-full px-8 h-12"
            onClick={() => {
              if (watchUrl) {
                window.open(watchUrl, "_blank");
              } else {
                toast.info("No streaming platform linked yet.");
              }
            }}
          >
            <Play className="w-5 h-5 fill-current" /> Watch Now
          </Button>
        )}

        {/* PREMIUM — not subscribed */}
        {media.pricing === "PREMIUM" && !hasAccess && (
          <Button size="lg" className="gap-2 rounded-full px-8 h-12" asChild>
            <Link href="/subscription">
              <Crown className="w-5 h-5" /> Subscribe to Watch
            </Link>
          </Button>
        )}

        {/* RENTAL — not purchased */}
        {media.pricing === "RENTAL" && !hasAccess && (
          <div className="flex items-center gap-3">
            {media.rentalPrice && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full px-8 h-12"
                onClick={() => openDialog("RENTAL")}
                disabled={!!loading}
              >
                {loading === "RENTAL" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
                Rent ${Number(media.rentalPrice).toFixed(2)}
                <span className="text-xs text-neutral-400">(48hrs)</span>
              </Button>
            )}
            {media.buyPrice && (
              <Button
                size="lg"
                className="gap-2 rounded-full px-8 h-12"
                onClick={() => openDialog("BUY")}
                disabled={!!loading}
              >
                {loading === "BUY" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                Buy ${Number(media.buyPrice).toFixed(2)}
              </Button>
            )}
          </div>
        )}

        {/* Not logged in */}
        {!user && !isFree && (
          <Button size="lg" className="rounded-full px-8 h-12" asChild>
            <Link href="/login">Login to Watch</Link>
          </Button>
        )}

        <WatchlistButton
          mediaId={media.id}
          initialIsWatchlisted={initialIsWatchlisted}
          user={user}
        />
      </div>

      {/* Confirm Purchase Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>
              Confirm {selectedType === "RENTAL" ? "Rental" : "Purchase"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              You are about to {selectedType === "RENTAL" ? "rent" : "buy"}{" "}
              <strong className="text-white">{media.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-6 py-4">
            <Image
              width={80}
              height={120}
              src={media.posterUrl || "https://placehold.co/80x120"}
              alt={media.title}
              className="rounded-xl object-cover w-20 h-28 shrink-0"
            />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">{media.title}</h3>
              <p className="text-neutral-400 text-sm">{media.releaseYear}</p>
              <div className="flex items-center gap-2 mt-3">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">
                  {actionPrice}
                </span>
              </div>
              {selectedType === "RENTAL" && (
                <p className="text-xs text-neutral-500">
                  48-hour access after payment
                </p>
              )}
              {selectedType === "BUY" && (
                <p className="text-xs text-neutral-500">Permanent access</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={!!loading}
              onClick={handleCheckout}
              className="px-8"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Pay with Stripe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
