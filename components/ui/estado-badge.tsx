import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

interface EstadoBadgeProps {
  activo: boolean;
  textoActivo?: string;
  textoInactivo?: string;
}

export function EstadoBadge({ activo, textoActivo = "Activo", textoInactivo = "Inactivo" }: EstadoBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: activo ? colors.exitoBadge : colors.peligroBadge }]}>
      <Text style={{ color: activo ? colors.exito : colors.peligro, fontSize: 11, fontWeight: "700" }}>
        {activo ? textoActivo : textoInactivo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
});
