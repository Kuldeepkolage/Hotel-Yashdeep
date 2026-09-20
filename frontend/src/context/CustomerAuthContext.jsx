import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCustomerToken,
  setCustomerToken,
  clearCustomerToken,
} from "../services/customerAuth.storage.js";
import {
  signupCustomer,
  verifyCustomerOTP,
  resendCustomerOTP,
  loginCustomer,
  getCurrentCustomer,
} from "../services/customerAuth.service.js";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    const token = getCustomerToken();
    if (!token) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getCurrentCustomer();
      setCustomer(data);
    } catch (err) {
      clearCustomerToken();
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signup = useCallback(async (payload) => {
    setError(null);
    return await signupCustomer(payload);
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    setError(null);
    const result = await verifyCustomerOTP(payload);
    if (result?.token && result?.customer) {
      setCustomerToken(result.token, true);
      setCustomer(result.customer);
    }
    return result;
  }, []);

  const resendOtp = useCallback(async (payload) => {
    setError(null);
    return await resendCustomerOTP(payload);
  }, []);

  const login = useCallback(async (email, password, remember = true) => {
    setError(null);
    const result = await loginCustomer({ email, password });
    if (result?.token && result?.customer) {
      setCustomerToken(result.token, remember);
      setCustomer(result.customer);
    }
    return result?.customer;
  }, []);

  const logout = useCallback(() => {
    clearCustomerToken();
    setCustomer(null);
  }, []);

  const value = {
    customer,
    loading,
    error,
    isAuthenticated: Boolean(customer && customer.isEmailVerified !== false),
    signup,
    verifyOtp,
    resendOtp,
    login,
    logout,
    checkAuth,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}

export default CustomerAuthContext;
