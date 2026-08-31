import React, { useState, useMemo, useCallback } from "react";
import { AnyTableProps, TableState } from "../types/table.types";
import { TableAction } from "../types/action.types";
import { resolveColumns } from "../columns/columnResolver";
import { useAnyTableSearch } from "../hooks/useAnyTableSearch";
import { useAnyTableSorting } from "../hooks/useAnyTableSorting";
import { useAnyTablePagination } from "../hooks/useAnyTablePagination";
import { useAnyTableData } from "../hooks/useAnyTableData";
import { useAnyTableController } from "../hooks/useAnyTableController";
import { AnyTableThemeProvider, useAnyTableTheme } from "../theme/themeContext";
import { TableSearch } from "./TableSearch";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableSkeleton } from "./TableSkeleton";
import { TableEmptyState } from "./TableEmptyState";
import { TableErrorState } from "./TableErrorState";
import { getNestedValue } from "../adapters/objectUtils";

export function AnyTableInner<TData = any>(props: AnyTableProps<TData>) {
  const {
    data: directData,
    api,
    columns: rawColumns,
    autoColumns = true,
    rowKey,
    title,
    subtitle,
    actions: explicitActions,
    actionsTitle = "Actions",
    actionsWidth,
    search = true,
    sorting = true,
    pagination = true,
    selectable = false,
    onSelectionChange,
    onRowClick,
    loading: manualLoading,
    loadingComponent,
    emptyComponent,
    emptyTitle,
    emptyDescription,
    errorComponent,
    className = "",
    tableClassName = "",
    headerActions,
    showHeader = true,
    bordered = true,
    striped = false,
    hoverable = true,
    stickyHeader = false,
    tableRef,

    // Legacy Wasel Props
    thead,
    headerData,
    tbodys,
    titleHeader,
    add,
    linkAdd,
    addHandler,
    view,
    linkView,
    viewHandler,
    edit,
    linkEdit,
    editHandler,
    del,
    handleDelete,
    block,
    handleBlock,
    buttons,
  } = props;

  const theme = useAnyTableTheme();

  // 1. Data Source Resolution (support tbodys legacy prop)
  const resolvedData = useMemo(() => {
    return directData || tbodys || undefined;
  }, [directData, tbodys]);

  // 2. Resolve Columns
  const resolvedColumns = useMemo(() => {
    const cols = resolveColumns({
      data: resolvedData,
      columns: rawColumns,
      autoColumns,
      thead,
      headerData,
    });
    // Filter hidden columns
    return cols.filter((col) => {
      if (typeof col.hidden === "function") {
        return !col.hidden({ data: resolvedData || [] });
      }
      return !col.hidden;
    });
  }, [resolvedData, rawColumns, autoColumns, thead, headerData]);

  // 3. Resolve Row Key
  const rowKeyResolver = useCallback(
    (row: TData, index: number): string | number => {
      if (typeof rowKey === "function") {
        return rowKey(row, index);
      }
      if (typeof rowKey === "string") {
        const val = getNestedValue(row, rowKey);
        if (val !== undefined && val !== null) return val;
      }
      // Automatic fallback lookup
      const defaultId = (row as any)?._id ?? (row as any)?.id ?? (row as any)?.key;
      return defaultId !== undefined && defaultId !== null ? defaultId : index;
    },
    [rowKey]
  );

  // 4. Setup Hooks
  const {
    enabled: isSearchEnabled,
    search: searchQuery,
    debouncedSearch,
    isDebouncing,
    setSearch,
    clearSearch,
    searchConfig,
  } = useAnyTableSearch({ config: search });

  const {
    enabled: isSortingEnabled,
    sortBy,
    sortOrder,
    toggleSort,
    setSorting,
    resetSorting,
  } = useAnyTableSorting({ config: sorting });

  // 5. Build Actions (Combining explicit actions and legacy Wasel actions)
  const resolvedActions = useMemo<TableAction<TData>[]>(() => {
    const list: TableAction<TData>[] = [...(explicitActions || [])];

    // Convert legacy buttons
    if (buttons && Array.isArray(buttons)) {
      buttons.forEach((btn, idx) => {
        list.push({
          id: `legacy-btn-${idx}`,
          label: btn.label,
          icon: btn.icon,
          className: btn.className,
          show: btn.show,
          hide: btn.hide,
          onClick: (row) => btn.onClick(row),
        });
      });
    }

    // Convert legacy Block action
    if (block && handleBlock) {
      list.push({
        id: "legacy-block",
        label: (row: any) => (row.isBanned || !row.isActive ? "Unblock" : "Block"),
        variant: (row: any) => (row.isBanned || !row.isActive ? "success" : "danger"),
        onClick: (row: any) => handleBlock(row?._id || row?.id),
      });
    }

    // Convert legacy View action
    if (view && (viewHandler || linkView)) {
      list.push({
        id: "legacy-view",
        label: "View",
        variant: "primary",
        onClick: (row: any) => {
          const id = row?._id || row?.id;
          if (viewHandler) viewHandler(id);
          else if (linkView && typeof window !== "undefined") {
            window.location.href = `${linkView}/${id}`;
          }
        },
      });
    }

    // Convert legacy Edit action
    if (edit && (editHandler || linkEdit)) {
      list.push({
        id: "legacy-edit",
        label: "Edit",
        variant: "info",
        onClick: (row: any) => {
          const id = row?._id || row?.id;
          if (editHandler) editHandler(id);
          else if (linkEdit && typeof window !== "undefined") {
            window.location.href = `${linkEdit}/${id}`;
          }
        },
      });
    }

    // Convert legacy Delete action
    if (del && handleDelete) {
      list.push({
        id: "legacy-del",
        label: "Delete",
        variant: "danger",
        confirmation: {
          title: "Delete Item",
          message: "Are you sure you want to delete this record?",
        },
        onClick: (row: any) => handleDelete(row?._id || row?.id),
      });
    }

    return list;
  }, [
    explicitActions,
    buttons,
    block,
    handleBlock,
    view,
    linkView,
    viewHandler,
    edit,
    linkEdit,
    editHandler,
    del,
    handleDelete,
  ]);

  // Initial Pagination Hooks
  const [activePage, setActivePage] = useState(1);
  const [activePageSize, setActivePageSize] = useState(10);

  // 6. Data Orchestration Hook
  const {
    rows,
    totalRecords,
    loading,
    error,
    refresh,
    isServerMode,
  } = useAnyTableData<TData>({
    data: resolvedData,
    api,
    columns: resolvedColumns,
    searchQuery: debouncedSearch,
    sortBy,
    sortOrder,
    page: activePage,
    pageSize: activePageSize,
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
    paginationConfig,
  } = useAnyTablePagination({
    config: pagination,
    totalRecords,
    onPageChange: (newPage, newPageSize) => {
      setActivePage(newPage);
      setActivePageSize(newPageSize);
    },
  });

  // 7. Selection Management
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());

  const handleToggleSelectRow = useCallback(
    (key: string | number, row: TData) => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);

        if (onSelectionChange) {
          const selectedRows = rows.filter((r, idx) => next.has(rowKeyResolver(r, idx)));
          onSelectionChange(selectedRows, Array.from(next));
        }
        return next;
      });
    },
    [rows, rowKeyResolver, onSelectionChange]
  );

  const handleToggleSelectAll = useCallback(() => {
    if (selectedKeys.size === rows.length && rows.length > 0) {
      setSelectedKeys(new Set());
      onSelectionChange?.([], []);
    } else {
      const allKeys = new Set(rows.map((r, idx) => rowKeyResolver(r, idx)));
      setSelectedKeys(allKeys);
      onSelectionChange?.(rows, Array.from(allKeys));
    }
  }, [rows, selectedKeys.size, rowKeyResolver, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
    onSelectionChange?.([], []);
  }, [onSelectionChange]);

  const allSelected = rows.length > 0 && selectedKeys.size === rows.length;
  const isIndeterminate = selectedKeys.size > 0 && selectedKeys.size < rows.length;

  const actionContext = useMemo(
    () => ({
      refresh,
      loading,
      page,
      selectedRows: rows.filter((r, idx) => selectedKeys.has(rowKeyResolver(r, idx))),
      setPage,
    }),
    [refresh, loading, page, rows, selectedKeys, rowKeyResolver, setPage]
  );

  // 8. Controller Ref Exposure
  useAnyTableController({
    tableRef,
    refresh,
    resetPagination,
    resetSearch: clearSearch,
    resetSorting,
    setPage,
    setPageSize,
    setSearch,
    setSorting,
    selectedRows: actionContext.selectedRows,
    clearSelection,
    getState: (): TableState<TData> => ({
      data: rows,
      loading,
      error,
      page,
      pageSize,
      total: totalRecords,
      totalPages,
      search: searchQuery,
      sortBy,
      sortOrder,
      selectedRowKeys: Array.from(selectedKeys),
      selectedRows: actionContext.selectedRows,
      isServerMode,
    }),
  });

  const displayTitle = title || titleHeader;
  const hasActions = resolvedActions.length > 0;
  const showTopToolbar = Boolean(displayTitle || subtitle || isSearchEnabled || headerActions || add);

  return (
    <div className={`any-table-wrapper ${theme.classes?.container || "w-full flex flex-col gap-4 font-sans"} ${className}`}>
      {/* Top Section Toolbar */}
      {showTopToolbar && (
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1">
          {/* Title & Subtitle */}
          {(displayTitle || subtitle) && (
            <div className="flex flex-col">
              {displayTitle && (
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
                  {displayTitle}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5 pl-4">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Right Toolbar: Search + Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end ml-auto">
            {isSearchEnabled && (
              <TableSearch
                value={searchQuery}
                onChange={setSearch}
                onClear={clearSearch}
                isDebouncing={isDebouncing}
                placeholder={searchConfig.placeholder}
              />
            )}

            {headerActions}

            {/* Legacy Add Button */}
            {add && (
              <button
                type="button"
                onClick={() => {
                  if (addHandler) addHandler();
                  else if (linkAdd && typeof window !== "undefined") {
                    window.location.href = linkAdd;
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-soft transition-all shadow-sm shadow-primary/20 active:scale-95 whitespace-nowrap"
              >
                <span>＋</span>
                <span>Add {displayTitle || "Record"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div
        className={`${
          theme.classes?.tableWrapper || "w-full overflow-x-auto rounded-2xl border bg-white dark:bg-slate-900"
        } ${bordered ? "border border-gray-200 dark:border-gray-800" : ""}`}
      >
        {/* Error State */}
        {error ? (
          typeof errorComponent === "function" ? (
            errorComponent(error, refresh)
          ) : errorComponent ? (
            errorComponent
          ) : (
            <TableErrorState error={error} onRetry={refresh} />
          )
        ) : (
          <table
            className={`${theme.classes?.table || "w-full border-collapse text-left text-sm"} ${
              stickyHeader ? "relative" : ""
            } ${tableClassName}`}
          >
            {showHeader && (
              <TableHeader
                columns={resolvedColumns}
                hasActions={hasActions}
                actionsTitle={actionsTitle}
                actionsWidth={actionsWidth}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={isSortingEnabled ? toggleSort : undefined}
                selectable={selectable}
                allSelected={allSelected}
                isIndeterminate={isIndeterminate}
                onToggleSelectAll={handleToggleSelectAll}
              />
            )}

            {/* Loading State Skeleton */}
            {loading && rows.length === 0 ? (
              loadingComponent ? (
                <tbody>
                  <tr>
                    <td colSpan={resolvedColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}>
                      {loadingComponent}
                    </td>
                  </tr>
                </tbody>
              ) : (
                <TableSkeleton
                  columnsCount={resolvedColumns.length + (selectable ? 1 : 0)}
                  rowsCount={pageSize || 5}
                  hasActions={hasActions}
                />
              )
            ) : rows.length === 0 ? (
              /* Empty State */
              <tbody>
                <tr>
                  <td
                    colSpan={resolvedColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                    className="p-0"
                  >
                    {emptyComponent ? (
                      emptyComponent
                    ) : (
                      <TableEmptyState
                        title={emptyTitle}
                        description={emptyDescription}
                        isSearchActive={Boolean(debouncedSearch)}
                        onClearSearch={clearSearch}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            ) : (
              /* Body Rows */
              <TableBody
                rows={rows}
                columns={resolvedColumns}
                actions={resolvedActions}
                actionContext={actionContext}
                rowKeyResolver={rowKeyResolver}
                selectable={selectable}
                selectedKeys={selectedKeys}
                onToggleSelectRow={handleToggleSelectRow}
                onRowClick={onRowClick}
                striped={striped}
                hoverable={hoverable}
              />
            )}
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      {isPaginationEnabled && !error && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          totalPages={totalPages}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          showPageSizeSelector={paginationConfig.showPageSizeSelector}
          showTotalCount={paginationConfig.showTotalCount}
          pageWindow={getPageWindow(5)}
        />
      )}
    </div>
  );
}

/**
 * AnyTable — The developer-facing, smart data table library for React.
 */
export function AnyTable<TData = any>(props: AnyTableProps<TData>) {
  return (
    <AnyTableThemeProvider theme={props.theme}>
      <AnyTableInner {...props} />
    </AnyTableThemeProvider>
  );
}

export default AnyTable;
