import React from "react";
import { TableSearch } from "./TableSearch";

export interface TableToolbarProps {
  displayTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  isSearchEnabled?: boolean;
  searchQuery?: string;
  setSearch?: (val: string) => void;
  clearSearch?: () => void;
  isDebouncing?: boolean;
  searchPlaceholder?: string;
  headerActions?: React.ReactNode;
  add?: boolean;
  linkAdd?: string;
  addHandler?: () => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  displayTitle,
  subtitle,
  isSearchEnabled,
  searchQuery = "",
  setSearch,
  clearSearch,
  isDebouncing = false,
  searchPlaceholder,
  headerActions,
  add,
  linkAdd,
  addHandler,
}) => {
  const showToolbar = Boolean(
    displayTitle || subtitle || isSearchEnabled || headerActions || add
  );

  if (!showToolbar) return null;

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1">
      {/* Title & Subtitle */}
      {(displayTitle || subtitle) && (
        <div className="flex flex-col">
          {displayTitle && (
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              {displayTitle}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {/* Right Toolbar Controls (Search + Header Actions + Add Button) */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end ml-auto">
        {isSearchEnabled && setSearch && clearSearch && (
          <TableSearch
            value={searchQuery}
            onChange={setSearch}
            onClear={clearSearch}
            isDebouncing={isDebouncing}
            placeholder={searchPlaceholder}
          />
        )}

        {headerActions}

        {/* Legacy Add Button */}
        {add && (
          <button
            type="button"
            onClick={() => {
              if (addHandler) addHandler();
              else if (linkAdd && typeof window !== "undefined") {
                window.location.href = linkAdd;
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-soft transition-all shadow-sm shadow-primary/20 active:scale-95 whitespace-nowrap"
          >
            <span>＋</span>
            <span>Add {displayTitle || "Record"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
