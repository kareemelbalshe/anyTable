import React from "react";
import { ColumnDef, SortDirection } from "./column.types";
import { TableAction, SwitchAction } from "./action.types";
import { ApiConfig, PaginationMeta } from "./api.types";
import { AnyTableTheme, TablePreset } from "./theme.types";

export type RowKeyResolver<TData = any> =
  | (keyof TData & string)
  | string
  | ((row: TData, index: number) => string | number);

export interface SearchConfig<TData = any> {
  enabled?: boolean;
  mode?: "server" | "client" | "auto";
  param?: string;
  placeholder?: string;
  debounce?: number;
  filter?: (row: TData, searchValue: string) => boolean;
  searchableColumns?: (keyof TData | string)[];
}

export interface SortingConfig<TData = any> {
  enabled?: boolean;
  mode?: "server" | "client" | "auto";
  defaultSortBy?: keyof TData | string;
  defaultSortOrder?: "asc" | "desc";
  sortByParam?: string;
  sortOrderParam?: string;
  allowUnsort?: boolean;
}

export interface PaginationConfig {
  enabled?: boolean;
  mode?: "server" | "client" | "auto";
  pageParam?: string;
  pageSizeParam?: string;
  defaultPage?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showTotalCount?: boolean;
}

export interface TableState<TData = any> {
  data: TData[];
  loading: boolean;
  error: any;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  search: string;
  sortBy: string | null;
  sortOrder: SortDirection;
  selectedRowKeys: (string | number)[];
  selectedRows: TData[];
  isServerMode: boolean;
}

export interface TableInstance<TData = any> {
  /**
   * Refetches the data from the API adapter or resets data stream.
   */
  refresh: () => Promise<void>;

  /**
   * Resets all search, sorting, pagination, and selection state to default.
   */
  reset: () => void;

  /**
   * Clears active search input and resets page to 1.
   */
  resetSearch: () => void;

  /**
   * Clears active sorting column.
   */
  resetSorting: () => void;

  /**
   * Resets pagination page to 1.
   */
  resetPagination: () => void;

  /**
   * Programmatically navigates to a specific page number.
   */
  setPage: (page: number) => void;

  /**
   * Programmatically sets the page size limit.
   */
  setPageSize: (pageSize: number) => void;

  /**
   * Programmatically sets the search query value.
   */
  setSearch: (search: string) => void;

  /**
   * Programmatically sorts by column and direction.
   */
  setSorting: (sortBy: string | null, sortOrder: SortDirection) => void;

  /**
   * Returns an array of currently selected row objects.
   */
  getSelectedRows: () => TData[];

  /**
   * Clears all row selections.
   */
  clearSelection: () => void;

  /**
   * Returns current internal state snapshot.
   */
  getState: () => TableState<TData>;
}

export interface AnyTableProps<TData = any> {
  /**
   * Direct local data array. Used when not passing `api`.
   */
  data?: TData[];

  /**
   * Smart API configuration for fetching remote REST API data.
   */
  api?: ApiConfig<TData>;

  /**
   * Column definitions. If omitted or autoColumns=true, columns are generated dynamically.
   */
  columns?: (ColumnDef<TData> | (keyof TData & string))[];

  /**
   * Whether to automatically detect columns from data rows if columns prop is omitted or partial. Defaults to true.
   */
  autoColumns?: boolean;

  /**
   * Unique row identifier accessor or key name (e.g. 'id', '_id', row => row.userId). Defaults to 'id' or '_id'.
   */
  rowKey?: RowKeyResolver<TData>;

  /**
   * Table section title.
   */
  title?: React.ReactNode;

  /**
   * Table section subtitle / description.
   */
  subtitle?: React.ReactNode;

  /**
   * Action buttons, switch toggles, and operations for each row.
   */
  actions?: (TableAction<TData> | SwitchAction<TData>)[];

  /**
   * Header title for the Actions column. Defaults to 'Actions'.
   */
  actionsTitle?: string;

  /**
   * Column width for the Actions column. Defaults to 'auto'.
   */
  actionsWidth?: string | number;

  /**
   * Search feature configuration or boolean to enable default search.
   */
  search?: boolean | SearchConfig<TData>;

  /**
   * Sorting feature configuration or boolean to enable default sorting.
   */
  sorting?: boolean | SortingConfig<TData>;

  /**
   * Pagination feature configuration or boolean to enable default pagination.
   */
  pagination?: boolean | PaginationConfig;

  /**
   * Enables row selection checkboxes.
   */
  selectable?: boolean;

  /**
   * Callback fired whenever row selection changes.
   */
  onSelectionChange?: (selectedRows: TData[], selectedKeys: (string | number)[]) => void;

  /**
   * Callback fired when a table row is clicked.
   */
  onRowClick?: (row: TData, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;

  /**
   * Manual loading state override.
   */
  loading?: boolean;

  /**
   * Custom skeleton/spinner loader component.
   */
  loadingComponent?: React.ReactNode;

  /**
   * Custom empty state component when no records exist.
   */
  emptyComponent?: React.ReactNode;

  /**
   * Custom empty state title text.
   */
  emptyTitle?: string;

  /**
   * Custom empty state description text.
   */
  emptyDescription?: string;

  /**
   * Custom error state component or function with retry callback.
   */
  errorComponent?:
    | React.ReactNode
    | ((error: any, retry: () => void) => React.ReactNode);

  /**
   * Built-in visual theme preset: 'default' | 'midnight' | 'emerald' | 'ocean' | 'luxury' | 'crimson' | 'minimal' | 'corporate'.
   */
  preset?: TablePreset;

  /**
   * Custom theme tokens and class overrides.
   */
  theme?: Partial<AnyTableTheme>;

  /**
   * Custom CSS classes for the outer wrapper.
   */
  className?: string;

  /**
   * Custom CSS classes for the `<table>` element.
   */
  tableClassName?: string;

  /**
   * Custom CSS classes for the `<thead>` element.
   */
  headerClassName?: string;

  /**
   * Custom CSS classes for each `<tr>` row or dynamic class generator based on row data.
   */
  rowClassName?: string | ((row: TData, index: number) => string);

  /**
   * Custom action buttons to place in the table top header (e.g. "Add User", "Export CSV").
   */
  headerActions?: React.ReactNode;

  /**
   * Whether to show table header (`<thead>`). Defaults to true.
   */
  showHeader?: boolean;

  /**
   * Shows borders around table and cells. Defaults to true.
   */
  bordered?: boolean;

  /**
   * Alternates row background colors (zebra striping). Defaults to false.
   */
  striped?: boolean;

  /**
   * Highlights row on hover. Defaults to true.
   */
  hoverable?: boolean;

  /**
   * Compact table density. Defaults to false.
   */
  compact?: boolean;

  /**
   * Makes the table header sticky when scrolling vertically. Defaults to false.
   */
  stickyHeader?: boolean;

  /**
   * Ref object to expose imperative controller API.
   */
  tableRef?: React.Ref<TableInstance<TData>>;

  // ==========================================
  // BACKWARD COMPATIBILITY PROPS (Legacy Wasel)
  // ==========================================
  thead?: string[];
  headerData?: string[];
  tbodys?: TData[];
  titleHeader?: string;
  add?: boolean;
  linkAdd?: string;
  addHandler?: () => void;
  view?: boolean;
  linkView?: string;
  viewHandler?: (id: string) => void;
  edit?: boolean;
  linkEdit?: string;
  editHandler?: (id: string) => void;
  del?: boolean;
  handleDelete?: (id: string) => void;
  block?: boolean;
  handleBlock?: (id: string) => void;
  buttons?: any[];
}
