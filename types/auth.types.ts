export interface UsuarioSesion {
  nombre: string;
  apellido?: string;
  rol: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export type LoginResponse = UsuarioSesion;
