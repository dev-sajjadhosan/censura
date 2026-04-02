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
import { adminGetAllComments } from "@/services/admin.service"; // You'll need to create this
import {
  TanTableFilterConfig,
  TanTableFilterValues,
} from "@/components/Shared/table/TanTableFilters";
import { commentColumns } from "./commentColumns";
import ViewCommentDialog from "./ViewCommentDialog";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { Comment } from "@/types/reaction.types";
import StatusCommentDialog from "./EditCommentDialog";

const COMMENT_FILTER_DEFINITIONS = [serverManagedFilter.single("status")];

const CommentTable = () => {
  const searchParams = useSearchParams();
  const [viewComment, setViewComment] = useState<Comment | null>(null);
  const [statusComment, setStatusComment] = useState<Comment | null>(null);
  const [deleteComment, setDeleteComment] = useState<Comment | null>(null);

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({ searchParams });

  const { searchFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({ searchParams, updateParams });

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: COMMENT_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-comments", queryStringFromUrl],
    queryFn: () =>
      adminGetAllComments(
        Object.fromEntries(new URLSearchParams(queryStringFromUrl || "")),
      ),
  });

  const items = (data as any)?.data?.data || [];
  const meta = (data as any)?.meta;

  console.log("Comments", items);

  const filterConfigs = useMemo<TanTableFilterConfig[]>(
    () => [
      {
        id: "status",
        label: "Moderation Status",
        type: "single-select",
        options: [
          { label: "Published", value: "PUBLISHED" },
          { label: "Unpublished", value: "UNPUBLISHED" },
        ],
      },
    ],
    [],
  );

  return (
    <>
      <TanTable
        data={items}
        columns={commentColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No comments found for moderation."
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
          placeholder: "Search by content or user...",
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: { status: filterValues.status },
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        meta={meta}
        actions={{
          onView: (item) => setViewComment(item),
          onEdit: (item) => setStatusComment(item),
          onDelete: (item) => setDeleteComment(item),
        }}
      />

      <ViewCommentDialog
        comment={viewComment}
        open={!!viewComment}
        onOpenChange={(open) => !open && setViewComment(null)}
      />

      <StatusCommentDialog
        comment={statusComment}
        open={!!statusComment}
        onOpenChange={(open) => !open && setStatusComment(null)}
      />

      <DeleteCommentDialog
        comment={deleteComment}
        open={!!deleteComment}
        onOpenChange={(open) => !open && setDeleteComment(null)}
      />
    </>
  );
};

export default CommentTable;
