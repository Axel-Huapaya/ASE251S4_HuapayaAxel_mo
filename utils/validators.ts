import type { CultivoFormValues, ParcelaFormValues } from "../types";

export const MSG_CAMPOS_OBLIGATORIOS = "Completa todos los campos obligatorios (*)";

const vacio = (valor: string) => valor.trim().length === 0;

const esNumeroPositivo = (valor: string) => {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0;
};

/** Devuelve un mensaje de error, o null si los datos son válidos. */
export function validarLogin(correo: string, password: string): string | null {
  if (vacio(correo) || vacio(password)) return "Por favor, ingresa tu correo y contraseña.";
  return null;
}

export function validarParcela(f: ParcelaFormValues): string | null {
  const obligatorios = [f.nombre, f.ubicacion, f.areaHectareas, f.tipoSuelo, f.responsable, f.estadoRiego, f.produccionEstimada];
  if (obligatorios.some(vacio)) return MSG_CAMPOS_OBLIGATORIOS;
  if (!esNumeroPositivo(f.areaHectareas)) return "El área debe ser un número mayor a 0.";
  return null;
}

export function validarCultivo(f: CultivoFormValues): string | null {
  if (!f.parcelaId || [f.nombre, f.tipoCultivo, f.frecuenciaRiegoDias, f.temperaturaIdeal].some(vacio)) {
    return MSG_CAMPOS_OBLIGATORIOS;
  }
  if (!esNumeroPositivo(f.frecuenciaRiegoDias)) return "La frecuencia de riego debe ser un número mayor a 0.";
  if (!Number.isFinite(Number(f.temperaturaIdeal))) return "La temperatura ideal debe ser un número.";
  return null;
}

export function validarUsuario(f: { nombre: string; apellido: string; correo: string; password?: string; rol: string }, esEdicion = false): string | null {
  if (vacio(f.nombre) || vacio(f.apellido) || vacio(f.correo) || vacio(f.rol)) {
    return MSG_CAMPOS_OBLIGATORIOS;
  }
  if (!esEdicion && (!f.password || vacio(f.password))) {
    return "La contraseña es obligatoria para nuevos usuarios.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(f.correo.trim())) {
    return "Ingresa un correo electrónico válido.";
  }
  return null;
}
