export function getUserMediaAccess(
  media: { id: string; pricing: string },
  subscription: { plan: string; status: string } | null,
  purchases: any[] | null,
): { hasAccess: boolean; reason: string } {
  const pricing = media?.pricing?.toUpperCase();
  const subStatus = subscription?.status?.toUpperCase();
  const subPlan = subscription?.plan?.toUpperCase();

  // 1. Public Content
  if (pricing === "FREE") return { hasAccess: true, reason: "FREE" };

  // 2. Subscription Content
  if (pricing === "PREMIUM") {
    // Check if status is active AND plan matches your allowed list
    const hasActiveSub = subStatus === "ACTIVE" && 
      ["MONTHLY", "YEARLY", "1_MONTH"].includes(subPlan || ""); 
    
    return { hasAccess: !!hasActiveSub, reason: "PREMIUM" };
  }

  // 3. Rental Content
  if (pricing === "RENTAL") {
    const activeRental = purchases?.some(
      (p) =>
        p?.mediaId === media?.id &&
        p?.type?.toUpperCase() === "RENTAL" &&
        p?.status?.toUpperCase() === "ACTIVE" &&
        p?.expiresAt && new Date(p.expiresAt) > new Date(),
    );
    return { hasAccess: !!activeRental, reason: "RENTAL" };
  }

  return { hasAccess: false, reason: "UNKNOWN" };
}