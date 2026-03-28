"use client";

import { useCallback, useMemo } from "react";
import { TanTableFilterConfig, TanTableFilterValues, TanTableFilterValue } from "@/components/Shared/table/TanTableFilters";

interface FilterDefinition {
  id: string;
  type: "single" | "multi" | "range";
}

export const serverManagedFilter = {
  single: (id: string): FilterDefinition => ({ id, type: "single" }),
  multi: (id: string): FilterDefinition => ({ id, type: "multi" }),
  range: (id: string): FilterDefinition => ({ id, type: "range" }),
};

export const useServerManagedDataTableFilters = ({
  searchParams,
  definitions,
  updateParams,
}: {
  searchParams: URLSearchParams;
  definitions: FilterDefinition[];
  updateParams: (params: Record<string, any>) => void;
}) => {
  const filterValues = useMemo<TanTableFilterValues>(() => {
    const values: TanTableFilterValues = {};

    definitions.forEach((def) => {
      if (def.type === "single") {
        values[def.id] = searchParams.get(def.id) || undefined;
      } else if (def.type === "multi") {
        const urlValues = searchParams.getAll(def.id);
        values[def.id] = urlValues.length > 0 ? urlValues : undefined;
      } else if (def.type === "range") {
        const gte = searchParams.get(`${def.id}.gte`);
        const lte = searchParams.get(`${def.id}.lte`);
        if (gte || lte) {
          values[def.id] = { gte: gte || "", lte: lte || "" };
        } else {
          values[def.id] = undefined;
        }
      }
    });

    return values;
  }, [searchParams, definitions]);

  const handleFilterChange = useCallback(
    (filterId: string, value: TanTableFilterValue | undefined) => {
      const def = definitions.find((d) => d.id === filterId);
      if (!def) return;

      const nextParams: any = {};

      if (def.type === "range") {
        const rangeVal = value as any;
        nextParams[`${def.id}.gte`] = rangeVal?.gte || undefined;
        nextParams[`${def.id}.lte`] = rangeVal?.lte || undefined;
      } else {
        nextParams[def.id] = value || undefined;
      }

      nextParams.page = "1"; // Reset to page 1 on filter change
      updateParams(nextParams);
    },
    [definitions, updateParams],
  );

  const clearAllFilters = useCallback(() => {
    const nextParams: any = {};
    definitions.forEach((def) => {
      if (def.type === "range") {
        nextParams[`${def.id}.gte`] = undefined;
        nextParams[`${def.id}.lte`] = undefined;
      } else {
        nextParams[def.id] = undefined;
      }
    });
    nextParams.page = "1";
    updateParams(nextParams);
  }, [definitions, updateParams]);

  return {
    filterValues,
    handleFilterChange,
    clearAllFilters,
  };
};
