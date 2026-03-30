import { MediaPurchase } from "@/types/media.types";
import { Subscription } from "@/types/payment.types";

export function getUserMediaAccess(
  media: { id: string; pricing: string },
  subscription: Pick<Subscription, "plan" | "status"> | null,
  purchases:
    | Pick<MediaPurchase, "mediaId" | "type" | "status" | "expiresAt">[]
    | null,
): { hasAccess: boolean; reason: string } {
  if (media.pricing === "FREE") return { hasAccess: true, reason: "FREE" };

  if (media.pricing === "PREMIUM") {
    const hasAccess =
      subscription?.status === "ACTIVE" &&
      (subscription.plan === "MONTHLY" || subscription.plan === "YEARLY");
    return { hasAccess, reason: "PREMIUM" };
  }

  if (media.pricing === "RENTAL") {
    const hasAccess = purchases?.some(
      (p) =>
        p.mediaId === media.id &&
        p.type === "RENTAL" &&
        p.status === "ACTIVE" &&
        p.expiresAt !== null &&
        new Date(p.expiresAt) > new Date(),
    );
    return { hasAccess: hasAccess || false, reason: "RENTAL" };
  }

  return { hasAccess: false, reason: "UNKNOWN" };
}
