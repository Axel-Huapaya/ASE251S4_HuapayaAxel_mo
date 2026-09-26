/** Paleta de colores de AgroPacayales Mobile. */
export const colors = {
  verdeOscuro: "#1B4332",
  verdeLogin: "#0b2a0c",
  lima: "#a3e635",
  fondo: "#F1F5F1",
  blanco: "#ffffff",

  texto: "#0f172a",
  textoMedio: "#374151",
  textoSuave: "#64748b",
  textoTenue: "#94a3b8",
  inactivo: "#9CA3AF",

  borde: "#e2e8f0",
  separador: "#f1f5f9",
  inputFondo: "#f8fafc",
  pizarra: "#334155",

  info: "#2563eb",
  infoFondo: "#eff6ff",
  exito: "#059669",
  exitoFondo: "#ecfdf5",
  exitoBadge: "#d1fae5",
  peligro: "#dc2626",
  peligroFondo: "#fef2f2",
  peligroBadge: "#fee2e2",
} as const;

export type AppColors = typeof colors;
