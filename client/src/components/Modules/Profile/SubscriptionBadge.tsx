import { Crown, Zap, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SubscriptionBadgeProps {
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
  } | null;
}

const planConfig = {
  FREE: {
    label: "Free",
    description: "Basic access",
    icon: Star,
    color: "text-neutral-400",
    bg: "bg-neutral-700/30",
    border: "border-neutral-600/30",
    badge: "bg-neutral-700 text-neutral-300",
  },
  MONTHLY: {
    label: "Monthly",
    description: "Premium access",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300",
  },
  YEARLY: {
    label: "Yearly",
    description: "Best value plan",
    icon: Crown,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
};

export default function SubscriptionBadge({
  subscription,
}: SubscriptionBadgeProps) {
  const plan = subscription?.plan ?? "FREE";
  const config = planConfig[plan as keyof typeof planConfig] ?? planConfig.FREE;
  const Icon = config.icon;
  const isActive = subscription?.status === "ACTIVE" && plan !== "FREE";
  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <div
      className={`w-full h-full p-5 rounded-xl border flex flex-col items-center justify-between gap-3 ${config.bg} ${config.border}`}
    >
      {isActive && subscription?.currentPeriodEnd ? (
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">Renews on</p>
          <p className="text-xs font-medium text-orange-500">
            {formatDate(subscription.currentPeriodEnd)}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-15 bg-secondary text-muted-foreground tracking-widest">
          UPGRADE TO PREMIUM
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`size-9 rounded-full flex items-center justify-center border ${config.border} ${config.bg}`}
        >
          <Icon className={`size-5 ${config.color}`} />
        </div>
        <div className="flex flex-col text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Badge
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}
            >
              {isActive ? "Active" : "Free Tier"}
            </Badge>
            <h3 className="text-white text-lg">{config.label} Plan</h3>
          </div>
          <p className="text-xs text-neutral-400">{config.description}</p>
        </div>
      </div>

      {/* CTA */}
      {!isActive ? (
        <Button size="sm" asChild className="rounded-full px-6">
          <Link href="/profile/subscription">
            <Crown className="w-4 h-4 mr-1" /> Upgrade Plan
          </Link>
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          asChild
          //   className="rounded-full px-6 border-neutral-600 text-neutral-300"
        >
          <Link href="/profile/subscription">Manage Subscription</Link>
        </Button>
      )}
    </div>
  );
}
