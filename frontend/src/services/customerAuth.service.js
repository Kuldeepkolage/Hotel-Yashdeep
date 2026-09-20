import publicApi from "./publicApi.js";

export async function signupCustomer(payload) {
  const response = await publicApi.post("/auth/customer/signup", payload);
  return response.data?.data || response.data;
}

export async function verifyCustomerOTP(payload) {
  const response = await publicApi.post("/auth/customer/verify-otp", payload);
  return response.data?.data || response.data;
}

export async function resendCustomerOTP(payload) {
  const response = await publicApi.post("/auth/customer/resend-otp", payload);
  return response.data?.data || response.data;
}

export async function loginCustomer(payload) {
  const response = await publicApi.post("/auth/customer/login", payload);
  return response.data?.data || response.data;
}

export async function getCurrentCustomer() {
  const response = await publicApi.get("/auth/customer/me");
  return response.data?.data?.customer || response.data?.data || response.data;
}
