import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends cookies automatically with every request
});

// ─── Request Interceptor ───────────────────────────────────────────
// Runs before every request is sent
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────
// Runs after every response comes back
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 (unauthorized) and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to get a new access token using the refresh token
        await api.post('/auth/refresh');

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token also failed — redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;