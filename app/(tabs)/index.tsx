import { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "../../components/common";
import { ModuleCard, StatCard } from "../../components/ui";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/use-auth";
import { cultivoService } from "../../services/cultivo.service";
import { parcelaService } from "../../services/parcela.service";
import { usuarioService } from "../../services/usuario.service";
import { fechaLarga } from "../../utils/formatters";

export default function InicioScreen() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [totalCultivos, setTotalCultivos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalParcelas, setTotalParcelas] = useState(0);

  async function cargarEstadisticas() {
    try {
      const [cultivosRes, usuariosRes, parcelasRes] = await Promise.allSettled([
        cultivoService.listar(),
        usuarioService.listar(),
        parcelaService.listar(),
      ]);
      if (cultivosRes.status === "fulfilled" && Array.isArray(cultivosRes.value)) {
        setTotalCultivos(cultivosRes.value.length);
      }
      if (usuariosRes.status === "fulfilled" && Array.isArray(usuariosRes.value)) {
        setTotalUsuarios(usuariosRes.value.length);
      }
      if (parcelasRes.status === "fulfilled" && Array.isArray(parcelasRes.value)) {
        setTotalParcelas(parcelasRes.value.length);
      }
    } catch (error) {
      console.warn("Error al cargar estadísticas:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      cargarEstadisticas();
    }, [])
  );

  const nombre = usuario?.nombre ?? "";

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Hero Banner con imagen de fondo */}
        <ImageBackground
          source={require("../../assets/images/Inicio.jpg")}
          style={styles.heroSection}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{fechaLarga().toUpperCase()}</Text>
          </View>
          <Text style={styles.heroTitulo}>¡Hola de vuelta{nombre ? `, ${nombre}` : ""}!</Text>
          <Text style={styles.heroSubtitulo}>
            Bienvenido al panel central de AgroPacayales. Monitorea y optimiza la producción agrícola.
          </Text>
        </ImageBackground>

        {/* Estadísticas */}
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
          <ModuleCard icono="people" titulo="Equipo y Usuarios" descripcion="Gestiona el personal, roles y permisos de acceso." colorFondo="#ede9fe" colorIcono="#7c3aed" onPress={() => router.push("/(tabs)/usuarios" as any)} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroSection: { borderRadius: 20, padding: 24, marginBottom: 24, overflow: "hidden", minHeight: 160, justifyContent: "center" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(27,67,50,0.75)", borderRadius: 20 },
  dateBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 12 },
  dateBadgeText: { color: colors.blanco, fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  heroTitulo: { color: colors.blanco, fontSize: 22, fontWeight: "800", marginBottom: 8 },
  heroSubtitulo: { color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: 19 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  sectionTitulo: { fontSize: 17, fontWeight: "700", color: colors.texto, marginBottom: 14 },
  modulesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 20 },
});
