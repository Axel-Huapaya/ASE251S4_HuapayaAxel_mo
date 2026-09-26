import { ENDPOINTS, STORAGE_KEYS } from "../constants/config";
import type { LoginRequest, LoginResponse, UsuarioSesion } from "../types";
import { loadJson, removeKey, saveJson } from "../utils/storage";
import { http } from "./http";

export const authService = {
  /** Valida las credenciales en el backend y devuelve los datos de la sesión. */
  async login(credenciales: LoginRequest): Promise<UsuarioSesion> {
    const data = await http.post<LoginResponse>(ENDPOINTS.login, credenciales);
    return { nombre: data.nombre, apellido: data.apellido, rol: data.rol };
  },

  guardarSesion: (usuario: UsuarioSesion) => saveJson(STORAGE_KEYS.sesion, usuario),
  obtenerSesion: () => loadJson<UsuarioSesion>(STORAGE_KEYS.sesion),
  borrarSesion: () => removeKey(STORAGE_KEYS.sesion),
};
