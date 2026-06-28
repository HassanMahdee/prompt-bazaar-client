import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getAuthToken() {
  const { data: session } = await authClient.getSession();
  return session?.session?.token || null;
  
}

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getAuthToken();

  // ✅ options থেকে headers আলাদা করো
  const { headers: customHeaders, ...restOptions } = options;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ token যোগ
      ...customHeaders, // ✅ custom headers merge
    },
  };

  // ✅ restOptions এ headers নেই — overwrite হবে না
  const response = await fetch(url, { ...defaultOptions, ...restOptions });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// get, post, patch, del — same থাকবে

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
