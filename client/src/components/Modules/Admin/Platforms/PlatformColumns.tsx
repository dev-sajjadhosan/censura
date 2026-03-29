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

export const getPlatformColumns = (
  onEdit: (platform: Platform) => void,
  onDelete: (platform: Platform) => void,
): ColumnDef<Platform>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary shrink-0 transition-colors">
            <Globe className="h-4 w-4" />
          </div>
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
        {row.original.icon || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "url",
    header: "Official URL",
    cell: ({ row }) => (
      <span className="text-xs text-blue-500 hover:underline cursor-pointer truncate max-w-[200px] block">
        {row.original.isPublished || "Not Linked"}
      </span>
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
