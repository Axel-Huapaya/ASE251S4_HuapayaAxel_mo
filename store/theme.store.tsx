import { createContext, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { colors, type AppColors } from "../constants/colors";

export interface ThemeState {
  /** Esquema del sistema; las pantallas actuales usan la paleta clara. */
  scheme: "light" | "dark";
  isDark: boolean;
  colors: AppColors;
}

export const ThemeContext = createContext<ThemeState | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const sistema = useColorScheme();
  const valor = useMemo<ThemeState>(() => {
    const scheme = sistema === "dark" ? "dark" : "light";
    return { scheme, isDark: scheme === "dark", colors };
  }, [sistema]);

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}
