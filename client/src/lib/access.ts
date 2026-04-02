export function getUserMediaAccess(
  media: { id: string; pricing: string },
  subscription: { plan: string; status: string } | null,
  purchases: any[] | null,
): { hasAccess: boolean; reason: string } {
  const pricing = media?.pricing?.toUpperCase();
  const subStatus = subscription?.status?.toUpperCase();
  const subPlan = subscription?.plan?.toUpperCase();

  // 1. Always accessible if FREE
  if (pricing === "FREE") return { hasAccess: true, reason: "FREE" };

  // 2. Check for Manual Purchases (Buy or Rent)
  // We check this before subscription because a user might own a "Premium" movie permanently
  if (purchases && purchases.length > 0) {
    const matchingPurchase = purchases.find((p) => p.mediaId === media.id);

    if (matchingPurchase) {
      const type = matchingPurchase.type?.toUpperCase();
      const status = matchingPurchase.status?.toUpperCase();

      // Permanent Ownership
      if (type === "BUY" && status === "ACTIVE") {
        return { hasAccess: true, reason: "OWNED" };
      }

      // Time-limited Rental
      if (type === "RENTAL" && status === "ACTIVE") {
        const isNotExpired = matchingPurchase.expiresAt && new Date(matchingPurchase.expiresAt) > new Date();
        if (isNotExpired) return { hasAccess: true, reason: "RENTAL_ACTIVE" };
      }
    }
  }

  // 3. Check Subscription for PREMIUM content
  if (pricing === "PREMIUM") {
    const hasActiveSub = subStatus === "ACTIVE" && 
      ["MONTHLY", "YEARLY", "1_MONTH"].includes(subPlan || ""); 
    
    return { hasAccess: !!hasActiveSub, reason: "PREMIUM_SUB" };
  }

  return { hasAccess: false, reason: "LOCKED" };
}