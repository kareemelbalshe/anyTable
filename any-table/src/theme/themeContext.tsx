import React, { createContext, useContext, useMemo } from "react";
import { AnyTableTheme } from "../types/theme.types";
import { defaultAnyTableTheme } from "./defaultTheme";

const ThemeContext = createContext<AnyTableTheme>(defaultAnyTableTheme);

export interface AnyTableThemeProviderProps {
  theme?: Partial<AnyTableTheme>;
  children: React.ReactNode;
}

export const AnyTableThemeProvider: React.FC<AnyTableThemeProviderProps> = ({
  theme,
  children,
}) => {
  const mergedTheme = useMemo<AnyTableTheme>(() => {
    if (!theme) return defaultAnyTableTheme;
    return {
      ...defaultAnyTableTheme,
      ...theme,
      colors: {
        ...defaultAnyTableTheme.colors,
        ...(theme.colors || {}),
      },
      classes: {
        ...defaultAnyTableTheme.classes,
        ...(theme.classes || {}),
      },
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAnyTableTheme(): AnyTableTheme {
  return useContext(ThemeContext);
}
