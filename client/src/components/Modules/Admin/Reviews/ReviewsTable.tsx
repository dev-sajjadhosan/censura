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
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { adminGetAllReviews } from "@/services/admin.service";
import { reviewColumns } from "./reviewColumns";
import {
  TanTableFilterConfig,
  TanTableFilterValues,
} from "@/components/Shared/table/TanTableFilters";
import { toast } from "sonner";
import { Review } from "@/types/media.types";
import ViewReviewDialog from "./ViewReviewDialog";
import EditReviewStatusDialog from "./EditReviewStatusDialog";
import DeleteReviewDialog from "./DeleteReviewDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const REVIEW_FILTER_DEFINITIONS = [
  serverManagedFilter.single("status"),
  serverManagedFilter.single("hasSpoiler"),
];

const ReviewsTable = ({
  initialQueryString,
}: {
  initialQueryString?: string;
}) => {
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

  const queryString = queryStringFromUrl || initialQueryString || "";

  const { searchFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: REVIEW_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["reviews", queryString],
    queryFn: () =>
      adminGetAllReviews(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const reviews = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta;

  console.log(reviews);

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

  // Modal states
  const [viewReview, setViewReview] = useState<Review | null>(null);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  const filterValuesForTable = useMemo<TanTableFilterValues>(() => {
    return {
      status: filterValues.status,
      hasSpoiler: filterValues.hasSpoiler,
    };
  }, [filterValues]);
  const columns = useMemo(
    () => reviewColumns(setViewReview, setDeletingReview, setEditReview),
    [setViewReview, setDeletingReview, setEditReview],
  );
  return (
    <>
      <TanTable
        data={reviews}
        columns={columns}
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
          initialValue: searchFromUrl,
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
          onView: (review) => setViewReview(review),
          onEdit: (review) => setEditReview(review),
          onDelete: (review) => setDeletingReview(review),
        }}
      />

      <ViewReviewDialog
        open={!!viewReview}
        onOpenChange={(open) => !open && setViewReview(null)}
        review={viewReview}
      />
      <EditReviewStatusDialog
        open={!!editReview}
        onOpenChange={(open) => !open && setEditReview(null)}
        review={editReview}
      />
      <DeleteReviewDialog
        open={!!deletingReview}
        onOpenChange={(open) => !open && setDeletingReview(null)}
        review={deletingReview!}
      />
    </>
  );
};

export default ReviewsTable;
