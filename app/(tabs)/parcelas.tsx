import { useState, useCallback } from "react";
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl,
  TouchableOpacity, Modal, TextInput, ScrollView, Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import TopHeader from "../../components/TopHeader";

const BASE_URL = "http://192.168.70.106";
const VERDE_OSCURO = "#1B4332";

interface Parcela {
  idParcela: number;
  nombre: string;
  ubicacion: string;
  areaHectareas: number;
  tipoSuelo: string;
  responsable: string;
  estadoRiego: string;
  produccionEstimada: string;
  observaciones?: string;
  enUso: boolean;
  estado: boolean;
}

export default function ParcelasScreen() {
  const [todasLasParcelas, setTodasLasParcelas] = useState<Parcela[]>([]);
  const [verActivos, setVerActivos] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Parcela | null>(null);

  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [areaHectareas, setAreaHectareas] = useState("");
  const [tipoSuelo, setTipoSuelo] = useState("");
  const [responsable, setResponsable] = useState("");
  const [estadoRiego, setEstadoRiego] = useState("");
  const [produccionEstimada, setProduccionEstimada] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const parcelasFiltradas = todasLasParcelas.filter((p) => p.estado === verActivos);

  async function cargarDatos() {
    try {
      const resp = await fetch(`${BASE_URL}/api/parcelas`);
      setTodasLasParcelas(await resp.json());
    } catch (error) {
      console.error("Error al cargar parcelas:", error);
    } finally {
      setCargando(false);
    }
  }

  useFocusEffect(useCallback(() => { cargarDatos(); }, []));

  function abrirNuevo() {
    setEditando(null);
    setNombre(""); setUbicacion(""); setAreaHectareas(""); setTipoSuelo("");
    setResponsable(""); setEstadoRiego(""); setProduccionEstimada(""); setObservaciones("");
    setModalVisible(true);
  }

  function abrirEditar(item: Parcela) {
    setEditando(item);
    setNombre(item.nombre);
    setUbicacion(item.ubicacion);
    setAreaHectareas(String(item.areaHectareas));
    setTipoSuelo(item.tipoSuelo);
    setResponsable(item.responsable);
    setEstadoRiego(item.estadoRiego);
    setProduccionEstimada(item.produccionEstimada);
    setObservaciones(item.observaciones ?? "");
    setModalVisible(true);
  }

  async function guardar() {
    if (!nombre || !ubicacion || !areaHectareas || !tipoSuelo || !responsable || !estadoRiego || !produccionEstimada) {
      Alert.alert("Faltan datos", "Completa todos los campos obligatorios (*)");
      return;
    }
    const body = { nombre, ubicacion, areaHectareas: Number(areaHectareas), tipoSuelo, responsable, estadoRiego, produccionEstimada, observaciones };
    try {
      const url = editando ? `${BASE_URL}/api/parcelas/${editando.idParcela}` : `${BASE_URL}/api/parcelas`;
      const metodo = editando ? "PUT" : "POST";
      const resp = await fetch(url, { method: metodo, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error("Error al guardar");
      setModalVisible(false);
      cargarDatos();
    } catch {
      Alert.alert("Error", "No se pudo guardar la parcela");
    }
  }

  async function eliminar(item: Parcela) {
    Alert.alert("Eliminar parcela", `¿Eliminar "${item.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive", onPress: async () => {
          try {
            await fetch(`${BASE_URL}/api/parcelas/${item.idParcela}/eliminar`, { method: "PATCH" });
            cargarDatos();
          } catch { Alert.alert("Error", "No se pudo eliminar"); }
        },
      },
    ]);
  }

  async function restaurar(item: Parcela) {
    try {
      await fetch(`${BASE_URL}/api/parcelas/${item.idParcela}/restaurar`, { method: "PATCH" });
      cargarDatos();
    } catch {
      Alert.alert("Error", "No se pudo restaurar la parcela");
    }
  }

  // ── Exportación PDF ──
  async function exportarPDF(soloActivos: boolean) {
    const datos = soloActivos ? todasLasParcelas.filter((p) => p.estado) : todasLasParcelas;
    const filas = datos.map((p) => `
      <tr>
        <td>${p.idParcela}</td>
        <td>${p.nombre}</td>
        <td>${p.ubicacion}</td>
        <td>${p.areaHectareas} Ha</td>
        <td>${p.responsable}</td>
        <td>${p.estado ? "Activa" : "Inactiva"}</td>
      </tr>`).join("");

    const html = `
      <html><body style="font-family: Helvetica;">
        <h2 style="color:#1B4332;">Reporte de Parcelas — AgroPacayales</h2>
        <p>${soloActivos ? "Solo parcelas activas" : "Todas las parcelas (activas e inactivas)"}</p>
        <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%; font-size: 12px;">
          <tr style="background:#1B4332; color white;">
            <th>ID</th><th>Nombre</th><th>Ubicación</th><th>Área</th><th>Responsable</th><th>Estado</th>
          </tr>
          ${filas}
        </table>
      </body></html>`;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  }

  // ── Exportación Excel (CSV compatible) ──
  async function exportarExcel(soloActivos: boolean) {
    const datos = soloActivos ? todasLasParcelas.filter((p) => p.estado) : todasLasParcelas;
    const encabezado = "ID,Nombre,Ubicacion,Area(Ha),TipoSuelo,Responsable,Riego,Estado\n";
    const filas = datos.map((p) =>
      `${p.idParcela},${p.nombre},${p.ubicacion},${p.areaHectareas},${p.tipoSuelo},${p.responsable},${p.estadoRiego},${p.estado ? "Activa" : "Inactiva"}`
    ).join("\n");

    const contenido = encabezado + filas;
    const fileUri = FileSystem.documentDirectory + `parcelas_${soloActivos ? "activas" : "todas"}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, contenido, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri, { mimeType: "text/csv", dialogTitle: "Exportar Parcelas" });
  }

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color={VERDE_OSCURO} />;

  return (
    <View style={styles.container}>
      <TopHeader />
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Gestión de Parcelas</Text>
        <TouchableOpacity style={styles.btnNuevo} onPress={abrirNuevo}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.btnNuevoTexto}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Activos / Inactivos */}
      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggleBtn, verActivos && styles.toggleBtnActivo]} onPress={() => setVerActivos(true)}>
          <Ionicons name="checkmark" size={14} color={verActivos ? "#fff" : "#374151"} />
          <Text style={{ color: verActivos ? "#fff" : "#374151", fontWeight: "600", fontSize: 12.5 }}> Ver Activos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, !verActivos && styles.toggleBtnActivo]} onPress={() => setVerActivos(false)}>
          <Ionicons name="refresh" size={14} color={!verActivos ? "#fff" : "#374151"} />
          <Text style={{ color: !verActivos ? "#fff" : "#374151", fontWeight: "600", fontSize: 12.5 }}> Ver Inactivos</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de exportación */}
      <View style={styles.exportRow}>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: "#dc2626" }]} onPress={() => exportarPDF(true)}>
          <Ionicons name="document-text" size={14} color="#fff" />
          <Text style={styles.exportTexto}>PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBtn, { backgroundColor: "#059669" }]} onPress={() => exportarExcel(true)}>
          <Ionicons name="grid" size={14} color="#fff" />
          <Text style={styles.exportTexto}>Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: "#334155" }]}
          onPress={() =>
            Alert.alert("Exportar todo", "Incluye activas e inactivas", [
              { text: "Cancelar", style: "cancel" },
              { text: "PDF", onPress: () => exportarPDF(false) },
              { text: "Excel", onPress: () => exportarExcel(false) },
            ])
          }
        >
          <Ionicons name="download" size={14} color="#fff" />
          <Text style={styles.exportTexto}>Todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={parcelasFiltradas}
        keyExtractor={(item) => item.idParcela.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={cargando} onRefresh={cargarDatos} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.nombre}>🏔️ {item.nombre}</Text>
              <View style={[styles.estadoBadge, { backgroundColor: item.estado ? "#d1fae5" : "#fee2e2" }]}>
                <Text style={{ color: item.estado ? "#059669" : "#dc2626", fontSize: 11, fontWeight: "700" }}>
                  {item.estado ? "Activa" : "Inactiva"}
                </Text>
              </View>
            </View>
            <Text style={styles.ubicacion}>📍 {item.ubicacion}</Text>
            <View style={styles.infoGrid}>
              <Text style={styles.infoItem}>📐 {item.areaHectareas} Ha</Text>
              <Text style={styles.infoItem}>🟤 Suelo: {item.tipoSuelo}</Text>
              <Text style={styles.infoItem}>👤 Responsable: {item.responsable}</Text>
              <Text style={styles.infoItem}>💧 Riego: {item.estadoRiego}</Text>
            </View>
            <View style={styles.acciones}>
              {item.estado ? (
                <>
                  <TouchableOpacity style={styles.btnEditar} onPress={() => abrirEditar(item)}>
                    <Ionicons name="pencil" size={14} color="#2563eb" />
                    <Text style={styles.btnEditarTexto}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnEliminar} onPress={() => eliminar(item)}>
                    <Ionicons name="trash" size={14} color="#dc2626" />
                    <Text style={styles.btnEliminarTexto}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.btnRestaurar} onPress={() => restaurar(item)}>
                  <Ionicons name="refresh" size={14} color="#059669" />
                  <Text style={styles.btnRestaurarTexto}>Restaurar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>No hay parcelas {verActivos ? "activas" : "inactivas"}</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>{editando ? "Editar Parcela" : "Registrar Nueva Parcela"}</Text>
            </View>
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej: Lote A - Valle Norte" />
              <Text style={styles.label}>Ubicación *</Text>
              <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} placeholder="Ej: Sector Norte, Km 5" />
              <Text style={styles.label}>Área (Hectáreas) *</Text>
              <TextInput style={styles.input} value={areaHectareas} onChangeText={setAreaHectareas} placeholder="Ej: 2.5" keyboardType="numeric" />
              <Text style={styles.label}>Tipo de Suelo *</Text>
              <TextInput style={styles.input} value={tipoSuelo} onChangeText={setTipoSuelo} placeholder="Ej: Franco, Arcilloso" />
              <Text style={styles.label}>Responsable *</Text>
              <TextInput style={styles.input} value={responsable} onChangeText={setResponsable} placeholder="Ej: Juan Pérez" />
              <Text style={styles.label}>Estado del Riego *</Text>
              <TextInput style={styles.input} value={estadoRiego} onChangeText={setEstadoRiego} placeholder="Ej: Goteo, Aspersión" />
              <Text style={styles.label}>Producción Estimada *</Text>
              <TextInput style={styles.input} value={produccionEstimada} onChangeText={setProduccionEstimada} placeholder="Ej: 500 kg" />
              <Text style={styles.label}>Observaciones</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={observaciones} onChangeText={setObservaciones} placeholder="Notas adicionales..." multiline />
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#374151", fontWeight: "600" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnRegistrar} onPress={guardar}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>{editando ? "Guardar" : "+ Registrar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F1" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginTop: 8 },
  headerTitulo: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  btnNuevo: { flexDirection: "row", alignItems: "center", backgroundColor: VERDE_OSCURO, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 4 },
  btnNuevoTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  toggleRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 12 },
  toggleBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  toggleBtnActivo: { backgroundColor: VERDE_OSCURO, borderColor: VERDE_OSCURO },
  exportRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: 10 },
  exportBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  exportTexto: { color: "#fff", fontWeight: "700", fontSize: 12 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  nombre: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  ubicacion: { fontSize: 13, color: "#64748b", marginBottom: 10 },
  infoGrid: { gap: 4, marginBottom: 12 },
  infoItem: { fontSize: 12.5, color: "#374151" },
  acciones: { flexDirection: "row", gap: 10, borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 10 },
  btnEditar: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#eff6ff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: "center" },
  btnEditarTexto: { color: "#2563eb", fontWeight: "600", fontSize: 12.5 },
  btnEliminar: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fef2f2", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: "center" },
  btnEliminarTexto: { color: "#dc2626", fontWeight: "600", fontSize: 12.5 },
  btnRestaurar: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#ecfdf5", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, flex: 1, justifyContent: "center" },
  btnRestaurarTexto: { color: "#059669", fontWeight: "600", fontSize: 12.5 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "88%" },
  modalHeader: { backgroundColor: VERDE_OSCURO, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitulo: { color: "#fff", fontSize: 18, fontWeight: "700" },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6, marginTop: 14 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: "#f8fafc" },
  modalFooter: { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  btnCancelar: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 10, backgroundColor: "#f1f5f9" },
  btnRegistrar: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 10, backgroundColor: VERDE_OSCURO },
});