import React from "react";
import { useAnyTableTheme } from "../theme/themeContext";

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  showTotalCount?: boolean;
  pageWindow: number[];
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  pageSize,
  totalRecords,
  totalPages,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showTotalCount = true,
  pageWindow,
}) => {
  const theme = useAnyTableTheme();

  const startRecord = Math.min((page - 1) * pageSize + 1, totalRecords);
  const endRecord = Math.min(page * pageSize, totalRecords);

  return (
    <div
      className={
        theme.classes?.paginationContainer ||
        "w-full flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-gray-600 dark:text-gray-400"
      }
    >
      {/* Total Records & Range Info */}
      <div className="flex items-center gap-3">
        {showTotalCount && totalRecords > 0 ? (
          <span className="text-xs sm:text-sm font-medium">
            Showing <strong className="text-gray-900 dark:text-white font-bold">{startRecord}</strong> to{" "}
            <strong className="text-gray-900 dark:text-white font-bold">{endRecord}</strong> of{" "}
            <strong className="text-gray-900 dark:text-white font-bold">{totalRecords.toLocaleString()}</strong> results
          </span>
        ) : (
          <span className="text-xs sm:text-sm font-medium">Page {page} of {totalPages}</span>
        )}

        {/* Page Size Selector */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={
                theme.classes?.paginationSelect ||
                "h-8 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary cursor-pointer"
              }
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Previous Button */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous Page"
          className={`${
            theme.classes?.paginationButton ||
            "h-8 min-w-[32px] px-2.5 flex items-center justify-center rounded-xl font-bold text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40"
          }`}
        >
          ‹
        </button>

        {/* Page Number Pills */}
        {pageWindow.map((p) => {
          const isActive = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`${
                theme.classes?.paginationButton ||
                "h-8 min-w-[32px] px-2.5 flex items-center justify-center rounded-xl font-bold text-xs"
              } ${
                isActive
                  ? theme.classes?.paginationButtonActive || "bg-primary text-white shadow-sm shadow-primary/30"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next Page"
          className={`${
            theme.classes?.paginationButton ||
            "h-8 min-w-[32px] px-2.5 flex items-center justify-center rounded-xl font-bold text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40"
          }`}
        >
          ›
        </button>
      </div>
    </div>
  );
};
