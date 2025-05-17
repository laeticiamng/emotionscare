
/**
 * Types d'API et d'activités API
 */

/**
 * Structure des activités d'utilisation des API
 */
export interface ApiUseActivity {
  date: string;
  openai?: number;
  whisper?: number;
  musicgen?: number;
  humeai?: number;
  dalle?: number;
  [key: string]: number | string | undefined;
}

/**
 * Structure des statistiques d'utilisation des API
 */
export interface ApiUsageStats {
  totalCalls: number;
  callsByApi: Record<string, number>;
  errorRate: number;
  avgResponseTime: number;
  costEstimate: number;
  period: {
    start: string;
    end: string;
  };
}

/**
 * Structure des données de latence d'API
 */
export interface ApiLatencyData {
  api: string;
  endpoint: string;
  timestamp: string;
  latency: number; // en ms
  status: number;
}

/**
 * Structure des erreurs d'API
 */
export interface ApiError {
  api: string;
  endpoint: string;
  timestamp: string;
  errorCode: string;
  errorMessage: string;
  requestId?: string;
}

/**
 * Structure des quotas d'API
 */
export interface ApiQuota {
  api: string;
  limit: number;
  used: number;
  reset: string; // Date ISO
  unit: 'requests' | 'tokens' | 'calls';
  period: 'minute' | 'hour' | 'day' | 'month';
}

/**
 * Statut des API
 */
export interface ApiStatus {
  name: string;
  isAvailable: boolean;
  lastChecked: Date | null;
}
