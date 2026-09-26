import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/use-auth";

/** Cabecera con el usuario y rol de la sesión activa. */
export function AppHeader() {
  const { usuario } = useAuth();
  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido ?? ""}`.trim().toUpperCase() : "USUARIO";

  return (
    <View style={styles.container}>
      <View style={styles.icono}>
        <Ionicons name="leaf" size={20} color={colors.blanco} />
      </View>
      <View>
        <Text style={styles.nombre}>{nombreCompleto}</Text>
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
    backgroundColor: colors.blanco,
  },
  icono: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.verdeOscuro,
    justifyContent: "center",
    alignItems: "center",
  },
  nombre: { fontSize: 13, fontWeight: "800", color: colors.texto },
  rol: { fontSize: 11, color: colors.textoSuave },
});
