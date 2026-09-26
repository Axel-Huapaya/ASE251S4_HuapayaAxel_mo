import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/use-auth";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { cerrarSesion } = useAuth();

  async function salir() {
    await cerrarSesion();
    router.replace("/login");
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.verdeOscuro,
        tabBarInactiveTintColor: colors.inactivo,
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cultivos"
        options={{
          title: "Cultivos",
          tabBarIcon: ({ color, size }) => <Ionicons name="leaf" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="parcelas"
        options={{
          title: "Parcelas",
          tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="usuarios"
        options={{
          title: "Usuarios",
          tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Salir",
          tabBarIcon: ({ color, size }) => <Ionicons name="log-out" color={color} size={size} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Alert.alert("Cerrar sesión", "¿Seguro que deseas salir?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Salir", style: "destructive", onPress: salir },
            ]);
          },
        }}
      />
    </Tabs>
  );
}
