"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Genre } from "@/types/media.types"
import { Badge } from "@/components/ui/badge";
import StatusBadgeCell from "@/components/Shared/ceil/StatusBadgeCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DateCeil from "@/components/Shared/ceil/DateCeil";

export const getGenreColumns = (
  onEdit: (genre: Genre) => void,
  onDelete: (genre: Genre) => void,
): ColumnDef<Genre>[] => [
  {
    id: "id",
    header: "Id",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.id.slice(0, 5)}...{row.original.id.slice(-5)}
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Genre",
    cell: ({ row }) => {
      const genre = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={genre.image} alt={genre.name} />
            <AvatarFallback>
              {genre.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{genre.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {genre.slug}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    enableSorting: false,
    header: "Status",
    cell: ({ row }) => (
      <StatusBadgeCell
        status={row.original.isPublished ? "PUBLISHED" : "UNPUBLISHED"}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <DateCeil date={row.original.createdAt} isTimeShow={false} />
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge
        variant={row.original.isFeatured ? "default" : "secondary"}
        className="text-[10px] uppercase font-bold tracking-widest"
      >
        {row.original.isFeatured ? "Featured" : "Regular"}
      </Badge>
    ),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const genre = row.original;
  //     return (
  //       <div className="flex items-center gap-3">
  //         <Button variant="ghost" size="icon" onClick={() => onEdit(genre)}>
  //           <Edit />
  //           {/* Edit Genre */}
  //         </Button>
  //         <Button variant="ghost" size="icon" onClick={() => onDelete(genre)}>
  //           <Trash2 />
  //           {/* Delete Genre */}
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
