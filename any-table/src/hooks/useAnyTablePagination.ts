import { useState, useCallback, useMemo } from "react";
import { PaginationConfig } from "../types/table.types";

export interface UseAnyTablePaginationParams {
  config?: boolean | PaginationConfig;
  totalRecords: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export function useAnyTablePagination({
  config,
  totalRecords,
  onPageChange,
}: UseAnyTablePaginationParams) {
  const paginationConfig = useMemo<PaginationConfig>(() => {
    if (typeof config === "object" && config !== null) {
      return config;
    }
    return { enabled: Boolean(config) };
  }, [config]);

  const enabled = paginationConfig.enabled !== false && Boolean(config);
  const defaultPage = paginationConfig.defaultPage || 1;
  const defaultPageSize = paginationConfig.defaultPageSize || 10;
  const pageSizeOptions = paginationConfig.pageSizeOptions || [5, 10, 20, 50, 100];

  const [page, setPageState] = useState(defaultPage);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(totalRecords / Math.max(1, pageSize)));

  const setPage = useCallback(
    (newPage: number) => {
      const clampedPage = Math.max(1, Math.min(newPage, totalPages));
      setPageState(clampedPage);
      onPageChange?.(clampedPage, pageSize);
    },
    [totalPages, pageSize, onPageChange]
  );

  const setPageSize = useCallback(
    (newSize: number) => {
      setPageSizeState(newSize);
      setPageState(1); // reset to page 1 on page size change
      onPageChange?.(1, newSize);
    },
    [onPageChange]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages, setPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const resetPagination = useCallback(() => {
    setPageState(1);
    setPageSizeState(defaultPageSize);
    onPageChange?.(1, defaultPageSize);
  }, [defaultPageSize, onPageChange]);

  const getPageWindow = useCallback(
    (maxVisible = 5): number[] => {
      const start = Math.max(
        1,
        Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible + 1)
      );
      const end = Math.min(totalPages, start + maxVisible - 1);

      const pages: number[] = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    [page, totalPages]
  );

  const sliceData = useCallback(
    <TData>(allData: TData[]): TData[] => {
      if (!enabled) return allData;
      const start = (page - 1) * pageSize;
      return allData.slice(start, start + pageSize);
    },
    [enabled, page, pageSize]
  );

  return {
    enabled,
    page,
    pageSize,
    totalRecords,
    totalPages,
    pageSizeOptions,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    resetPagination,
    getPageWindow,
    sliceData,
    paginationConfig,
  };
}
