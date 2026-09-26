import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { colors } from "../constants/colors";
import type { Parcela } from "../types";
import { csvCell, escapeHtml } from "../utils/formatters";

/** Genera un PDF con el listado de parcelas y abre la hoja de compartir. */
export async function exportarParcelasPDF(parcelas: Parcela[], soloActivas: boolean): Promise<void> {
  const filas = parcelas
    .map(
      (p) => `
      <tr>
        <td>${escapeHtml(p.idParcela)}</td>
        <td>${escapeHtml(p.nombre)}</td>
        <td>${escapeHtml(p.ubicacion)}</td>
        <td>${escapeHtml(p.areaHectareas)} Ha</td>
        <td>${escapeHtml(p.responsable)}</td>
        <td>${p.estado ? "Activa" : "Inactiva"}</td>
      </tr>`
    )
    .join("");

  const html = `
    <html><body style="font-family: Helvetica;">
      <h2 style="color:${colors.verdeOscuro};">Reporte de Parcelas — AgroPacayales</h2>
      <p>${soloActivas ? "Solo parcelas activas" : "Todas las parcelas (activas e inactivas)"}</p>
      <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%; font-size: 12px;">
        <tr style="background:${colors.verdeOscuro}; color:white;">
          <th>ID</th><th>Nombre</th><th>Ubicación</th><th>Área</th><th>Responsable</th><th>Estado</th>
        </tr>
        ${filas}
      </table>
    </body></html>`;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}

/** Genera un CSV compatible con Excel y abre la hoja de compartir. */
export async function exportarParcelasCSV(parcelas: Parcela[], soloActivas: boolean): Promise<void> {
  const encabezado = "ID,Nombre,Ubicacion,Area(Ha),TipoSuelo,Responsable,Riego,Estado";
  const filas = parcelas.map((p) =>
    [p.idParcela, p.nombre, p.ubicacion, p.areaHectareas, p.tipoSuelo, p.responsable, p.estadoRiego, p.estado ? "Activa" : "Inactiva"]
      .map(csvCell)
      .join(",")
  );
  // El BOM inicial permite que Excel muestre bien las tildes.
  const contenido = "\uFEFF" + [encabezado, ...filas].join("\n");
  const fileUri = FileSystem.documentDirectory + `parcelas_${soloActivas ? "activas" : "todas"}.csv`;
  await FileSystem.writeAsStringAsync(fileUri, contenido, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(fileUri, { mimeType: "text/csv", dialogTitle: "Exportar Parcelas" });
}
