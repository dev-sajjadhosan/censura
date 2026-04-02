"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TanTable from "@/components/Shared/table/tanTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import {
  useServerManagedDataTableFilters,
  serverManagedFilter,
} from "@/hooks/useServerManagedDataTableFilters";
import { adminGetAllPayments } from "@/services/admin.service";
import {
  TanTableFilterConfig,
  TanTableFilterValues,
} from "@/components/Shared/table/TanTableFilters";
import { paymentColumns } from "./paymentColumns";
import ViewPaymentDialog from "./ViewPaymentDialog";
import { Payment } from "@/types/payment.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PAYMENT_FILTER_DEFINITIONS = [serverManagedFilter.single("status")];

const PaymentTable = () => {
  const searchParams = useSearchParams();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || "";

  const { searchFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: PAYMENT_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-payments", queryString],
    queryFn: () =>
      adminGetAllPayments(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const items = (data as any)?.data || [];
  const meta = (data as any)?.meta;

  console.log("payment", items);

  const filterConfigs = useMemo<TanTableFilterConfig[]>(
    () => [
      {
        id: "status",
        label: "Status",
        type: "single-select",
        options: [
          { label: "Succeeded", value: "succeeded" },
          { label: "Pending", value: "pending" },
          { label: "Failed", value: "failed" },
        ],
      },
    ],
    [],
  );

  const filterValuesForTable = useMemo<TanTableFilterValues>(
    () => ({
      status: filterValues.status,
    }),
    [filterValues],
  );

  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  //   const [statusUpdateUser, setStatusUpdateUser] = useState<Payment | null>(null);

  return (
    <>
      <TanTable
        data={items}
        columns={paymentColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No payment transactions found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchFromUrl,
          placeholder: "Search Stripe ID or status...",
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: filterValuesForTable,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        meta={meta}
        actions={{
          onView: (user) => setViewPayment(user),
        //   onEdit: (user) => setStatusUpdateUser(user),
        }}
      />
      <ViewPaymentDialog
        payment={viewPayment!}
        open={!!viewPayment}
        onOpenChange={(open) => !open && setViewPayment(null)}
      />
    </>
  );
};

export default PaymentTable;
