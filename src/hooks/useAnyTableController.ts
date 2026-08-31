import React, { useImperativeHandle } from "react";
import { TableInstance, TableState } from "../types/table.types";
import { SortDirection } from "../types/column.types";

export interface UseAnyTableControllerParams<TData = any> {
  tableRef?: React.Ref<TableInstance<TData>>;
  refresh: () => Promise<void>;
  resetPagination: () => void;
  resetSearch: () => void;
  resetSorting: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSorting: (sortBy: string | null, sortOrder: SortDirection) => void;
  selectedRows: TData[];
  clearSelection: () => void;
  getState: () => TableState<TData>;
}

export function useAnyTableController<TData = any>({
  tableRef,
  refresh,
  resetPagination,
  resetSearch,
  resetSorting,
  setPage,
  setPageSize,
  setSearch,
  setSorting,
  selectedRows,
  clearSelection,
  getState,
}: UseAnyTableControllerParams<TData>) {
  useImperativeHandle(
    tableRef,
    (): TableInstance<TData> => ({
      refresh,
      reset: () => {
        resetPagination();
        resetSearch();
        resetSorting();
        clearSelection();
      },
      resetSearch,
      resetSorting,
      resetPagination,
      setPage,
      setPageSize,
      setSearch,
      setSorting,
      getSelectedRows: () => selectedRows,
      clearSelection,
      getState,
    }),
    [
      refresh,
      resetPagination,
      resetSearch,
      resetSorting,
      setPage,
      setPageSize,
      setSearch,
      setSorting,
      selectedRows,
      clearSelection,
      getState,
    ]
  );
}
