"use client";

import { Button } from "@/components/ui/button";
import { Coins, Crown, Loader2, Play, ShoppingCart, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
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

interface MediaActionsProps {
  media: Media;
  hasPurchasedInitial: boolean;
  user: any;
  initialIsWatchlisted: boolean;
}

export default function MediaActions({
  media,
  user,
  initialIsWatchlisted,
}: MediaActionsProps) {
  const [loading, setLoading] = useState<"RENTAL" | "BUY" | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"RENTAL" | "BUY" | null>(
    null,
  );

  const router = useRouter();
  const pathname = usePathname();

  // Determine access based on user data
  const { hasAccess } = getUserMediaAccess(
    media,
    user?.subscription ?? null,
    user?.purchases ?? null,
  );

  // Get the first available streaming link
  const watchUrl = media.streamingUrl || "";

  const openDialog = (type: "RENTAL" | "BUY") => {
    if (!user) {
      toast.error("Please login to continue");
      router.push(`/login?callbackUrl=${pathname}`);
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
        router.push(res.data.data.session_url);
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
        {/* CASE 1: User can watch (Free content or User has paid/subscribed) */}
        {(isFree || (user && hasAccess)) && (
          <Button
            size="lg"
            className="gap-2 font-semibold rounded-full px-8 h-12 bg-primary hover:bg-primary/90"
            onClick={() => {
              if (watchUrl) {
                router.push(`/watch/${media.slug}?v=${media.trailerUrl}`);
              } else {
                toast.info("No streaming link available for this media.");
              }
            }}
          >
            <Play className="w-5 h-5 fill-current" /> Watch Now
          </Button>
        )}

        {/* CASE 2: Content is PREMIUM and user is logged in but has no access */}
        {user && !hasAccess && media.pricing === "PREMIUM" && (
          <Button
            size="lg"
            className="gap-2 rounded-full px-8 h-12 bg-amber-600 hover:bg-amber-700"
            asChild
          >
            <Link href="/subscription">
              <Crown className="w-5 h-5" /> Subscribe to Watch
            </Link>
          </Button>
        )}

        {/* CASE 3: Content is RENTAL/BUY and user is logged in but hasn't purchased */}
        {user && !hasAccess && media.pricing === "RENTAL" && (
          <div className="flex items-center gap-3">
            {media.rentalPrice && (
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full px-8 h-12 border-neutral-700 hover:bg-neutral-800"
                onClick={() => openDialog("RENTAL")}
                disabled={!!loading}
              >
                {loading === "RENTAL" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
                Rent ${Number(media.rentalPrice).toFixed(2)}
                <span className="text-[10px] text-neutral-400 ml-1">
                  (48hrs)
                </span>
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

        {/* CASE 4: Not logged in and content is not free */}
        {!user && !isFree && (
          <Button size="lg" className="px-8 font-medium" asChild>
            <Link href={`/login?callbackUrl=${pathname}`}>Login to Watch</Link>
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
            <DialogTitle className="text-xl">
              Confirm {selectedType === "RENTAL" ? "Rental" : "Purchase"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400">
              You are about to {selectedType === "RENTAL" ? "rent" : "buy"}{" "}
              <span className="text-white font-medium">{media.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-6 py-6 border-y border-neutral-800 my-2">
            <div className="relative w-20 h-28 shrink-0">
              <Image
                fill
                src={media.posterUrl || "https://placehold.co/80x120"}
                alt={media.title}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg leading-tight">{media.title}</h3>
              <p className="text-neutral-400 text-sm">
                {media.releaseYear} • {media.director}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">
                  {actionPrice}
                </span>
              </div>
              <p className="text-xs text-neutral-500 italic mt-1">
                {selectedType === "RENTAL"
                  ? "✓ 48-hour viewing window starts after first play."
                  : "✓ Permanent access to your library."}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowDialog(false)}
              className="text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              disabled={!!loading}
              onClick={handleCheckout}
              className="px-8 bg-white text-black hover:bg-neutral-200"
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
