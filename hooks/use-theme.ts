import { useContext } from "react";
import { ThemeContext, type ThemeState } from "../store/theme.store";

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <AppThemeProvider>");
  return ctx;
}
