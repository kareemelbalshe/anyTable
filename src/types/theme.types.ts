export type ThemeMode = "light" | "dark" | "system" | "auto";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  scaffold: string;
  card: string;
  cardSecondary: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  rowHover: string;
  rowSelected: string;
}

export interface AnyTableThemeClasses {
  container?: string;
  tableWrapper?: string;
  table?: string;
  thead?: string;
  th?: string;
  tbody?: string;
  tr?: string;
  td?: string;
  searchContainer?: string;
  searchInput?: string;
  paginationContainer?: string;
  paginationButton?: string;
  paginationButtonActive?: string;
  paginationSelect?: string;
  actionButton?: string;
  switchTrack?: string;
  switchThumb?: string;
  skeleton?: string;
  emptyState?: string;
  errorState?: string;
}

export interface AnyTableTheme {
  mode?: ThemeMode;
  colors?: Partial<ThemeColors>;
  classes?: AnyTableThemeClasses;
  borderRadius?: string;
  fontFamily?: string;
  density?: "compact" | "normal" | "spacious";
}
