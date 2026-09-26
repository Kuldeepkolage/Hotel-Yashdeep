import axios from "axios";
import { getCustomerToken } from "./customerAuth.storage.js";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

publicApi.interceptors.request.use((config) => {
  const token = getCustomerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default publicApi;
