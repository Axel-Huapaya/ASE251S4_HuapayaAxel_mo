import { ENDPOINTS } from "../constants/config";
import type { Usuario, UsuarioPayload } from "../types";
import { http } from "./http";

export const usuarioService = {
  /** Obtiene la lista completa de usuarios. */
  listar: () => http.get<Usuario[]>(ENDPOINTS.usuarios),

  /** Obtiene un usuario específico por su ID único. */
  buscarPorId: (id: string) => http.get<Usuario>(`${ENDPOINTS.usuarios}/${id}`),

  /** Crea un nuevo usuario. */
  crear: (datos: UsuarioPayload) => http.post<Usuario>(ENDPOINTS.usuarios, datos),

  /** Actualiza los datos de un usuario existente. */
  actualizar: (id: string, datos: UsuarioPayload) => http.put<Usuario>(`${ENDPOINTS.usuarios}/${id}`, datos),

  /** Eliminación lógica: el usuario pasa a inactivo (estado = false). */
  eliminar: (id: string) => http.patch<Usuario>(`${ENDPOINTS.usuarios}/${id}/eliminar`),

  /** Restauración lógica: el usuario vuelve a estar activo (estado = true). */
  restaurar: (id: string) => http.patch<Usuario>(`${ENDPOINTS.usuarios}/${id}/restaurar`),
};
