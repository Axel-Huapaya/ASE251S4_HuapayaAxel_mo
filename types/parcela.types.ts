export interface Parcela {
  idParcela: number;
  nombre: string;
  ubicacion: string;
  areaHectareas: number;
  tipoSuelo: string;
  responsable: string;
  estadoRiego: string;
  produccionEstimada: string;
  observaciones?: string;
  enUso: boolean;
  estado: boolean;
}

/** Cuerpo enviado al backend en POST y PUT. */
export interface ParcelaPayload {
  nombre: string;
  ubicacion: string;
  areaHectareas: number;
  tipoSuelo: string;
  responsable: string;
  estadoRiego: string;
  produccionEstimada: string;
  observaciones: string;
}

/** Valores del formulario (todo texto, tal como lo escribe el usuario). */
export interface ParcelaFormValues {
  nombre: string;
  ubicacion: string;
  areaHectareas: string;
  tipoSuelo: string;
  responsable: string;
  estadoRiego: string;
  produccionEstimada: string;
  observaciones: string;
}

export type ParcelaResumen = Pick<Parcela, "idParcela" | "nombre">;
