import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { AppHeader } from "./app-header";

interface ScreenContainerProps {
  children: ReactNode;
  /** Muestra la cabecera con el usuario (por defecto sí). */
  conCabecera?: boolean;
}

/** Contenedor base de las pantallas: fondo, cabecera y área de contenido. */
export function ScreenContainer({ children, conCabecera = true }: ScreenContainerProps) {
  return (
    <View style={styles.container}>
      {conCabecera ? <AppHeader /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
});
