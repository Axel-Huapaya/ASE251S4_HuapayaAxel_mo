import { useCallback, useState } from "react";
import { usuarioService } from "../services/usuario.service";
import type { Usuario, UsuarioPayload } from "../types";

/** Lógica de datos del CRUD Maestro de Usuarios. */
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      const res = await usuarioService.listar();
      setUsuarios(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  const guardar = useCallback(
    async (datos: UsuarioPayload, id?: string) => {
      if (id === undefined) await usuarioService.crear(datos);
      else await usuarioService.actualizar(id, datos);
      await cargar();
    },
    [cargar]
  );

  const eliminar = useCallback(
    async (id: string) => {
      await usuarioService.eliminar(id);
      await cargar();
    },
    [cargar]
  );

  const restaurar = useCallback(
    async (id: string) => {
      await usuarioService.restaurar(id);
      await cargar();
    },
    [cargar]
  );

  return { usuarios, cargando, cargar, guardar, eliminar, restaurar };
}
