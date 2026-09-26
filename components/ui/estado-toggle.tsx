import { StyleSheet, View } from "react-native";
import { AppButton } from "../common/app-button";

interface EstadoToggleProps {
  verActivos: boolean;
  onCambiar: (verActivos: boolean) => void;
}

/** Alterna entre registros activos e inactivos. */
export function EstadoToggle({ verActivos, onCambiar }: EstadoToggleProps) {
  return (
    <View style={styles.fila}>
      <AppButton titulo="Ver Activos" icono="checkmark" tamano="sm" variante={verActivos ? "primary" : "outline"} onPress={() => onCambiar(true)} />
      <AppButton titulo="Ver Inactivos" icono="refresh" tamano="sm" variante={!verActivos ? "primary" : "outline"} onPress={() => onCambiar(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 12 },
});
