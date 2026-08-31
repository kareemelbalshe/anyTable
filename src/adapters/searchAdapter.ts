import { getNestedValue } from "./objectUtils";

/**
 * Filters a list of rows locally by checking whether any searchable column's value matches the search query.
 */
export function filterRowsBySearch<TData = any>(
  rows: TData[],
  query: string,
  searchableKeys?: (string | keyof TData)[],
  customFilter?: (row: TData, search: string) => boolean
): TData[] {
  if (!rows || !rows.length) return [];
  if (!query || typeof query !== "string" || !query.trim()) return rows;

  const normalizedQuery = query.trim().toLowerCase();

  // If custom filter predicate is provided, use it
  if (customFilter && typeof customFilter === "function") {
    return rows.filter((row) => customFilter(row, normalizedQuery));
  }

  // Tokenize search query for multi-word matching (e.g. 'Ahmed Ali')
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return rows.filter((row) => {
    if (!row || typeof row !== "object") return false;

    // Collect all stringifiable values from the row
    const valuesToSearch: string[] = [];

    if (searchableKeys && searchableKeys.length > 0) {
      for (const key of searchableKeys) {
        const val = getNestedValue(row, key as string);
        if (val !== null && val !== undefined) {
          if (typeof val === "object") {
            valuesToSearch.push(JSON.stringify(val).toLowerCase());
          } else {
            valuesToSearch.push(String(val).toLowerCase());
          }
        }
      }
    } else {
      // Search all non-function values in the object recursively
      extractSearchableStrings(row, valuesToSearch);
    }

    const rowText = valuesToSearch.join(" ");

    // Every search token must match somewhere in the row
    return queryTokens.every((token) => rowText.includes(token));
  });
}

function extractSearchableStrings(obj: any, collector: string[], depth = 0): void {
  if (depth > 4 || obj === null || obj === undefined) return;

  if (typeof obj !== "object") {
    collector.push(String(obj).toLowerCase());
    return;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      extractSearchableStrings(item, collector, depth + 1);
    }
    return;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip internal keys and passwords
      if (key.startsWith("__") || key.toLowerCase().includes("password")) continue;
      extractSearchableStrings(obj[key], collector, depth + 1);
    }
  }
}
