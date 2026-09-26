/**
 * Configuración central de la aplicación.
 * La URL del backend puede sobrescribirse con la variable EXPO_PUBLIC_API_URL
 * (archivo .env local) sin tocar el código.
 */
export const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.70.102:3000";

/** Tiempo máximo de espera de una solicitud HTTP, en milisegundos. */
export const API_TIMEOUT_MS = 15000;

export const ENDPOINTS = {
  login: "/api/auth/login",
  usuarios: "/api/usuarios",
  parcelas: "/api/parcelas",
  cultivos: "/api/cultivos",
} as const;

export const STORAGE_KEYS = {
  sesion: "usuario_sesion",
} as const;
