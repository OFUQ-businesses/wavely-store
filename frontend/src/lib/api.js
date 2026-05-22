const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('wavely_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('wavely_token', token);
  else localStorage.removeItem('wavely_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request('/health'),

  getSettings: () => request('/products/settings'),

  getFilterMeta: () => request('/products/meta/filters'),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    return request(`/products?${qs}`);
  },

  getProduct: id => request(`/products/${id}`),

  register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: body => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request('/auth/me'),

  updateMe: body => request('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),

  placeOrder: body => request('/orders', { method: 'POST', body: JSON.stringify(body) }),

  myOrders: () => request('/orders/my'),

  trackOrder: (orderNumber, email) => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    return request(`/orders/track/${encodeURIComponent(orderNumber)}${qs}`);
  },

  getOrder: orderNumber => request(`/orders/${encodeURIComponent(orderNumber)}`),

  saveCard: body => request('/auth/me/cards', { method: 'POST', body: JSON.stringify(body) }),

  deleteCard: cardId => request(`/auth/me/cards/${cardId}`, { method: 'DELETE' }),
};
