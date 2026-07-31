import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";

const VERDE_OSCURO = "#1B4332";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: VERDE_OSCURO,
        tabBarInactiveTintColor: "#9CA3AF",
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
              { text: "Salir", style: "destructive", onPress: () => router.replace("/login") },
            ]);
          },
        }}
      />
    </Tabs>
  );
}