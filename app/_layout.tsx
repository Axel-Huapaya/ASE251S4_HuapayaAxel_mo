import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useTheme } from "../hooks/use-theme";
import { AuthProvider } from "../store/auth.store";
import { AppThemeProvider } from "../store/theme.store";

export const unstable_settings = {
  anchor: "login",
};

function NavegacionRaiz() {
  const { isDark } = useTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <NavegacionRaiz />
      </AuthProvider>
    </AppThemeProvider>
  );
}
