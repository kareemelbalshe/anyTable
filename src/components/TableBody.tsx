import React from "react";
import { ColumnDef } from "../types/column.types";
import { TableAction, ActionContext } from "../types/action.types";
import { CellRenderer } from "../renderers/CellRenderer";
import { ActionRenderer } from "../renderers/ActionRenderer";
import { useAnyTableTheme } from "../theme/themeContext";
import { TableMessages, enMessages } from "../i18n";

export interface TableBodyProps<TData = any> {
  rows: TData[];
  columns: ColumnDef<TData>[];
  actions?: TableAction<TData>[];
  actionContext: ActionContext<TData>;
  rowKeyResolver: (row: TData, index: number) => string | number;
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onToggleSelectRow?: (key: string | number, row: TData) => void;
  onRowClick?: (row: TData, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
  striped?: boolean;
  hoverable?: boolean;
  rowClassName?: string | ((row: TData, index: number) => string);
  isVirtualized?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  startIndex?: number;
  pinnedStyles?: Record<string, React.CSSProperties>;
  columnWidths?: Record<string, number>;
  dir?: "ltr" | "rtl" | "auto";
  actionsWidth?: string | number;
  messages?: TableMessages;
}

export function TableBody<TData = any>({
  rows,
  columns,
  actions,
  actionContext,
  rowKeyResolver,
  selectable,
  selectedKeys,
  onToggleSelectRow,
  onRowClick,
  striped = false,
  hoverable = true,
  rowClassName,
  isVirtualized = false,
  paddingTop = 0,
  paddingBottom = 0,
  startIndex = 0,
  pinnedStyles = {},
  columnWidths = {},
  dir = "ltr",
  actionsWidth,
  messages = enMessages,
}: TableBodyProps<TData>) {
  const theme = useAnyTableTheme();
  const isRtl = dir === "rtl";
  const hasActions = Boolean(actions && actions.length > 0);
  const totalCols = columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <tbody
      className={
        theme.classes?.tbody ||
        "divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900"
      }
    >
      {/* Top spacer row for DOM Virtualization */}
      {isVirtualized && paddingTop > 0 && (
        <tr
          style={{ height: `${paddingTop}px`, border: 0 }}
          aria-hidden="true"
          className="pointer-events-none"
        >
          <td
            colSpan={totalCols}
            style={{ height: `${paddingTop}px`, padding: 0, border: 0 }}
          />
        </tr>
      )}

      {rows.map((row, localIndex) => {
        const globalIndex = startIndex + localIndex;
        const rowKey = rowKeyResolver(row, globalIndex);
        const isSelected = selectedKeys?.has(rowKey);
        const customRowClass =
          typeof rowClassName === "function"
            ? rowClassName(row, globalIndex)
            : rowClassName || "";

        return (
          <tr
            key={String(rowKey)}
            onClick={(e) => onRowClick?.(row, globalIndex, e)}
            className={`${theme.classes?.tr || "transition-colors duration-150"} ${
              striped && globalIndex % 2 === 1
                ? "bg-gray-50/40 dark:bg-slate-800/20"
                : ""
            } ${
              hoverable
                ? "hover:bg-gray-50/70 dark:hover:bg-slate-800/50"
                : ""
            } ${
              isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
            } ${onRowClick ? "cursor-pointer" : ""} ${customRowClass}`}
          >
            {/* Selection Checkbox */}
            {selectable && (
              <td
                style={{
                  width: 44,
                  minWidth: 44,
                  position: "sticky",
                  [isRtl ? "right" : "left"]: 0,
                  zIndex: 3,
                  backgroundColor: isSelected
                    ? undefined
                    : theme.colors?.tableBg || "inherit",
                }}
                className="w-11 px-4 py-3 text-center align-middle"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  title={messages.selectRow}
                  aria-label={messages.selectRow}
                  onChange={() => onToggleSelectRow?.(rowKey, row)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/30 cursor-pointer"
                />
              </td>
            )}

            {/* Data Cells */}
            {columns.map((col) => {
              const colKey = String(col.key);
              const pinnedStyle = pinnedStyles[colKey];
              const isPinned = Boolean(pinnedStyle);

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

              const customCellClass =
                typeof col.className === "function"
                  ? col.className((row as any)?.[col.key], row, globalIndex)
                  : col.className || "";

              const cellStyle: React.CSSProperties = {
                width: columnWidths[colKey] ?? col.width,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
                ...(isPinned ? pinnedStyle : {}),
                backgroundColor: isPinned
                  ? isSelected
                    ? undefined
                    : theme.colors?.tableBg || "inherit"
                  : undefined,
              };

              return (
                <td
                  key={colKey}
                  style={cellStyle}
                  className={`${
                    theme.classes?.td || "py-3 px-4 text-sm align-middle"
                  } ${alignClass} ${customCellClass} ${
                    isPinned
                      ? isRtl
                        ? "border-l border-gray-200/60 dark:border-gray-800/60 shadow-[-2px_0_4px_rgba(0,0,0,0.03)]"
                        : "border-r border-gray-200/60 dark:border-gray-800/60 shadow-[2px_0_4px_rgba(0,0,0,0.03)]"
                      : ""
                  }`}
                >
                  <CellRenderer row={row} column={col} rowIndex={globalIndex} />
                </td>
              );
            })}

            {/* Actions Cell */}
            {hasActions && (
              <td
                style={{
                  width: actionsWidth || "auto",
                  position: "sticky",
                  [isRtl ? "left" : "right"]: 0,
                  zIndex: 3,
                  backgroundColor: isSelected
                    ? undefined
                    : theme.colors?.tableBg || "inherit",
                }}
                className={`${
                  theme.classes?.td || "py-3 px-4 text-sm align-middle"
                } ${isRtl ? "text-left pl-6" : "text-right pr-6"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ActionRenderer
                  row={row}
                  actions={actions || []}
                  context={actionContext}
                />
              </td>
            )}
          </tr>
        );
      })}

      {/* Bottom spacer row for DOM Virtualization */}
      {isVirtualized && paddingBottom > 0 && (
        <tr
          style={{ height: `${paddingBottom}px`, border: 0 }}
          aria-hidden="true"
          className="pointer-events-none"
        >
          <td
            colSpan={totalCols}
            style={{ height: `${paddingBottom}px`, padding: 0, border: 0 }}
          />
        </tr>
      )}
    </tbody>
  );
}
