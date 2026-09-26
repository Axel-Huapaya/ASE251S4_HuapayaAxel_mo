import type { ParcelaResumen } from "./parcela.types";

export interface Cultivo {
  idCultivo: number;
  parcela: ParcelaResumen;
  nombre: string;
  tipoCultivo: string;
  frecuenciaRiegoDias: number;
  temperaturaIdeal: number;
  requiereSombra: boolean;
  observaciones?: string;
  estado: boolean;
}

/** Cuerpo enviado al backend en POST y PUT. */
export interface CultivoPayload {
  parcela: { idParcela: number };
  nombre: string;
  tipoCultivo: string;
  frecuenciaRiegoDias: number;
  temperaturaIdeal: number;
  requiereSombra: boolean;
  observaciones: string;
}

/** Valores del formulario (todo texto, salvo los campos de selección). */
export interface CultivoFormValues {
  parcelaId: number | null;
  nombre: string;
  tipoCultivo: string;
  frecuenciaRiegoDias: string;
  temperaturaIdeal: string;
  requiereSombra: boolean;
  observaciones: string;
}
