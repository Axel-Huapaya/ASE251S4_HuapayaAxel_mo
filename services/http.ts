import { API_TIMEOUT_MS, BASE_URL } from "../constants/config";

/** Error devuelto cuando el servidor responde con un código distinto de 2xx. */
export class ApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`Error HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const resp = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    if (!resp.ok) throw new ApiError(resp.status);
    const texto = await resp.text();
    return (texto ? JSON.parse(texto) : undefined) as T;
  } finally {
    clearTimeout(temporizador);
  }
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T = void>(path: string) => request<T>("PATCH", path),
};
