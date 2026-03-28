"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeCellProps {
  status: string;
  variantMappings?: Record<string, "default" | "secondary" | "outline" | "destructive">;
  classNameMappings?: Record<string, string>;
}

const DEFAULT_VARIANT_MAPPINGS: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  BLOCKED: "bg-red-500/10 text-red-500 border-red-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  UNVERIFIED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  UNPUBLISHED: "bg-red-500/10 text-red-500 border-red-500/20",
};

const StatusBadgeCell = ({ status, classNameMappings }: StatusBadgeCellProps) => {
  const statusLabel = status?.replace(/_/g, " ") || "UNKNOWN";
  const customClass = classNameMappings?.[status] || DEFAULT_VARIANT_MAPPINGS[status] || "bg-muted text-muted-foreground";

  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-medium uppercase tracking-wider", customClass)}
    >
      {statusLabel}
    </Badge>
  );
};

export default StatusBadgeCell;
