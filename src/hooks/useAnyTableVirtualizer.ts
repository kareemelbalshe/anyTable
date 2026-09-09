import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { VirtualizedConfig } from "../types/table.types";

export interface UseAnyTableVirtualizerParams {
  config?: boolean | VirtualizedConfig;
  totalCount: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseAnyTableVirtualizerReturn {
  isVirtualized: boolean;
  totalHeight: number;
  paddingTop: number;
  paddingBottom: number;
  startIndex: number;
  endIndex: number;
  rowHeight: number;
  maxHeight: number | string;
  scrollToIndex: (index: number, align?: "start" | "center" | "end" | "auto") => void;
  sliceRows: <T>(rows: T[]) => T[];
}

export function useAnyTableVirtualizer({
  config,
  totalCount,
  scrollContainerRef,
}: UseAnyTableVirtualizerParams): UseAnyTableVirtualizerReturn {
  const virtualConfig = useMemo<VirtualizedConfig>(() => {
    if (typeof config === "object" && config !== null) {
      return {
        enabled: config.enabled !== false,
        rowHeight: config.rowHeight ?? 48,
        maxHeight: config.maxHeight ?? 520,
        overscan: config.overscan ?? 10,
      };
    }
    return {
      enabled: Boolean(config),
      rowHeight: 48,
      maxHeight: 520,
      overscan: 10,
    };
  }, [config]);

  const isVirtualized = Boolean(virtualConfig.enabled && totalCount > 0);
  const rowHeight = virtualConfig.rowHeight || 48;
  const maxHeight = virtualConfig.maxHeight || 520;
  const overscan = virtualConfig.overscan ?? 10;

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(
    typeof maxHeight === "number" ? maxHeight : 520
  );

  const rafIdRef = useRef<number | null>(null);

  // Measure container height and listen to passive scroll events with requestAnimationFrame
  useEffect(() => {
    if (!isVirtualized) return;

    const el = scrollContainerRef.current;
    if (!el) return;

    // Initial measurement
    if (el.clientHeight > 0) {
      setContainerHeight(el.clientHeight);
    }

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        if (el) {
          setScrollTop(el.scrollTop);
        }
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    // Optional ResizeObserver for adaptive container sizing
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          if (cr.height > 0) {
            setContainerHeight(cr.height);
          }
        }
      });
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isVirtualized, scrollContainerRef]);

  // Windowing calculations
  const totalHeight = totalCount * rowHeight;

  const { startIndex, endIndex, paddingTop, paddingBottom } = useMemo(() => {
    if (!isVirtualized || totalCount === 0) {
      return {
        startIndex: 0,
        endIndex: Math.max(0, totalCount - 1),
        paddingTop: 0,
        paddingBottom: 0,
      };
    }

    const rawStart = Math.floor(scrollTop / rowHeight);
    const visibleCount = Math.ceil(containerHeight / rowHeight);

    const start = Math.max(0, rawStart - overscan);
    const end = Math.min(totalCount - 1, rawStart + visibleCount + overscan);

    const top = start * rowHeight;
    const bottom = Math.max(0, (totalCount - 1 - end) * rowHeight);

    return {
      startIndex: start,
      endIndex: end,
      paddingTop: top,
      paddingBottom: bottom,
    };
  }, [isVirtualized, totalCount, rowHeight, scrollTop, containerHeight, overscan]);

  // Programmatic scrollToIndex
  const scrollToIndex = useCallback(
    (index: number, align: "start" | "center" | "end" | "auto" = "auto") => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const targetTop = index * rowHeight;
      const currentScrollTop = el.scrollTop;
      const clientH = el.clientHeight || (typeof maxHeight === "number" ? maxHeight : 520);

      let nextScrollTop = targetTop;

      if (align === "start") {
        nextScrollTop = targetTop;
      } else if (align === "end") {
        nextScrollTop = targetTop - clientH + rowHeight;
      } else if (align === "center") {
        nextScrollTop = targetTop - clientH / 2 + rowHeight / 2;
      } else {
        // Auto
        if (targetTop < currentScrollTop) {
          nextScrollTop = targetTop;
        } else if (targetTop + rowHeight > currentScrollTop + clientH) {
          nextScrollTop = targetTop - clientH + rowHeight;
        } else {
          return; // already fully visible
        }
      }

      const clampedTop = Math.max(0, Math.min(nextScrollTop, totalHeight - clientH));

      if (typeof el.scrollTo === "function") {
        el.scrollTo({
          top: clampedTop,
          behavior: "smooth",
        });
      } else {
        el.scrollTop = clampedTop;
      }
    },
    [rowHeight, maxHeight, totalHeight, scrollContainerRef]
  );

  const sliceRows = useCallback(
    <T>(rows: T[]): T[] => {
      if (!isVirtualized) return rows;
      return rows.slice(startIndex, endIndex + 1);
    },
    [isVirtualized, startIndex, endIndex]
  );

  return {
    isVirtualized,
    totalHeight,
    paddingTop,
    paddingBottom,
    startIndex,
    endIndex,
    rowHeight,
    maxHeight,
    scrollToIndex,
    sliceRows,
  };
}
