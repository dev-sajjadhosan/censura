"use client";

import { useMemo } from "react";
import { Genre } from "@/types/media.types";
import { getGenreColumns } from "./GenreColumns";
import { PaginationMeta } from "@/types/api.types";
import TanTable from "@/components/Shared/table/tanTable";

interface GenresTableProps {
  data: Genre[];
  meta: PaginationMeta;
  isLoading: boolean;
  onEdit: (genre: Genre) => void;
  onDelete: (genre: Genre) => void;
}

export const GenresTable = ({
  data,
  meta,
  isLoading,
  onEdit,
  onDelete,
}: GenresTableProps) => {
  const columns = useMemo(() => getGenreColumns(onEdit, onDelete), [onEdit, onDelete]);

  return (
    <TanTable
      columns={columns}
      data={data}
      meta={meta}
      isLoading={isLoading}
    />
  );
};
