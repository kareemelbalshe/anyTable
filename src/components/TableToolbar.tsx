import React, { useState, useRef, useEffect } from "react";
import { TableSearch } from "./TableSearch";
import { TableMessages, enMessages } from "../i18n";
import { ExportConfig } from "../types/table.types";

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
  messages?: TableMessages;
  exportable?: boolean | ExportConfig;
  onExport?: (format: "csv" | "json") => void;
  dir?: "ltr" | "rtl" | "auto";
}

export function TableToolbar({
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
  messages = enMessages,
  exportable = false,
  onExport,
  dir = "ltr",
}: TableToolbarProps) {
  const isRtl = dir === "rtl";
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);

  const hasExport = Boolean(exportable && onExport);
  const allowCsv = typeof exportable === "object" ? exportable.csv !== false : true;
  const allowJson = typeof exportable === "object" ? exportable.json === true : false;
  const hasMultipleExportOptions = allowCsv && allowJson;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setShowExportMenu(false);
      }
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  const showToolbar = Boolean(
    displayTitle ||
      subtitle ||
      isSearchEnabled ||
      headerActions ||
      add ||
      hasExport
  );

  if (!showToolbar) return null;

  return (
    <div
      dir={dir}
      className={`w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1 ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      {/* Title & Subtitle */}
      {(displayTitle || subtitle) && (
        <div className="flex flex-col">
          {displayTitle && (
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              {displayTitle}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Toolbar Controls (Search + Export + Header Actions + Add Button) */}
      <div
        className={`flex flex-wrap items-center gap-3 w-full sm:w-auto ${
          isRtl ? "justify-start sm:justify-start mr-auto" : "justify-start sm:justify-end ml-auto"
        }`}
      >
        {isSearchEnabled && setSearch && clearSearch && (
          <TableSearch
            value={searchQuery}
            onChange={setSearch}
            onClear={clearSearch}
            isDebouncing={isDebouncing}
            placeholder={searchPlaceholder || messages.searchPlaceholder}
          />
        )}

        {/* Built-in Export Button */}
        {hasExport && (
          <div className="relative inline-block" ref={exportMenuRef}>
            {hasMultipleExportOptions ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm active:scale-95 cursor-pointer"
                  title={messages.export}
                >
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>{messages.export}</span>
                  <span className="text-[10px] opacity-70">▼</span>
                </button>

                {showExportMenu && (
                  <div
                    className={`absolute mt-1.5 w-36 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-800 shadow-xl z-30 py-1 overflow-hidden any-table-fade-in ${
                      isRtl ? "left-0" : "right-0"
                    }`}
                  >
                    {allowCsv && (
                      <button
                        type="button"
                        onClick={() => {
                          onExport?.("csv");
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-emerald-500 font-bold">📊</span>
                        <span>{messages.exportCsv}</span>
                      </button>
                    )}
                    {allowJson && (
                      <button
                        type="button"
                        onClick={() => {
                          onExport?.("json");
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-amber-500 font-bold">{"{ }"}</span>
                        <span>{messages.exportJson}</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => onExport?.(allowCsv ? "csv" : "json")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm active:scale-95 cursor-pointer"
                title={messages.export}
              >
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>{messages.exportCsv}</span>
              </button>
            )}
          </div>
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-soft transition-all shadow-sm shadow-primary/20 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>＋</span>
            <span>
              {messages.addRecord} {displayTitle || ""}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
