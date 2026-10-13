import React, { useState, useMemo, useCallback, useRef } from "react";
import { AnyTableProps, TableState, TableInstance } from "../types/table.types";
import { resolveColumns } from "../columns/columnResolver";
import { computePinnedStyles } from "../columns/pinningUtils";
import { resolveTableActions } from "../adapters/legacyActionsAdapter";
import { useAnyTableSearch } from "../hooks/useAnyTableSearch";
import { useAnyTableSorting } from "../hooks/useAnyTableSorting";
import { useAnyTablePagination } from "../hooks/useAnyTablePagination";
import { useAnyTableData } from "../hooks/useAnyTableData";
import { useAnyTableController } from "../hooks/useAnyTableController";
import { useAnyTableSelection } from "../hooks/useAnyTableSelection";
import { useAnyTableVirtualizer } from "../hooks/useAnyTableVirtualizer";
import { AnyTableThemeProvider, useAnyTableTheme } from "../theme/themeContext";
import { TableToolbar } from "./TableToolbar";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { TableSkeleton } from "./TableSkeleton";
import { TableEmptyState } from "./TableEmptyState";
import { TableErrorState } from "./TableErrorState";
import { getNestedValue } from "../adapters/objectUtils";
import { resolveMessages } from "../i18n";
import { exportToCsv, exportToJson } from "../export/exportEngine";

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
    actionsTitle,
    actionsWidth,
    search = true,
    sorting = true,
    pagination,
    virtualized = false,
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

    // Internationalization & Features
    dir,
    locale = "en",
    messages: customMessages,
    exportable = false,
    resizableColumns = false,

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

  // 0. Resolve Localization & Direction
  const resolvedMessages = useMemo(
    () => resolveMessages(locale, customMessages),
    [locale, customMessages]
  );

  const resolvedDir = useMemo<"ltr" | "rtl">(() => {
    if (dir === "ltr" || dir === "rtl") return dir;
    if (locale?.toLowerCase().startsWith("ar")) return "rtl";
    return "ltr";
  }, [dir, locale]);

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

  // 3. Column Width Resizing State
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const handleResizeColumn = useCallback((key: string, width: number) => {
    setColumnWidths((prev) => ({ ...prev, [key]: width }));
  }, []);

  // 4. Resolve Row Key
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

  // 5. Setup Hooks
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

  // 6. Build Actions (Combining explicit actions and legacy Wasel actions)
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

  const isVirtualRequested = useMemo(() => {
    if (typeof virtualized === "object" && virtualized !== null) {
      return virtualized.enabled !== false;
    }
    return Boolean(virtualized);
  }, [virtualized]);

  const resolvedPaginationConfig = useMemo(() => {
    if (pagination !== undefined) {
      return pagination;
    }
    if (isVirtualRequested) {
      return false;
    }
    return true;
  }, [isVirtualRequested, pagination]);

  const paginationEnabled = useMemo(() => {
    if (typeof resolvedPaginationConfig === "object" && resolvedPaginationConfig !== null) {
      return resolvedPaginationConfig.enabled !== false;
    }
    return Boolean(resolvedPaginationConfig);
  }, [resolvedPaginationConfig]);

  // 7. Data Orchestration Hook
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
    paginationConfig,
  } = useAnyTablePagination({
    config: resolvedPaginationConfig,
    totalRecords,
    onPageChange: (newPage, newPageSize) => {
      setActivePage(newPage);
      setActivePageSize(newPageSize);
    },
  });

  // 8. Virtualization Hook
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    isVirtualized,
    paddingTop,
    paddingBottom,
    startIndex,
    maxHeight: virtualMaxHeight,
    scrollToIndex,
    sliceRows: virtualSliceRows,
  } = useAnyTableVirtualizer({
    config: virtualized,
    totalCount: rows.length,
    scrollContainerRef,
  });

  const displayRows = useMemo(() => {
    if (!isVirtualized) return rows;
    return virtualSliceRows(rows);
  }, [isVirtualized, rows, virtualSliceRows]);

  // 9. Selection Hook
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

  // 10. Column Pinning Offsets
  const hasActions = resolvedActions.length > 0;
  const pinnedStyles = useMemo(() => {
    return computePinnedStyles(resolvedColumns, {
      selectable,
      hasActions,
      actionsWidth,
      columnWidths,
      isRtl: resolvedDir === "rtl",
    });
  }, [
    resolvedColumns,
    selectable,
    hasActions,
    actionsWidth,
    columnWidths,
    resolvedDir,
  ]);

  // 11. Native Export Handler
  const handleExport = useCallback(
    (format: "csv" | "json" = "csv", customFilename?: string) => {
      const defaultName =
        (typeof exportable === "object" && exportable?.filename) ||
        customFilename ||
        (typeof title === "string"
          ? title.toLowerCase().replace(/\s+/g, "-")
          : "table-export");

      if (format === "json") {
        exportToJson(rows, defaultName);
      } else {
        exportToCsv(rows, resolvedColumns, defaultName);
      }
    },
    [rows, resolvedColumns, exportable, title]
  );

  // 12. Controller Ref Exposure
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
    scrollToIndex,
    exportData: handleExport,
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

  const tableContainerStyle = useMemo<React.CSSProperties>(() => {
    const s: React.CSSProperties = {};
    if (theme.borderRadius) s.borderRadius = theme.borderRadius;
    if (isVirtualized) {
      s.maxHeight = typeof virtualMaxHeight === "number" ? `${virtualMaxHeight}px` : virtualMaxHeight;
      s.overflowY = "auto";
      s.position = "relative";
    }
    return s;
  }, [theme.borderRadius, isVirtualized, virtualMaxHeight]);

  return (
    <div
      dir={resolvedDir}
      lang={locale}
      style={themeStyle}
      className={`any-table-wrapper ${
        theme.classes?.container ||
        "w-full flex flex-col gap-4 font-sans text-gray-900 dark:text-gray-100"
      } ${className}`}
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
        messages={resolvedMessages}
        exportable={exportable}
        onExport={handleExport}
        dir={resolvedDir}
      />

      {/* Table Container Box */}
      <div
        ref={scrollContainerRef}
        style={tableContainerStyle}
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
            <TableErrorState
              error={error}
              onRetry={refresh}
              messages={resolvedMessages}
            />
          )
        ) : (
          <table
            className={`${theme.classes?.table || "w-full border-collapse text-left rtl:text-right text-sm"} ${
              compact || theme.density === "compact" ? "text-xs" : ""
            } ${
              stickyHeader || isVirtualized ? "relative" : ""
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
                sticky={stickyHeader || isVirtualized}
                messages={resolvedMessages}
                dir={resolvedDir}
                resizableColumns={resizableColumns}
                columnWidths={columnWidths}
                onResizeColumn={handleResizeColumn}
                pinnedStyles={pinnedStyles}
              />
            )}

            {/* Loading Skeleton */}
            {loading && rows.length === 0 ? (
              loadingComponent ? (
                loadingComponent
              ) : (
                <TableSkeleton
                  columnsCount={
                    resolvedColumns.length +
                    (selectable ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
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
                  colSpan={
                    resolvedColumns.length +
                    (selectable ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
                  messages={resolvedMessages}
                />
              )
            ) : (
              // Table Body
              <TableBody
                rows={displayRows}
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
                isVirtualized={isVirtualized}
                paddingTop={paddingTop}
                paddingBottom={paddingBottom}
                startIndex={startIndex}
                pinnedStyles={pinnedStyles}
                columnWidths={columnWidths}
                dir={resolvedDir}
                actionsWidth={actionsWidth}
                messages={resolvedMessages}
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
          messages={resolvedMessages}
          dir={resolvedDir}
        />
      )}
    </div>
  );
}

/**
 * AnyTable — The developer-facing, smart data table library for React.
 * Supports both standard ref={tableRef} and tableRef={tableRef} seamlessly across React 16.8, 17, 18, and 19.
 */
export const AnyTable = React.forwardRef(function AnyTable<TData = any>(
  props: AnyTableProps<TData>,
  ref: React.Ref<TableInstance<TData>>
) {
  const mergedRef = ref || props.tableRef;
  if (!props.theme && !props.preset) {
    return <AnyTableInner {...props} tableRef={mergedRef} />;
  }
  return (
    <AnyTableThemeProvider theme={props.theme} preset={props.preset}>
      <AnyTableInner {...props} tableRef={mergedRef} />
    </AnyTableThemeProvider>
  );
}) as <TData = any>(
  props: AnyTableProps<TData> & { ref?: React.Ref<TableInstance<TData>> }
) => React.ReactElement | null;

export default AnyTable;
