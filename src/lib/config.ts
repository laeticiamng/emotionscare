/**
 * Configuration centralisée pour EmotionsCare Production
 */

// ⚠️ MODE TEST - PRODUCTION: BYPASS_AUTH doit être false!
// Ce flag ne doit JAMAIS être true en production - cause des erreurs RLS 403
export const TEST_MODE: {
  BYPASS_AUTH: boolean;
  MOCK_USER: { id: string; email: string; user_metadata: { full_name: string; avatar_url: null } } | null;
} = {
  BYPASS_AUTH: false, // ← PRODUCTION: false obligatoire
  MOCK_USER: null, // Pas d'utilisateur mock en production
};

export const CONFIG = {
  // APIs Configuration — clés via variables d'environnement uniquement (pas de fallback en dur)
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  },
  
  // Edge Functions - Utilisant les vraies edge functions existantes
  EDGE_FUNCTIONS: {
    EMOTION_ANALYSIS: 'analyze-emotion',
    MUSIC_GENERATION: 'suno-music',
    MUSIC_RECOMMENDATIONS: 'emotion-music-ai',
    MUSIC_THERAPY: 'adaptive-music',
    COACH_AI: 'chat-coach',
    JOURNAL_ANALYSIS: 'journal-ai-process',
    EMOTIONSCARE_GENERATOR: 'emotion-music-ai',
    ADMIN_ANALYTICS: 'ai-analytics-insights',
    SECURITY_AUDIT: 'security-audit'
  },

  // Production Endpoints — dérivés de l'URL Supabase
  ENDPOINTS: {
    BASE_API: '/api/v1',
    WEBSOCKET: (import.meta.env.VITE_SUPABASE_URL ?? '').replace('https://', 'wss://') + '/realtime/v1',
    FUNCTIONS: (import.meta.env.VITE_SUPABASE_URL ?? '') + '/functions/v1'
  },

  // Features Configuration  
  FEATURES: {
    EMOTION_ANALYSIS: true,
    MUSIC_GENERATION: true,
    AI_COACHING: true,
    JOURNAL_INSIGHTS: true,
    VR_EXPERIENCES: true,
    SOCIAL_FEATURES: true,
    REAL_TIME_SYNC: true,
    ANALYTICS: true,
    EXPORT_DATA: true
  },

  // Limits & Quotas
  LIMITS: {
    MUSIC_GENERATION_MONTHLY: 50,
    CHAT_MESSAGES_MONTHLY: 200,
    JOURNAL_ENTRIES_MONTHLY: 100,
    FILE_UPLOAD_SIZE_MB: 50,
    SESSION_TIMEOUT_MINUTES: 60
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 5000,
    DEBOUNCE_DELAY: 500,
    POLLING_INTERVAL: 30000
  },

  // Analytics
  ANALYTICS: {
    TRACK_EVENTS: true,
    TRACK_PERFORMANCE: true,
    TRACK_ERRORS: true,
    BATCH_SIZE: 10,
    FLUSH_INTERVAL: 30000
  },

  // Security
  SECURITY: {
    ENABLE_CSP: true,
    SECURE_HEADERS: true,
    RATE_LIMITING: true,
    AUDIT_LOGS: true
  }
};

export default CONFIG;