import { useState, useCallback, useMemo, useRef, useEffect } from "react";

export interface UseAnyTableSelectionOptions<TData = any> {
  rows: TData[];
  rowKeyResolver: (row: TData, index: number) => string | number;
  onSelectionChange?: (selectedRows: TData[], selectedKeys: (string | number)[]) => void;
}

export function useAnyTableSelection<TData = any>({
  rows,
  rowKeyResolver,
  onSelectionChange,
}: UseAnyTableSelectionOptions<TData>) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const selectedRowMapRef = useRef<Map<string | number, TData>>(new Map());

  // Cache row data objects so navigation across pages doesn't lose selected objects
  useEffect(() => {
    if (rows && rows.length > 0) {
      rows.forEach((r, idx) => {
        const key = rowKeyResolver(r, idx);
        if (selectedKeys.has(key)) {
          selectedRowMapRef.current.set(key, r);
        }
      });
    }
  }, [rows, selectedKeys, rowKeyResolver]);

  const onToggleSelectRow = useCallback(
    (key: string | number, row: TData) => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
          selectedRowMapRef.current.delete(key);
        } else {
          next.add(key);
          selectedRowMapRef.current.set(key, row);
        }
        const selectedRowList = Array.from(next)
          .map(
            (k) =>
              selectedRowMapRef.current.get(k) ||
              rows.find((r, idx) => rowKeyResolver(r, idx) === k)!
          )
          .filter(Boolean);
        onSelectionChange?.(selectedRowList, Array.from(next));
        return next;
      });
    },
    [rows, rowKeyResolver, onSelectionChange]
  );

  const handleToggleSelectAll = useCallback(() => {
    if (selectedKeys.size === rows.length && rows.length > 0) {
      setSelectedKeys(new Set());
      selectedRowMapRef.current.clear();
      onSelectionChange?.([], []);
    } else {
      const allKeys = new Set(rows.map((r, idx) => rowKeyResolver(r, idx)));
      rows.forEach((r, idx) => {
        selectedRowMapRef.current.set(rowKeyResolver(r, idx), r);
      });
      setSelectedKeys(allKeys);
      onSelectionChange?.(rows, Array.from(allKeys));
    }
  }, [rows, selectedKeys.size, rowKeyResolver, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
    selectedRowMapRef.current.clear();
    onSelectionChange?.([], []);
  }, [onSelectionChange]);

  const allSelected = rows.length > 0 && selectedKeys.size === rows.length;
  const isIndeterminate = selectedKeys.size > 0 && selectedKeys.size < rows.length;

  const selectedRows = useMemo(() => {
    return Array.from(selectedKeys)
      .map(
        (k) =>
          selectedRowMapRef.current.get(k) ||
          rows.find((r, idx) => rowKeyResolver(r, idx) === k)!
      )
      .filter(Boolean);
  }, [rows, selectedKeys, rowKeyResolver]);

  return {
    selectedKeys,
    setSelectedKeys,
    selectedRows,
    onToggleSelectRow,
    handleToggleSelectAll,
    clearSelection,
    allSelected,
    isIndeterminate,
  };
}
