/**
 * Configuration centralisée pour EmotionsCare Production
 */

export const CONFIG = {
  // APIs Configuration
  SUPABASE: {
    URL: 'https://yaincoxihiqdksxgrsrk.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
  },
  
  // Edge Functions
  EDGE_FUNCTIONS: {
    EMOTION_ANALYSIS: 'enhanced-emotion-analyze',
    MUSIC_GENERATION: 'suno-music-generation',
    MUSIC_RECOMMENDATIONS: 'get-music-recommendations',
    MUSIC_THERAPY: 'music-therapy',
    COACH_AI: 'coach-ai',
    JOURNAL_ANALYSIS: 'journal-analysis',
    EMOTIONSCARE_GENERATOR: 'emotionscare-music-generator',
    ADMIN_ANALYTICS: 'admin-analytics',
    SECURITY_AUDIT: 'security-audit'
  },

  // Production Endpoints
  ENDPOINTS: {
    BASE_API: '/api/v1',
    WEBSOCKET: 'wss://yaincoxihiqdksxgrsrk.supabase.co/realtime/v1',
    FUNCTIONS: 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1'
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