// Centralized API client for AuraPay frontend
// Reads base URL and Authorization token from Vite env.
// Falls back to localStorage key 'AURAPAY_AUTH' if env not present.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getAuthToken(): string | null {
  // Prefer Vite env variable; ensure it includes the 'Bearer ' prefix when set
  const fromEnv = import.meta.env.VITE_AUTHORIZATION as string | undefined;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  const fromStorage = (typeof window !== 'undefined')
    ? window.localStorage.getItem('AURAPAY_AUTH')
    : null;
  return fromStorage && fromStorage.trim().length > 0 ? fromStorage.trim() : null;
}

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', token);

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const res = await fetch(url, { ...options, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : undefined;

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message: (body && (body.error || body.message)) || res.statusText,
      details: body,
    };
    throw err;
  }

  return (body as T);
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
  post: <T>(path: string, data?: unknown) => apiFetch<T>(path, { method: 'POST', body: JSON.stringify(data ?? {}) }),
  put: <T>(path: string, data?: unknown) => apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(data ?? {}) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};

// Helpers to dynamically manage auth after real login
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('AURAPAY_AUTH', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('AURAPAY_AUTH');
  }
}
