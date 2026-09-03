import { AnyTableTheme, ThemeColors } from "../types/theme.types";

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: "#2667EC",
  primaryHover: "#1E54C6",
  primaryLight: "#397FF6",
  secondary: "#39E965",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  scaffold: "#0F172A",
  card: "#1E293B",
  cardSecondary: "#334155",
  border: "#334155",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  inputBg: "#1E293B",
  rowHover: "rgba(38, 103, 236, 0.04)",
  rowSelected: "rgba(38, 103, 236, 0.08)",
};

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

export const TABLE_PRESETS: Record<string, Partial<AnyTableTheme>> = {
  default: {
    colors: DEFAULT_THEME_COLORS,
    borderRadius: "1rem",
    density: "normal",
  },
  midnight: {
    mode: "dark",
    colors: {
      primary: "#6366F1",
      primaryHover: "#4F46E5",
      primaryLight: "#818CF8",
      card: "#090D16",
      cardSecondary: "#111827",
      border: "#1E293B",
      textPrimary: "#F8FAFC",
      textSecondary: "#94A3B8",
      rowHover: "rgba(99, 102, 241, 0.08)",
      rowSelected: "rgba(99, 102, 241, 0.16)",
      theadBg: "#0F172A",
      theadText: "#C7D2FE",
    },
    borderRadius: "1.25rem",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-2xl border border-indigo-950/70 bg-[#090D16] shadow-2xl shadow-indigo-950/30",
      thead: "bg-[#0F172A]/90 backdrop-blur-md border-b border-indigo-950/80 text-indigo-200 font-bold uppercase text-xs tracking-wider",
      searchInput: "w-full pl-10 pr-10 py-2.5 rounded-xl border border-indigo-900/50 bg-[#111827] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500",
      paginationButtonActive: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30",
    },
  },
  emerald: {
    colors: {
      primary: "#10B981",
      primaryHover: "#059669",
      primaryLight: "#34D399",
      border: "#10B98125",
      rowHover: "rgba(16, 185, 129, 0.06)",
      rowSelected: "rgba(16, 185, 129, 0.12)",
      theadBg: "rgba(16, 185, 129, 0.08)",
      theadText: "#065F46",
    },
    borderRadius: "1rem",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-2xl border border-emerald-500/20 bg-white dark:bg-slate-900 shadow-lg shadow-emerald-500/5",
      thead: "bg-emerald-500/10 dark:bg-emerald-950/30 border-b border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold uppercase text-xs",
      searchInput: "w-full pl-10 pr-10 py-2.5 rounded-xl border border-emerald-500/30 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-emerald-500/40 focus:border-emerald-500",
      paginationButtonActive: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30",
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
      theadBg: "rgba(14, 165, 233, 0.08)",
      theadText: "#0369A1",
    },
    borderRadius: "1rem",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-2xl border border-sky-500/20 bg-white dark:bg-slate-900 shadow-lg shadow-sky-500/5",
      thead: "bg-sky-500/10 dark:bg-sky-950/30 border-b border-sky-500/20 text-sky-800 dark:text-sky-300 font-bold uppercase text-xs",
      searchInput: "w-full pl-10 pr-10 py-2.5 rounded-xl border border-sky-500/30 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-sky-500/40 focus:border-sky-500",
      paginationButtonActive: "bg-sky-500 text-white shadow-md shadow-sky-500/30",
    },
  },
  luxury: {
    colors: {
      primary: "#D97706",
      primaryHover: "#B45309",
      primaryLight: "#F59E0B",
      rowHover: "rgba(245, 158, 11, 0.06)",
      rowSelected: "rgba(245, 158, 11, 0.14)",
      theadBg: "rgba(245, 158, 11, 0.08)",
      theadText: "#78350F",
    },
    borderRadius: "1.25rem",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-3xl border border-amber-500/30 bg-white dark:bg-[#120F0B] shadow-2xl shadow-amber-500/10",
      thead: "bg-amber-500/10 dark:bg-amber-950/30 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase text-xs tracking-wider",
      searchInput: "w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-500/30 bg-white dark:bg-[#1A1612] text-gray-900 dark:text-amber-100 focus:ring-amber-500/40 focus:border-amber-500",
      paginationButtonActive: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/30 font-black",
    },
  },
  crimson: {
    colors: {
      primary: "#F43F5E",
      primaryHover: "#E11D48",
      primaryLight: "#FB7185",
      rowHover: "rgba(244, 63, 94, 0.06)",
      rowSelected: "rgba(244, 63, 94, 0.12)",
      theadBg: "rgba(244, 63, 94, 0.08)",
      theadText: "#881337",
    },
    borderRadius: "1rem",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-2xl border border-rose-500/20 bg-white dark:bg-slate-900 shadow-lg shadow-rose-500/5",
      thead: "bg-rose-500/10 dark:bg-rose-950/30 border-b border-rose-500/20 text-rose-800 dark:text-rose-300 font-bold uppercase text-xs",
      searchInput: "w-full pl-10 pr-10 py-2.5 rounded-xl border border-rose-500/30 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-rose-500/40 focus:border-rose-500",
      paginationButtonActive: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
    },
  },
  minimal: {
    borderRadius: "0.5rem",
    density: "spacious",
    classes: {
      tableWrapper: "w-full overflow-x-auto rounded-lg border-0 bg-transparent shadow-none",
      thead: "bg-transparent border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-semibold text-xs tracking-wider",
      tbody: "divide-y divide-gray-100 dark:divide-gray-800/40 bg-transparent",
      tr: "hover:bg-gray-500/5 transition-colors",
      searchInput: "w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:border-gray-400",
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
      tableWrapper: "w-full overflow-x-auto rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-sm",
      thead: "bg-gray-100 dark:bg-slate-800 border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs",
      searchInput: "w-full pl-9 pr-8 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-xs",
      paginationButtonActive: "bg-blue-800 text-white",
    },
  },
};
