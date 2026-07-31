import { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopHeader from "../../components/TopHeader";
import { obtenerUsuario, UsuarioSesion } from "../../lib/auth";

const VERDE_OSCURO = "#1B4332";
const BASE_URL = "http://192.168.70.106";

interface StatCardProps {
  icono: keyof typeof Ionicons.glyphMap;
  numero: number;
  titulo: string;
  subtitulo: string;
  colorFondo: string;
  colorIcono: string;
  colorBarra: string;
}

function StatCard({ icono, numero, titulo, subtitulo, colorFondo, colorIcono, colorBarra }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderTopColor: colorBarra }]}>
      <View style={[styles.statIconWrap, { backgroundColor: colorFondo }]}>
        <Ionicons name={icono} size={22} color={colorIcono} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statNumero}>{numero}</Text>
        <Text style={styles.statTitulo}>{titulo}</Text>
        <Text style={styles.statSubtitulo}>{subtitulo}</Text>
      </View>
    </View>
  );
}

interface ModuleCardProps {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descripcion: string;
  colorFondo: string;
  colorIcono: string;
  onPress: () => void;
}

function ModuleCard({ icono, titulo, descripcion, colorFondo, colorIcono, onPress }: ModuleCardProps) {
  return (
    <TouchableOpacity style={styles.moduleCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.moduleHeader, { backgroundColor: colorFondo }]}>
        <Ionicons name={icono} size={32} color={colorIcono} />
      </View>
      <View style={styles.moduleBody}>
        <Text style={styles.moduleTitulo}>{titulo}</Text>
        <Text style={styles.moduleDescripcion}>{descripcion}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function InicioScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [totalCultivos, setTotalCultivos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalParcelas, setTotalParcelas] = useState(0);

  const fechaHoy = new Date()
    .toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());

  async function cargarEstadisticas() {
    try {
      const [rCultivos, rUsuarios, rParcelas] = await Promise.all([
        fetch(`${BASE_URL}/api/cultivos`),
        fetch(`${BASE_URL}/api/usuarios`),
        fetch(`${BASE_URL}/api/parcelas`),
      ]);
      const cultivos = await rCultivos.json();
      const usuarios = await rUsuarios.json();
      const parcelas = await rParcelas.json();
      setTotalCultivos(Array.isArray(cultivos) ? cultivos.length : 0);
      setTotalUsuarios(Array.isArray(usuarios) ? usuarios.length : 0);
      setTotalParcelas(Array.isArray(parcelas) ? parcelas.length : 0);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      cargarEstadisticas();
      obtenerUsuario().then((u: UsuarioSesion | null) => setNombre(u?.nombre ?? ""));
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5F1" }}>
      <TopHeader />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Hero Banner con imagen de fondo */}
        <ImageBackground
          source={require("../../assets/images/Inicio.jpg")}
          style={styles.heroSection}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{fechaHoy.toUpperCase()}</Text>
          </View>
          <Text style={styles.heroTitulo}>¡Hola de vuelta{nombre ? `, ${nombre}` : ""}!</Text>
          <Text style={styles.heroSubtitulo}>
            Bienvenido al panel central de AgroPacayales. Monitorea y optimiza la producción agrícola.
          </Text>
        </ImageBackground>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard icono="leaf" numero={totalCultivos} titulo="Cultivos" subtitulo="En crecimiento" colorFondo="#ccfbf1" colorIcono="#0d9488" colorBarra="#14b8a6" />
          <StatCard icono="triangle" numero={totalParcelas} titulo="Parcelas" subtitulo="Zonas operativas" colorFondo="#d1fae5" colorIcono="#059669" colorBarra="#10b981" />
          <StatCard icono="people" numero={totalUsuarios} titulo="Usuarios" subtitulo="Equipo activo" colorFondo="#ede9fe" colorIcono="#7c3aed" colorBarra="#8b5cf6" />
        </View>

        {/* Módulos */}
        <Text style={styles.sectionTitulo}>Módulos del Sistema</Text>
        <View style={styles.modulesGrid}>
          <ModuleCard icono="leaf" titulo="Cultivos y Siembra" descripcion="Monitorea la siembra y evolución de los cultivos." colorFondo="#e8f5e9" colorIcono="#2e7d32" onPress={() => router.push("/cultivos")} />
          <ModuleCard icono="map" titulo="Zonas y Parcelas" descripcion="Administra las extensiones de tierra y responsables." colorFondo="#e0f2f1" colorIcono="#00695c" onPress={() => router.push("/parcelas")} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: { borderRadius: 20, padding: 24, marginBottom: 24, overflow: "hidden", minHeight: 160, justifyContent: "center" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(27,67,50,0.75)", borderRadius: 20 },
  dateBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 12 },
  dateBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  heroTitulo: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  heroSubtitulo: { color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: 19 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  statCard: { flexBasis: "31%", flexGrow: 1, backgroundColor: "#fff", borderRadius: 14, padding: 12, borderTopWidth: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  statIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statNumero: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  statTitulo: { fontSize: 11, fontWeight: "700", color: "#334155", marginTop: 2 },
  statSubtitulo: { fontSize: 9, color: "#94a3b8", marginTop: 2, textTransform: "uppercase" },
  sectionTitulo: { fontSize: 17, fontWeight: "700", color: "#0f172a", marginBottom: 14 },
  modulesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 20 },
  moduleCard: { flexBasis: "47%", flexGrow: 1, backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  moduleHeader: { paddingVertical: 24, alignItems: "center", justifyContent: "center" },
  moduleBody: { padding: 12 },
  moduleTitulo: { fontSize: 13.5, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  moduleDescripcion: { fontSize: 11, color: "#64748b", lineHeight: 15 },
});