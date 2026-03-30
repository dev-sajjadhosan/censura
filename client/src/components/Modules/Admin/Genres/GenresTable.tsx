"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllGenres, adminDeleteGenre } from "@/services/admin.service";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { Genre } from "@/types/media.types";
import { Button } from "@/components/ui/button";
import { Plus, Tag, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { UpdateGenreModal } from "./UpdateGenreModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GenreDeleteModal from "./GenreDeleteModal";
import GenreJsonAddDialog from "./GenreJsonAddDialog";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import TanTable from "@/components/Shared/table/tanTable";
import { getGenreColumns } from "./GenreColumns";
import {
  TanTableFilterConfig,
  TanTableFilterValues,
} from "@/components/Shared/table/TanTableFilters";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const GENRE_FILTER_DEFINITIONS = [
  serverManagedFilter.single("isPublished"),
  serverManagedFilter.single("isFeatured"),
];
export const GenresClient = ({
  initialQueryString,
}: {
  initialQueryString?: string;
}) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const tableState = useServerManagedDataTable({ searchParams });
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);

  const {
    deletingItem: statusUpdateItem,
    isDeleteDialogOpen: isStatusUpdateOpen,
    onDeleteOpenChange: onStatusUpdateOpenChange,
    tableActions,
  } = useRowActionModalState<any>();

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
      definitions: GENRE_FILTER_DEFINITIONS,
      updateParams,
    });

  // Modal states
  const [editingPlatform, setEditingPlatform] = useState<Genre | null>(null);
  const [deletingPlatform, setDeletingPlatform] = useState<Genre | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-genres", queryString],
    queryFn: () => getAllGenres(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-genres"] });
      toast.success("Genre deleted successfully");
      setDeletingGenre(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete genre");
    },
  });

  const genres = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const filterConfigs = useMemo<TanTableFilterConfig[]>(() => {
    return [
      {
        id: "isPublished",
        label: "Publish Status",
        type: "single-select",
        options: [
          { label: "Published", value: "true" },
          { label: "Draft", value: "false" },
        ],
      },
      {
        id: "isFeatured",
        label: "Featured Status",
        type: "single-select",
        options: [
          { label: "Featured", value: "true" },
          { label: "Standard", value: "false" },
        ],
      },
    ];
  }, []);

  const filterValuesForTable = useMemo<TanTableFilterValues>(() => {
    return {
      isPublished: filterValues.isPublished,
      isFeatured: filterValues.isFeatured,
    };
  }, [filterValues]);

  const columns = useMemo(
    () => getGenreColumns(setEditingPlatform, setDeletingPlatform),
    [setEditingPlatform, setDeletingPlatform],
  );
  return (
    <div className="space-y-6 p-3">
      <div className="flex items-center justify-between">
        <div className="relative z-10 flex flex-col gap-1">
          <h1 className="text-2xl tracking-tight">Genre Management</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Organize discovery by managing genres. These values appear in
            filters and media details across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GenreJsonAddDialog />
          <Button asChild size={"lg"}>
            <Link href="/admin/genres/create">
              <Plus className="h-4.5 w-4.5" />
              Create Genre
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <TanTable
          columns={columns}
          data={genres}
          meta={meta}
          isLoading={isLoading || isRouteRefreshPending}
          emptyMessage="No genres found."
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
            placeholder: "Search genre by name...", // Updated
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          actions={{
            onEdit: (genre) => setEditingPlatform(genre),
            onDelete: (genre) => setDeletingPlatform(genre),
          }}
        />
      </div>

      {/* Update Modal */}
      <UpdateGenreModal
        isOpen={!!editingPlatform}
        onClose={() => setEditingPlatform(null)}
        genre={editingPlatform!}
      />

      <GenreDeleteModal
        deletingGenre={deletingPlatform}
        deleteMutation={deleteMutation}
        setDeletingGenre={setDeletingPlatform}
      />
    </div>
  );
};
