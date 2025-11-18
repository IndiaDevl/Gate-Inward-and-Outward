// src/config.js
// safe API base detection for CRA (process.env) or Vite (import.meta.env)
function getApiBase() {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  // default (your backend)
  return 'http://localhost:5200';
}

export const API_BASE = getApiBase();
export default API_BASE;
