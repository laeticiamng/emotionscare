
// Définition centralisée des endpoints API
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register'
  },

  // User Dashboard
  DASHBOARD: {
    WEEKLY: '/me/dashboard/weekly',
    DAILY: '/me/dashboard/daily'
  },

  // Glow Experiences
  GLOW: {
    FLASH: '/metrics/flash_glow',
    FACE_FILTER: '/metrics/face_filter',
    BUBBLE_BEAT: '/me/heart_rate/live',
    VR_GALAXY: '/metrics/vr_galaxy'
  },

  // Wellness Modules
  WELLNESS: {
    JOURNAL: {
      VOICE: '/journal_voice',
      TEXT: '/journal_text',
      FEED: '/me/journal',
      WEEKLY: '/me/journal/weekly'
    },
    MUSIC: {
      WEEKLY: '/me/music/weekly',
      SESSION: '/biotune_session'
    },
    SCAN: {
      WEEKLY: '/me/scan/weekly',
      SUBMIT: '/metrics/scan'
    },
    BREATH: {
      WEEKLY: '/me/breath/weekly',
      SESSION: '/breath_session'
    },
    VR: {
      WEEKLY: '/me/vr/weekly',
      SESSION: '/vr_session'
    }
  },

  // Gamification
  GAMIFICATION: {
    USER: '/me/gamification',
    LEADERBOARD: '/leaderboard',
    BADGES: '/me/badges'
  },

  // Organization (B2B)
  ORG: {
    DASHBOARD: '/org/{orgId}/dashboard/weekly',
    USERS: '/org/{orgId}/users',
    METRICS: '/org/{orgId}/metrics'
  },

  // Privacy & RGPD
  PRIVACY: {
    PREFS: '/user/privacy',
    EXPORT: '/user/export',
    EXPORT_STATUS: '/user/export/{jobId}',
    DELETE: '/user/delete',
    DELETE_STATUS: '/user/delete/status'
  },

  // Micro-breaks
  BREAKS: {
    START: '/micro_breaks',
    STOP: '/micro_breaks/{id}/stop',
    HISTORY: '/me/micro_breaks'
  }
} as const;

// Helper pour remplacer les paramètres dans les URLs
export const buildEndpoint = (endpoint: string, params: Record<string, string | number>) => {
  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`{${key}}`, String(value)),
    endpoint
  );
};

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Types pour les métriques communes
export interface WeeklyMetrics {
  glow_score: number;
  delta_rmssd: number;
  panas_pa: number;
  week_start: string;
  week_end: string;
}

export interface DashboardData {
  user: {
    name: string;
    avatar?: string;
    level: string;
    points: number;
  };
  metrics: WeeklyMetrics;
  recent_activities: Array<{
    type: string;
    date: string;
    score: number;
  }>;
}
