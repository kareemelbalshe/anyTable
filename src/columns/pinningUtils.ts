import React from "react";
import { ColumnDef } from "../types/column.types";

export interface PinningOptions {
  selectable?: boolean;
  hasActions?: boolean;
  actionsWidth?: number | string;
  columnWidths?: Record<string, number>;
  isRtl?: boolean;
}

/**
 * Parses width string or number into pixel numeric value if possible.
 */
export function parsePixelWidth(width?: string | number): number {
  if (typeof width === "number") return width;
  if (typeof width === "string") {
    const parsed = parseInt(width, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 150; // default estimated column width for offset calculation
}

/**
 * Computes sticky positioning styles for pinned columns (left or right).
 */
export function computePinnedStyles<TData = any>(
  columns: ColumnDef<TData>[],
  options: PinningOptions = {}
): Record<string, React.CSSProperties> {
  const {
    selectable = false,
    hasActions = false,
    actionsWidth = 100,
    columnWidths = {},
    isRtl = false,
  } = options;

  const result: Record<string, React.CSSProperties> = {};

  // 1. Calculate left pinned offsets
  let leftOffset = selectable ? 44 : 0;
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const key = String(col.key);
    const colWidth = columnWidths[key] ?? parsePixelWidth(col.width);

    if (col.pinned === "left") {
      result[key] = {
        position: "sticky",
        [isRtl ? "right" : "left"]: `${leftOffset}px`,
        zIndex: 5,
      };
      leftOffset += colWidth;
    }
  }

  // 2. Calculate right pinned offsets
  let rightOffset = hasActions ? parsePixelWidth(actionsWidth) : 0;
  for (let i = columns.length - 1; i >= 0; i--) {
    const col = columns[i];
    const key = String(col.key);
    const colWidth = columnWidths[key] ?? parsePixelWidth(col.width);

    if (col.pinned === "right") {
      result[key] = {
        position: "sticky",
        [isRtl ? "left" : "right"]: `${rightOffset}px`,
        zIndex: 5,
      };
      rightOffset += colWidth;
    }
  }

  return result;
}
