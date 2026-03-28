import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantStyles = {
  default: "bg-card border-border",
  success: "bg-emerald-500/5 border-emerald-500/10",
  warning: "bg-amber-500/5 border-amber-500/10",
  danger: "bg-red-500/5 border-red-500/10",
  info: "bg-blue-500/5 border-blue-500/10",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/10 text-emerald-500",
  warning: "bg-amber-500/10 text-amber-500",
  danger: "bg-red-500/10 text-red-500",
  info: "bg-blue-500/10 text-blue-500",
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex flex-col gap-4 transition-all hover:shadow-md",
        variantStyles[variant],
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            iconStyles[variant],
          )}
        >
          <Icon className="size-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.value >= 0
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-red-500 bg-red-500/10",
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
