// File: src/admin/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { getToken, setToken, clearToken } from "../services/api.js";
import {
  loginRequest,
  getCurrentAdminRequest,
  logoutRequest,
} from "../services/auth.service.js";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getCurrentAdminRequest();
      setCurrentUser(res.data);
    } catch (err) {
      clearToken();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password, remember = false) => {
    setError(null);

    const res = await loginRequest(email, password);
    const { token, admin } = res.data;

    setToken(token, remember);
    setCurrentUser(admin);

    return admin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (err) {
      // Token is cleared client-side regardless of network failure on logout
    } finally {
      clearToken();
      setCurrentUser(null);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}