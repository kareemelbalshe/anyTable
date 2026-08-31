import { ColumnDef } from "../types/column.types";
import { generateAutoColumns } from "./autoColumns";
import { toTitleCase } from "../adapters/objectUtils";
import { inferColumnType } from "./typeDetector";

export interface ResolveColumnsParams<TData = any> {
  data?: TData[];
  columns?: (ColumnDef<TData> | (keyof TData & string))[];
  autoColumns?: boolean;
  thead?: string[]; // Legacy AnyTable prop
  headerData?: string[]; // Legacy AnyTable prop
}

/**
 * Normalizes and resolves all column definitions, merging developer explicit columns,
 * legacy props, and auto-generated columns seamlessly.
 */
export function resolveColumns<TData = any>(
  params: ResolveColumnsParams<TData>
): ColumnDef<TData>[] {
  const { data = [], columns, autoColumns = true, thead, headerData } = params;

  // 1. Support Legacy Props: `thead` + `headerData`
  if (headerData && Array.isArray(headerData) && headerData.length > 0) {
    return headerData.map((key, idx) => {
      const title = thead && thead[idx] ? thead[idx] : toTitleCase(key);
      const sampleValues = data.map((d) => (d as any)?.[key]);
      const inferredType = inferColumnType(key, sampleValues);

      return {
        key,
        title,
        type: inferredType,
        sortable: true,
        searchable: true,
        align: inferredType === "number" || inferredType === "currency" ? "right" : "left",
      };
    });
  }

  // 2. Developer provided explicit `columns`
  if (columns && Array.isArray(columns) && columns.length > 0) {
    return columns.map((col) => {
      if (typeof col === "string") {
        const sampleValues = data.map((d) => (d as any)?.[col]);
        const inferredType = inferColumnType(col, sampleValues);
        return {
          key: col,
          title: toTitleCase(col),
          type: inferredType,
          sortable: true,
          searchable: true,
          align: inferredType === "number" || inferredType === "currency" ? "right" : "left",
        };
      }

      // If object, fill defaults
      const keyStr = String(col.key);
      const title = col.title !== undefined ? col.title : toTitleCase(keyStr);
      const inferredType = col.type || inferColumnType(keyStr, data.map((d) => (d as any)?.[keyStr]));

      return {
        ...col,
        title,
        type: inferredType,
        sortable: col.sortable !== undefined ? col.sortable : true,
        searchable: col.searchable !== undefined ? col.searchable : true,
        align: col.align || (inferredType === "number" || inferredType === "currency" ? "right" : "left"),
      };
    });
  }

  // 3. Fallback: Auto Columns from Data
  if (autoColumns && data && data.length > 0) {
    return generateAutoColumns(data);
  }

  return [];
}
