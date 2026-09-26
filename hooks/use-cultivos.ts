import { useCallback, useState } from "react";
import { cultivoService } from "../services/cultivo.service";
import type { Cultivo, CultivoPayload } from "../types";

/** Lógica de datos del CRUD de Cultivos. */
export function useCultivos() {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      setCultivos(await cultivoService.listar());
    } catch (error) {
      console.error("Error al cargar cultivos:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  const guardar = useCallback(
    async (datos: CultivoPayload, id?: number) => {
      if (id === undefined) await cultivoService.crear(datos);
      else await cultivoService.actualizar(id, datos);
      await cargar();
    },
    [cargar]
  );

  const eliminar = useCallback(
    async (id: number) => {
      await cultivoService.eliminar(id);
      await cargar();
    },
    [cargar]
  );

  const restaurar = useCallback(
    async (id: number) => {
      await cultivoService.restaurar(id);
      await cargar();
    },
    [cargar]
  );

  return { cultivos, cargando, cargar, guardar, eliminar, restaurar };
}
