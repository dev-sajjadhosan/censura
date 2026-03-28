"use client";

import { ColumnDef } from "@tanstack/react-table";
import UserInfoCell from "@/components/Shared/ceil/UserInfoCell";
import DateCeil from "@/components/Shared/ceil/DateCeil";
import StatusBadgeCell from "@/components/Shared/ceil/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import RatingCeil from "@/components/Shared/ceil/RatingCeil";
import { Film } from "lucide-react";

export const mediaColumns: ColumnDef<any>[] = [
  {
    id: "media",
    header: "Media",
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.posterUrl ? (
          <img
            src={row.original.posterUrl}
            alt={row.original.title}
            className="w-8 h-11 rounded object-cover shrink-0 border border-border"
          />
        ) : (
          <div className="w-8 h-11 rounded bg-muted flex items-center justify-center shrink-0 border">
            <Film className="size-3 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">{row.original.title}</span>
          <span className="text-xs text-muted-foreground truncate">{row.original.director || "—"}</span>
        </div>
      </div>
    ),
  },
  {
    id: "type",
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">
        {row.original.type}
      </Badge>
    ),
  },
  {
    id: "pricing",
    header: "Pricing",
    accessorKey: "pricing",
    cell: ({ row }) => {
      const pricing = row.original.pricing;
      return (
        <Badge
          className={
            pricing === "FREE"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
              : pricing === "PREMIUM"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
          }
        >
          {pricing}
        </Badge>
      );
    },
  },
  {
    id: "rating",
    header: "Rating",
    accessorKey: "avgRating",
    cell: ({ row }) => <RatingCeil rating={row.original.avgRating || 0} />,
  },
  {
    id: "year",
    header: "Year",
    accessorKey: "releaseYear",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {row.original.releaseYear}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "isPublished",
    cell: ({ row }) => (
      <StatusBadgeCell 
        status={row.original.isPublished ? "APPROVED" : "UNPUBLISHED"} 
        classNameMappings={{
          APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          UNPUBLISHED: "bg-red-500/10 text-red-500 border-red-500/20",
        }}
      />
    ),
  },
  {
    id: "createdAt",
    header: "Added On",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCeil date={row.original.createdAt} />,
  },
];
