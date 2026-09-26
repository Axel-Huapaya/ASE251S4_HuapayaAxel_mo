import { ENDPOINTS } from "../constants/config";
import type { Parcela, ParcelaPayload } from "../types";
import { http } from "./http";

export const parcelaService = {
  listar: () => http.get<Parcela[]>(ENDPOINTS.parcelas),
  crear: (datos: ParcelaPayload) => http.post<Parcela>(ENDPOINTS.parcelas, datos),
  actualizar: (id: number, datos: ParcelaPayload) => http.put<Parcela>(`${ENDPOINTS.parcelas}/${id}`, datos),
  /** Eliminación lógica: el registro pasa a inactivo. */
  eliminar: (id: number) => http.patch(`${ENDPOINTS.parcelas}/${id}/eliminar`),
  restaurar: (id: number) => http.patch(`${ENDPOINTS.parcelas}/${id}/restaurar`),
};
