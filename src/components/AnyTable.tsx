import React, { useState, useMemo, useCallback } from "react";
import { AnyTableProps, TableState } from "../types/table.types";
import { resolveColumns } from "../columns/columnResolver";
import { resolveTableActions } from "../adapters/legacyActionsAdapter";
import { useAnyTableSearch } from "../hooks/useAnyTableSearch";
import { useAnyTableSorting } from "../hooks/useAnyTableSorting";
import { useAnyTablePagination } from "../hooks/useAnyTablePagination";
import { useAnyTableData } from "../hooks/useAnyTableData";
import { useAnyTableController } from "../hooks/useAnyTableController";
import { useAnyTableSelection } from "../hooks/useAnyTableSelection";
import { AnyTableThemeProvider, useAnyTableTheme } from "../theme/themeContext";
import { TableToolbar } from "./TableToolbar";
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
    headerClassName = "",
    rowClassName,
    headerActions,
    showHeader = true,
    bordered = true,
    striped = false,
    hoverable = true,
    compact = false,
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
  const resolvedActions = useMemo(
    () =>
      resolveTableActions<TData>({
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
      }),
    [
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
    ]
  );

  // Initial Pagination State
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

  const actionContext = useMemo(
    () => ({
      refresh,
      loading,
      page,
      selectedRows,
      setPage,
    }),
    [refresh, loading, page, selectedRows, setPage]
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
    selectedRows,
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
      selectedRows,
      isServerMode,
    }),
  });

  const displayTitle = title || titleHeader;
  const hasActions = resolvedActions.length > 0;

  const themeStyle = useMemo<React.CSSProperties>(() => {
    const s: Record<string, any> = {};
    if (theme.borderRadius) s["--any-table-radius"] = theme.borderRadius;
    if (theme.fontFamily) {
      s["--any-table-font"] = theme.fontFamily;
      s.fontFamily = theme.fontFamily;
    }
    if (theme.colors?.primary) s["--any-table-primary"] = theme.colors.primary;
    if (theme.colors?.primaryHover) s["--any-table-primary-hover"] = theme.colors.primaryHover;
    if (theme.colors?.border) s["--any-table-border"] = theme.colors.border;
    return s;
  }, [theme]);

  return (
    <div
      style={themeStyle}
      className={`any-table-wrapper ${theme.classes?.container || "w-full flex flex-col gap-4 font-sans text-gray-900 dark:text-gray-100"} ${className}`}
    >
      {/* Top Section Toolbar */}
      <TableToolbar
        displayTitle={displayTitle}
        subtitle={subtitle}
        isSearchEnabled={isSearchEnabled}
        searchQuery={searchQuery}
        setSearch={setSearch}
        clearSearch={clearSearch}
        isDebouncing={isDebouncing}
        searchPlaceholder={searchConfig.placeholder}
        headerActions={headerActions}
        add={add}
        linkAdd={linkAdd}
        addHandler={addHandler}
      />

      {/* Table Container Box */}
      <div
        style={theme.borderRadius ? { borderRadius: theme.borderRadius } : undefined}
        className={`${
          theme.classes?.tableWrapper ||
          "w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm transition-colors"
        } ${!bordered ? "border-0 shadow-none" : ""}`}
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
              compact || theme.density === "compact" ? "text-xs" : ""
            } ${
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
                headerClassName={headerClassName}
              />
            )}

            {/* Loading Skeleton */}
            {loading && rows.length === 0 ? (
              loadingComponent ? (
                loadingComponent
              ) : (
                <TableSkeleton
                  columnsCount={resolvedColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                  rowsCount={pageSize || 5}
                />
              )
            ) : rows.length === 0 ? (
              // Empty State
              emptyComponent ? (
                emptyComponent
              ) : (
                <TableEmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  colSpan={resolvedColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                />
              )
            ) : (
              // Table Body
              <TableBody
                rows={rows}
                columns={resolvedColumns}
                actions={resolvedActions}
                actionContext={actionContext}
                rowKeyResolver={rowKeyResolver}
                selectable={selectable}
                selectedKeys={selectedKeys}
                onToggleSelectRow={onToggleSelectRow}
                onRowClick={onRowClick}
                striped={striped}
                hoverable={hoverable}
                rowClassName={rowClassName}
              />
            )}
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {isPaginationEnabled && (
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
  if (!props.theme && !props.preset) {
    return <AnyTableInner {...props} />;
  }
  return (
    <AnyTableThemeProvider theme={props.theme} preset={props.preset}>
      <AnyTableInner {...props} />
    </AnyTableThemeProvider>
  );
}

export default AnyTable;
