import { ColumnDef } from "../types/column.types";
import { getNestedValue } from "../adapters/objectUtils";

export interface ExportOptions<TData = any> {
  filename?: string;
  columns?: ColumnDef<TData>[];
  includeHidden?: boolean;
}

/**
 * Escapes a cell string for safe CSV inclusion (RFC 4180 standard).
 */
export function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts table data rows and columns definition into RFC 4180 compliant CSV string with UTF-8 BOM.
 */
export function generateCsvContent<TData = any>(
  data: TData[],
  columns: ColumnDef<TData>[]
): string {
  const exportCols = columns.filter((col) => !col.hidden && col.key);

  // Headers line
  const headers = exportCols.map((col) => {
    const title = typeof col.title === "string" ? col.title : String(col.key);
    return escapeCsvValue(title);
  });

  const lines: string[] = [headers.join(",")];

  // Data rows
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowValues = exportCols.map((col) => {
      const rawVal = getNestedValue(row, String(col.key));
      if (rawVal === null || rawVal === undefined) return "";
      if (typeof rawVal === "object") {
        try {
          return escapeCsvValue(JSON.stringify(rawVal));
        } catch {
          return "";
        }
      }
      return escapeCsvValue(rawVal);
    });
    lines.push(rowValues.join(","));
  }

  // Prepend UTF-8 BOM (\uFEFF) to guarantee Excel Arabic/international characters support
  return "\uFEFF" + lines.join("\r\n");
}

/**
 * Triggers a native browser file download using a Blob and anchor element.
 */
export function triggerDownload(
  content: string | Blob,
  filename: string,
  mimeType: string
): void {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) {
    return;
  }

  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports table data to CSV file with UTF-8 BOM.
 */
export function exportToCsv<TData = any>(
  data: TData[],
  columns: ColumnDef<TData>[],
  filename: string = "table-export"
): void {
  const csv = generateCsvContent(data, columns);
  const safeFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  triggerDownload(csv, safeFilename, "text/csv;charset=utf-8;");
}

/**
 * Exports table data to formatted JSON file.
 */
export function exportToJson<TData = any>(
  data: TData[],
  filename: string = "table-export"
): void {
  const json = JSON.stringify(data, null, 2);
  const safeFilename = filename.endsWith(".json") ? filename : `${filename}.json`;
  triggerDownload(json, safeFilename, "application/json;charset=utf-8;");
}
