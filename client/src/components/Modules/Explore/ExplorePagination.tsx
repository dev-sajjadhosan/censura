"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaginationToken = number | "start-ellipsis" | "end-ellipsis";

const DEFAULT_PAGE_SIZES = [8, 10, 20, 50, 100] as const;

const isDefaultPageSize = (value: number) =>
  DEFAULT_PAGE_SIZES.includes(value as (typeof DEFAULT_PAGE_SIZES)[number]);

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationToken[] => {
  if (totalPages <= 0) return [];
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 5) return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  if (currentPage >= totalPages - 4)
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  return [
    1,
    "start-ellipsis",
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    "end-ellipsis",
    totalPages,
  ];
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  className?: string;
  isSummary?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize = 8,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  className,
  isSummary = false,
}: PaginationProps) {
  const [isCustomMode, setIsCustomMode] = useState(
    !isDefaultPageSize(pageSize),
  );
  const [customPageSize, setCustomPageSize] = useState(String(pageSize));

  const showCustomInput = isCustomMode || !isDefaultPageSize(pageSize);
  const pageSizeSelectValue = showCustomInput ? "custom" : String(pageSize);

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const jumpBackwardTarget = Math.max(1, currentPage - 5);
  const jumpForwardTarget = Math.min(totalPages, currentPage + 5);

  const applyCustomPageSize = () => {
    const parsed = Number(customPageSize);
    if (!Number.isInteger(parsed) || parsed <= 0) return;
    setIsCustomMode(!isDefaultPageSize(parsed));
    onPageSizeChange?.(parsed);
    onPageChange(1); // reset to first page on size change
  };

  const onPageSizeSelect = (value: string) => {
    if (value === "custom") {
      setIsCustomMode(true);
      setCustomPageSize(String(pageSize));
      return;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) return;
    setIsCustomMode(false);
    setCustomPageSize(String(parsed));
    onPageSizeChange?.(parsed);
    onPageChange(1);
  };

  if (totalPages <= 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-4 mt-8",
        "md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      {/* ── Page buttons ── */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev || isLoading}
          className="rounded-md"
        >
          <ChevronLeft className="size-4" />
          {/* Prev */}
        </Button>

        {paginationItems.map((item, idx) => {
          if (item === "start-ellipsis") {
            return (
              <Button
                key="start-ellipsis"
                variant="secondary"
                size="sm"
                className="min-w-9 px-2"
                onClick={() => onPageChange(jumpBackwardTarget)}
                disabled={isLoading}
              >
                ...
              </Button>
            );
          }
          if (item === "end-ellipsis") {
            return (
              <Button
                key="end-ellipsis"
                variant="secondary"
                size="sm"
                className="min-w-9 px-2"
                onClick={() => onPageChange(jumpForwardTarget)}
                disabled={isLoading}
              >
                ...
              </Button>
            );
          }
          const isActive = item === currentPage;
          return (
            <Button
              key={item}
              variant={isActive ? "default" : "secondary"}
              size="sm"
              className={cn("min-w-9", isActive && "pointer-events-none")}
              onClick={() => onPageChange(item as number)}
              disabled={isLoading}
            >
              {item}
            </Button>
          );
        })}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext || isLoading}
          className="rounded-md"
        >
          {/* Next */}
          <ChevronRight className="size-4" />
        </Button>
      </div>
      {isSummary
        ? onPageSizeChange && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Select
                value={pageSizeSelectValue}
                onValueChange={onPageSizeSelect}
              >
                <SelectTrigger className="w-24" aria-label="Rows per page">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <span>rows</span>

              {showCustomInput && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    className="h-9 w-24"
                    value={customPageSize}
                    onChange={(e) => setCustomPageSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCustomPageSize();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={applyCustomPageSize}
                    disabled={isLoading}
                  >
                    Apply
                  </Button>
                </div>
              )}

              <span className="ml-2">
                Total {totalRows ?? 0} items, {totalPages} pages
              </span>
            </div>
          )
        : ""}
    </div>
  );
}
