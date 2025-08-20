export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function api(path: string, opts: RequestInit = {}){
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: any = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers, credentials: 'omit' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
