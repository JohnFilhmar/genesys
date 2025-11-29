/**
 * Error handling utilities
 */

import { AxiosError } from 'axios';
import { ApiError, ApiErrorException } from '@/types';

/**
 * Format error message from API error
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof ApiErrorException) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Parse API error from axios error
 */
export const parseApiError = (error: AxiosError<ApiError>): string => {
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  return error.response.data?.message || 'An error occurred';
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof ApiErrorException) {
    return error.statusCode === 401;
  }
  
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  
  return false;
};

/**
 * Check if error is authorization error
 */
export const isAuthorizationError = (error: unknown): boolean => {
  if (error instanceof ApiErrorException) {
    return error.statusCode === 403;
  }
  
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  
  return false;
};
