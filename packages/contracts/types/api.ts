/**
 * Common API types and response formats
 */

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: ApiError;
}

// API error structure
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

// Pagination metadata
export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Common API status codes
export enum ApiStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

// Health check response
export interface HealthCheckResponse {
  ok: boolean;
  timestamp: string;
  version: string;
  services: {
    database: ServiceStatus;
    supabase: ServiceStatus;
    redis?: ServiceStatus;
  };
}

export interface ServiceStatus {
  ok: boolean;
  latency?: number;
  error?: string;
}
