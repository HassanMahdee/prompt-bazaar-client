import { authClient } from "./auth-client";
import { headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // async function getAuthToken() {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });
  //   console.log("Session:", session);
  //   return session?.token || null;
  // }

  const { token, user } = await authClient.useSession({
    headers: await headers(),
  });
  console.log("Token:", token);
  console.log("User:", user);

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function get(endpoint, params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const queryString = new URLSearchParams(cleanParams).toString();

  return fetchAPI(queryString ? `${endpoint}?${queryString}` : endpoint);
}

export async function post(endpoint, data) {
  return fetchAPI(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function patch(endpoint, data) {
  return fetchAPI(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function del(endpoint) {
  return fetchAPI(endpoint, {
    method: "DELETE",
  });
}
