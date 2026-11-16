import { useState, useMemo, useCallback } from "react";
import {
  RowKeyResolver,
  SearchConfig,
  SortingConfig,
  PaginationConfig,
  ExportConfig,
  ExportScope,
  ExportContext,
} from "../types/table.types";
import { ColumnDef } from "../types/column.types";
import { ApiConfig, ApiFetcherParams } from "../types/api.types";
import { normalizeApiResponse } from "../adapters/apiAdapter";
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
  exportable?: boolean | ExportConfig<TData>;
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
    allFilteredRows,
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
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const exportData = useCallback(
    async (
      format: "csv" | "json" = "csv",
      filename?: string,
      scopeOverride?: ExportScope
    ): Promise<void> => {
      const exportConfig = typeof exportable === "object" ? exportable : {};
      const defaultFilename =
        exportConfig.filename || filename || "table-export";

      // Determine effective scope
      let effectiveScope: ExportScope = scopeOverride || exportConfig.scope || "auto";
      if (effectiveScope === "auto") {
        if (!isServerMode) {
          effectiveScope = "all";
        } else {
          effectiveScope =
            exportConfig.fetchAllRows || exportConfig.onExport
              ? "all"
              : "current-page";
        }
      }

      // Check for custom onExport handler first
      if (typeof exportConfig.onExport === "function") {
        setIsExporting(true);
        try {
          const exportContext: ExportContext<TData> = {
            format,
            scope: effectiveScope,
            search: searchQuery,
            sortBy,
            sortOrder,
            params: api?.params,
            currentPageRows: rows,
            selectedRows,
            selectedKeys: Array.from(selectedKeys),
            totalRecords,
            columns: resolvedColumns,
            defaultExport: (customRows, customName) => {
              const fname = customName || defaultFilename;
              if (format === "json") {
                exportToJson(customRows, fname);
              } else {
                exportToCsv(customRows, resolvedColumns, fname);
              }
            },
          };
          await exportConfig.onExport(format, exportContext);
        } finally {
          setIsExporting(false);
        }
        return;
      }

      // Handle based on scope
      if (effectiveScope === "selected" && selectedRows.length > 0) {
        if (format === "json") {
          exportToJson(selectedRows, defaultFilename);
        } else {
          exportToCsv(selectedRows, resolvedColumns, defaultFilename);
        }
        return;
      }

      if (effectiveScope === "current-page") {
        if (format === "json") {
          exportToJson(rows, defaultFilename);
        } else {
          exportToCsv(rows, resolvedColumns, defaultFilename);
        }
        return;
      }

      // effectiveScope is "all"
      if (!isServerMode) {
        const targetRows =
          allFilteredRows && allFilteredRows.length > 0 ? allFilteredRows : rows;
        if (format === "json") {
          exportToJson(targetRows, defaultFilename);
        } else {
          exportToCsv(targetRows, resolvedColumns, defaultFilename);
        }
        return;
      }

      // Server mode:
      if (exportConfig.fetchAllRows) {
        setIsExporting(true);
        try {
          let rowsToExport: TData[] = [];
          if (typeof exportConfig.fetchAllRows === "function") {
            const paramNames = api?.paramNames || {};
            const pageKey = paramNames.pageParam || "page";
            const pageSizeKey = paramNames.pageSizeParam || "limit";
            const searchKey = paramNames.searchParam || "q";
            const sortByKey = paramNames.sortByParam || "sortBy";
            const sortOrderKey = paramNames.sortOrderParam || "sortOrder";

            const fetchParams: ApiFetcherParams = {
              [pageKey]: 1,
              [pageSizeKey]: totalRecords || 999999,
              page: 1,
              pageSize: totalRecords || 999999,
              ...(searchQuery ? { [searchKey]: searchQuery, search: searchQuery, q: searchQuery } : {}),
              ...(sortBy ? { [sortByKey]: sortBy, sortBy } : {}),
              ...(sortOrder ? { [sortOrderKey]: sortOrder, sortOrder } : {}),
              ...(api?.params || {}),
              all: true,
            };
            rowsToExport = await exportConfig.fetchAllRows(fetchParams);
          } else if (exportConfig.fetchAllRows === true && api?.fetcher) {
            const paramNames = api.paramNames || {};
            const pageKey = paramNames.pageParam || "page";
            const pageSizeKey = paramNames.pageSizeParam || "limit";
            const searchKey = paramNames.searchParam || "q";
            const sortByKey = paramNames.sortByParam || "sortBy";
            const sortOrderKey = paramNames.sortOrderParam || "sortOrder";

            const fetchParams: ApiFetcherParams = {
              [pageKey]: 1,
              [pageSizeKey]: totalRecords || 999999,
              page: 1,
              pageSize: totalRecords || 999999,
              ...(searchQuery ? { [searchKey]: searchQuery, search: searchQuery, q: searchQuery } : {}),
              ...(sortBy ? { [sortByKey]: sortBy, sortBy } : {}),
              ...(sortOrder ? { [sortOrderKey]: sortOrder, sortOrder } : {}),
              ...(api.params || {}),
              all: true,
            };
            const rawResult = await api.fetcher(fetchParams);
            const normalized = normalizeApiResponse<TData>(rawResult, api, fetchParams);
            rowsToExport = normalized.data;
          }

          if (format === "json") {
            exportToJson(rowsToExport, defaultFilename);
          } else {
            exportToCsv(rowsToExport, resolvedColumns, defaultFilename);
          }
        } finally {
          setIsExporting(false);
        }
        return;
      }

      // Server mode fallback if neither fetchAllRows nor onExport provided
      console.warn(
        "AnyTable: Exporting current page only. For server-side pagination, configure 'exportable.fetchAllRows' or 'exportable.onExport' to fetch all filtered records."
      );
      if (format === "json") {
        exportToJson(rows, defaultFilename);
      } else {
        exportToCsv(rows, resolvedColumns, defaultFilename);
      }
    },
    [
      exportable,
      isServerMode,
      searchQuery,
      sortBy,
      sortOrder,
      api,
      rows,
      allFilteredRows,
      selectedRows,
      selectedKeys,
      totalRecords,
      resolvedColumns,
    ]
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
    isExporting,
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
