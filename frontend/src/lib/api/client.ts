/**
 * Axios HTTP client configuration with interceptors
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiErrorException } from '@/types';
import { getToken, removeToken } from '@/utils/token';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        new ApiErrorException(
          0,
          'Network error. Please check your internet connection.'
        )
      );
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      removeToken();
      
      // Only redirect if not already on login or signup page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login?expired=true';
      }
      
      return Promise.reject(
        new ApiErrorException(
          status,
          data?.message || 'Session expired. Please login again.'
        )
      );
    }

    // Handle 403 Forbidden
    if (status === 403) {
      return Promise.reject(
        new ApiErrorException(
          status,
          data?.message || 'You do not have permission to perform this action.'
        )
      );
    }

    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject(
        new ApiErrorException(
          status,
          data?.message || 'The requested resource was not found.'
        )
      );
    }

    // Handle 500 Internal Server Error
    if (status === 500) {
      return Promise.reject(
        new ApiErrorException(
          status,
          data?.message || 'An unexpected error occurred. Please try again later.'
        )
      );
    }

    // Handle other errors
    return Promise.reject(
      new ApiErrorException(
        status,
        data?.message || 'An error occurred. Please try again.'
      )
    );
  }
);

export default apiClient;
