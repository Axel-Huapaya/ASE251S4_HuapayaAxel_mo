import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/auth.service";
import type { LoginRequest, UsuarioSesion } from "../types";

export interface AuthState {
  usuario: UsuarioSesion | null;
  iniciarSesion: (credenciales: LoginRequest) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  // Recupera la sesión guardada al abrir la aplicación.
  useEffect(() => {
    authService.obtenerSesion().then(setUsuario).catch(() => setUsuario(null));
  }, []);

  const iniciarSesion = useCallback(async (credenciales: LoginRequest) => {
    const sesion = await authService.login(credenciales);
    await authService.guardarSesion(sesion);
    setUsuario(sesion);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await authService.borrarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({ usuario, iniciarSesion, cerrarSesion }), [usuario, iniciarSesion, cerrarSesion]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
