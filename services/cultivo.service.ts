import { ENDPOINTS } from "../constants/config";
import type { Cultivo, CultivoPayload } from "../types";
import { http } from "./http";

export const cultivoService = {
  listar: () => http.get<Cultivo[]>(ENDPOINTS.cultivos),
  crear: (datos: CultivoPayload) => http.post<Cultivo>(ENDPOINTS.cultivos, datos),
  actualizar: (id: number, datos: CultivoPayload) => http.put<Cultivo>(`${ENDPOINTS.cultivos}/${id}`, datos),
  /** Eliminación lógica: el registro pasa a inactivo. */
  eliminar: (id: number) => http.patch(`${ENDPOINTS.cultivos}/${id}/eliminar`),
  restaurar: (id: number) => http.patch(`${ENDPOINTS.cultivos}/${id}/restaurar`),
};
