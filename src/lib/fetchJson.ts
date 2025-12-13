// @ts-nocheck
/**
 * fetchJson - Client HTTP complet avec support JSON
 * Gestion des erreurs, retry, timeout et intercepteurs
 */

import { logger } from '@/lib/logger';

if (!globalThis.fetch) {
  Object.assign(globalThis, require('undici'));
}

/** Méthode HTTP */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/** Configuration de retry */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryOn: number[];
  retryOnNetworkError: boolean;
}

/** Options de requête */
export interface FetchJsonOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
  retry?: Partial<RetryConfig>;
  baseUrl?: string;
  params?: Record<string, string | number | boolean | undefined>;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  validateStatus?: (status: number) => boolean;
  onUploadProgress?: (progress: ProgressInfo) => void;
  onDownloadProgress?: (progress: ProgressInfo) => void;
}

/** Info de progression */
export interface ProgressInfo {
  loaded: number;
  total: number;
  percent: number;
}

/** Réponse enrichie */
export interface FetchJsonResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
  url: string;
  duration: number;
}

/** Erreur HTTP */
export class HttpError extends Error {
  status: number;
  statusText: string;
  data: unknown;
  url: string;
  method: string;

  constructor(message: string, response: Response, data: unknown, method: string) {
    super(message);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = data;
    this.url = response.url;
    this.method = method;
  }
}

/** Erreur de timeout */
export class TimeoutError extends Error {
  url: string;
  timeout: number;

  constructor(url: string, timeout: number) {
    super(`Request timeout after ${timeout}ms: ${url}`);
    this.name = 'TimeoutError';
    this.url = url;
    this.timeout = timeout;
  }
}

/** Erreur réseau */
export class NetworkError extends Error {
  url: string;
  cause?: Error;

  constructor(url: string, cause?: Error) {
    super(`Network error: ${url}`);
    this.name = 'NetworkError';
    this.url = url;
    this.cause = cause;
  }
}

/** Intercepteur de requête */
export interface RequestInterceptor {
  onRequest?: (config: FetchJsonOptions & { url: string }) => FetchJsonOptions & { url: string } | Promise<FetchJsonOptions & { url: string }>;
  onRequestError?: (error: Error) => Error | Promise<Error>;
}

/** Intercepteur de réponse */
export interface ResponseInterceptor {
  onResponse?: <T>(response: FetchJsonResponse<T>) => FetchJsonResponse<T> | Promise<FetchJsonResponse<T>>;
  onResponseError?: (error: Error) => Error | Promise<Error>;
}

/** Stats des requêtes */
export interface FetchStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalRetries: number;
  averageResponseTime: number;
  byStatusCode: Record<number, number>;
  byMethod: Record<HttpMethod, number>;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryOn: [408, 429, 500, 502, 503, 504],
  retryOnNetworkError: true
};

const DEFAULT_TIMEOUT = 30000;

// État global
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const responseTimes: number[] = [];

const stats: FetchStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalRetries: 0,
  averageResponseTime: 0,
  byStatusCode: {},
  byMethod: {
    GET: 0,
    POST: 0,
    PUT: 0,
    PATCH: 0,
    DELETE: 0,
    HEAD: 0,
    OPTIONS: 0
  }
};

/** Construire l'URL avec les paramètres */
function buildUrl(input: string, options: FetchJsonOptions): string {
  let url = options.baseUrl ? new URL(input, options.baseUrl).href : input;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  return url;
}

/** Calculer le délai de retry avec jitter */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const delay = Math.min(
    config.baseDelay * Math.pow(2, attempt),
    config.maxDelay
  );
  const jitter = delay * 0.2 * Math.random();
  return delay + jitter;
}

/** Attendre avec AbortSignal */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/** Créer un AbortController avec timeout */
function createTimeoutController(timeout: number, existingSignal?: AbortSignal): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  if (existingSignal) {
    existingSignal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }

  return { controller, timeoutId };
}

/** Parser la réponse selon le type */
async function parseResponse<T>(
  response: Response,
  responseType: FetchJsonOptions['responseType'] = 'json'
): Promise<T> {
  switch (responseType) {
    case 'text':
      return await response.text() as T;
    case 'blob':
      return await response.blob() as T;
    case 'arrayBuffer':
      return await response.arrayBuffer() as T;
    case 'formData':
      return await response.formData() as T;
    case 'json':
    default:
      const text = await response.text();
      if (!text) return null as T;
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as T;
      }
  }
}

/** Exécuter les intercepteurs de requête */
async function runRequestInterceptors(
  config: FetchJsonOptions & { url: string }
): Promise<FetchJsonOptions & { url: string }> {
  let currentConfig = config;
  for (const interceptor of requestInterceptors) {
    if (interceptor.onRequest) {
      try {
        currentConfig = await interceptor.onRequest(currentConfig);
      } catch (error) {
        if (interceptor.onRequestError) {
          throw await interceptor.onRequestError(error as Error);
        }
        throw error;
      }
    }
  }
  return currentConfig;
}

/** Exécuter les intercepteurs de réponse */
async function runResponseInterceptors<T>(
  response: FetchJsonResponse<T>
): Promise<FetchJsonResponse<T>> {
  let currentResponse = response;
  for (const interceptor of responseInterceptors) {
    if (interceptor.onResponse) {
      try {
        currentResponse = await interceptor.onResponse(currentResponse);
      } catch (error) {
        if (interceptor.onResponseError) {
          throw await interceptor.onResponseError(error as Error);
        }
        throw error;
      }
    }
  }
  return currentResponse;
}

/** Effectuer la requête avec retry */
async function executeWithRetry<T>(
  url: string,
  init: RequestInit,
  options: FetchJsonOptions,
  method: HttpMethod
): Promise<FetchJsonResponse<T>> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...options.retry };
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const validateStatus = options.validateStatus ?? ((status) => status >= 200 && status < 300);

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    if (attempt > 0) {
      stats.totalRetries++;
      const retryDelay = calculateRetryDelay(attempt - 1, retryConfig);
      logger.debug(`Retrying request (attempt ${attempt})`, { url, delay: retryDelay }, 'HTTP');
      await delay(retryDelay, init.signal as AbortSignal);
    }

    const { controller, timeoutId } = createTimeoutController(timeout, init.signal as AbortSignal);
    const startTime = performance.now();

    try {
      const response = await globalThis.fetch(url, {
        ...init,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;

      // Mettre à jour les stats
      responseTimes.push(duration);
      stats.byStatusCode[response.status] = (stats.byStatusCode[response.status] || 0) + 1;

      const data = await parseResponse<T>(response, options.responseType);

      if (!validateStatus(response.status)) {
        // Vérifier si on doit retry
        if (attempt < retryConfig.maxRetries && retryConfig.retryOn.includes(response.status)) {
          lastError = new HttpError(
            `HTTP ${response.status}: ${response.statusText}`,
            response,
            data,
            method
          );
          continue;
        }

        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response,
          data,
          method
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok,
        url: response.url,
        duration
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError(url, timeout);
      }

      if (error instanceof HttpError || error instanceof TimeoutError) {
        throw error;
      }

      // Erreur réseau
      if (attempt < retryConfig.maxRetries && retryConfig.retryOnNetworkError) {
        lastError = new NetworkError(url, error as Error);
        continue;
      }

      throw new NetworkError(url, error as Error);
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/** Fonction principale fetchJson */
export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: FetchJsonOptions
): Promise<FetchJsonResponse<T>> {
  const options = init || {};
  const method = (options.method?.toUpperCase() as HttpMethod) || 'GET';
  let url = typeof input === 'string' ? input : input.toString();

  stats.totalRequests++;
  stats.byMethod[method]++;

  try {
    // Construire l'URL
    url = buildUrl(url, options);

    // Exécuter les intercepteurs de requête
    const config = await runRequestInterceptors({ ...options, url });
    url = config.url;

    // Préparer les headers
    const headers = new Headers(config.headers);
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }

    // Préparer le body
    let body: BodyInit | undefined;
    if (config.body !== undefined) {
      if (config.body instanceof FormData || typeof config.body === 'string') {
        body = config.body as BodyInit;
      } else {
        body = JSON.stringify(config.body);
      }
    }

    // Exécuter la requête
    const response = await executeWithRetry<T>(
      url,
      {
        method,
        headers,
        body,
        credentials: config.credentials,
        mode: config.mode,
        cache: config.cache,
        redirect: config.redirect,
        referrer: config.referrer,
        referrerPolicy: config.referrerPolicy,
        integrity: config.integrity,
        signal: config.signal
      },
      config,
      method
    );

    // Exécuter les intercepteurs de réponse
    const finalResponse = await runResponseInterceptors(response);

    stats.successfulRequests++;
    stats.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    logger.debug('HTTP request completed', {
      method,
      url,
      status: finalResponse.status,
      duration: finalResponse.duration
    }, 'HTTP');

    return finalResponse;
  } catch (error) {
    stats.failedRequests++;

    // Exécuter les intercepteurs d'erreur
    for (const interceptor of responseInterceptors) {
      if (interceptor.onResponseError) {
        throw await interceptor.onResponseError(error as Error);
      }
    }

    logger.error('HTTP request failed', error as Error, 'HTTP');
    throw error;
  }
}

/** Raccourcis pour les méthodes HTTP */
export const http = {
  get: <T = unknown>(url: string, options?: FetchJsonOptions) =>
    fetchJson<T>(url, { ...options, method: 'GET' }),

  post: <T = unknown>(url: string, body?: unknown, options?: FetchJsonOptions) =>
    fetchJson<T>(url, { ...options, method: 'POST', body }),

  put: <T = unknown>(url: string, body?: unknown, options?: FetchJsonOptions) =>
    fetchJson<T>(url, { ...options, method: 'PUT', body }),

  patch: <T = unknown>(url: string, body?: unknown, options?: FetchJsonOptions) =>
    fetchJson<T>(url, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(url: string, options?: FetchJsonOptions) =>
    fetchJson<T>(url, { ...options, method: 'DELETE' }),

  head: (url: string, options?: FetchJsonOptions) =>
    fetchJson(url, { ...options, method: 'HEAD' }),

  options: (url: string, options?: FetchJsonOptions) =>
    fetchJson(url, { ...options, method: 'OPTIONS' })
};

/** Ajouter un intercepteur de requête */
export function addRequestInterceptor(interceptor: RequestInterceptor): () => void {
  requestInterceptors.push(interceptor);
  return () => {
    const index = requestInterceptors.indexOf(interceptor);
    if (index > -1) requestInterceptors.splice(index, 1);
  };
}

/** Ajouter un intercepteur de réponse */
export function addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
  responseInterceptors.push(interceptor);
  return () => {
    const index = responseInterceptors.indexOf(interceptor);
    if (index > -1) responseInterceptors.splice(index, 1);
  };
}

/** Créer une instance avec configuration par défaut */
export function createFetchClient(defaultOptions: FetchJsonOptions = {}): {
  fetch: typeof fetchJson;
  http: typeof http;
} {
  const clientFetch = <T = unknown>(url: string, options?: FetchJsonOptions) =>
    fetchJson<T>(url, { ...defaultOptions, ...options });

  return {
    fetch: clientFetch,
    http: {
      get: <T = unknown>(url: string, options?: FetchJsonOptions) =>
        clientFetch<T>(url, { ...options, method: 'GET' }),
      post: <T = unknown>(url: string, body?: unknown, options?: FetchJsonOptions) =>
        clientFetch<T>(url, { ...options, method: 'POST', body }),
      put: <T = unknown>(url: string, body?: unknown, options?: FetchJsonOptions) =>
        clientFetch<T>(url, { ...options, method: 'PUT', body }),
      patch: <T = unknown>(url: string, body?: unknown, options?: FetchJsonOptions) =>
        clientFetch<T>(url, { ...options, method: 'PATCH', body }),
      delete: <T = unknown>(url: string, options?: FetchJsonOptions) =>
        clientFetch<T>(url, { ...options, method: 'DELETE' }),
      head: (url: string, options?: FetchJsonOptions) =>
        clientFetch(url, { ...options, method: 'HEAD' }),
      options: (url: string, options?: FetchJsonOptions) =>
        clientFetch(url, { ...options, method: 'OPTIONS' })
    }
  };
}

/** Obtenir les statistiques */
export function getFetchStats(): FetchStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetFetchStats(): void {
  stats.totalRequests = 0;
  stats.successfulRequests = 0;
  stats.failedRequests = 0;
  stats.totalRetries = 0;
  stats.averageResponseTime = 0;
  stats.byStatusCode = {};
  stats.byMethod = {
    GET: 0,
    POST: 0,
    PUT: 0,
    PATCH: 0,
    DELETE: 0,
    HEAD: 0,
    OPTIONS: 0
  };
  responseTimes.length = 0;
}

/** Vérifier si une erreur est une HttpError */
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

/** Vérifier si une erreur est une TimeoutError */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

/** Vérifier si une erreur est une NetworkError */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export default fetchJson;
