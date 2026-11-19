export const API_URL =
  typeof window !== 'undefined'
    ? ''
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'mentorlagbe_jwt_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchAndStoreJwt(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/jwt`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data?.token) {
      setStoredToken(data.token);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch JWT:', error);
    return null;
  }
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data as T;
}