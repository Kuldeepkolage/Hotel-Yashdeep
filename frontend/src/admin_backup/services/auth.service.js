// File: src/admin/services/auth.service.js
import api from "./api.js";

export const loginRequest = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const getCurrentAdminRequest = async () => {
  const response = await api.get("/admin/me");
  return response.data;
};

export const logoutRequest = async () => {
  const response = await api.post("/admin/logout");
  return response.data;
};