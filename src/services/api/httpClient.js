import axios from 'axios';

// ONE axios instance for the whole app. Every service file imports this —
// never create a second axios instance.
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach JWT on every request.
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every error to { success:false, message } shape from the backend contract,
// so components never have to guess the error's shape.
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('transitops_token');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      'Could not reach the server. Check your connection and try again.';
    return Promise.reject({ success: false, message, status: error.response?.status });
  }
);

export default httpClient;
