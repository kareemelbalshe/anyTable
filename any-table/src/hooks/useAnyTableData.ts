import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ApiConfig, ApiFetcherParams, NormalizedApiResponse } from "../types/api.types";
import { ColumnDef, SortDirection } from "../types/column.types";
import { normalizeApiResponse } from "../adapters/apiAdapter";
import { filterRowsBySearch } from "../adapters/searchAdapter";
import { sortRows } from "../adapters/sortAdapter";

export interface UseAnyTableDataParams<TData = any> {
  data?: TData[];
  api?: ApiConfig<TData>;
  columns: ColumnDef<TData>[];
  searchQuery: string;
  sortBy: string | null;
  sortOrder: SortDirection;
  page: number;
  pageSize: number;
  manualLoading?: boolean;
}

export function useAnyTableData<TData = any>({
  data: directData,
  api,
  columns,
  searchQuery,
  sortBy,
  sortOrder,
  page,
  pageSize,
  manualLoading,
}: UseAnyTableDataParams<TData>) {
  const isRemoteApi = Boolean(api && typeof api.fetcher === "function");
  const isServerMode = isRemoteApi && api?.mode !== "client";

  const [remoteData, setRemoteData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [fetchCounter, setFetchCounter] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch Remote API
  const fetchData = useCallback(async () => {
    if (!isRemoteApi || !api?.fetcher) return;

    // Cancel any ongoing fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    const paramNames = api.paramNames || {};
    const pageKey = paramNames.pageParam || "page";
    const pageSizeKey = paramNames.pageSizeParam || "limit";
    const searchKey = paramNames.searchParam || "q";
    const sortByKey = paramNames.sortByParam || "sortBy";
    const sortOrderKey = paramNames.sortOrderParam || "sortOrder";

    const params: ApiFetcherParams = {
      [pageKey]: page,
      [pageSizeKey]: pageSize,
      page,
      pageSize,
      ...(searchQuery ? { [searchKey]: searchQuery, search: searchQuery, q: searchQuery } : {}),
      ...(sortBy ? { [sortByKey]: sortBy, sortBy } : {}),
      ...(sortOrder ? { [sortOrderKey]: sortOrder, sortOrder } : {}),
      ...(api.params || {}),
    };

    try {
      const rawResult = await api.fetcher(params, abortController.signal);

      // Guard against aborted requests
      if (abortController.signal.aborted) return;

      const normalized: NormalizedApiResponse<TData> = normalizeApiResponse(
        rawResult,
        api,
        params
      );

      setRemoteData(normalized.data);
      setTotalCount(normalized.meta.total);
      api.onSuccess?.(normalized);
    } catch (err: any) {
      if (err?.name === "AbortError" || err?.name === "CanceledError") {
        return; // ignore expected aborts
      }
      setError(err);
      api.onError?.(err);
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [isRemoteApi, api, page, pageSize, searchQuery, sortBy, sortOrder]);

  // Trigger fetch when parameters or manual counter changes
  useEffect(() => {
    if (isRemoteApi) {
      fetchData();
    }
  }, [fetchData, fetchCounter]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    if (isRemoteApi) {
      setFetchCounter((c) => c + 1);
    }
  }, [isRemoteApi]);

  // Compute Active Display Rows
  const { displayRows, finalTotal } = useMemo(() => {
    // 1. If Remote Server Mode: Data is already paginated, filtered, and sorted by backend
    if (isServerMode) {
      return {
        displayRows: remoteData,
        finalTotal: totalCount,
      };
    }

    // 2. If Client Mode (either directData or remote fetched in client mode)
    const baseData = isRemoteApi ? remoteData : directData || [];

    // Step A: Search Filter
    const searchableKeys = columns
      .filter((c) => c.searchable !== false)
      .map((c) => c.key);

    const filtered = filterRowsBySearch(baseData, searchQuery, searchableKeys);

    // Step B: Sorting
    const activeCol = columns.find((c) => c.key === sortBy);
    const customComparator = activeCol?.comparator;
    const sorted = sortRows(filtered, sortBy, sortOrder, customComparator);

    // Step C: Pagination Slicing
    const startIndex = (page - 1) * pageSize;
    const paginated = sorted.slice(startIndex, startIndex + pageSize);

    return {
      displayRows: paginated,
      finalTotal: filtered.length,
    };
  }, [
    isServerMode,
    isRemoteApi,
    remoteData,
    directData,
    totalCount,
    columns,
    searchQuery,
    sortBy,
    sortOrder,
    page,
    pageSize,
  ]);

  return {
    rows: displayRows,
    totalRecords: finalTotal,
    loading: manualLoading !== undefined ? manualLoading : loading,
    error,
    refresh,
    isServerMode,
    rawRemoteData: remoteData,
  };
}
