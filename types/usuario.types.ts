export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: string;
  fechaNacimiento?: string;
  fechaContratacion?: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}

export interface UsuarioPayload {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: string;
  fechaNacimiento?: string;
  fechaContratacion?: string;
  estado?: boolean;
}

export interface UsuarioFormValues {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol: string;
  fechaNacimiento: string;
  fechaContratacion: string;
}
