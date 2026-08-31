import { SortDirection } from "../types/column.types";
import { getNestedValue } from "./objectUtils";

/**
 * Pure non-mutating sort comparator for tabular data.
 * Supports strings (locale aware + natural numeric sorting), numbers, dates, booleans, and nested paths.
 * Puts null/undefined values consistently at the end.
 */
export function sortRows<TData = any>(
  rows: TData[],
  sortBy: string | null,
  sortOrder: SortDirection,
  customComparator?: (a: TData, b: TData) => number
): TData[] {
  if (!rows || !rows.length || !sortBy || !sortOrder) {
    return rows;
  }

  const copy = [...rows];

  if (customComparator && typeof customComparator === "function") {
    copy.sort((a, b) => {
      const res = customComparator(a, b);
      return sortOrder === "desc" ? -res : res;
    });
    return copy;
  }

  copy.sort((a, b) => {
    const valA = getNestedValue(a, sortBy);
    const valB = getNestedValue(b, sortBy);

    // 1. Handle Null / Undefined
    if (valA === undefined || valA === null) {
      if (valB === undefined || valB === null) return 0;
      return 1; // place nulls at the end
    }
    if (valB === undefined || valB === null) {
      return -1;
    }

    let comparison = 0;

    // 2. Numbers
    if (typeof valA === "number" && typeof valB === "number") {
      comparison = valA - valB;
    }
    // 3. Booleans
    else if (typeof valA === "boolean" && typeof valB === "boolean") {
      comparison = valA === valB ? 0 : valA ? -1 : 1;
    }
    // 4. Dates
    else if (valA instanceof Date && valB instanceof Date) {
      comparison = valA.getTime() - valB.getTime();
    }
    // 5. Date-like Strings
    else if (
      typeof valA === "string" &&
      typeof valB === "string" &&
      isIsoDateString(valA) &&
      isIsoDateString(valB)
    ) {
      comparison = new Date(valA).getTime() - new Date(valB).getTime();
    }
    // 6. Generic Strings (locale aware & natural numeric comparison)
    else {
      const strA = String(valA);
      const strB = String(valB);
      comparison = strA.localeCompare(strB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  return copy;
}

function isIsoDateString(val: string): boolean {
  if (val.length < 10) return false;
  // Basic ISO 8601 regex check (e.g. 2026-08-29 or 2026-08-29T12:00:00.000Z)
  return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/.test(val);
}
