import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { colors } from "../../constants/colors";
import { fontSize, radius } from "../../constants/theme";

interface AppInputProps extends TextInputProps {
  label: string;
  /** "claro" para formularios sobre fondo blanco; "cristal" para el login sobre imagen. */
  variante?: "claro" | "cristal";
}

export function AppInput({ label, variante = "claro", style, ...props }: AppInputProps) {
  const cristal = variante === "cristal";
  return (
    <View style={cristal ? styles.grupoCristal : undefined}>
      <Text style={cristal ? styles.labelCristal : styles.labelClaro}>{label}</Text>
      <TextInput
        placeholderTextColor={cristal ? "rgba(255,255,255,0.4)" : undefined}
        {...props}
        style={[cristal ? styles.inputCristal : styles.inputClaro, props.multiline && { height: 80 }, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grupoCristal: { marginBottom: 18 },
  labelClaro: { fontSize: 13, fontWeight: "600", color: colors.textoMedio, marginBottom: 6, marginTop: 14 },
  inputClaro: {
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.md,
    padding: 12,
    fontSize: fontSize.md,
    backgroundColor: colors.inputFondo,
  },
  labelCristal: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 6 },
  inputCristal: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
    color: colors.blanco,
    fontSize: fontSize.md,
  },
});
