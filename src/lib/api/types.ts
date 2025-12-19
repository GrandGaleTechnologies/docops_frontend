/**
 * Common API types used across the application
 */

export interface ApiError {
  msg: string;
  loc: string | null;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  error?: ApiError;
  data: T | null;
}

/**
 * Pagination metadata returned by paginated endpoints
 */
export interface PaginationMeta {
  total_no_items: number;
  total_no_pages: number;
  page: number;
  size: number;
  count: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

/**
 * Paginated response structure (used by endpoints with msg field)
 */
export interface PaginatedResponse<T> {
  msg: string;
  data: T[];
  meta: PaginationMeta;
}

