import { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity, Switch, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AppInput, ScreenContainer } from "../../components/common";
import { EntityCard, EstadoBadge, EstadoToggle, FormModal, ListHeader } from "../../components/ui";
import { colors } from "../../constants/colors";
import { useCultivos } from "../../hooks/use-cultivos";
import { useParcelas } from "../../hooks/use-parcelas";
import type { Cultivo, CultivoFormValues } from "../../types";
import { validarCultivo } from "../../utils/validators";

const FORM_VACIO: CultivoFormValues = {
  parcelaId: null, nombre: "", tipoCultivo: "", frecuenciaRiegoDias: "",
  temperaturaIdeal: "", requiereSombra: false, observaciones: "",
};

export default function CultivosScreen() {
  const { cultivos, cargando, cargar, guardar, eliminar, restaurar } = useCultivos();
  const { parcelas, cargar: cargarParcelas } = useParcelas();
  const [verActivos, setVerActivos] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Cultivo | null>(null);
  const [form, setForm] = useState<CultivoFormValues>(FORM_VACIO);

  const cultivosFiltrados = cultivos.filter((c) => c.estado === verActivos);
  const campo = <K extends keyof CultivoFormValues>(k: K, valor: CultivoFormValues[K]) => setForm((f) => ({ ...f, [k]: valor }));

  const cargarTodo = useCallback(() => Promise.all([cargar(), cargarParcelas()]), [cargar, cargarParcelas]);

  useFocusEffect(useCallback(() => { cargarTodo(); }, [cargarTodo]));

  async function refrescar() {
    setRefrescando(true);
    await cargarTodo();
    setRefrescando(false);
  }

  function abrirNuevo() {
    setEditando(null);
    setForm({ ...FORM_VACIO, parcelaId: parcelas[0]?.idParcela ?? null });
    setModalVisible(true);
  }

  function abrirEditar(item: Cultivo) {
    setEditando(item);
    setForm({
      parcelaId: item.parcela?.idParcela ?? null,
      nombre: item.nombre,
      tipoCultivo: item.tipoCultivo,
      frecuenciaRiegoDias: String(item.frecuenciaRiegoDias),
      temperaturaIdeal: String(item.temperaturaIdeal),
      requiereSombra: item.requiereSombra,
      observaciones: item.observaciones ?? "",
    });
    setModalVisible(true);
  }

  async function onGuardar() {
    const errorValidacion = validarCultivo(form);
    if (errorValidacion || form.parcelaId === null) {
      Alert.alert("Revisa los datos", errorValidacion ?? "Completa todos los campos obligatorios (*)");
      return;
    }
    try {
      await guardar(
        {
          parcela: { idParcela: form.parcelaId },
          nombre: form.nombre.trim(),
          tipoCultivo: form.tipoCultivo.trim(),
          frecuenciaRiegoDias: Number(form.frecuenciaRiegoDias),
          temperaturaIdeal: Number(form.temperaturaIdeal),
          requiereSombra: form.requiereSombra,
          observaciones: form.observaciones.trim(),
        },
        editando?.idCultivo
      );
      setModalVisible(false);
    } catch {
      Alert.alert("Error", "No se pudo guardar el cultivo");
    }
  }

  function onEliminar(item: Cultivo) {
    Alert.alert("Eliminar cultivo", `¿Eliminar "${item.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive", onPress: async () => {
          try { await eliminar(item.idCultivo); } catch { Alert.alert("Error", "No se pudo eliminar"); }
        },
      },
    ]);
  }

  async function onRestaurar(item: Cultivo) {
    try { await restaurar(item.idCultivo); } catch { Alert.alert("Error", "No se pudo restaurar el cultivo"); }
  }

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.verdeOscuro} />;

  return (
    <ScreenContainer>
      <ListHeader titulo="Gestión de Cultivos" textoBoton="Nuevo" onPressBoton={abrirNuevo} />
      <EstadoToggle verActivos={verActivos} onCambiar={setVerActivos} />

      <FlatList
        data={cultivosFiltrados}
        keyExtractor={(item) => item.idCultivo.toString()}
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
              <View style={styles.tipoBadge}><Text style={styles.tipoBadgeTexto}>{item.tipoCultivo?.toUpperCase()}</Text></View>
              <EstadoBadge activo={item.estado} />
            </View>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.parcela}>🏠 {item.parcela?.nombre}</Text>
            <View style={styles.infoGrid}>
              <Text style={styles.infoItem}>💧 Riego cada {item.frecuenciaRiegoDias} días</Text>
              <Text style={styles.infoItem}>🌡️ {item.temperaturaIdeal}°C</Text>
              <Text style={styles.infoItem}>☀️ Sombra: {item.requiereSombra ? "Sí" : "No"}</Text>
              {item.observaciones ? <Text style={styles.infoItem}>📝 {item.observaciones}</Text> : null}
            </View>
          </EntityCard>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>No hay cultivos {verActivos ? "activos" : "inactivos"}</Text>}
      />

      <FormModal
        visible={modalVisible}
        titulo={editando ? "Editar Cultivo" : "Registrar Nuevo Cultivo"}
        textoGuardar={editando ? "Guardar" : "+ Registrar"}
        onCerrar={() => setModalVisible(false)}
        onGuardar={onGuardar}
      >
        <Text style={styles.label}>Parcela Asociada *</Text>
        <View style={styles.selectBox}>
          {parcelas.map((p) => (
            <TouchableOpacity
              key={p.idParcela}
              style={[styles.chip, form.parcelaId === p.idParcela && styles.chipActivo]}
              onPress={() => campo("parcelaId", p.idParcela)}
            >
              <Text style={{ color: form.parcelaId === p.idParcela ? colors.blanco : colors.textoMedio }}>{p.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <AppInput label="Nombre del Cultivo *" placeholder="Ej: Maíz Híbrido 2026" value={form.nombre} onChangeText={(v) => campo("nombre", v)} />
        <AppInput label="Tipo de Cultivo *" placeholder="Ej: Maíz, Trigo, Tomate" value={form.tipoCultivo} onChangeText={(v) => campo("tipoCultivo", v)} />
        <AppInput label="Frecuencia de Riego (días) *" placeholder="Ej: 7" keyboardType="numeric" value={form.frecuenciaRiegoDias} onChangeText={(v) => campo("frecuenciaRiegoDias", v)} />
        <AppInput label="Temperatura Ideal (°C) *" placeholder="Ej: 25.5" keyboardType="numeric" value={form.temperaturaIdeal} onChangeText={(v) => campo("temperaturaIdeal", v)} />
        <View style={styles.switchRow}>
          <Text style={styles.labelSwitch}>Requiere sombra</Text>
          <Switch value={form.requiereSombra} onValueChange={(v) => campo("requiereSombra", v)} trackColor={{ true: colors.verdeOscuro }} />
        </View>
        <AppInput label="Observaciones" placeholder="Notas adicionales..." multiline value={form.observaciones} onChangeText={(v) => campo("observaciones", v)} />
      </FormModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  tipoBadge: { backgroundColor: colors.verdeOscuro, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  tipoBadgeTexto: { color: colors.blanco, fontSize: 10, fontWeight: "700" },
  nombre: { fontSize: 17, fontWeight: "700", color: colors.texto, marginBottom: 2 },
  parcela: { fontSize: 13, color: colors.textoSuave, marginBottom: 10 },
  infoGrid: { gap: 4, marginBottom: 12 },
  infoItem: { fontSize: 12.5, color: colors.textoMedio },
  vacio: { textAlign: "center", color: colors.textoTenue, marginTop: 40 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textoMedio, marginBottom: 6, marginTop: 14 },
  labelSwitch: { fontSize: 13, fontWeight: "600", color: colors.textoMedio },
  selectBox: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.borde, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipActivo: { backgroundColor: colors.verdeOscuro, borderColor: colors.verdeOscuro },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
});
