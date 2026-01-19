import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Read from Zustand persisted storage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth storage:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Read refresh token from Zustand storage
        const authStorage = localStorage.getItem('auth-storage');
        let refreshToken = null;
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          refreshToken = state?.refreshToken;
        }
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          // Update Zustand storage
          const updatedState = {
            state: {
              ...JSON.parse(authStorage).state,
              accessToken: access_token,
              refreshToken: newRefreshToken,
            },
            version: 0,
          };
          localStorage.setItem('auth-storage', JSON.stringify(updatedState));

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('auth-storage');
        globalThis.location.href = '/login';
        throw refreshError;
      }
    }

    throw error;
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/v1/auth/login', 
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ),
  
  register: (data: any) =>
    api.post('/api/v1/auth/register', data),
  
  getMe: () =>
    api.get('/api/v1/auth/me'),
  
  logout: () => {
    localStorage.removeItem('auth-storage');
    return Promise.resolve();
  },
};

// Temporary: For development without login
export const setTempToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

export default api;
