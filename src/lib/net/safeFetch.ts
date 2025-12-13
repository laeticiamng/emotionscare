// @ts-nocheck
import { logger } from '@/lib/logger';

/** Méthodes HTTP supportées */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/** Stratégie de retry */
export type RetryStrategy = 'fixed' | 'exponential' | 'linear';

/** Configuration du cache */
export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  key?: string;
  staleWhileRevalidate?: boolean;
}

/** Configuration de retry */
export interface RetryConfig {
  maxRetries: number;
  strategy: RetryStrategy;
  baseDelay: number;
  maxDelay: number;
  retryOn?: number[];
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

/** Options avancées de safeFetch */
export interface SafeFetchOptions extends Omit<RequestInit, 'signal'> {
  timeoutMs?: number;
  retries?: number;
  retryConfig?: Partial<RetryConfig>;
  cache?: Partial<CacheConfig>;
  onProgress?: (progress: FetchProgress) => void;
  onRetry?: (attempt: number, error: Error) => void;
  validateStatus?: (status: number) => boolean;
  transformRequest?: (config: RequestInit) => RequestInit;
  transformResponse?: <T>(response: Response) => Promise<T>;
  baseUrl?: string;
  queryParams?: Record<string, string | number | boolean>;
  parseJson?: boolean;
  throwOnError?: boolean;
}

/** Progression du fetch */
export interface FetchProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/** Résultat enrichi */
export interface SafeFetchResult<T = unknown> {
  data: T | null;
  response: Response | null;
  error: Error | null;
  status: number;
  ok: boolean;
  duration: number;
  retryCount: number;
  cached: boolean;
}

/** Stats de requêtes */
export interface FetchStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalRetries: number;
  averageResponseTime: number;
  cacheHits: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  strategy: 'exponential',
  baseDelay: 1000,
  maxDelay: 30000,
  retryOn: [408, 429, 500, 502, 503, 504]
};

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: false,
  ttl: 60000,
  staleWhileRevalidate: true
};

// Cache en mémoire
const requestCache = new Map<string, { data: unknown; timestamp: number; response: Response }>();

// Stats globales
const stats: FetchStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalRetries: 0,
  averageResponseTime: 0,
  cacheHits: 0
};

const responseTimes: number[] = [];

/** Calculer le délai de retry */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  let delay: number;

  switch (config.strategy) {
    case 'exponential':
      delay = config.baseDelay * Math.pow(2, attempt - 1);
      break;
    case 'linear':
      delay = config.baseDelay * attempt;
      break;
    case 'fixed':
    default:
      delay = config.baseDelay;
  }

  // Ajouter du jitter (±10%)
  const jitter = delay * 0.1 * (Math.random() * 2 - 1);
  delay = Math.min(delay + jitter, config.maxDelay);

  return Math.round(delay);
}

/** Générer une clé de cache */
function getCacheKey(url: string, options?: SafeFetchOptions): string {
  if (options?.cache?.key) return options.cache.key;

  const method = options?.method || 'GET';
  const body = options?.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
}

/** Vérifier si une entrée de cache est valide */
function isCacheValid(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
}

/** Construire l'URL avec les paramètres de requête */
function buildUrl(url: string, baseUrl?: string, queryParams?: Record<string, string | number | boolean>): string {
  let fullUrl = baseUrl ? new URL(url, baseUrl).toString() : url;

  if (queryParams && Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const separator = fullUrl.includes('?') ? '&' : '?';
    fullUrl += separator + searchParams.toString();
  }

  return fullUrl;
}

/** Fonction safeFetch principale */
export async function safeFetch<T = unknown>(
  url: string,
  opts: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const startTime = performance.now();
  stats.totalRequests++;

  const {
    timeoutMs = 30000,
    retries = 0,
    retryConfig: userRetryConfig,
    cache: userCacheConfig,
    onProgress,
    onRetry,
    validateStatus = (status) => status >= 200 && status < 300,
    transformRequest,
    transformResponse,
    baseUrl,
    queryParams,
    parseJson = true,
    throwOnError = false,
    ...fetchOptions
  } = opts;

  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...userRetryConfig, maxRetries: retries || userRetryConfig?.maxRetries || 0 };
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...userCacheConfig };

  // Construire l'URL complète
  const fullUrl = buildUrl(url, baseUrl, queryParams);
  const cacheKey = getCacheKey(fullUrl, opts);

  // Vérifier le cache pour les requêtes GET
  if (cacheConfig.enabled && (!fetchOptions.method || fetchOptions.method === 'GET')) {
    const cached = requestCache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp, cacheConfig.ttl)) {
      stats.cacheHits++;
      logger.debug('Cache hit', { url: fullUrl }, 'NET');

      return {
        data: cached.data as T,
        response: cached.response,
        error: null,
        status: cached.response.status,
        ok: true,
        duration: performance.now() - startTime,
        retryCount: 0,
        cached: true
      };
    }

    // Stale-while-revalidate: retourner les données périmées et rafraîchir en arrière-plan
    if (cached && cacheConfig.staleWhileRevalidate) {
      // Lancer la revalidation en arrière-plan
      safeFetch<T>(url, { ...opts, cache: { enabled: false } }).then(result => {
        if (result.ok && result.data) {
          requestCache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now(),
            response: result.response!
          });
        }
      }).catch(() => {});

      return {
        data: cached.data as T,
        response: cached.response,
        error: null,
        status: cached.response.status,
        ok: true,
        duration: performance.now() - startTime,
        retryCount: 0,
        cached: true
      };
    }
  }

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retryConfig.maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Transformer la requête si nécessaire
      let requestInit: RequestInit = {
        ...fetchOptions,
        signal: controller.signal
      };

      if (transformRequest) {
        requestInit = transformRequest(requestInit);
      }

      const response = await fetch(fullUrl, requestInit);

      clearTimeout(timer);

      // Vérifier le statut
      if (!validateStatus(response.status)) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).response = response;

        // Vérifier si on doit retry
        if (
          attempt < retryConfig.maxRetries &&
          retryConfig.retryOn?.includes(response.status)
        ) {
          throw error;
        }

        stats.failedRequests++;
        const duration = performance.now() - startTime;

        if (throwOnError) throw error;

        return {
          data: null,
          response,
          error,
          status: response.status,
          ok: false,
          duration,
          retryCount: attempt,
          cached: false
        };
      }

      // Parser la réponse
      let data: T | null = null;

      if (parseJson && response.headers.get('content-type')?.includes('application/json')) {
        if (transformResponse) {
          data = await transformResponse<T>(response);
        } else {
          data = await response.json();
        }
      } else if (transformResponse) {
        data = await transformResponse<T>(response);
      }

      // Mettre en cache si activé
      if (cacheConfig.enabled && (!fetchOptions.method || fetchOptions.method === 'GET')) {
        requestCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          response: response.clone()
        });
      }

      const duration = performance.now() - startTime;
      responseTimes.push(duration);
      stats.successfulRequests++;
      stats.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

      return {
        data,
        response,
        error: null,
        status: response.status,
        ok: true,
        duration,
        retryCount: attempt,
        cached: false
      };

    } catch (err) {
      clearTimeout(timer);
      lastError = err as Error;

      // Vérifier si c'est une erreur d'abort (timeout)
      if ((err as Error).name === 'AbortError') {
        lastError = new Error(`Request timeout after ${timeoutMs}ms`);
      }

      // Vérifier si on doit retry
      const shouldRetry = retryConfig.shouldRetry
        ? retryConfig.shouldRetry(lastError, attempt + 1)
        : true;

      if (attempt < retryConfig.maxRetries && shouldRetry) {
        attempt++;
        stats.totalRetries++;

        const delay = calculateRetryDelay(attempt, retryConfig);
        logger.warn(`Retry ${attempt}/${retryConfig.maxRetries}`, { url: fullUrl, delay }, 'NET');

        onRetry?.(attempt, lastError);

        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      break;
    }
  }

  stats.failedRequests++;
  const duration = performance.now() - startTime;

  logger.error('Request failed', lastError!, 'NET');

  if (throwOnError && lastError) throw lastError;

  return {
    data: null,
    response: null,
    error: lastError,
    status: 0,
    ok: false,
    duration,
    retryCount: attempt,
    cached: false
  };
}

/** Méthodes HTTP simplifiées */
export const http = {
  get: <T = unknown>(url: string, opts?: SafeFetchOptions) =>
    safeFetch<T>(url, { ...opts, method: 'GET' }),

  post: <T = unknown>(url: string, body?: unknown, opts?: SafeFetchOptions) =>
    safeFetch<T>(url, {
      ...opts,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json', ...opts?.headers }
    }),

  put: <T = unknown>(url: string, body?: unknown, opts?: SafeFetchOptions) =>
    safeFetch<T>(url, {
      ...opts,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json', ...opts?.headers }
    }),

  patch: <T = unknown>(url: string, body?: unknown, opts?: SafeFetchOptions) =>
    safeFetch<T>(url, {
      ...opts,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json', ...opts?.headers }
    }),

  delete: <T = unknown>(url: string, opts?: SafeFetchOptions) =>
    safeFetch<T>(url, { ...opts, method: 'DELETE' })
};

/** Créer une instance configurée */
export function createFetchClient(baseConfig: SafeFetchOptions) {
  return {
    fetch: <T = unknown>(url: string, opts?: SafeFetchOptions) =>
      safeFetch<T>(url, { ...baseConfig, ...opts }),

    get: <T = unknown>(url: string, opts?: SafeFetchOptions) =>
      http.get<T>(url, { ...baseConfig, ...opts }),

    post: <T = unknown>(url: string, body?: unknown, opts?: SafeFetchOptions) =>
      http.post<T>(url, body, { ...baseConfig, ...opts }),

    put: <T = unknown>(url: string, body?: unknown, opts?: SafeFetchOptions) =>
      http.put<T>(url, body, { ...baseConfig, ...opts }),

    patch: <T = unknown>(url: string, body?: unknown, opts?: SafeFetchOptions) =>
      http.patch<T>(url, body, { ...baseConfig, ...opts }),

    delete: <T = unknown>(url: string, opts?: SafeFetchOptions) =>
      http.delete<T>(url, { ...baseConfig, ...opts })
  };
}

/** Vider le cache */
export function clearFetchCache(): void {
  requestCache.clear();
  logger.info('Fetch cache cleared', {}, 'NET');
}

/** Obtenir les stats */
export function getFetchStats(): FetchStats {
  return { ...stats };
}

/** Réinitialiser les stats */
export function resetFetchStats(): void {
  stats.totalRequests = 0;
  stats.successfulRequests = 0;
  stats.failedRequests = 0;
  stats.totalRetries = 0;
  stats.averageResponseTime = 0;
  stats.cacheHits = 0;
  responseTimes.length = 0;
}

export default safeFetch;
