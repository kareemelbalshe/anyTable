export type ThemeMode = "light" | "dark" | "system" | "auto";

export type TablePreset =
  | "default"
  | "midnight"
  | "emerald"
  | "ocean"
  | "luxury"
  | "crimson"
  | "minimal"
  | "corporate";

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
  theadBg?: string;
  theadText?: string;
  rowStripe?: string;
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
  preset?: TablePreset;
  colors?: Partial<ThemeColors>;
  classes?: AnyTableThemeClasses;
  borderRadius?: string;
  borderWidth?: string;
  fontFamily?: string;
  density?: "compact" | "normal" | "spacious";
}
