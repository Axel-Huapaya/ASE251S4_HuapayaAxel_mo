import { useState, useCallback } from "react";
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl,
  TouchableOpacity, Modal, TextInput, ScrollView, Switch, Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TopHeader from "../../components/TopHeader";

const BASE_URL = "http://192.168.70.106";
const VERDE_OSCURO = "#1B4332";

interface Parcela { idParcela: number; nombre: string; }
interface Cultivo {
  idCultivo: number;
  parcela: Parcela;
  nombre: string;
  tipoCultivo: string;
  frecuenciaRiegoDias: number;
  temperaturaIdeal: number;
  requiereSombra: boolean;
  observaciones?: string;
  estado: boolean;
}

export default function CultivosScreen() {
  const [todosLosCultivos, setTodosLosCultivos] = useState<Cultivo[]>([]);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [verActivos, setVerActivos] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Cultivo | null>(null);

  const [parcelaId, setParcelaId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [tipoCultivo, setTipoCultivo] = useState("");
  const [frecuenciaRiego, setFrecuenciaRiego] = useState("");
  const [temperaturaIdeal, setTemperaturaIdeal] = useState("");
  const [requiereSombra, setRequiereSombra] = useState(false);
  const [observaciones, setObservaciones] = useState("");

  const cultivosFiltrados = todosLosCultivos.filter((c) => c.estado === verActivos);

  async function cargarDatos() {
    try {
      const [rCultivos, rParcelas] = await Promise.all([
        fetch(`${BASE_URL}/api/cultivos`),
        fetch(`${BASE_URL}/api/parcelas`),
      ]);
      setTodosLosCultivos(await rCultivos.json());
      setParcelas(await rParcelas.json());
    } catch (error) {
      console.error("Error al cargar cultivos:", error);
    } finally {
      setCargando(false);
    }
  }

  useFocusEffect(useCallback(() => { cargarDatos(); }, []));

  function abrirNuevo() {
    setEditando(null);
    setParcelaId(parcelas[0]?.idParcela ?? null);
    setNombre(""); setTipoCultivo(""); setFrecuenciaRiego(""); setTemperaturaIdeal("");
    setRequiereSombra(false); setObservaciones("");
    setModalVisible(true);
  }

  function abrirEditar(item: Cultivo) {
    setEditando(item);
    setParcelaId(item.parcela?.idParcela ?? null);
    setNombre(item.nombre);
    setTipoCultivo(item.tipoCultivo);
    setFrecuenciaRiego(String(item.frecuenciaRiegoDias));
    setTemperaturaIdeal(String(item.temperaturaIdeal));
    setRequiereSombra(item.requiereSombra);
    setObservaciones(item.observaciones ?? "");
    setModalVisible(true);
  }

  async function guardar() {
    if (!parcelaId || !nombre || !tipoCultivo || !frecuenciaRiego || !temperaturaIdeal) {
      Alert.alert("Faltan datos", "Completa todos los campos obligatorios (*)");
      return;
    }
    const body = {
      parcela: { idParcela: parcelaId }, nombre, tipoCultivo,
      frecuenciaRiegoDias: Number(frecuenciaRiego),
      temperaturaIdeal: Number(temperaturaIdeal),
      requiereSombra, observaciones,
    };
    try {
      const url = editando ? `${BASE_URL}/api/cultivos/${editando.idCultivo}` : `${BASE_URL}/api/cultivos`;
      const metodo = editando ? "PUT" : "POST";
      const resp = await fetch(url, { method: metodo, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error("Error al guardar");
      setModalVisible(false);
      cargarDatos();
    } catch {
      Alert.alert("Error", "No se pudo guardar el cultivo");
    }
  }

  async function eliminar(item: Cultivo) {
    Alert.alert("Eliminar cultivo", `¿Eliminar "${item.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive", onPress: async () => {
          try {
            await fetch(`${BASE_URL}/api/cultivos/${item.idCultivo}/eliminar`, { method: "PATCH" });
            cargarDatos();
          } catch { Alert.alert("Error", "No se pudo eliminar"); }
        },
      },
    ]);
  }

  async function restaurar(item: Cultivo) {
    try {
      await fetch(`${BASE_URL}/api/cultivos/${item.idCultivo}/restaurar`, { method: "PATCH" });
      cargarDatos();
    } catch {
      Alert.alert("Error", "No se pudo restaurar el cultivo");
    }
  }

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color={VERDE_OSCURO} />;

  return (
    <View style={styles.container}>
      <TopHeader />
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Gestión de Cultivos</Text>
        <TouchableOpacity style={styles.btnNuevo} onPress={abrirNuevo}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.btnNuevoTexto}>Nuevo</Text>
        </TouchableOpacity>
      </View>

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

      <FlatList
        data={cultivosFiltrados}
        keyExtractor={(item) => item.idCultivo.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={cargando} onRefresh={cargarDatos} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.tipoBadge}><Text style={styles.tipoBadgeTexto}>{item.tipoCultivo?.toUpperCase()}</Text></View>
              <View style={[styles.estadoBadge, { backgroundColor: item.estado ? "#d1fae5" : "#fee2e2" }]}>
                <Text style={{ color: item.estado ? "#059669" : "#dc2626", fontSize: 11, fontWeight: "700" }}>
                  {item.estado ? "Activo" : "Inactivo"}
                </Text>
              </View>
            </View>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.parcela}>🏠 {item.parcela?.nombre}</Text>
            <View style={styles.infoGrid}>
              <Text style={styles.infoItem}>💧 Riego cada {item.frecuenciaRiegoDias} días</Text>
              <Text style={styles.infoItem}>🌡️ {item.temperaturaIdeal}°C</Text>
              <Text style={styles.infoItem}>☀️ Sombra: {item.requiereSombra ? "Sí" : "No"}</Text>
              {item.observaciones ? <Text style={styles.infoItem}>📝 {item.observaciones}</Text> : null}
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
        ListEmptyComponent={<Text style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>No hay cultivos {verActivos ? "activos" : "inactivos"}</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>{editando ? "Editar Cultivo" : "Registrar Nuevo Cultivo"}</Text>
            </View>
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.label}>Parcela Asociada *</Text>
              <View style={styles.selectBox}>
                {parcelas.map((p) => (
                  <TouchableOpacity key={p.idParcela} style={[styles.chip, parcelaId === p.idParcela && styles.chipActivo]} onPress={() => setParcelaId(p.idParcela)}>
                    <Text style={{ color: parcelaId === p.idParcela ? "#fff" : "#374151" }}>{p.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Nombre del Cultivo *</Text>
              <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej: Maíz Híbrido 2026" />
              <Text style={styles.label}>Tipo de Cultivo *</Text>
              <TextInput style={styles.input} value={tipoCultivo} onChangeText={setTipoCultivo} placeholder="Ej: Maíz, Trigo, Tomate" />
              <Text style={styles.label}>Frecuencia de Riego (días) *</Text>
              <TextInput style={styles.input} value={frecuenciaRiego} onChangeText={setFrecuenciaRiego} placeholder="Ej: 7" keyboardType="numeric" />
              <Text style={styles.label}>Temperatura Ideal (°C) *</Text>
              <TextInput style={styles.input} value={temperaturaIdeal} onChangeText={setTemperaturaIdeal} placeholder="Ej: 25.5" keyboardType="numeric" />
              <View style={styles.switchRow}>
                <Text style={styles.label}>Requiere sombra</Text>
                <Switch value={requiereSombra} onValueChange={setRequiereSombra} trackColor={{ true: VERDE_OSCURO }} />
              </View>
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
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  tipoBadge: { backgroundColor: VERDE_OSCURO, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  tipoBadgeTexto: { color: "#fff", fontSize: 10, fontWeight: "700" },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  nombre: { fontSize: 17, fontWeight: "700", color: "#0f172a", marginBottom: 2 },
  parcela: { fontSize: 13, color: "#64748b", marginBottom: 10 },
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
  selectBox: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#e2e8f0", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipActivo: { backgroundColor: VERDE_OSCURO, borderColor: VERDE_OSCURO },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  modalFooter: { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  btnCancelar: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 10, backgroundColor: "#f1f5f9" },
  btnRegistrar: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 10, backgroundColor: VERDE_OSCURO },
});