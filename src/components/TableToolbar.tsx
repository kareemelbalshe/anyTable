import React, { useState, useRef, useEffect } from "react";
import { TableSearch } from "./TableSearch";
import { TableMessages, enMessages } from "../i18n";
import { ExportConfig, ExportScope } from "../types/table.types";

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
  onExport?: (format: "csv" | "json", scope?: ExportScope) => void;
  isExporting?: boolean;
  hasSelectedRows?: boolean;
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
  isExporting = false,
  hasSelectedRows = false,
  dir = "ltr",
}: TableToolbarProps) {
  const isRtl = dir === "rtl";
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);

  const hasExport = Boolean(exportable && onExport);
  const allowCsv = typeof exportable === "object" ? exportable.csv !== false : true;
  const allowJson = typeof exportable === "object" ? exportable.json === true : false;
  const showScopeOptions =
    typeof exportable === "object" ? Boolean(exportable.showScopeOptions) : false;
  const hasMultipleExportOptions = (allowCsv && allowJson) || showScopeOptions;

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
                  disabled={isExporting}
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  title={isExporting ? messages.exporting : messages.export}
                >
                  {isExporting ? (
                    <svg
                      className="w-4 h-4 animate-spin text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
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
                  )}
                  <span>{isExporting ? messages.exporting : messages.export}</span>
                  <span className="text-[10px] opacity-70">▼</span>
                </button>

                {showExportMenu && (
                  <div
                    className={`absolute mt-1.5 w-48 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-800 shadow-xl z-30 py-1 overflow-hidden any-table-fade-in ${
                      isRtl ? "left-0" : "right-0"
                    }`}
                  >
                    {allowCsv && (
                      <>
                        <button
                          type="button"
                          disabled={isExporting}
                          onClick={() => {
                            onExport?.("csv", "all");
                            setShowExportMenu(false);
                          }}
                          className="w-full text-left rtl:text-right px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <span className="text-emerald-500 font-bold">📊</span>
                          <span>{showScopeOptions ? messages.exportAll : messages.exportCsv}</span>
                        </button>

                        {showScopeOptions && (
                          <button
                            type="button"
                            disabled={isExporting}
                            onClick={() => {
                              onExport?.("csv", "current-page");
                              setShowExportMenu(false);
                            }}
                            className="w-full text-left rtl:text-right px-3 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer ps-7 disabled:opacity-50"
                          >
                            <span>↳ {messages.exportCurrentPage}</span>
                          </button>
                        )}

                        {showScopeOptions && hasSelectedRows && (
                          <button
                            type="button"
                            disabled={isExporting}
                            onClick={() => {
                              onExport?.("csv", "selected");
                              setShowExportMenu(false);
                            }}
                            className="w-full text-left rtl:text-right px-3 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer ps-7 disabled:opacity-50"
                          >
                            <span>↳ {messages.exportSelected}</span>
                          </button>
                        )}
                      </>
                    )}

                    {allowJson && (
                      <>
                        <button
                          type="button"
                          disabled={isExporting}
                          onClick={() => {
                            onExport?.("json", "all");
                            setShowExportMenu(false);
                          }}
                          className={`w-full text-left rtl:text-right px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                            allowCsv ? "border-t border-gray-100 dark:border-gray-800" : ""
                          }`}
                        >
                          <span className="text-amber-500 font-bold">{"{ }"}</span>
                          <span>{showScopeOptions ? `${messages.exportJson} (${messages.exportAll})` : messages.exportJson}</span>
                        </button>

                        {showScopeOptions && (
                          <button
                            type="button"
                            disabled={isExporting}
                            onClick={() => {
                              onExport?.("json", "current-page");
                              setShowExportMenu(false);
                            }}
                            className="w-full text-left rtl:text-right px-3 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition flex items-center gap-2 cursor-pointer ps-7 disabled:opacity-50"
                          >
                            <span>↳ {messages.exportCurrentPage}</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                disabled={isExporting}
                onClick={() => onExport?.(allowCsv ? "csv" : "json", "all")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                title={isExporting ? messages.exporting : messages.export}
              >
                {isExporting ? (
                  <svg
                    className="w-4 h-4 animate-spin text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
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
                )}
                <span>
                  {isExporting
                    ? messages.exporting
                    : allowCsv
                    ? messages.exportCsv
                    : messages.exportJson}
                </span>
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
