"use client";

import { Button } from "@/components/ui/button";
import { Coins, History, ShoppingCart, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { purchaseMedia } from "@/services/media.service";
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

export default function MediaActions({
  media,
  hasPurchasedInitial,
  user,
  initialIsBookmarked,
}: {
  media: Media;
  hasPurchasedInitial: boolean;
  user: any;
  initialIsBookmarked: boolean;
}) {
  const [hasPurchased, setHasPurchased] = useState(hasPurchasedInitial);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please log in to make a purchase");
      return;
    }

    try {
      setIsPurchasing(true);

      const payload = {
        mediaId: media.id,
        amount: media.pricing === "RENTAL" ? 4.99 : 14.99,
        type: media.pricing === "RENTAL" ? "RENTAL" : "BUY",
        expiryDate:
          media.pricing === "RENTAL"
            ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
            : new Date(
                Date.now() + 100 * 365 * 24 * 60 * 60 * 1000,
              ).toISOString(), // 100 years
      };

      await purchaseMedia(payload);

      toast.success(
        media.pricing === "RENTAL"
          ? "Rented successfully!"
          : "Purchased successfully!",
      );
      setHasPurchased(true);
      setShowPurchaseDialog(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Purchase failed. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const isFree = media.pricing === "FREE";
  const canWatch = isFree || hasPurchased;
  const actionText = media.pricing === "RENTAL" ? "Rent" : "Buy";
  const actionPrice = media.pricing === "RENTAL" ? "$4.99" : "$14.99";

  return (
    <>
      <div className="flex flex-wrap gap-4 pt-4">
        {canWatch ? (
          <Button
            size="lg"
            className="gap-2 bg-primary text-black hover:bg-primary/90 font-semibold"
            onClick={() => {
              if (media.streamingUrl) {
                window.open(media.streamingUrl, "_blank");
              } else {
                toast.info("Streaming URL will be available soon.");
              }
            }}
          >
            Watch Now
            <Video className="w-5 h-5" />
          </Button>
        ) : (
          <Button size="lg" onClick={() => setShowPurchaseDialog(true)}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            {actionText} {actionPrice}
          </Button>
        )}

        <WatchlistButton
          mediaId={media.id}
          initialIsBookmarked={initialIsBookmarked}
          user={user}
        />
      </div>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-3xl bg-neutral-900 border-neutral-800 text-white p-9">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You are about to {actionText.toLowerCase()}{" "}
              <strong>{media.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-around items-center  px-5 py-7 rounded-lg">
              <div className="space-y-2">
                <Image
                  width={130}
                  height={130}
                  src={
                    media.posterUrl ||
                    "https://placehold.co/400x600?text=No+Poster"
                  }
                  alt={media.title}
                  className="object-cover w-full h-full rounded-xl"
                />
                <h3 className="text-muted-foreground text-center">
                  {media.title}
                </h3>
              </div>
              <div className="flex flex-col items-center gap-1 bg-secondary/45 py-14 px-21 rounded-xl">
                <Coins className="size-10 mb-3 text-muted-foreground" />
                <h3 className="text-lg">
                  <span className="text-orange-500">{actionText}</span> Price
                </h3>
                <span className="font-bold text-3xl">{actionPrice}</span>
              </div>
            </div>
            {media.pricing === "RENTAL" && (
              <p className="text-sm text-neutral-500">
                You will have 48 hours to watch this content after purchase.
              </p>
            )}
          </div>

          <div className="flex justify-between items-center w-full">
            {user ? (
              <span />
            ) : (
              <p className="text-sm text-red-500">
                Please Login/Register to make a purchase.
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                size={"lg"}
                variant="ghost"
                onClick={() => setShowPurchaseDialog(false)}
              >
                Cancel
              </Button>
              <Button
                size={"lg"}
                disabled={isPurchasing || !user}
                onClick={handlePurchase}
                className="bg-primary text-black hover:bg-primary/90"
              >
                {isPurchasing ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
