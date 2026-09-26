import { useCallback, useState } from "react";
import { parcelaService } from "../services/parcela.service";
import type { Parcela, ParcelaPayload } from "../types";

/** Lógica de datos del CRUD maestro de Parcelas. */
export function useParcelas() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      setParcelas(await parcelaService.listar());
    } catch (error) {
      console.error("Error al cargar parcelas:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  /** Crea la parcela, o la actualiza si se indica el id; recarga la lista al terminar. */
  const guardar = useCallback(
    async (datos: ParcelaPayload, id?: number) => {
      if (id === undefined) await parcelaService.crear(datos);
      else await parcelaService.actualizar(id, datos);
      await cargar();
    },
    [cargar]
  );

  const eliminar = useCallback(
    async (id: number) => {
      await parcelaService.eliminar(id);
      await cargar();
    },
    [cargar]
  );

  const restaurar = useCallback(
    async (id: number) => {
      await parcelaService.restaurar(id);
      await cargar();
    },
    [cargar]
  );

  return { parcelas, cargando, cargar, guardar, eliminar, restaurar };
}
