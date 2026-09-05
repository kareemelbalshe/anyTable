import { useState, useCallback, useMemo } from "react";

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

  const onToggleSelectRow = useCallback(
    (key: string | number, row: TData) => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        const selectedRowList = rows.filter((r, idx) => next.has(rowKeyResolver(r, idx)));
        onSelectionChange?.(selectedRowList, Array.from(next));
        return next;
      });
    },
    [rows, rowKeyResolver, onSelectionChange]
  );

  const handleToggleSelectAll = useCallback(() => {
    if (selectedKeys.size === rows.length && rows.length > 0) {
      setSelectedKeys(new Set());
      onSelectionChange?.([], []);
    } else {
      const allKeys = new Set(rows.map((r, idx) => rowKeyResolver(r, idx)));
      setSelectedKeys(allKeys);
      onSelectionChange?.(rows, Array.from(allKeys));
    }
  }, [rows, selectedKeys.size, rowKeyResolver, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
    onSelectionChange?.([], []);
  }, [onSelectionChange]);

  const allSelected = rows.length > 0 && selectedKeys.size === rows.length;
  const isIndeterminate = selectedKeys.size > 0 && selectedKeys.size < rows.length;

  const selectedRows = useMemo(
    () => rows.filter((r, idx) => selectedKeys.has(rowKeyResolver(r, idx))),
    [rows, selectedKeys, rowKeyResolver]
  );

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
