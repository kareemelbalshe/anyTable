import { useState, useCallback, useMemo } from "react";
import { SortingConfig } from "../types/table.types";
import { SortDirection } from "../types/column.types";

export interface UseAnyTableSortingParams<TData = any> {
  config?: boolean | SortingConfig<TData>;
  onSortChange?: (sortBy: string | null, sortOrder: SortDirection) => void;
}

export function useAnyTableSorting<TData = any>({
  config,
  onSortChange,
}: UseAnyTableSortingParams<TData>) {
  const sortingConfig = useMemo<SortingConfig<TData>>(() => {
    if (typeof config === "object" && config !== null) {
      return config;
    }
    return { enabled: Boolean(config) };
  }, [config]);

  const enabled = sortingConfig.enabled !== false && Boolean(config);
  const allowUnsort = sortingConfig.allowUnsort ?? true;

  const [sortBy, setSortByState] = useState<string | null>(
    (sortingConfig.defaultSortBy as string) || null
  );
  const [sortOrder, setSortOrderState] = useState<SortDirection>(
    sortingConfig.defaultSortOrder || null
  );

  const toggleSort = useCallback(
    (columnKey: string) => {
      if (!enabled) return;

      if (sortBy !== columnKey) {
        setSortByState(columnKey);
        setSortOrderState("asc");
        onSortChange?.(columnKey, "asc");
        return;
      }

      // If already sorting by this column: asc -> desc -> (null | asc)
      if (sortOrder === "asc") {
        setSortOrderState("desc");
        onSortChange?.(columnKey, "desc");
      } else if (sortOrder === "desc") {
        if (allowUnsort) {
          setSortByState(null);
          setSortOrderState(null);
          onSortChange?.(null, null);
        } else {
          setSortOrderState("asc");
          onSortChange?.(columnKey, "asc");
        }
      } else {
        setSortOrderState("asc");
        onSortChange?.(columnKey, "asc");
      }
    },
    [enabled, sortBy, sortOrder, allowUnsort, onSortChange]
  );

  const setSorting = useCallback(
    (newSortBy: string | null, newSortOrder: SortDirection) => {
      setSortByState(newSortBy);
      setSortOrderState(newSortOrder);
      onSortChange?.(newSortBy, newSortOrder);
    },
    [onSortChange]
  );

  const resetSorting = useCallback(() => {
    setSortByState(null);
    setSortOrderState(null);
    onSortChange?.(null, null);
  }, [onSortChange]);

  return {
    enabled,
    sortBy,
    sortOrder,
    toggleSort,
    setSorting,
    resetSorting,
    sortingConfig,
  };
}
