import type { ReactNode } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius } from "../../constants/theme";
import { AppButton } from "../common/app-button";

interface FormModalProps {
  visible: boolean;
  titulo: string;
  textoGuardar: string;
  onCerrar: () => void;
  onGuardar: () => void;
  children: ReactNode;
}

/** Ventana modal deslizable para los formularios de alta y edición. */
export function FormModal({ visible, titulo, textoGuardar, onCerrar, onGuardar, children }: FormModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCerrar}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.titulo}>{titulo}</Text>
          </View>
          <ScrollView style={{ padding: 20 }}>{children}</ScrollView>
          <View style={styles.footer}>
            <AppButton titulo="Cancelar" variante="neutral" style={styles.boton} onPress={onCerrar} />
            <AppButton titulo={textoGuardar} style={styles.boton} onPress={onGuardar} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  card: { backgroundColor: colors.blanco, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, maxHeight: "88%" },
  header: { backgroundColor: colors.verdeOscuro, padding: 20, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet },
  titulo: { color: colors.blanco, fontSize: 18, fontWeight: "700" },
  footer: { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: colors.separador },
  boton: { flex: 1 },
});
