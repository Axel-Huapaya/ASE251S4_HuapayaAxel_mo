import { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { obtenerUsuario, UsuarioSesion } from "../lib/auth";

const VERDE_OSCURO = "#1B4332";

export default function TopHeader() {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  useFocusEffect(
    useCallback(() => {
      obtenerUsuario().then(setUsuario);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.icono}>
        <Ionicons name="leaf" size={20} color="#fff" />
      </View>
      <View>
        <Text style={styles.nombre}>
          {usuario ? `${usuario.nombre} ${usuario.apellido ?? ""}`.trim().toUpperCase() : "USUARIO"}
        </Text>
        <Text style={styles.rol}>{usuario?.rol ?? "..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  icono: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: VERDE_OSCURO,
    justifyContent: "center",
    alignItems: "center",
  },
  nombre: { fontSize: 13, fontWeight: "800", color: "#0f172a" },
  rol: { fontSize: 11, color: "#64748b" },
});