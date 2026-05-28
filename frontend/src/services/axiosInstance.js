import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Important for sending/receiving HTTP-only cookies
});

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;

        // If the API call requires an Authorization header, update it
        // Note: For now we don't strictly set the default header globally here,
        // we'll manage it via interceptors if needed, or AuthContext can hold it.
        // But since we are updating originalRequest, let's set it:
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Return the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g. refresh token expired), we should logout
        // The easiest way is to dispatch an event or handle it in AuthContext
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
