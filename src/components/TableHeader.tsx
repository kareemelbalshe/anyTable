import React from "react";
import { ColumnDef, SortDirection } from "../types/column.types";
import { useAnyTableTheme } from "../theme/themeContext";

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
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  hasActions,
  actionsTitle = "Actions",
  actionsWidth,
  sortBy,
  sortOrder,
  onSort,
  selectable,
  allSelected,
  isIndeterminate,
  onToggleSelectAll,
  headerClassName = "",
}) => {
  const theme = useAnyTableTheme();

  const theadStyle: React.CSSProperties = {};
  if (theme.colors?.theadBg) theadStyle.backgroundColor = theme.colors.theadBg;
  if (theme.colors?.theadText) theadStyle.color = theme.colors.theadText;

  return (
    <thead
      style={theadStyle}
      className={`${theme.classes?.thead || "bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-200 dark:border-gray-800"} ${headerClassName}`}
    >
      <tr>
        {/* Checkbox Select All Column */}
        {selectable && (
          <th className="w-10 px-4 py-3 text-center align-middle">
            <input
              type="checkbox"
              checked={allSelected}
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
          const isSorted = sortBy === col.key;
          const isSortable = col.sortable !== false && Boolean(onSort);

          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
              ? "text-right"
              : "text-left";

          return (
            <th
              key={String(col.key)}
              style={{
                width: col.width,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
              }}
              onClick={() => isSortable && onSort?.(String(col.key))}
              className={`${
                theme.classes?.th || "py-3.5 px-4 font-bold select-none whitespace-nowrap text-xs uppercase tracking-wider"
              } ${alignClass} ${col.headerClassName || ""} ${
                isSortable ? "cursor-pointer hover:text-primary transition-colors group" : ""
              }`}
            >
              <div
                className={`inline-flex items-center gap-1.5 ${
                  col.align === "center"
                    ? "justify-center"
                    : col.align === "right"
                    ? "justify-end"
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
            </th>
          );
        })}

        {/* Actions Column Header */}
        {hasActions && (
          <th
            style={{ width: actionsWidth || "auto" }}
            className={`${
              theme.classes?.th || "py-3.5 px-4 font-bold select-none whitespace-nowrap text-xs uppercase tracking-wider"
            } text-right pr-6`}
          >
            {actionsTitle}
          </th>
        )}
      </tr>
    </thead>
  );
};
