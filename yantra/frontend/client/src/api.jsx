export const API_BASE = 'http://localhost:5200';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(()=> null);
  if (!res.ok) {
    const err = new Error(data?.error || 'Request failed');
    err.response = data;
    throw err;
  }
  return data;
}
