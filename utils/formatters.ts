/** Escapa texto para insertarlo de forma segura en HTML (reporte PDF). */
export function escapeHtml(valor: unknown): string {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapa una celda CSV: encierra en comillas si hay comas, comillas o saltos de línea. */
export function csvCell(valor: unknown): string {
  const texto = String(valor ?? "");
  return /[",\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

/** Fecha larga en español con la primera letra en mayúscula. */
export function fechaLarga(fecha: Date = new Date()): string {
  return fecha
    .toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());
}
