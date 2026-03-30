"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Platform } from "@/types/media.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TitleCaseFormat } from "@/utils/app.utils";

export const getPlatformColumns = (
  onEdit: (platform: Platform) => void,
  onDelete: (platform: Platform) => void,
): ColumnDef<Platform>[] => [
  // {
  //   id: "id",
  //   header: "Id",
  //   cell: ({ row, table }) => (
  //     <span className="text-sm font-medium text-muted-foreground">
  //       {row.original.id.slice(0, 5)}...{row.original.id.slice(-3)}
  //     </span>
  //   ),
  // },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={p.icon} />
            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm capitalize">{p.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Streaming Service
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Plan Type",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground tracking-tight">
        {row.original.type ? TitleCaseFormat(row.original.type) : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "_",
    header: "Total Media",
    cell: ({ row }) => (
      <span>
        {row.original?.mediaPlatforms?.length || "000"}
      </span>
    ),
  },
  {
    accessorKey: "url",
    header: "Official URL",
    cell: ({ row }) => (
      <span className="text-xs text-blue-500 hover:underline cursor-pointer truncate max-w-[200px] block">
        {row.original.url ? (
          <Link href={row.original.url || "#"} target="_blank">
            Visit Site
          </Link>
        ) : (
          "Not Linked"
        )}
      </span>
    ),
  },
  {
    accessorKey: "isFeatured",
    enableSorting: false,
    header: "Featured",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isFeatured ? "default" : "secondary"}
        className="uppercase tracking-tight py-3 px-3"
      >
        {row.original.isFeatured ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "isPublished",
    enableSorting: false,
    header: "Published",
    cell: ({ row }) => (
      <Badge
        variant={row.original.isPublished ? "default" : "secondary"}
        className="uppercase tracking-tight py-3 px-3"
      >
        {row.original.isPublished ? "Yes" : "No"}
      </Badge>
    ),
  },
];
