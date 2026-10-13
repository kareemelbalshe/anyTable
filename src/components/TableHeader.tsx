import React, { useState, useCallback, useRef } from "react";
import { ColumnDef, SortDirection } from "../types/column.types";
import { useAnyTableTheme } from "../theme/themeContext";
import { TableMessages, enMessages } from "../i18n";

export interface TableHeaderProps<TData = any> {
  columns: ColumnDef<TData>[];
  hasActions?: boolean;
  actionsTitle?: string;
  actionsWidth?: string | number;
  sortBy?: string | null;
  sortOrder?: SortDirection;
  onSort?: (key: string) => void;
  selectable?: boolean;
  allSelected?: boolean;
  isIndeterminate?: boolean;
  onToggleSelectAll?: () => void;
  headerClassName?: string;
  sticky?: boolean;
  messages?: TableMessages;
  dir?: "ltr" | "rtl" | "auto";
  resizableColumns?: boolean;
  columnWidths?: Record<string, number>;
  onResizeColumn?: (key: string, width: number) => void;
  pinnedStyles?: Record<string, React.CSSProperties>;
}

export function TableHeader<TData = any>({
  columns,
  hasActions,
  actionsTitle,
  actionsWidth,
  sortBy,
  sortOrder,
  onSort,
  selectable,
  allSelected,
  isIndeterminate,
  onToggleSelectAll,
  headerClassName = "",
  sticky = false,
  messages = enMessages,
  dir = "ltr",
  resizableColumns = false,
  columnWidths = {},
  onResizeColumn,
  pinnedStyles = {},
}: TableHeaderProps<TData>) {
  const theme = useAnyTableTheme();
  const isRtl = dir === "rtl";
  const resizingRef = useRef<{
    key: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const [activeResizingKey, setActiveResizingKey] = useState<string | null>(null);

  const startResize = useCallback(
    (e: React.MouseEvent, key: string, currentWidth: number) => {
      e.preventDefault();
      e.stopPropagation();

      resizingRef.current = {
        key,
        startX: e.clientX,
        startWidth: currentWidth,
      };
      setActiveResizingKey(key);

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingRef.current) return;
        const delta =
          (moveEvent.clientX - resizingRef.current.startX) * (isRtl ? -1 : 1);
        const nextWidth = Math.max(50, resizingRef.current.startWidth + delta);
        onResizeColumn?.(resizingRef.current.key, nextWidth);
      };

      const onMouseUp = () => {
        resizingRef.current = null;
        setActiveResizingKey(null);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [isRtl, onResizeColumn]
  );

  const theadStyle: React.CSSProperties = {};
  if (sticky) {
    theadStyle.position = "sticky";
    theadStyle.top = 0;
    theadStyle.zIndex = 10;
  }
  if (theme.colors?.theadBg) theadStyle.backgroundColor = theme.colors.theadBg;
  if (theme.colors?.theadText) theadStyle.color = theme.colors.theadText;

  const displayActionsTitle = actionsTitle || messages.actions;

  return (
    <thead
      style={theadStyle}
      className={`${
        theme.classes?.thead ||
        "bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-200 dark:border-gray-800"
      } ${headerClassName}`}
    >
      <tr>
        {/* Checkbox Select All Column */}
        {selectable && (
          <th
            style={{
              width: 44,
              minWidth: 44,
              position: sticky ? "sticky" : undefined,
              [isRtl ? "right" : "left"]: 0,
              zIndex: 12,
              backgroundColor: theme.colors?.theadBg || undefined,
            }}
            className="w-11 px-4 py-3 text-center align-middle"
          >
            <input
              type="checkbox"
              checked={allSelected}
              title={messages.selectAll}
              aria-label={messages.selectAll}
              ref={(el) => {
                if (el) el.indeterminate = Boolean(isIndeterminate);
              }}
              onChange={onToggleSelectAll}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/30 cursor-pointer"
            />
          </th>
        )}

        {/* Data Columns */}
        {columns.map((col) => {
          const colKey = String(col.key);
          const isSorted = sortBy === colKey;
          const isSortable = col.sortable !== false && Boolean(onSort);
          const pinnedStyle = pinnedStyles[colKey];
          const isPinned = Boolean(pinnedStyle);

          const currentWidth =
            columnWidths[colKey] ??
            (typeof col.width === "number"
              ? col.width
              : typeof col.width === "string"
              ? parseInt(col.width, 10) || 150
              : 150);

          const cellStyle: React.CSSProperties = {
            width: columnWidths[colKey] ?? col.width,
            minWidth: col.minWidth,
            maxWidth: col.maxWidth,
            ...(isPinned ? pinnedStyle : {}),
            zIndex: isPinned ? (sticky ? 15 : 8) : sticky ? 10 : undefined,
            backgroundColor: isPinned
              ? theme.colors?.theadBg || (theme.colors?.tableBg ?? undefined)
              : undefined,
          };

          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
              ? "text-right"
              : col.align === "left"
              ? "text-left"
              : isRtl
              ? "text-right"
              : "text-left";

          const isColResizable =
            resizableColumns && col.resizable !== false;

          return (
            <th
              key={colKey}
              style={cellStyle}
              onClick={() => isSortable && onSort?.(colKey)}
              className={`relative ${
                theme.classes?.th ||
                "py-3.5 px-4 font-bold select-none whitespace-nowrap text-xs uppercase tracking-wider"
              } ${alignClass} ${col.headerClassName || ""} ${
                isSortable
                  ? "cursor-pointer hover:text-primary transition-colors group"
                  : ""
              } ${
                isPinned
                  ? isRtl
                    ? "border-l border-gray-200/80 dark:border-gray-700/80 shadow-[-2px_0_4px_rgba(0,0,0,0.03)]"
                    : "border-r border-gray-200/80 dark:border-gray-700/80 shadow-[2px_0_4px_rgba(0,0,0,0.03)]"
                  : ""
              }`}
            >
              <div
                className={`inline-flex items-center gap-1.5 ${
                  col.align === "center"
                    ? "justify-center"
                    : col.align === "right"
                    ? "justify-end"
                    : isRtl
                    ? "justify-start"
                    : "justify-start"
                }`}
              >
                <span>{col.title}</span>

                {/* Sort Arrow Indicators */}
                {isSortable && (
                  <span
                    className={`inline-flex flex-col text-[10px] transition-transform ${
                      isSorted
                        ? "text-primary scale-110"
                        : "text-gray-400 opacity-40 group-hover:opacity-100"
                    }`}
                  >
                    {isSorted ? (
                      sortOrder === "asc" ? (
                        "▲"
                      ) : (
                        "▼"
                      )
                    ) : (
                      <span className="text-[9px] leading-none opacity-50">▲▼</span>
                    )}
                  </span>
                )}
              </div>

              {/* Column Resize Handle */}
              {isColResizable && (
                <div
                  onMouseDown={(e) => startResize(e, colKey, currentWidth)}
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute top-0 bottom-0 w-2 cursor-col-resize select-none z-20 group/handle ${
                    isRtl ? "left-0" : "right-0"
                  }`}
                  title="Resize column"
                >
                  <div
                    className={`w-0.5 h-full mx-auto transition-colors ${
                      activeResizingKey === colKey
                        ? "bg-primary w-1"
                        : "bg-transparent group-hover/handle:bg-primary/60"
                    }`}
                  />
                </div>
              )}
            </th>
          );
        })}

        {/* Actions Column Header */}
        {hasActions && (
          <th
            style={{
              width: actionsWidth || "auto",
              position: sticky ? "sticky" : undefined,
              [isRtl ? "left" : "right"]: 0,
              zIndex: 12,
              backgroundColor: theme.colors?.theadBg || undefined,
            }}
            className={`${
              theme.classes?.th ||
              "py-3.5 px-4 font-bold select-none whitespace-nowrap text-xs uppercase tracking-wider"
            } ${isRtl ? "text-left pl-6" : "text-right pr-6"}`}
          >
            {displayActionsTitle}
          </th>
        )}
      </tr>
    </thead>
  );
}
