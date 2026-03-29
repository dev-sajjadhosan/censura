"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Platform } from "@/types/media.types";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Edit, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const getPlatformColumns = (
  onEdit: (platform: Platform) => void,
  onDelete: (platform: Platform) => void,
): ColumnDef<Platform>[] => [
  {
    id: "No.",
    header: "No.",
    cell: ({ row, table }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {table.getRowModel().rows.indexOf(row) + 1}
      </span>
    ),
  },
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
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
        {row.original.type || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "_",
    header: "Total Media",
    cell: ({ row }) => (
      <span className="">{row.original?.mediaPlatforms?.length || 0}</span>
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
  {
    id: "actions",
    cell: ({ row }) => {
      const p = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(p)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(p)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove portal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
