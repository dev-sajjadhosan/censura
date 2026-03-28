"use client";

import { ColumnDef } from "@tanstack/react-table";
import UserInfoCell from "@/components/Shared/ceil/UserInfoCell";
import DateCeil from "@/components/Shared/ceil/DateCeil";
import StatusBadgeCell from "@/components/Shared/ceil/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import RatingCeil from "@/components/Shared/ceil/RatingCeil";
import { MessageSquare, AlertTriangle } from "lucide-react";

export const reviewColumns: ColumnDef<any>[] = [
  {
    id: "user",
    header: "User",
    accessorKey: "user.name",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.user?.name}
        email={row.original.user?.email}
        profilePhoto={row.original.user?.image}
      />
    ),
  },
  {
    id: "media",
    header: "Target Media",
    accessorKey: "media.title",
    cell: ({ row }) => {
      const media = row.original.media;
      if (!media) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-col min-w-0 max-w-[200px]">
          <span className="text-sm font-medium truncate">{media.title}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
            {media.type}
          </span>
        </div>
      );
    },
  },
  {
    id: "rating",
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => <RatingCeil rating={row.original.rating} max={10} />,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
  },
  {
    id: "hasSpoiler",
    header: "Spoiler",
    accessorKey: "hasSpoiler",
    cell: ({ row }) => row.original.hasSpoiler ? (
      <Badge variant="destructive" className="h-5 px-1.5 text-[10px] gap-1">
        <AlertTriangle className="size-2.5" />
        Yes
      </Badge>
    ) : (
      <span className="text-muted-foreground text-xs">—</span>
    ),
  },
  {
    id: "createdAt",
    header: "Submitted On",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCeil date={row.original.createdAt} />,
  },
];
