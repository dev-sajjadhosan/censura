export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T;
    meta?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: any;
}

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: any;
}
