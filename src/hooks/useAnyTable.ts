import { useState, useMemo, useCallback } from "react";
import {
  RowKeyResolver,
  SearchConfig,
  SortingConfig,
  PaginationConfig,
  ExportConfig,
} from "../types/table.types";
import { ColumnDef } from "../types/column.types";
import { ApiConfig } from "../types/api.types";
import { resolveColumns } from "../columns/columnResolver";
import { useAnyTableSearch } from "./useAnyTableSearch";
import { useAnyTableSorting } from "./useAnyTableSorting";
import { useAnyTablePagination } from "./useAnyTablePagination";
import { useAnyTableData } from "./useAnyTableData";
import { useAnyTableSelection } from "./useAnyTableSelection";
import { exportToCsv, exportToJson } from "../export/exportEngine";
import { getNestedValue } from "../adapters/objectUtils";

export interface UseAnyTableOptions<TData = any> {
  data?: TData[];
  api?: ApiConfig<TData>;
  columns?: (ColumnDef<TData> | (keyof TData & string))[];
  autoColumns?: boolean;
  rowKey?: RowKeyResolver<TData>;
  search?: boolean | SearchConfig<TData>;
  sorting?: boolean | SortingConfig<TData>;
  pagination?: boolean | PaginationConfig;
  manualLoading?: boolean;
  onSelectionChange?: (selectedRows: TData[], selectedKeys: (string | number)[]) => void;
  exportable?: boolean | ExportConfig;
}

export function useAnyTable<TData = any>(options: UseAnyTableOptions<TData> = {}) {
  const {
    data: directData,
    api,
    columns: rawColumns,
    autoColumns = true,
    rowKey,
    search = true,
    sorting = true,
    pagination = true,
    manualLoading,
    onSelectionChange,
    exportable,
  } = options;

  // 1. Resolve Columns
  const resolvedColumns = useMemo(() => {
    return resolveColumns({
      data: directData,
      columns: rawColumns,
      autoColumns,
    });
  }, [directData, rawColumns, autoColumns]);

  // 2. Resolve Row Key
  const rowKeyResolver = useCallback(
    (row: TData, index: number): string | number => {
      if (typeof rowKey === "function") {
        return rowKey(row, index);
      }
      if (typeof rowKey === "string") {
        const val = getNestedValue(row, rowKey);
        if (val !== undefined && val !== null) return val;
      }
      const defaultId = (row as any)?._id ?? (row as any)?.id ?? (row as any)?.key;
      return defaultId !== undefined && defaultId !== null ? defaultId : index;
    },
    [rowKey]
  );

  // 3. Search Hook
  const {
    enabled: isSearchEnabled,
    search: searchQuery,
    debouncedSearch,
    isDebouncing,
    setSearch,
    clearSearch,
    searchConfig,
  } = useAnyTableSearch({ config: search });

  // 4. Sorting Hook
  const {
    enabled: isSortingEnabled,
    sortBy,
    sortOrder,
    toggleSort,
    setSorting,
    resetSorting,
  } = useAnyTableSorting({ config: sorting });

  // 5. Pagination State
  const initialPageSize =
    typeof pagination === "object" && pagination !== null && pagination.defaultPageSize
      ? pagination.defaultPageSize
      : 10;
  const initialPage =
    typeof pagination === "object" && pagination !== null && pagination.defaultPage
      ? pagination.defaultPage
      : 1;

  const [activePage, setActivePage] = useState(initialPage);
  const [activePageSize, setActivePageSize] = useState(initialPageSize);

  const paginationEnabled = useMemo(() => {
    if (typeof pagination === "object" && pagination !== null) {
      return pagination.enabled !== false;
    }
    return Boolean(pagination);
  }, [pagination]);

  // 6. Data Orchestration
  const {
    rows,
    totalRecords,
    loading,
    error,
    refresh,
    isServerMode,
  } = useAnyTableData<TData>({
    data: directData,
    api,
    columns: resolvedColumns,
    searchQuery: debouncedSearch,
    sortBy,
    sortOrder,
    page: activePage,
    pageSize: activePageSize,
    paginationEnabled,
    manualLoading,
  });

  const {
    enabled: isPaginationEnabled,
    page,
    pageSize,
    totalPages,
    pageSizeOptions,
    setPage,
    setPageSize,
    resetPagination,
    getPageWindow,
  } = useAnyTablePagination({
    config: pagination,
    totalRecords,
    onPageChange: (newPage, newPageSize) => {
      setActivePage(newPage);
      setActivePageSize(newPageSize);
    },
  });

  // 7. Selection Hook
  const {
    selectedKeys,
    selectedRows,
    onToggleSelectRow,
    handleToggleSelectAll,
    clearSelection,
    allSelected,
    isIndeterminate,
  } = useAnyTableSelection<TData>({
    rows,
    rowKeyResolver,
    onSelectionChange,
  });

  // 8. Export Function
  const exportData = useCallback(
    (format: "csv" | "json" = "csv", filename?: string) => {
      const defaultFilename =
        (typeof exportable === "object" && exportable?.filename) ||
        filename ||
        "table-export";

      if (format === "json") {
        exportToJson(rows, defaultFilename);
      } else {
        exportToCsv(rows, resolvedColumns, defaultFilename);
      }
    },
    [rows, resolvedColumns, exportable]
  );

  const resetAll = useCallback(() => {
    resetPagination();
    clearSearch();
    resetSorting();
    clearSelection();
  }, [resetPagination, clearSearch, resetSorting, clearSelection]);

  return {
    rows,
    columns: resolvedColumns,
    totalRecords,
    loading,
    error,
    isServerMode,
    refresh,
    reset: resetAll,
    search: {
      enabled: isSearchEnabled,
      query: searchQuery,
      isDebouncing,
      setSearch,
      clearSearch,
      placeholder: searchConfig.placeholder,
    },
    sorting: {
      enabled: isSortingEnabled,
      sortBy,
      sortOrder,
      toggleSort,
      setSorting,
      resetSorting,
    },
    pagination: {
      enabled: isPaginationEnabled,
      page,
      pageSize,
      totalPages,
      pageSizeOptions,
      setPage,
      setPageSize,
      resetPagination,
      getPageWindow,
    },
    selection: {
      selectedKeys,
      selectedRows,
      toggleSelectRow: onToggleSelectRow,
      toggleSelectAll: handleToggleSelectAll,
      clearSelection,
      allSelected,
      isIndeterminate,
    },
    exportData,
  };
}
