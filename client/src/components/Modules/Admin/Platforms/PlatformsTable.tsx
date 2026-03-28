"use client";

import { useMemo } from "react";
import TanTable from "@/components/Shared/table/tanTable";
import { Platform } from "@/types/media.types";
import { getPlatformColumns } from "./PlatformColumns";
import { PaginationMeta } from "@/types/api.types";

interface PlatformsTableProps {
  data: Platform[];
  meta: PaginationMeta;
  isLoading: boolean;
  onEdit: (p: Platform) => void;
  onDelete: (p: Platform) => void;
}

export const PlatformsTable = ({
  data,
  meta,
  isLoading,
  onEdit,
  onDelete,
}: PlatformsTableProps) => {
  const columns = useMemo(
    () => getPlatformColumns(onEdit, onDelete),
    [onEdit, onDelete],
  );

  return (
    <TanTable
      columns={columns}
      data={data}
      meta={meta}
      isLoading={isLoading}

    />
  );
};
