"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPlatforms, adminDeletePlatform } from "@/services/admin.service";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { Platform } from "@/types/media.types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { UpdatePlatformModal } from "./UpdatePlatformModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import PlatformDeleteModal from "./PlatformDeleteModal";
import PlatformJsonAddDialog from "./PlatformJsonAddDialog";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import {
  TanTableFilterConfig,
  TanTableFilterValues,
} from "@/components/Shared/table/TanTableFilters";
import TanTable from "@/components/Shared/table/tanTable";
import { getPlatformColumns } from "./PlatformColumns";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PLATFORM_FILTER_DEFINITIONS = [
  serverManagedFilter.single("type"),
  serverManagedFilter.single("isPublished"),
  serverManagedFilter.single("isFeatured"),
];
export const PlatformsClient = ({
  initialQueryString,
}: {
  initialQueryString?: string;
}) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

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
      definitions: PLATFORM_FILTER_DEFINITIONS,
      updateParams,
    });

  // Modal states
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deletingPlatform, setDeletingPlatform] = useState<Platform | null>(
    null,
  );

  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ["admin-platforms", queryString],
    queryFn: () =>
      getAllPlatforms(Object.fromEntries(new URLSearchParams(queryString))),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeletePlatform(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platforms"] });
      toast.success("Platform removed successfully");
      setDeletingPlatform(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove platform",
      );
    },
  });

  const platforms = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const filterConfigs = useMemo<TanTableFilterConfig[]>(() => {
    return [
      {
        id: "type",
        label: "Platform Type",
        type: "single-select",
        options: [
          { label: "Free", value: "FREE" },
          { label: "Premium", value: "PREMIUM" },
          { label: "Subscription", value: "SUBSCRIPTION" },
          { label: "Rental", value: "RENTAL" },
          { label: "Buy", value: "BUY" },
          { label: "Free with Ads", value: "FREE_WITH_ADS" },
          { label: "Limited Free", value: "LIMITED_FREE" },
          { label: "One Time", value: "ONE_TIME" },
        ],
      },
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
        label: "Featured",
        type: "single-select",
        options: [
          { label: "Featured Only", value: "true" },
          { label: "Standard", value: "false" },
        ],
      },
    ];
  }, []);

  const filterValuesForTable = useMemo<TanTableFilterValues>(() => {
    return {
      type: filterValues.type,
      isPublished: filterValues.isPublished,
      isFeatured: filterValues.isFeatured,
    };
  }, [filterValues]);

  const columns = useMemo(
    () => getPlatformColumns(setEditingPlatform, setDeletingPlatform),
    [setEditingPlatform, setDeletingPlatform],
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 p-5">
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-2xl tracking-tight">Streaming Portals</h1>
          <p className="text-muted-foreground text-sm max-w-xl font-medium">
            Integrate external streaming platforms. Link existing media to their
            homes across the web with direct portal integration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size={"lg"}>
            <Link href="/admin/platforms/create">
              <Plus className="h-5 w-5" />
              Register Portal
            </Link>
          </Button>
          <PlatformJsonAddDialog />
        </div>
      </div>

      <div>
        <TanTable
          columns={columns}
          data={platforms}
          meta={meta}
          isLoading={isLoading || isRouteRefreshPending}
          emptyMessage="No platforms found."
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
            placeholder: "Search platform by name or slug...", // Updated
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          actions={{
            onEdit: (platform) => setEditingPlatform(platform),
            onDelete: (platform) => setDeletingPlatform(platform),
          }}
        />
      </div>

      {/* Update Modal */}
      <UpdatePlatformModal
        isOpen={!!editingPlatform}
        onClose={() => setEditingPlatform(null)}
        platform={editingPlatform}
      />

      {/* Delete confirmation dialog */}
      <PlatformDeleteModal
        deletingPlatform={deletingPlatform}
        setDeletingPlatform={setDeletingPlatform}
        deleteMutation={deleteMutation}
      />
    </div>
  );
};
