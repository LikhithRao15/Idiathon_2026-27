/**
 * API Client for Ideathon Backend
 */
const API_BASE = 'http://localhost:5001/api';

export async function apiRequest(endpoint, options = {}, token = null) {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('ideathon_token') : null);
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };

  const startTime = performance.now();
  try {
    const res = await fetch(url, { ...options, headers });
    const elapsed = Math.round(performance.now() - startTime);
    const raw = await res.json().catch(() => ({}));

    // Extract payload data
    let data = raw.data !== undefined ? raw.data : raw;
    const isSuccess = res.ok && (raw.success !== false);
    let message = raw.message || (isSuccess ? 'Success' : 'Request failed');

    // Handle express-validator errors array
    if (raw.errors && Array.isArray(raw.errors)) {
      message = raw.errors.map(e => e.message || e.msg).join(' • ');
    }

    return {
      ok: isSuccess,
      status: res.status,
      data,
      message,
      raw,
      elapsed,
    };
  } catch (err) {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      ok: false,
      status: 0,
      data: null,
      message: err.message || 'Network error connecting to backend API',
      elapsed,
    };
  }
}
