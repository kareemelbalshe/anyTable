import { AnyTableTheme, TablePreset } from "../types/theme.types";
import { DEFAULT_THEME_COLORS } from "./defaultTheme";

export const TABLE_PRESETS: Record<TablePreset, Partial<AnyTableTheme>> = {
  default: {
    colors: DEFAULT_THEME_COLORS,
    borderRadius: "1rem",
    density: "normal",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm transition-colors",
      thead:
        "bg-gray-50/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wider",
      tbody: "divide-y divide-gray-100 dark:divide-gray-800/60 bg-white dark:bg-slate-900",
      tr: "transition-colors duration-150 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
      searchInput:
        "w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all",
      paginationButtonActive:
        "bg-primary text-white hover:bg-primary-soft shadow-md shadow-primary/30 font-bold",
    },
  },
  midnight: {
    colors: {
      primary: "#6366F1",
      primaryHover: "#4F46E5",
      primaryLight: "#818CF8",
      rowHover: "rgba(99, 102, 241, 0.08)",
      rowSelected: "rgba(99, 102, 241, 0.16)",
    },
    borderRadius: "1.25rem",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-white dark:bg-[#090d1a] shadow-xl shadow-indigo-500/5 dark:shadow-indigo-950/40 transition-colors",
      thead:
        "bg-indigo-50/90 dark:bg-[#0f172a] backdrop-blur-md border-b border-indigo-200 dark:border-indigo-900/80 text-indigo-900 dark:text-indigo-200 font-bold uppercase text-xs tracking-wider",
      tbody: "divide-y divide-indigo-100 dark:divide-indigo-950/60 bg-white dark:bg-[#090d1a]",
      tr: "transition-colors duration-150 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30",
      searchInput:
        "w-full pl-10 pr-10 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-[#111728] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all",
      paginationButtonActive: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold",
    },
  },
  emerald: {
    colors: {
      primary: "#10B981",
      primaryHover: "#059669",
      primaryLight: "#34D399",
      rowHover: "rgba(16, 185, 129, 0.06)",
      rowSelected: "rgba(16, 185, 129, 0.12)",
    },
    borderRadius: "1rem",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-2xl border border-emerald-300/60 dark:border-emerald-900/60 bg-white dark:bg-[#06140e] shadow-lg shadow-emerald-500/5 dark:shadow-emerald-950/30 transition-colors",
      thead:
        "bg-emerald-50/90 dark:bg-emerald-950/60 backdrop-blur-md border-b border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold uppercase text-xs tracking-wider",
      tbody: "divide-y divide-emerald-100 dark:divide-emerald-950/60 bg-white dark:bg-[#06140e]",
      tr: "transition-colors duration-150 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30",
      searchInput:
        "w-full pl-10 pr-10 py-2.5 rounded-xl border border-emerald-300/60 dark:border-emerald-800/60 bg-white dark:bg-[#0c1c14] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all",
      paginationButtonActive: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold",
    },
  },
  ocean: {
    colors: {
      primary: "#0EA5E9",
      primaryHover: "#0284C7",
      primaryLight: "#38BDF8",
      secondary: "#06B6D4",
      rowHover: "rgba(14, 165, 233, 0.06)",
      rowSelected: "rgba(14, 165, 233, 0.12)",
    },
    borderRadius: "1rem",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-2xl border border-sky-300/60 dark:border-sky-900/60 bg-white dark:bg-[#07131d] shadow-lg shadow-sky-500/5 dark:shadow-sky-950/30 transition-colors",
      thead:
        "bg-sky-50/90 dark:bg-sky-950/60 backdrop-blur-md border-b border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200 font-bold uppercase text-xs tracking-wider",
      tbody: "divide-y divide-sky-100 dark:divide-sky-950/60 bg-white dark:bg-[#07131d]",
      tr: "transition-colors duration-150 hover:bg-sky-50/70 dark:hover:bg-sky-950/30",
      searchInput:
        "w-full pl-10 pr-10 py-2.5 rounded-xl border border-sky-300/60 dark:border-sky-800/60 bg-white dark:bg-[#0d1d2b] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-sky-300/40 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all",
      paginationButtonActive: "bg-sky-500 text-white shadow-md shadow-sky-500/30 font-bold",
    },
  },
  luxury: {
    colors: {
      primary: "#D97706",
      primaryHover: "#B45309",
      primaryLight: "#F59E0B",
      rowHover: "rgba(245, 158, 11, 0.06)",
      rowSelected: "rgba(245, 158, 11, 0.14)",
    },
    borderRadius: "1.25rem",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-3xl border border-amber-300/80 dark:border-amber-700/60 bg-white dark:bg-[#14100a] shadow-xl shadow-amber-500/10 transition-colors",
      thead:
        "bg-amber-50/95 dark:bg-amber-950/80 backdrop-blur-md border-b border-amber-300/80 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 font-black uppercase text-xs tracking-wider",
      tbody: "divide-y divide-amber-100 dark:divide-amber-950/60 bg-white dark:bg-[#14100a]",
      tr: "transition-colors duration-150 hover:bg-amber-50/80 dark:hover:bg-amber-950/40",
      searchInput:
        "w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-white dark:bg-[#1c160e] text-gray-900 dark:text-amber-100 placeholder:text-gray-400 dark:placeholder:text-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all",
      paginationButtonActive:
        "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/30 font-black",
    },
  },
  crimson: {
    colors: {
      primary: "#F43F5E",
      primaryHover: "#E11D48",
      primaryLight: "#FB7185",
      rowHover: "rgba(244, 63, 94, 0.06)",
      rowSelected: "rgba(244, 63, 94, 0.12)",
    },
    borderRadius: "1rem",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-2xl border border-rose-300/60 dark:border-rose-900/60 bg-white dark:bg-[#15070c] shadow-lg shadow-rose-500/5 dark:shadow-rose-950/30 transition-colors",
      thead:
        "bg-rose-50/90 dark:bg-rose-950/60 backdrop-blur-md border-b border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 font-bold uppercase text-xs tracking-wider",
      tbody: "divide-y divide-rose-100 dark:divide-rose-950/60 bg-white dark:bg-[#15070c]",
      tr: "transition-colors duration-150 hover:bg-rose-50/70 dark:hover:bg-rose-950/30",
      searchInput:
        "w-full pl-10 pr-10 py-2.5 rounded-xl border border-rose-300/60 dark:border-rose-800/60 bg-white dark:bg-[#1f0b13] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-rose-300/40 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all",
      paginationButtonActive: "bg-rose-500 text-white shadow-md shadow-rose-500/30 font-bold",
    },
  },
  minimal: {
    borderRadius: "0.5rem",
    density: "spacious",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-lg border-0 bg-transparent shadow-none",
      thead:
        "bg-transparent border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wider",
      tbody: "divide-y divide-gray-100 dark:divide-gray-800/40 bg-transparent",
      tr: "hover:bg-gray-500/5 transition-colors",
      searchInput:
        "w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:border-gray-400",
      paginationButtonActive: "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold",
    },
  },
  corporate: {
    colors: {
      primary: "#1E40AF",
      primaryHover: "#1E3A8A",
      primaryLight: "#3B82F6",
    },
    borderRadius: "0.375rem",
    density: "compact",
    classes: {
      tableWrapper:
        "w-full overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-colors",
      thead:
        "bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold uppercase text-xs tracking-wider",
      tbody: "divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900",
      tr: "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60",
      searchInput:
        "w-full pl-9 pr-8 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs",
      paginationButtonActive: "bg-blue-800 text-white font-bold",
    },
  },
};
