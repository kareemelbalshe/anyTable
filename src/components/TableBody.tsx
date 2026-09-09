import React from "react";
import { ColumnDef } from "../types/column.types";
import { TableAction, ActionContext } from "../types/action.types";
import { CellRenderer } from "../renderers/CellRenderer";
import { ActionRenderer } from "../renderers/ActionRenderer";
import { useAnyTableTheme } from "../theme/themeContext";

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
}: TableBodyProps<TData>) {
  const theme = useAnyTableTheme();
  const hasActions = Boolean(actions && actions.length > 0);
  const totalCols = columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <tbody className={theme.classes?.tbody || "divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900"}>
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
          typeof rowClassName === "function" ? rowClassName(row, globalIndex) : rowClassName || "";

        return (
          <tr
            key={String(rowKey)}
            onClick={(e) => onRowClick?.(row, globalIndex, e)}
            className={`${theme.classes?.tr || "transition-colors duration-150"} ${
              striped && globalIndex % 2 === 1 ? "bg-gray-50/40 dark:bg-slate-800/20" : ""
            } ${hoverable ? "hover:bg-gray-50/70 dark:hover:bg-slate-800/50" : ""} ${
              isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
            } ${onRowClick ? "cursor-pointer" : ""} ${customRowClass}`}
          >
            {/* Selection Checkbox */}
            {selectable && (
              <td
                className="w-10 px-4 py-3 text-center align-middle"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelectRow?.(rowKey, row)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/30 cursor-pointer"
                />
              </td>
            )}

            {/* Data Cells */}
            {columns.map((col) => {
              const alignClass =
                col.align === "center"
                  ? "text-center"
                  : col.align === "right"
                  ? "text-right"
                  : "text-left";

              const customCellClass =
                typeof col.className === "function"
                  ? col.className((row as any)?.[col.key], row, globalIndex)
                  : col.className || "";

              return (
                <td
                  key={String(col.key)}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                  }}
                  className={`${theme.classes?.td || "py-3 px-4 text-sm align-middle"} ${alignClass} ${customCellClass}`}
                >
                  <CellRenderer row={row} column={col} rowIndex={globalIndex} />
                </td>
              );
            })}

            {/* Actions Cell */}
            {hasActions && (
              <td
                className={`${theme.classes?.td || "py-3 px-4 text-sm align-middle"} text-right`}
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
