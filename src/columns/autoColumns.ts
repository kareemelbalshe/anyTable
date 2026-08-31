import { ColumnDef } from "../types/column.types";
import { toTitleCase, isPlainObject, getNestedValue } from "../adapters/objectUtils";
import { inferColumnType } from "./typeDetector";

const DEFAULT_IGNORED_KEYS = ["__v", "password", "token", "refreshToken", "secret", "hash", "salt"];

/**
 * Automatically generates a list of ColumnDef objects by inspecting keys and sample values of data rows.
 */
export function generateAutoColumns<TData = any>(
  data: TData[],
  ignoredKeys: string[] = DEFAULT_IGNORED_KEYS,
  maxNestedDepth = 2
): ColumnDef<TData>[] {
  if (!data || !data.length) {
    return [];
  }

  const columnsMap = new Map<string, ColumnDef<TData>>();
  const rowsToInspect = data.slice(0, 10); // inspect first 10 rows for solid heuristics

  // Extract all property paths
  for (const row of rowsToInspect) {
    if (!row || typeof row !== "object") continue;
    extractRowPaths(row, "", columnsMap, rowsToInspect, ignoredKeys, 0, maxNestedDepth);
  }

  return Array.from(columnsMap.values());
}

function extractRowPaths<TData>(
  obj: any,
  parentPath: string,
  collector: Map<string, ColumnDef<TData>>,
  allSampleRows: TData[],
  ignoredKeys: string[],
  currentDepth: number,
  maxDepth: number
): void {
  if (!obj || typeof obj !== "object" || currentDepth > maxDepth) return;

  for (const rawKey of Object.keys(obj)) {
    // Check if key is ignored
    if (ignoredKeys.includes(rawKey)) continue;

    const fullPath = parentPath ? `${parentPath}.${rawKey}` : rawKey;
    const value = obj[rawKey];

    // If it's a nested plain object (and not an image wrapper or date), drill down
    if (
      isPlainObject(value) &&
      !isSpecialObject(value, rawKey) &&
      currentDepth < maxDepth
    ) {
      extractRowPaths(value, fullPath, collector, allSampleRows, ignoredKeys, currentDepth + 1, maxDepth);
      continue;
    }

    if (!collector.has(fullPath)) {
      // Gather sample values across all inspected rows
      const sampleValues = allSampleRows.map((r) => getNestedValue(r, fullPath));
      const inferredType = inferColumnType(fullPath, sampleValues);

      collector.set(fullPath, {
        key: fullPath,
        title: toTitleCase(fullPath),
        type: inferredType,
        sortable: true,
        searchable: true,
        align: inferredType === "number" || inferredType === "currency" ? "right" : "left",
      });
    }
  }
}

function isSpecialObject(obj: any, keyName: string): boolean {
  // Multilingual objects like { en: 'Ahmed', ar: 'أحمد' } -> keep nested so we can access user.name.en
  if ("en" in obj && "ar" in obj && Object.keys(obj).length <= 3) {
    return false; // let it expand to .en and .ar
  }
  // Image object with url
  if ("url" in obj && typeof obj.url === "string") {
    return true;
  }
  // Coordinates object
  if ("coordinates" in obj || ("lat" in obj && "lng" in obj)) {
    return true;
  }
  return false;
}
