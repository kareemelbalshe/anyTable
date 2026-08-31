import { useState, useEffect, useCallback, useMemo } from "react";
import { SearchConfig } from "../types/table.types";

export interface UseAnyTableSearchParams<TData = any> {
  config?: boolean | SearchConfig<TData>;
  onSearchChange?: (search: string) => void;
}

export function useAnyTableSearch<TData = any>({
  config,
  onSearchChange,
}: UseAnyTableSearchParams<TData>) {
  const searchConfig = useMemo<SearchConfig<TData>>(() => {
    if (typeof config === "object" && config !== null) {
      return config;
    }
    return { enabled: Boolean(config) };
  }, [config]);

  const enabled = searchConfig.enabled !== false && Boolean(config);
  const debounceDelay = searchConfig.debounce ?? 350;

  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    if (search === "") {
      setDebouncedSearch("");
      setIsDebouncing(false);
      onSearchChange?.("");
      return;
    }

    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setIsDebouncing(false);
      onSearchChange?.(search);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [search, debounceDelay, enabled, onSearchChange]);

  const setSearch = useCallback((val: string) => {
    setSearchState(val);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState("");
    setDebouncedSearch("");
    setIsDebouncing(false);
    onSearchChange?.("");
  }, [onSearchChange]);

  return {
    enabled,
    search,
    debouncedSearch,
    isDebouncing,
    setSearch,
    clearSearch,
    searchConfig,
  };
}
