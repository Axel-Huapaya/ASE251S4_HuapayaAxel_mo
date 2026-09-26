import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

interface ModuleCardProps {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descripcion: string;
  colorFondo: string;
  colorIcono: string;
  onPress: () => void;
}

export function ModuleCard({ icono, titulo, descripcion, colorFondo, colorIcono, onPress }: ModuleCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.header, { backgroundColor: colorFondo }]}>
        <Ionicons name={icono} size={32} color={colorIcono} />
      </View>
      <View style={styles.body}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: "47%", flexGrow: 1, backgroundColor: colors.blanco, borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  header: { paddingVertical: 24, alignItems: "center", justifyContent: "center" },
  body: { padding: 12 },
  titulo: { fontSize: 13.5, fontWeight: "700", color: colors.texto, marginBottom: 4 },
  descripcion: { fontSize: 11, color: colors.textoSuave, lineHeight: 15 },
});
