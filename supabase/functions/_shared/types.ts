/**
 * Types partagés pour les Edge Functions
 * Fournit les types manquants pour les imports ESM
 */

export interface SupabaseClient {
  from: (table: string) => any;
  rpc: (fn: string, params?: any) => any;
  auth: {
    getUser: (jwt?: string) => Promise<{ data: { user: any } | null; error: any }>;
  };
}

export interface AuthResult {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  } | null;
  status: number;
}

export interface CorsHeaders {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Headers': string;
}

export type ErrorResponse = {
  error: string;
  message?: string;
};

export type SuccessResponse<T = any> = {
  success: boolean;
  data?: T;
  [key: string]: any;
};
