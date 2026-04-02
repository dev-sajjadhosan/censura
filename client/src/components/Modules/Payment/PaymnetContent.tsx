"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMediaById } from "@/services/media.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Ticket, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { createMediaCheckoutSession } from "@/services/payment.service";

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mediaId = searchParams.get("mediaId");
  const type = searchParams.get("type") || "RENTAL";

  const { data, isLoading } = useQuery({
    queryKey: ["media-checkout", mediaId],
    queryFn: () => getMediaById(mediaId as string),
    enabled: !!mediaId,
  });

  const media = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  const price = media?.rentalPrice || 3.99;

  const handlePayment = async () => {
    try {
      const response = (await createMediaCheckoutSession({
        mediaId: mediaId as string,
        type: type as "RENTAL" | "BUY",
      })) as any;
      router.push(response?.data?.session_url);
      console.log("media payment: ", response);
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="container max-w-4xl py-10 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden border-none shadow-2xl">
            <div className="relative aspect-[2/3]">
              <Image
                src={media?.posterUrl || "https://placehold.co/400x600"}
                alt={media?.title || ""}
                fill
                className="object-cover"
              />
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <Badge
              variant="outline"
              className="mb-2 uppercase tracking-widest text-[10px]"
            >
              Secure Checkout
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Confirm Your {type}
            </h1>
            <p className="text-muted-foreground mt-2">
              You are renting{" "}
              <span className="text-foreground font-medium">
                {media?.title}
              </span>
              . Access will be granted immediately after payment.
            </p>
          </div>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="size-5 text-primary" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {media?.title} ({type})
                </span>
                <span className="font-medium">${price}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-black text-primary">
                  ${price}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full text-lg h-14"
                onClick={handlePayment}
              >
                <Zap className="mr-2 fill-current" /> Pay with Stripe
              </Button>
            </CardFooter>
          </Card>

          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground"
          >
            ← Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
