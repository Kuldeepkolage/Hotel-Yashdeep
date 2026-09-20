const CUSTOMER_TOKEN_KEY = "yashdeep_customer_token";

export const getCustomerToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CUSTOMER_TOKEN_KEY) || sessionStorage.getItem(CUSTOMER_TOKEN_KEY);
};

export const setCustomerToken = (token, remember = true) => {
  if (typeof window === "undefined") return;
  clearCustomerToken();
  if (remember) {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  }
};

export const clearCustomerToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
};
