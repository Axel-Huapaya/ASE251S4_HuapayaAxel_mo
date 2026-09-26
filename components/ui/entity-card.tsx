import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { AppButton } from "../common/app-button";

interface EntityCardProps {
  children: ReactNode;
  activo: boolean;
  onEditar: () => void;
  onEliminar: () => void;
  onRestaurar: () => void;
}

/** Tarjeta de un registro con sus acciones: editar/eliminar si está activo, restaurar si no. */
export function EntityCard({ children, activo, onEditar, onEliminar, onRestaurar }: EntityCardProps) {
  return (
    <View style={styles.card}>
      {children}
      <View style={styles.acciones}>
        {activo ? (
          <>
            <AppButton titulo="Editar" icono="pencil" tamano="sm" variante="info-suave" style={styles.accion} onPress={onEditar} />
            <AppButton titulo="Eliminar" icono="trash" tamano="sm" variante="peligro-suave" style={styles.accion} onPress={onEliminar} />
          </>
        ) : (
          <AppButton titulo="Restaurar" icono="refresh" tamano="sm" variante="exito-suave" style={styles.accion} onPress={onRestaurar} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.blanco, borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  acciones: { flexDirection: "row", gap: 10, borderTopWidth: 1, borderTopColor: colors.separador, paddingTop: 10 },
  accion: { flex: 1 },
});
