import { guardarUsuario } from "../lib/auth";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";


const LIMA = "#a3e635";
const VERDE_OSCURO = "#0b2a0c";
const AUTH_URL = "http://192.168.70.106/api/auth/login";

export default function LoginScreen() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit() {
        if (!correo || !password) {
            setError("Por favor, ingresa tu correo y contraseña.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const respuesta = await fetch(AUTH_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, password }),
            });
            if (!respuesta.ok) {
                if (respuesta.status === 401 || respuesta.status === 403) {
                    setError("Correo o contraseña incorrectos.");
                } else {
                    setError("Error de inicio de sesión.");
                }
                return;
            }
            const usuario = await respuesta.json();
            console.log("Usuario recibido:", usuario);

            await guardarUsuario({
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                rol: usuario.rol,
            });

            router.replace({ pathname: "/(tabs)", params: { nombre: usuario.nombre } });
        } catch (e) {
            setError("No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ImageBackground
            source={require("../assets/images/login_bg.png")}
            style={styles.wrapper}
            resizeMode="cover"
        >
            <LinearGradient
                colors={["rgba(46,125,50,0.45)", "rgba(11,26,12,0.8)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.container}
            >
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ejemplo@agropacayales.com"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={correo}
                            onChangeText={setCorreo}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.boton, (!correo || !password || loading) && styles.botonDisabled]}
                        onPress={onSubmit}
                        disabled={!correo || !password || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={VERDE_OSCURO} />
                        ) : (
                            <Text style={styles.botonTexto}>Acceder al Sistema</Text>
                        )}
                    </TouchableOpacity>
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
    titulo: { fontSize: 26, fontWeight: "700", color: "#fff" },
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
    inputGroup: { marginBottom: 18 },
    label: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 6 },
    input: {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        color: "#fff",
        fontSize: 14,
    },
    boton: {
        backgroundColor: LIMA,
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 8,
    },
    botonDisabled: { backgroundColor: "rgba(255,255,255,0.12)" },
    botonTexto: { color: VERDE_OSCURO, fontWeight: "600", fontSize: 15 },
});