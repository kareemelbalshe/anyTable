import React from "react";

export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "currency"
  | "image"
  | "url"
  | "email"
  | "phone"
  | "status"
  | "badge"
  | "progress"
  | "rating"
  | "array"
  | "object"
  | "custom";

export type ColumnAlign = "left" | "center" | "right";
export type SortDirection = "asc" | "desc" | null;

export interface CellRenderContext<TData> {
  row: TData;
  value: any;
  index: number;
  column: ColumnDef<TData>;
}

export interface ColumnDef<TData = any, TValue = any> {
  /**
   * The property name or dot-notation path to extract from the row (e.g. 'name', 'user.email', 'address.city').
   */
  key: (keyof TData & string) | string;

  /**
   * The display header title for the column.
   */
  title?: React.ReactNode;

  /**
   * Semantic data type for automatic smart rendering.
   * If omitted, AnyTable infers the type from the data values.
   */
  type?: DataType;

  /**
   * Currency code or symbol if type is 'currency' (e.g. 'EGP', 'USD', 'EUR', '$'). Defaults to 'EGP'.
   */
  currency?: string;

  /**
   * Date format locale string or options if type is 'date' or 'datetime'.
   */
  dateFormat?: string;

  /**
   * Whether this column supports sorting. Defaults to true.
   */
  sortable?: boolean;

  /**
   * Whether this column is included in client-side search indexing. Defaults to true.
   */
  searchable?: boolean;

  /**
   * Text alignment for header and data cells. Defaults to 'left'.
   */
  align?: ColumnAlign;

  /**
   * Column width (e.g. '150px', '20%', 150).
   */
  width?: string | number;

  /**
   * Minimum column width.
   */
  minWidth?: string | number;

  /**
   * Maximum column width.
   */
  maxWidth?: string | number;

  /**
   * Hide this column conditionally or statically.
   */
  hidden?: boolean | ((context: { data: TData[] }) => boolean);

  /**
   * Custom CSS class name for cells in this column.
   */
  className?: string | ((value: TValue, row: TData, index: number) => string);

  /**
   * Custom CSS class name for header cell.
   */
  headerClassName?: string;

  /**
   * Formatter function returning a string or ReactNode (simple formatting without replacing cell shell).
   */
  formatter?: (value: TValue, row: TData, index: number) => React.ReactNode | string;

  /**
   * Full custom cell renderer function (gives total control over cell rendering).
   */
  render?: (value: TValue, row: TData, index: number) => React.ReactNode;

  /**
   * Custom client-side sort comparator function for this column.
   */
  comparator?: (a: TData, b: TData) => number;

  /**
   * Custom client-side search predicate for this column.
   */
  filterFn?: (row: TData, searchValue: string) => boolean;

  /**
   * Optional tooltip text or tooltip resolver.
   */
  tooltip?: string | ((value: TValue, row: TData) => string);

  /**
   * Status mapping configuration if type is 'status'.
   * Maps status values to badge variants or custom colors.
   */
  statusMap?: Record<
    string,
    {
      label?: string;
      color?: string;
      bg?: string;
      variant?: "success" | "danger" | "warning" | "info" | "neutral";
    }
  >;
}
