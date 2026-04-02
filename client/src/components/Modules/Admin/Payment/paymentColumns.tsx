"use client";

import { ColumnDef } from "@tanstack/react-table";
import UserInfoCell from "@/components/Shared/ceil/UserInfoCell";
import DateCeil from "@/components/Shared/ceil/DateCeil";
import StatusBadgeCell from "@/components/Shared/ceil/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types/payment.types";

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    id: "user",
    header: "Customer",
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
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency?.toUpperCase() || "USD";
      return (
        <span className="font-bold text-sm">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          }).format(amount)}
        </span>
      );
    },
  },
  {
    id: "description",
    header: "Payment For",
    cell: ({ row }) => {
      const media = row.original.mediaPurchase?.media?.title;
      const sub = row.original.subscriptionId ? "Subscription Plan" : null;
      return (
        <div className="flex flex-col">
          <span className="text-sm truncate max-w-50">
            {media || sub || "Other"}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">
            ID: {row.original.stripePaymentId?.slice(-8)}
          </span>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadgeCell
        status={row.original.status?.toUpperCase()}
        classNameMappings={{
          SUCCEEDED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
        }}
      />
    ),
  },
  {
    id: "type",
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      const type = row.original.mediaPurchase.type
      return (
        <Badge variant="outline" className="text-xs">
          {type}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCeil date={row.original.createdAt} />,
  },
];
