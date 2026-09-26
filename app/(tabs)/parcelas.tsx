import { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert, type KeyboardTypeOptions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AppButton, AppInput, ScreenContainer } from "../../components/common";
import { EntityCard, EstadoBadge, EstadoToggle, FormModal, ListHeader } from "../../components/ui";
import { colors } from "../../constants/colors";
import { useParcelas } from "../../hooks/use-parcelas";
import { exportarParcelasCSV, exportarParcelasPDF } from "../../services/parcela-export.service";
import type { Parcela, ParcelaFormValues } from "../../types";
import { validarParcela } from "../../utils/validators";

const FORM_VACIO: ParcelaFormValues = {
  nombre: "", ubicacion: "", areaHectareas: "", tipoSuelo: "", responsable: "",
  estadoRiego: "", produccionEstimada: "", observaciones: "",
};

const CAMPOS: { campo: keyof ParcelaFormValues; label: string; placeholder: string; teclado?: KeyboardTypeOptions; multilinea?: boolean }[] = [
  { campo: "nombre", label: "Nombre *", placeholder: "Ej: Lote A - Valle Norte" },
  { campo: "ubicacion", label: "Ubicación *", placeholder: "Ej: Sector Norte, Km 5" },
  { campo: "areaHectareas", label: "Área (Hectáreas) *", placeholder: "Ej: 2.5", teclado: "numeric" },
  { campo: "tipoSuelo", label: "Tipo de Suelo *", placeholder: "Ej: Franco, Arcilloso" },
  { campo: "responsable", label: "Responsable *", placeholder: "Ej: Juan Pérez" },
  { campo: "estadoRiego", label: "Estado del Riego *", placeholder: "Ej: Goteo, Aspersión" },
  { campo: "produccionEstimada", label: "Producción Estimada *", placeholder: "Ej: 500 kg" },
  { campo: "observaciones", label: "Observaciones", placeholder: "Notas adicionales...", multilinea: true },
];

export default function ParcelasScreen() {
  const { parcelas, cargando, cargar, guardar, eliminar, restaurar } = useParcelas();
  const [verActivos, setVerActivos] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Parcela | null>(null);
  const [form, setForm] = useState<ParcelaFormValues>(FORM_VACIO);

  const parcelasFiltradas = parcelas.filter((p) => p.estado === verActivos);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  async function refrescar() {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }

  function abrirNuevo() {
    setEditando(null);
    setForm(FORM_VACIO);
    setModalVisible(true);
  }

  function abrirEditar(item: Parcela) {
    setEditando(item);
    setForm({
      nombre: item.nombre,
      ubicacion: item.ubicacion,
      areaHectareas: String(item.areaHectareas),
      tipoSuelo: item.tipoSuelo,
      responsable: item.responsable,
      estadoRiego: item.estadoRiego,
      produccionEstimada: item.produccionEstimada,
      observaciones: item.observaciones ?? "",
    });
    setModalVisible(true);
  }

  async function onGuardar() {
    const errorValidacion = validarParcela(form);
    if (errorValidacion) {
      Alert.alert("Revisa los datos", errorValidacion);
      return;
    }
    try {
      await guardar(
        {
          nombre: form.nombre.trim(),
          ubicacion: form.ubicacion.trim(),
          areaHectareas: Number(form.areaHectareas),
          tipoSuelo: form.tipoSuelo.trim(),
          responsable: form.responsable.trim(),
          estadoRiego: form.estadoRiego.trim(),
          produccionEstimada: form.produccionEstimada.trim(),
          observaciones: form.observaciones.trim(),
        },
        editando?.idParcela
      );
      setModalVisible(false);
    } catch {
      Alert.alert("Error", "No se pudo guardar la parcela");
    }
  }

  function onEliminar(item: Parcela) {
    Alert.alert("Eliminar parcela", `¿Eliminar "${item.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive", onPress: async () => {
          try { await eliminar(item.idParcela); } catch { Alert.alert("Error", "No se pudo eliminar"); }
        },
      },
    ]);
  }

  async function onRestaurar(item: Parcela) {
    try { await restaurar(item.idParcela); } catch { Alert.alert("Error", "No se pudo restaurar la parcela"); }
  }

  async function exportar(formato: "pdf" | "excel", soloActivas: boolean) {
    const datos = soloActivas ? parcelas.filter((p) => p.estado) : parcelas;
    try {
      if (formato === "pdf") await exportarParcelasPDF(datos, soloActivas);
      else await exportarParcelasCSV(datos, soloActivas);
    } catch {
      Alert.alert("Error", "No se pudo exportar el reporte");
    }
  }

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.verdeOscuro} />;

  return (
    <ScreenContainer>
      <ListHeader titulo="Gestión de Parcelas" textoBoton="Nueva" onPressBoton={abrirNuevo} />
      <EstadoToggle verActivos={verActivos} onCambiar={setVerActivos} />

      {/* Botones de exportación */}
      <View style={styles.exportRow}>
        <AppButton titulo="PDF" icono="document-text" tamano="sm" variante="peligro" onPress={() => exportar("pdf", true)} />
        <AppButton titulo="Excel" icono="grid" tamano="sm" variante="exito" onPress={() => exportar("excel", true)} />
        <AppButton
          titulo="Todo"
          icono="download"
          tamano="sm"
          variante="pizarra"
          onPress={() =>
            Alert.alert("Exportar todo", "Incluye activas e inactivas", [
              { text: "Cancelar", style: "cancel" },
              { text: "PDF", onPress: () => exportar("pdf", false) },
              { text: "Excel", onPress: () => exportar("excel", false) },
            ])
          }
        />
      </View>

      <FlatList
        data={parcelasFiltradas}
        keyExtractor={(item) => item.idParcela.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} />}
        renderItem={({ item }) => (
          <EntityCard
            activo={item.estado}
            onEditar={() => abrirEditar(item)}
            onEliminar={() => onEliminar(item)}
            onRestaurar={() => onRestaurar(item)}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.nombre}>🏔️ {item.nombre}</Text>
              <EstadoBadge activo={item.estado} textoActivo="Activa" textoInactivo="Inactiva" />
            </View>
            <Text style={styles.ubicacion}>📍 {item.ubicacion}</Text>
            <View style={styles.infoGrid}>
              <Text style={styles.infoItem}>📐 {item.areaHectareas} Ha</Text>
              <Text style={styles.infoItem}>🟤 Suelo: {item.tipoSuelo}</Text>
              <Text style={styles.infoItem}>👤 Responsable: {item.responsable}</Text>
              <Text style={styles.infoItem}>💧 Riego: {item.estadoRiego}</Text>
            </View>
          </EntityCard>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>No hay parcelas {verActivos ? "activas" : "inactivas"}</Text>}
      />

      <FormModal
        visible={modalVisible}
        titulo={editando ? "Editar Parcela" : "Registrar Nueva Parcela"}
        textoGuardar={editando ? "Guardar" : "+ Registrar"}
        onCerrar={() => setModalVisible(false)}
        onGuardar={onGuardar}
      >
        {CAMPOS.map((c) => (
          <AppInput
            key={c.campo}
            label={c.label}
            placeholder={c.placeholder}
            value={form[c.campo]}
            onChangeText={(valor) => setForm((f) => ({ ...f, [c.campo]: valor }))}
            keyboardType={c.teclado}
            multiline={c.multilinea}
          />
        ))}
      </FormModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  exportRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 10 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  nombre: { fontSize: 16, fontWeight: "700", color: colors.texto },
  ubicacion: { fontSize: 13, color: colors.textoSuave, marginBottom: 10 },
  infoGrid: { gap: 4, marginBottom: 12 },
  infoItem: { fontSize: 12.5, color: colors.textoMedio },
  vacio: { textAlign: "center", color: colors.textoTenue, marginTop: 40 },
});
