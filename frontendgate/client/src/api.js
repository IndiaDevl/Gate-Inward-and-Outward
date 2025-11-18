const API_BASE = "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, options);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  list: () => request("/api/gate-entries"),
  getEntry: (id) => request(`/api/gate-entries/${id}`),
  createEntry: (payload) =>
    request("/api/gate-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  audit: () => request("/api/gate-entries/audit"),
  auditEntry: (id) => request(`/api/gate-entries/${id}`),
  createEntry: (payload) =>
    request("/api/gate-entries/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  gateIn: (payload) =>
    request("/api/gate-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  gateOut: (payload) =>
    request("/api/gate-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
