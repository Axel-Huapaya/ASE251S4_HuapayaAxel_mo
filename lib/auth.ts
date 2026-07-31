import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UsuarioSesion {
  nombre: string;
  apellido?: string;
  rol: string;
}

const KEY = "usuario_sesion";

export async function guardarUsuario(usuario: UsuarioSesion) {
  await AsyncStorage.setItem(KEY, JSON.stringify(usuario));
}

export async function obtenerUsuario(): Promise<UsuarioSesion | null> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem(KEY);
}