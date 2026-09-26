import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { AppButton } from "../common/app-button";

interface ListHeaderProps {
  titulo: string;
  textoBoton: string;
  onPressBoton: () => void;
}

/** Título de la pantalla con el botón de alta a la derecha. */
export function ListHeader({ titulo, textoBoton, onPressBoton }: ListHeaderProps) {
  return (
    <View style={styles.fila}>
      <Text style={styles.titulo}>{titulo}</Text>
      <AppButton titulo={textoBoton} icono="add" tamano="sm" onPress={onPressBoton} />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginTop: 8 },
  titulo: { fontSize: 20, fontWeight: "800", color: colors.texto },
});
