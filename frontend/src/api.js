import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  me: () => api.get("/api/auth/me"),
  update: (data) => api.put("/api/auth/me", data),
};

export const services = {
  categories: () => api.get("/api/services/categories"),
  agents: (params) => api.get("/api/services/agents", { params }),
  myServices: () => api.get("/api/services/agent-services"),
  addService: (data) => api.post("/api/services/agent-services", data),
  updateService: (id, data) => api.put(`/api/services/agent-services/${id}`, data),
  deleteService: (id) => api.delete(`/api/services/agent-services/${id}`),
};

export const bookings = {
  create: (data) => api.post("/api/bookings", data),
  mine: () => api.get("/api/bookings/my"),
  updateStatus: (id, status) => api.put(`/api/bookings/${id}/status`, { status }),
};

export const reviews = {
  byAgent: (id) => api.get(`/api/reviews/agent/${id}`),
  add: (data) => api.post("/api/reviews", data),
};

export default api;
