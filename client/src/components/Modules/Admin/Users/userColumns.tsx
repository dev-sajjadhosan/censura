"use client";

import { ColumnDef } from "@tanstack/react-table";
import UserInfoCell from "@/components/Shared/ceil/UserInfoCell";
import DateCeil from "@/components/Shared/ceil/DateCeil";
import StatusBadgeCell from "@/components/Shared/ceil/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export const userColumns: ColumnDef<any>[] = [
  {
    id: "user",
    header: "User",
    accessorKey: "name",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        image={row.original.image}
      />
    ),
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          className={
            role === "ADMIN"
              ? "bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]"
              : "text-[10px]"
          }
          variant="secondary"
        >
          {role === "ADMIN" ? (
            <ShieldCheck className="size-2.5 mr-1" />
          ) : null}
          {role}
        </Badge>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
  },
  {
    id: "createdAt",
    header: "Joined On",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCeil date={row.original.createdAt} />,
  },
];
