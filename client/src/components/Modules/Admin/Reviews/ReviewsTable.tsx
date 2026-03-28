"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TanTable from "@/components/Shared/table/tanTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTableFilters, serverManagedFilter } from "@/hooks/useServerManagedDataTableFilters";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { adminGetAllReviews } from "@/services/admin.service";
import { reviewColumns } from "./reviewColumns";
import { TanTableFilterConfig, TanTableFilterValues } from "@/components/Shared/table/TanTableFilters";
import { toast } from "sonner";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const REVIEW_FILTER_DEFINITIONS = [
  serverManagedFilter.single("status"),
  serverManagedFilter.single("hasSpoiler"),
];

const ReviewsTable = ({ initialQueryString }: { initialQueryString?: string }) => {
  const searchParams = useSearchParams();

  // We actually don't have a view/edit/delete modal for reviews yet in this table pattern,
  // we'll rely on the existing status update logic if needed, but for now just the list.
  const { tableActions } = useRowActionModalState<any>();

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

  const queryString = queryStringFromUrl || initialQueryString || "";

  const { searchTermFromUrl, handleDebouncedSearchChange } = useServerManagedDataTableSearch({
    searchParams,
    updateParams,
  });

  const { filterValues, handleFilterChange, clearAllFilters } = useServerManagedDataTableFilters({
    searchParams,
    definitions: REVIEW_FILTER_DEFINITIONS,
    updateParams,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["reviews", queryString],
    queryFn: () => adminGetAllReviews(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const reviews = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta;

  const filterConfigs = useMemo<TanTableFilterConfig[]>(() => {
    return [
      {
        id: "status",
        label: "Moderation Status",
        type: "single-select",
        options: [
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Unpublished", value: "UNPUBLISHED" },
        ],
      },
      {
        id: "hasSpoiler",
        label: "Spoiler Alert",
        type: "single-select",
        options: [
          { label: "Has Spoiler", value: "true" },
          { label: "No Spoiler", value: "false" },
        ],
      },
    ];
  }, []);

  const filterValuesForTable = useMemo<TanTableFilterValues>(() => {
    return {
      status: filterValues.status,
      hasSpoiler: filterValues.hasSpoiler,
    };
  }, [filterValues]);

  return (
    <>
      <TanTable
        data={reviews}
        columns={reviewColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No reviews found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search user or content...",
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
          onView: (review) => {
             // Logic to show review full content could go here
             toast.info(`Viewing review by ${review.user?.name}`);
          },
        }}
      />
    </>
  );
};

export default ReviewsTable;
