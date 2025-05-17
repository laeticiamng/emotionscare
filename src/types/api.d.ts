
// Types pour les activités d'utilisation d'API
export interface ApiUseActivity {
  date: string;
  openai?: number;
  whisper?: number;
  musicgen?: number;
  humeai?: number;
  dalle?: number;
}

// Types pour les statistiques d'utilisation d'API
export interface ApiUsageStats {
  totalCalls: number;
  callsByApi: {
    openai: number;
    whisper: number;
    musicgen: number;
    humeai: number;
    dalle: number;
  };
  errorRate: number;
  avgResponseTime: number;
  costEstimate: number;
  period: {
    start: string;
    end: string;
  };
}

// Types pour les événements d'API
export interface ApiEvent {
  id: string;
  timestamp: string;
  api: string;
  endpoint: string;
  success: boolean;
  responseTime: number;
  errorMessage?: string;
  userId?: string;
  cost?: number;
}

// Types pour l'état de l'API
export interface ApiStatus {
  name: string;
  isAvailable: boolean;
  lastChecked: Date | null;
}
