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
}

export const TableBody: React.FC<TableBodyProps> = ({
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
}) => {
  const theme = useAnyTableTheme();
  const hasActions = Boolean(actions && actions.length > 0);

  return (
    <tbody className={theme.classes?.tbody || "divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900"}>
      {rows.map((row, rowIndex) => {
        const rowKey = rowKeyResolver(row, rowIndex);
        const isSelected = selectedKeys?.has(rowKey);
        const customRowClass =
          typeof rowClassName === "function" ? rowClassName(row, rowIndex) : rowClassName || "";

        return (
          <tr
            key={String(rowKey)}
            onClick={(e) => onRowClick?.(row, rowIndex, e)}
            className={`${theme.classes?.tr || "transition-colors duration-150"} ${
              striped && rowIndex % 2 === 1 ? "bg-gray-50/40 dark:bg-slate-800/20" : ""
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
                  ? col.className((row as any)?.[col.key], row, rowIndex)
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
                  <CellRenderer row={row} column={col} rowIndex={rowIndex} />
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
    </tbody>
  );
};
