"use client";

import { ColumnDef } from "@tanstack/react-table";
import UserInfoCell from "@/components/Shared/ceil/UserInfoCell";
import DateCeil from "@/components/Shared/ceil/DateCeil";
import StatusBadgeCell from "@/components/Shared/ceil/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";

export const commentColumns: ColumnDef<any>[] = [
  {
    id: "user",
    header: "User",
    accessorKey: "user",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.user?.name || "Unknown"}
        email={row.original.user?.email}
        image={row.original.user?.image}
      />
    ),
  },
  {
    id: "content",
    header: "Comment Content",
    accessorKey: "content",
    cell: ({ row }) => (
      <p className="max-w-[300px] truncate text-sm text-muted-foreground">
        {row.original.content}
      </p>
    ),
  },
  {
    id: "media",
    header: "Media Context",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.original.media?.title}</span>
        <Badge variant="outline" className="w-fit text-[10px] mt-1">
          Review ID: {row.original.reviewId?.slice(-6)}
        </Badge>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadgeCell
        status={row.original.status}
        classNameMappings={{
          PUBLISHED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          UNPUBLISHED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
        }}
      />
    ),
  },
  {
    id: "createdAt",
    header: "Date Posted",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCeil date={row.original.createdAt} />,
  },
];