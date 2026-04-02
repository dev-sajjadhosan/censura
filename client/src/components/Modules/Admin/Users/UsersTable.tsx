"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TanTable from "@/components/Shared/table/tanTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import {
  useServerManagedDataTableFilters,
  serverManagedFilter,
} from "@/hooks/useServerManagedDataTableFilters";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { adminGetAllUsers } from "@/services/admin.service";
import { userColumns } from "./userColumns";
import UpdateUserStatusDialog from "./UpdateUserStatusDialog";
import {
  TanTableFilterConfig,
  TanTableFilterValues,
} from "@/components/Shared/table/TanTableFilters";
import ViewUserDialog from "./ViewUserDialog";
import { User } from "@/types/auth.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const USER_FILTER_DEFINITIONS = [
  serverManagedFilter.single("role"),
  serverManagedFilter.single("status"),
];

const UsersTable = ({
  initialQueryString,
}: {
  initialQueryString?: string;
}) => {
  const searchParams = useSearchParams();

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [statusUpdateUser, setStatusUpdateUser] = useState<User | null>(null);

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
      definitions: USER_FILTER_DEFINITIONS,
      updateParams,
    });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", queryString],
    queryFn: () =>
      adminGetAllUsers(Object.fromEntries(new URLSearchParams(queryString))),
  });

  const users = (data as any)?.data?.data || [];
  const meta = (data as any)?.data?.meta;

  console.log("users from user-table: ", users);

  useEffect(() => {
    if (meta && meta.totalPages > 0) {
      const currentPage = optimisticPaginationState.pageIndex + 1;
      if (currentPage > meta.totalPages) {
        updateParams({ page: String(meta.totalPages) });
      }
    }
  }, [meta, optimisticPaginationState.pageIndex, updateParams]);

  const filterConfigs = useMemo<TanTableFilterConfig[]>(() => {
    return [
      {
        id: "role",
        label: "Role",
        type: "single-select",
        options: [
          { label: "Admin", value: "ADMIN" },
          { label: "User", value: "USER" },
        ],
      },
      {
        id: "status",
        label: "Account Status",
        type: "single-select",
        options: [
          { label: "Active", value: "ACTIVE" },
          { label: "Blocked", value: "BLOCKED" },
          { label: "Pending", value: "PENDING" },
          { label: "Unverified", value: "UNVERIFIED" },
        ],
      },
    ];
  }, []);

  const filterValuesForTable = useMemo<TanTableFilterValues>(() => {
    return {
      role: filterValues.role,
      status: filterValues.status,
    };
  }, [filterValues]);

  return (
    <>
      <TanTable
        data={users}
        columns={userColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No users found."
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
          placeholder: "Search user by name or email...",
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
          onView: (user) => setViewUser(user),
          onEdit: (user) => setStatusUpdateUser(user), // Mapped to block/unblock action
        }}
      />

      <UpdateUserStatusDialog
        open={!!statusUpdateUser}
        onOpenChange={(open) => !open && setStatusUpdateUser(null)}
        user={statusUpdateUser}
      />
      <ViewUserDialog
        open={!!viewUser}
        onOpenChange={(open) => !open && setViewUser(null)}
        user={viewUser!!}
      />
    </>
  );
};

export default UsersTable;
