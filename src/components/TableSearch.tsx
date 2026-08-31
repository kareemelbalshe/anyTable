import React from "react";
import { useAnyTableTheme } from "../theme/themeContext";

export interface TableSearchProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isDebouncing?: boolean;
  placeholder?: string;
}

export const TableSearch: React.FC<TableSearchProps> = ({
  value,
  onChange,
  onClear,
  isDebouncing = false,
  placeholder = "Search records...",
}) => {
  const theme = useAnyTableTheme();

  return (
    <div className={theme.classes?.searchContainer || "w-full sm:max-w-md relative flex items-center"}>
      {/* Search Icon */}
      <span className="absolute left-3.5 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={
          theme.classes?.searchInput ||
          "w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        }
      />

      {/* Right controls: Spinner or Clear Button */}
      <div className="absolute right-3 flex items-center gap-1.5">
        {isDebouncing && (
          <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title="Clear search"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
