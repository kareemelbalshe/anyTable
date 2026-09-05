import { AnyTableTheme } from "../types/theme.types";
import { DEFAULT_THEME_COLORS, TABLE_PRESETS } from "./presets";

export { DEFAULT_THEME_COLORS, TABLE_PRESETS };

export const defaultAnyTableTheme: AnyTableTheme = {
  mode: "auto",
  colors: DEFAULT_THEME_COLORS,
  borderRadius: "1rem",
  fontFamily: "'Alexandria', system-ui, -apple-system, sans-serif",
  density: "normal",
  classes: {
    container: "w-full flex flex-col gap-4 font-sans text-gray-900 dark:text-gray-100",
    tableWrapper:
      "w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm transition-colors",
    table: "w-full border-collapse text-left text-sm",
    thead: "bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider text-xs",
    th: "py-3.5 px-4 font-bold select-none whitespace-nowrap",
    tbody: "divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900",
    tr: "transition-colors duration-150 hover:bg-gray-50/60 dark:hover:bg-slate-800/40",
    td: "py-3 px-4 text-sm text-gray-700 dark:text-gray-300 align-middle",
    searchContainer: "w-full sm:max-w-md relative flex items-center",
    searchInput:
      "w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all",
    paginationContainer:
      "w-full flex flex-wrap items-center justify-between gap-4 pt-2 text-sm text-gray-600 dark:text-gray-400",
    paginationButton:
      "h-9 min-w-[36px] px-3 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-150 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed",
    paginationButtonActive:
      "bg-primary text-white hover:bg-primary-soft shadow-md shadow-primary/30",
    paginationSelect:
      "h-9 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary cursor-pointer",
  },
};
