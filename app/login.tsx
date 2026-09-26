import { useState } from "react";
import { View, Text, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

import { AppButton, AppInput } from "../components/common";
import { colors } from "../constants/colors";
import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../services/http";
import { validarLogin } from "../utils/validators";

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    const errorValidacion = validarLogin(correo, password);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await iniciarSesion({ correo, password });
      router.replace("/(tabs)");
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.status === 401 || e.status === 403 ? "Correo o contraseña incorrectos." : "Error de inicio de sesión.");
      } else {
        setError("No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={require("../assets/images/login_bg.png")} style={styles.wrapper} resizeMode="cover">
      <LinearGradient
        colors={["rgba(46,125,50,0.45)", "rgba(11,26,12,0.8)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <BlurView intensity={40} tint="light" style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🚜</Text>
            </View>
            <Text style={styles.titulo}>AgroPacayales</Text>
            <Text style={styles.subtitulo}>Portal de Gestión Agrícola</Text>
          </View>

          {error && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorTexto}>{error}</Text>
            </View>
          )}

          <AppInput
            variante="cristal"
            label="Correo Electrónico"
            placeholder="ejemplo@agropacayales.com"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <AppInput
            variante="cristal"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            titulo="Acceder al Sistema"
            variante="lima"
            tamano="lg"
            cargando={loading}
            deshabilitado={!correo || !password}
            onPress={onSubmit}
            style={styles.boton}
          />
        </BlurView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: {
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    overflow: "hidden",
  },
  header: { alignItems: "center", marginBottom: 28 },
  logoBox: {
    backgroundColor: "rgba(255,255,255,0.18)",
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  logoIcon: { fontSize: 32 },
  titulo: { fontSize: 26, fontWeight: "700", color: colors.blanco },
  subtitulo: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  errorAlert: {
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorTexto: { color: "#fca5a5", fontSize: 13, fontWeight: "500" },
  boton: { marginTop: 8 },
});
