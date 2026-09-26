import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { fontSize, radius } from "../../constants/theme";

type Variante =
  | "primary" | "lima" | "neutral" | "outline"
  | "info-suave" | "peligro-suave" | "exito-suave"
  | "peligro" | "exito" | "pizarra";
type Tamano = "sm" | "md" | "lg";

const ESTILOS: Record<Variante, { fondo: string; texto: string; borde?: string }> = {
  primary: { fondo: colors.verdeOscuro, texto: colors.blanco },
  lima: { fondo: colors.lima, texto: colors.verdeLogin },
  neutral: { fondo: colors.separador, texto: colors.textoMedio },
  outline: { fondo: "transparent", texto: colors.textoMedio, borde: colors.borde },
  "info-suave": { fondo: colors.infoFondo, texto: colors.info },
  "peligro-suave": { fondo: colors.peligroFondo, texto: colors.peligro },
  "exito-suave": { fondo: colors.exitoFondo, texto: colors.exito },
  peligro: { fondo: colors.peligro, texto: colors.blanco },
  exito: { fondo: colors.exito, texto: colors.blanco },
  pizarra: { fondo: colors.pizarra, texto: colors.blanco },
};

const TAMANOS: Record<Tamano, { vertical: number; horizontal: number; radio: number; fuente: number; icono: number }> = {
  sm: { vertical: 8, horizontal: 12, radio: radius.md, fuente: fontSize.sm, icono: 14 },
  md: { vertical: 12, horizontal: 16, radio: radius.md, fuente: fontSize.md, icono: 16 },
  lg: { vertical: 15, horizontal: 16, radio: radius.lg, fuente: 15, icono: 18 },
};

interface AppButtonProps {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  tamano?: Tamano;
  icono?: keyof typeof Ionicons.glyphMap;
  cargando?: boolean;
  deshabilitado?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  titulo, onPress, variante = "primary", tamano = "md", icono, cargando = false, deshabilitado = false, style,
}: AppButtonProps) {
  const est = ESTILOS[variante];
  const tam = TAMANOS[tamano];
  const inactivo = deshabilitado || cargando;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={inactivo}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: est.fondo,
          borderColor: est.borde ?? "transparent",
          borderWidth: est.borde ? 1 : 0,
          paddingVertical: tam.vertical,
          paddingHorizontal: tam.horizontal,
          borderRadius: tam.radio,
          opacity: deshabilitado ? 0.5 : 1,
        },
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={est.texto} />
      ) : (
        <>
          {icono ? <Ionicons name={icono} size={tam.icono} color={est.texto} /> : null}
          <Text style={{ color: est.texto, fontWeight: "600", fontSize: tam.fuente }}>{titulo}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
});
