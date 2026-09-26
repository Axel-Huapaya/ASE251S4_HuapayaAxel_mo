import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

interface StatCardProps {
  icono: keyof typeof Ionicons.glyphMap;
  numero: number;
  titulo: string;
  subtitulo: string;
  colorFondo: string;
  colorIcono: string;
  colorBarra: string;
}

export function StatCard({ icono, numero, titulo, subtitulo, colorFondo, colorIcono, colorBarra }: StatCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: colorBarra }]}>
      <View style={[styles.iconWrap, { backgroundColor: colorFondo }]}>
        <Ionicons name={icono} size={22} color={colorIcono} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.numero}>{numero}</Text>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: "31%", flexGrow: 1, backgroundColor: colors.blanco, borderRadius: 14, padding: 12, borderTopWidth: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  numero: { fontSize: 22, fontWeight: "800", color: colors.texto },
  titulo: { fontSize: 11, fontWeight: "700", color: colors.pizarra, marginTop: 2 },
  subtitulo: { fontSize: 9, color: colors.textoTenue, marginTop: 2, textTransform: "uppercase" },
});
