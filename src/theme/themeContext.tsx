import React, { createContext, useContext, useMemo } from "react";
import { AnyTableTheme, TablePreset } from "../types/theme.types";
import { defaultAnyTableTheme } from "./defaultTheme";
import { TABLE_PRESETS } from "./presets";

const ThemeContext = createContext<AnyTableTheme>(defaultAnyTableTheme);

export interface AnyTableThemeProviderProps {
  theme?: Partial<AnyTableTheme>;
  preset?: TablePreset;
  children: React.ReactNode;
}

export const AnyTableThemeProvider: React.FC<AnyTableThemeProviderProps> = ({
  theme,
  preset,
  children,
}) => {
  const parentTheme = useContext(ThemeContext);

  const mergedTheme = useMemo<AnyTableTheme>(() => {
    const base = parentTheme || defaultAnyTableTheme;
    const presetTheme = preset && TABLE_PRESETS[preset] ? TABLE_PRESETS[preset] : {};

    return {
      ...base,
      ...presetTheme,
      ...(theme || {}),
      colors: {
        ...base.colors,
        ...(presetTheme.colors || {}),
        ...(theme?.colors || {}),
      },
      classes: {
        ...base.classes,
        ...(presetTheme.classes || {}),
        ...(theme?.classes || {}),
      },
    };
  }, [parentTheme, preset, theme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAnyTableTheme(): AnyTableTheme {
  return useContext(ThemeContext);
}
