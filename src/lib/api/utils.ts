import { AxiosError } from 'axios';
import { ApiResponse } from './types';

/**
 * Extracts error message from API response or axios error
 * Prioritizes error.msg from API response, falls back to axios error message
 */
export function getErrorMessage(error: unknown): string {
  // Check if it's an axios error with API response
  if (error instanceof AxiosError) {
    const response = error.response?.data;
    
    // Handle standard API response structure: { status: "error", error: { msg: "...", loc: null }, data: null }
    if (response && typeof response === 'object' && 'error' in response) {
      const apiResponse = response as ApiResponse<unknown>;
      if (apiResponse.error?.msg) {
        return apiResponse.error.msg;
      }
    }
    
    // Handle alternative response structure: { msg: "error", data: null } (e.g., dashboard endpoints)
    if (response && typeof response === 'object' && 'msg' in response && !('status' in response)) {
      const altResponse = response as { msg: string; data: unknown };
      if (altResponse.msg && altResponse.msg !== 'success') {
        return altResponse.msg;
      }
    }
    
    // Fall back to axios error message
    if (error.message) {
      return error.message;
    }
  }
  
  // Check if it's a standard Error
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred';
}

