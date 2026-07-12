import axios from "axios";

// VITE_API_BASE_URL should point at wherever the backend is reachable -
// e.g. http://100.100.100.2:5002/api if the API server itself is only
// on the tailnet, or a normal LAN/public URL if it's exposed separately.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || "Unable to reach the server. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
