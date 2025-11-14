// @ts-nocheck
/**
 * API Endpoints Registry - EmotionsCare Platform
 *
 * Fichier central définissant tous les endpoints API de la plateforme
 * Organisé par domaine fonctionnel avec types TypeScript complets
 *
 * @version 1.0.0
 * @lastUpdated 2025-11-14
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Helper pour construire les URLs d'endpoints
 */
export const buildEndpoint = (path: string, params?: Record<string, string | number>): string => {
  let url = `${API_BASE_URL}${path}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
};

/**
 * ════════════════════════════════════════════════════════════════
 * AUTHENTIFICATION & USER
 * ════════════════════════════════════════════════════════════════
 */
export const AUTH_ENDPOINTS = {
  // Authentification B2C
  LOGIN_B2C: '/auth/b2c/login',
  REGISTER_B2C: '/auth/b2c/register',

  // Authentification B2B
  LOGIN_B2B_USER: '/auth/b2b/user/login',
  LOGIN_B2B_ADMIN: '/auth/b2b/admin/login',
  REGISTER_B2B_USER: '/auth/b2b/user/register',

  // Profil & Session
  GET_PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',

  // Mot de passe
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
} as const;

export const USER_ENDPOINTS = {
  // CRUD Utilisateur
  CREATE_USER: '/users',
  GET_USER: '/users/:id',
  UPDATE_USER: '/users/:id',
  DELETE_USER: '/users/:id',

  // Profil & Préférences
  GET_PROFILE: '/users/:id/profile',
  UPDATE_PROFILE: '/users/:id/profile',
  GET_PREFERENCES: '/users/:id/preferences',
  UPDATE_PREFERENCES: '/users/:id/preferences',

  // Avatar
  UPLOAD_AVATAR: '/users/:id/avatar',
  DELETE_AVATAR: '/users/:id/avatar',

  // Stats & Activité
  GET_STATS: '/users/:id/stats',
  GET_ACTIVITY: '/users/:id/activity',

  // Gestion compte
  DEACTIVATE: '/users/:id/deactivate',
  REACTIVATE: '/users/:id/reactivate',

  // Dashboard
  GET_DASHBOARD_STATS: '/user/dashboard-stats',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * SCAN ÉMOTIONNEL (CRITIQUE)
 * ════════════════════════════════════════════════════════════════
 */
export const SCAN_ENDPOINTS = {
  // CRUD Scans
  CREATE_SCAN: '/scans',
  LIST_SCANS: '/scans',
  GET_SCAN: '/scans/:id',
  DELETE_SCAN: '/scans/:id',

  // Analyse (services existants)
  ANALYZE_TEXT: '/emotion/analyze',
  ANALYZE_VOICE: '/emotion/voice',
  ANALYZE_FACIAL: '/emotion/facial',
  ANALYZE_EMOJI: '/emotion/emoji',

  // Statistiques & Insights
  GET_STATS: '/scans/stats',
  GET_TRENDS: '/scans/trends',
  GET_PATTERNS: '/scans/patterns',

  // Historique
  GET_DAILY: '/scans/daily',
  GET_WEEKLY: '/scans/weekly',
  GET_MONTHLY: '/scans/monthly',

  // Export
  EXPORT_SCANS: '/scans/export',
  BATCH_ANALYZE: '/scans/batch',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * ASSESSMENT CLINIQUE (CRITIQUE)
 * ════════════════════════════════════════════════════════════════
 */
export const ASSESSMENT_ENDPOINTS = {
  // CRUD Assessments
  CREATE_ASSESSMENT: '/assessments',
  LIST_ASSESSMENTS: '/assessments',
  GET_ASSESSMENT: '/assessments/:id',
  DELETE_ASSESSMENT: '/assessments/:id',

  // Passation
  GET_ACTIVE: '/assessments/active',
  SUBMIT_ANSWERS: '/assessments/:id/submit',
  GET_RESULTS: '/assessments/:id/results',

  // Historique
  GET_HISTORY: '/assessments/history',

  // Instruments disponibles (WHO-5, PHQ-9, GAD-7, etc.)
  GET_INSTRUMENTS: '/assessments/instruments',
  GET_INSTRUMENT: '/assessments/instruments/:type',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * MUSIQUE & GÉNÉRATION (CRITIQUE)
 * ════════════════════════════════════════════════════════════════
 */
export const MUSIC_ENDPOINTS = {
  // Sessions Musicales
  CREATE_SESSION: '/music/sessions',
  LIST_SESSIONS: '/music/sessions',
  GET_SESSION: '/music/sessions/:id',
  UPDATE_SESSION: '/music/sessions/:id',
  DELETE_SESSION: '/music/sessions/:id',
  COMPLETE_SESSION: '/music/sessions/:id/complete',

  // Playlists
  LIST_PLAYLISTS: '/music/playlists',
  CREATE_PLAYLIST: '/music/playlists',
  GET_PLAYLIST: '/music/playlists/:id',
  UPDATE_PLAYLIST: '/music/playlists/:id',
  DELETE_PLAYLIST: '/music/playlists/:id',
  ADD_TRACK: '/music/playlists/:id/tracks',

  // Génération AI (Suno/MusicGen)
  GENERATE_MUSIC: '/music/generate',
  LIST_GENERATED: '/music/generated',
  GET_GENERATED: '/music/generated/:id',
  DELETE_GENERATED: '/music/generated/:id',

  // Favoris
  LIST_FAVORITES: '/music/favorites',
  ADD_FAVORITE: '/music/favorites',
  REMOVE_FAVORITE: '/music/favorites/:id',

  // Historique
  GET_HISTORY: '/music/history',
  LOG_PLAY: '/music/play-log',
  LOG_SKIP: '/music/skip-log',

  // Queue de génération
  GET_QUEUE: '/music/queue',
  GET_QUEUE_STATUS: '/music/queue/:id/status',
  CANCEL_GENERATION: '/music/queue/cancel/:id',

  // Recommandations
  GET_RECOMMENDATIONS: '/music/recommendations',
  GET_PREFERENCES: '/music/preferences',
  UPDATE_PREFERENCES: '/music/preferences',

  // Analytics
  GET_ANALYTICS: '/music/analytics',
  GET_PROFILE: '/music/profile',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * COACH IA (CRITIQUE)
 * ════════════════════════════════════════════════════════════════
 */
export const COACH_ENDPOINTS = {
  // Sessions de Coaching
  CREATE_SESSION: '/coach/sessions',
  LIST_SESSIONS: '/coach/sessions',
  GET_SESSION: '/coach/sessions/:id',
  UPDATE_SESSION: '/coach/sessions/:id',
  DELETE_SESSION: '/coach/sessions/:id',
  CLOSE_SESSION: '/coach/sessions/:id/close',
  GET_SUMMARY: '/coach/sessions/:id/summary',

  // Messages (Chat)
  SEND_MESSAGE: '/coach/messages',
  GET_MESSAGES: '/coach/messages',
  GET_SESSION_MESSAGES: '/coach/sessions/:id/messages',
  DELETE_MESSAGE: '/coach/messages/:id',

  // Chat direct (service existant)
  CHAT: '/coach/chat',

  // Programmes
  LIST_PROGRAMS: '/coach/programs',
  GET_PROGRAM: '/coach/programs/:id',
  ENROLL_PROGRAM: '/coach/programs/:id/enroll',
  GET_PROGRESS: '/coach/programs/:id/progress',

  // Insights & Recommandations
  GET_INSIGHTS: '/coach/insights',
  GET_RECOMMENDATIONS: '/coach/recommendations',
  SEND_FEEDBACK: '/coach/feedback',

  // Analytics
  GET_ANALYTICS: '/coach/analytics',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * JOURNAL
 * ════════════════════════════════════════════════════════════════
 */
export const JOURNAL_ENDPOINTS = {
  // CRUD Entrées
  CREATE_ENTRY: '/journal/entries',
  LIST_ENTRIES: '/journal/entries',
  GET_ENTRY: '/journal/entries/:id',
  UPDATE_ENTRY: '/journal/entries/:id',
  DELETE_ENTRY: '/journal/entries/:id',

  // Recherche & Filtres
  SEARCH: '/journal/search',
  GET_TAGS: '/journal/tags',
  GET_BY_TAG: '/journal/tagged/:tag',
  GET_BY_DATE: '/journal/date/:date',

  // Statistiques
  GET_STATS: '/journal/stats',
  GET_INSIGHTS: '/journal/insights',

  // Export/Import
  EXPORT: '/journal/export',
  IMPORT: '/journal/import',

  // Prompts & Reminders
  GET_PROMPTS: '/journal/prompts',
  CREATE_PROMPT: '/journal/prompts',
  GET_REMINDERS: '/journal/reminders',
  CREATE_REMINDER: '/journal/reminders',
  UPDATE_REMINDER: '/journal/reminders/:id',
  DELETE_REMINDER: '/journal/reminders/:id',

  // Services existants
  VOICE_ENTRY: '/journal/voice',
  TEXT_ENTRY: '/journal/text',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * VR & EXPÉRIENCES IMMERSIVES
 * ════════════════════════════════════════════════════════════════
 */
export const VR_ENDPOINTS = {
  // Sessions VR
  CREATE_SESSION: '/vr/sessions',
  LIST_SESSIONS: '/vr/sessions',
  GET_SESSION: '/vr/sessions/:id',
  UPDATE_SESSION: '/vr/sessions/:id',
  DELETE_SESSION: '/vr/sessions/:id',
  COMPLETE_SESSION: '/vr/sessions/:id/complete',

  // Templates & Expériences
  LIST_TEMPLATES: '/vr/templates',
  GET_TEMPLATE: '/vr/templates/:id',
  LIST_EXPERIENCES: '/vr/experiences',
  GET_EXPERIENCE: '/vr/experiences/:id',
  GET_EXPERIENCE_STATS: '/vr/experiences/:id/stats',

  // Environnements
  LIST_ENVIRONMENTS: '/vr/environments',

  // Favoris
  LIST_FAVORITES: '/vr/favorites',
  ADD_FAVORITE: '/vr/favorites/:id',

  // AR Filters
  CREATE_AR_SESSION: '/ar/sessions',
  LIST_AR_SESSIONS: '/ar/sessions',
  LIST_AR_FILTERS: '/ar/filters',
  USE_AR_FILTER: '/ar/filters/:id/use',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * COMMUNITY & SOCIAL
 * ════════════════════════════════════════════════════════════════
 */
export const COMMUNITY_ENDPOINTS = {
  // Posts
  CREATE_POST: '/community/posts',
  LIST_POSTS: '/community/posts',
  GET_POST: '/community/posts/:id',
  UPDATE_POST: '/community/posts/:id',
  DELETE_POST: '/community/posts/:id',
  LIKE_POST: '/community/posts/:id/like',
  UNLIKE_POST: '/community/posts/:id/like',
  REPORT_POST: '/community/posts/:id/report',
  SHARE_POST: '/community/posts/:id/share',

  // Comments
  CREATE_COMMENT: '/community/posts/:id/comments',
  LIST_COMMENTS: '/community/posts/:id/comments',
  UPDATE_COMMENT: '/community/comments/:id',
  DELETE_COMMENT: '/community/comments/:id',
  LIKE_COMMENT: '/community/comments/:id/like',
  REPORT_COMMENT: '/community/comments/:id/report',

  // Groups
  CREATE_GROUP: '/community/groups',
  LIST_GROUPS: '/community/groups',
  GET_GROUP: '/community/groups/:id',
  UPDATE_GROUP: '/community/groups/:id',
  DELETE_GROUP: '/community/groups/:id',
  JOIN_GROUP: '/community/groups/:id/join',
  LEAVE_GROUP: '/community/groups/:id/leave',
  LIST_MEMBERS: '/community/groups/:id/members',
  INVITE_MEMBER: '/community/groups/:id/invite',
  GET_GROUP_POSTS: '/community/groups/:id/posts',
} as const;

export const FRIENDS_ENDPOINTS = {
  LIST_FRIENDS: '/friends',
  SEND_REQUEST: '/friends/requests',
  LIST_REQUESTS: '/friends/requests',
  ACCEPT_REQUEST: '/friends/requests/:id/accept',
  DECLINE_REQUEST: '/friends/requests/:id/decline',
  REMOVE_FRIEND: '/friends/:id',
} as const;

export const MESSAGES_ENDPOINTS = {
  SEND_MESSAGE: '/messages',
  LIST_CONVERSATIONS: '/messages',
  GET_CONVERSATION: '/messages/:conversationId',
  UPDATE_MESSAGE: '/messages/:id',
  DELETE_MESSAGE: '/messages/:id',
  MARK_AS_READ: '/messages/:id/read',
  GET_UNREAD: '/messages/unread',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * GOALS & WELLNESS
 * ════════════════════════════════════════════════════════════════
 */
export const GOALS_ENDPOINTS = {
  // Objectifs
  CREATE_GOAL: '/goals',
  LIST_GOALS: '/goals',
  GET_GOAL: '/goals/:id',
  UPDATE_GOAL: '/goals/:id',
  DELETE_GOAL: '/goals/:id',
  COMPLETE_GOAL: '/goals/:id/complete',
  UPDATE_PROGRESS: '/goals/:id/progress',
  GET_ACTIVE: '/goals/active',
  GET_COMPLETED: '/goals/completed',
  GET_STATS: '/goals/stats',
} as const;

export const WELLNESS_ENDPOINTS = {
  // Quêtes
  CREATE_QUEST: '/wellness/quests',
  LIST_QUESTS: '/wellness/quests',
  GET_QUEST: '/wellness/quests/:id',
  START_QUEST: '/wellness/quests/:id/start',
  COMPLETE_QUEST: '/wellness/quests/:id/complete',

  // Streak
  GET_STREAK: '/wellness/streak',

  // Coffres/Récompenses
  LIST_CHESTS: '/wellness/chests',
  OPEN_CHEST: '/wellness/chests/:id/open',
} as const;

export const RITUALS_ENDPOINTS = {
  CREATE_RITUAL: '/rituals',
  LIST_RITUALS: '/rituals',
  GET_RITUAL: '/rituals/:id',
  UPDATE_RITUAL: '/rituals/:id',
  DELETE_RITUAL: '/rituals/:id',
  COMPLETE_TODAY: '/rituals/:id/complete',
  GET_HISTORY: '/rituals/:id/history',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * GAMIFICATION
 * ════════════════════════════════════════════════════════════════
 */
export const GAMIFICATION_ENDPOINTS = {
  // Achievements
  LIST_ACHIEVEMENTS: '/gamification/achievements',
  GET_ACHIEVEMENT: '/gamification/achievements/:id',
  GET_UNLOCKED: '/gamification/achievements/unlocked',
  GET_PROGRESS: '/gamification/achievements/progress',

  // Badges
  LIST_BADGES: '/gamification/badges',
  GET_EARNED: '/gamification/badges/earned',
  GET_BADGE: '/gamification/badges/:id',

  // Challenges
  LIST_CHALLENGES: '/gamification/challenges',
  GET_CHALLENGE: '/gamification/challenges/:id',
  CREATE_CHALLENGE: '/gamification/challenges',
  JOIN_CHALLENGE: '/gamification/challenges/:id/join',
  COMPLETE_CHALLENGE: '/gamification/challenges/:id/complete',
  GET_CHALLENGE_LEADERBOARD: '/gamification/challenges/:id/leaderboard',
  GET_DAILY_CHALLENGES: '/gamification/challenges/daily',
  GET_ACTIVE_CHALLENGES: '/gamification/challenges/active',
  GET_CHALLENGE_HISTORY: '/gamification/challenges/history',

  // Leaderboards
  LIST_LEADERBOARDS: '/gamification/leaderboards',
  GET_LEADERBOARD: '/gamification/leaderboards/:type',
  GET_MY_POSITION: '/gamification/leaderboards/:type/me',
  GET_FRIENDS_LEADERBOARD: '/gamification/leaderboards/friends',

  // Points & Récompenses
  GET_POINTS: '/gamification/points',
  GET_POINTS_HISTORY: '/gamification/points/history',
  LIST_REWARDS: '/gamification/rewards',
  REDEEM_REWARD: '/gamification/rewards/:id/redeem',
  GET_REDEEMED: '/gamification/rewards/redeemed',

  // Stats générales
  GET_USER_STATS: '/gamification/user-stats',
  CHECK_PROGRESS: '/gamification/check-progress',
} as const;

export const GUILDS_ENDPOINTS = {
  CREATE_GUILD: '/guilds',
  LIST_GUILDS: '/guilds',
  GET_GUILD: '/guilds/:id',
  UPDATE_GUILD: '/guilds/:id',
  JOIN_GUILD: '/guilds/:id/join',
  LEAVE_GUILD: '/guilds/:id/leave',
  LIST_MEMBERS: '/guilds/:id/members',
  INVITE_MEMBER: '/guilds/:id/invite',
  GET_STATS: '/guilds/:id/stats',
  GET_CHALLENGES: '/guilds/:id/challenges',
} as const;

export const TOURNAMENTS_ENDPOINTS = {
  LIST_TOURNAMENTS: '/tournaments',
  GET_TOURNAMENT: '/tournaments/:id',
  REGISTER: '/tournaments/:id/register',
  GET_BRACKETS: '/tournaments/:id/brackets',
  GET_MATCHES: '/tournaments/:id/matches',
  GET_MATCH: '/matches/:id',
  SPECTATE_MATCH: '/matches/:id/spectate',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * ANALYTICS & RAPPORTS
 * ════════════════════════════════════════════════════════════════
 */
export const ANALYTICS_ENDPOINTS = {
  // Vue d'ensemble
  GET_OVERVIEW: '/analytics/overview',
  GET_DASHBOARD: '/analytics/dashboard',
  GET_REALTIME: '/analytics/realtime',
  COMPARE_PERIODS: '/analytics/compare',

  // Par module
  GET_EMOTIONS: '/analytics/emotions',
  GET_MUSIC: '/analytics/music',
  GET_JOURNAL: '/analytics/journal',
  GET_VR: '/analytics/vr',
  GET_COACH: '/analytics/coach',
  GET_COMMUNITY: '/analytics/community',

  // Tendances & Patterns
  GET_TRENDS: '/analytics/trends',
  GET_PATTERNS: '/analytics/patterns',
  GET_CORRELATIONS: '/analytics/correlations',
  GET_PREDICTIONS: '/analytics/predictions',
} as const;

export const REPORTS_ENDPOINTS = {
  LIST_REPORTS: '/reports',
  GENERATE_REPORT: '/reports/generate',
  GET_REPORT: '/reports/:id',
  GET_SCHEDULED: '/reports/scheduled',
  SCHEDULE_REPORT: '/reports/schedule',
  CANCEL_SCHEDULE: '/reports/schedule/:id',

  // Rapports prédéfinis
  GET_WEEKLY: '/reports/weekly',
  GET_MONTHLY: '/reports/monthly',
} as const;

export const EXPORT_ENDPOINTS = {
  EXPORT_DATA: '/export',
  GET_EXPORT_STATUS: '/export/:id/status',
  DOWNLOAD_EXPORT: '/export/:id/download',
  LIST_FORMATS: '/export/formats',
} as const;

export const INSIGHTS_ENDPOINTS = {
  GET_TODAY: '/insights',
  GET_WEEKLY: '/insights/weekly',
  GET_PERSONALIZED: '/insights/personalized',
  SEND_FEEDBACK: '/insights/feedback',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * FUN-FIRST MODULES (Pattern Unifié)
 * ════════════════════════════════════════════════════════════════
 */
export const MODULES_ENDPOINTS = {
  // Pattern générique pour tous les modules
  CREATE_SESSION: '/modules/:module/sessions',
  LIST_SESSIONS: '/modules/:module/sessions',
  GET_SESSION: '/modules/:module/sessions/:id',
  UPDATE_SESSION: '/modules/:module/sessions/:id',
  DELETE_SESSION: '/modules/:module/sessions/:id',
  GET_STATS: '/modules/:module/stats',
  GET_CONFIG: '/modules/:module/config',
} as const;

// Modules spécifiques
export const FLASH_GLOW_ENDPOINTS = {
  LIST_CARDS: '/flash-glow/cards',
  GET_HISTORY: '/flash-glow/history',
} as const;

export const BUBBLE_BEAT_ENDPOINTS = {
  SUBMIT_HIGHSCORE: '/bubble-beat/highscore',
  GET_LEADERBOARD: '/bubble-beat/leaderboard',
  GET_STATS: '/bubble-beat/stats',
} as const;

export const NYVEE_ENDPOINTS = {
  LIST_CONVERSATIONS: '/nyvee/conversations',
  SEND_MESSAGE: '/nyvee/message',
} as const;

export const AR_FILTERS_ENDPOINTS = {
  LIST_AVAILABLE: '/ar-filters/available',
  USE_FILTER: '/ar-filters/:id/use',
} as const;

export const SCREEN_SILK_ENDPOINTS = {
  LIST_WALLPAPERS: '/screen-silk/wallpapers',
  GET_GALLERY: '/screen-silk/gallery',
} as const;

export const MOOD_MIXER_ENDPOINTS = {
  LIST_PRESETS: '/mood-mixer/presets',
  CREATE_MIX: '/mood-mixer/create',
  GET_LIBRARY: '/mood-mixer/library',
} as const;

export const PARCOURS_XL_ENDPOINTS = {
  LIST_AVAILABLE: '/parcours-xl/available',
  GENERATE: '/parcours-xl/generate',
  EXTEND: '/parcours-xl/:id/extend',
  GET_LIBRARY: '/parcours-xl/library',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * B2B ENTERPRISE
 * ════════════════════════════════════════════════════════════════
 */
export const B2B_ENDPOINTS = {
  // Organizations
  LIST_ORGANIZATIONS: '/b2b/organizations',
  CREATE_ORGANIZATION: '/b2b/organizations',
  GET_ORGANIZATION: '/b2b/organization',
  UPDATE_ORGANIZATION: '/b2b/organization',
  GET_ORG_STATS: '/b2b/organization/stats',
  GET_ORG_MEMBERS: '/b2b/organization/members',

  // Teams
  CREATE_TEAM: '/b2b/teams',
  LIST_TEAMS: '/b2b/teams',
  GET_TEAM: '/b2b/teams/:id',
  UPDATE_TEAM: '/b2b/teams/:id',
  DELETE_TEAM: '/b2b/teams/:id',
  LIST_TEAM_MEMBERS: '/b2b/teams/:id/members',
  ADD_MEMBER: '/b2b/teams/:id/members',
  REMOVE_MEMBER: '/b2b/teams/:id/members/:userId',
  GET_TEAM_ANALYTICS: '/b2b/teams/:id/analytics',
  GET_TEAM_HEATMAP: '/b2b/teams/:id/heatmap',

  // Reports
  GET_ORG_REPORT: '/b2b/reports/organization',
  GET_TEAMS_REPORTS: '/b2b/reports/teams',
  GET_TEAM_REPORT: '/b2b/reports/team/:id',
  EXPORT_REPORT: '/b2b/reports/export',
  SCHEDULE_REPORT: '/b2b/reports/schedule',

  // Events
  CREATE_EVENT: '/b2b/events',
  LIST_EVENTS: '/b2b/events',
  GET_EVENT: '/b2b/events/:id',
  UPDATE_EVENT: '/b2b/events/:id',
  DELETE_EVENT: '/b2b/events/:id',
  RSVP_EVENT: '/b2b/events/:id/rsvp',
  LIST_ATTENDEES: '/b2b/events/:id/attendees',
  NOTIFY_ATTENDEES: '/b2b/events/:id/notify',

  // Roles & Permissions
  LIST_ROLES: '/b2b/roles',
  GET_MEMBER_ROLES: '/b2b/members/:id/roles',
  UPDATE_MEMBER_ROLES: '/b2b/members/:id/roles',
  LIST_PERMISSIONS: '/b2b/permissions',

  // Audit & Security
  GET_AUDIT_LOGS: '/b2b/audit/logs',
  EXPORT_AUDIT: '/b2b/audit/export',
  LIST_ACTIVE_SESSIONS: '/b2b/security/sessions',
  REVOKE_SESSION: '/b2b/security/revoke/:id',
  ROTATE_KEYS: '/b2b/security/rotate-keys',
  GET_SECURITY_ALERTS: '/b2b/security/alerts',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * ADMIN & MODERATION
 * ════════════════════════════════════════════════════════════════
 */
export const ADMIN_ENDPOINTS = {
  // User Management
  LIST_ALL_USERS: '/admin/users',
  GET_USER: '/admin/users/:id',
  UPDATE_USER: '/admin/users/:id',
  SUSPEND_USER: '/admin/users/:id/suspend',
  UNSUSPEND_USER: '/admin/users/:id/unsuspend',
  DELETE_USER: '/admin/users/:id',
  GET_USER_ACTIVITY: '/admin/users/:id/activity',
  IMPERSONATE: '/admin/users/:id/impersonate',

  // Content Moderation
  GET_MODERATION_QUEUE: '/admin/moderation/queue',
  GET_REPORTED_CONTENT: '/admin/moderation/reported',
  APPROVE_CONTENT: '/admin/moderation/:id/approve',
  REJECT_CONTENT: '/admin/moderation/:id/reject',
  BAN_USER: '/admin/moderation/:id/ban-user',

  // Feature Flags
  LIST_FEATURES: '/admin/features',
  UPDATE_FEATURE: '/admin/features/:id',
  CREATE_FEATURE: '/admin/features',
  GET_FEATURE_USERS: '/admin/features/:id/users',

  // System Configuration
  GET_CONFIG: '/admin/config',
  UPDATE_CONFIG: '/admin/config',
  GET_MODULES_CONFIG: '/admin/config/modules',
  UPDATE_MODULE_CONFIG: '/admin/config/modules/:id',

  // Database Maintenance
  VACUUM_DB: '/admin/db/vacuum',
  BACKUP_DB: '/admin/db/backup',
  GET_BACKUP_STATUS: '/admin/db/backup/status',
  RESTORE_DB: '/admin/db/restore',

  // Analytics Admin
  GET_ADMIN_ANALYTICS: '/admin/analytics/overview',
  GET_EMOTIONAL_TRENDS: '/admin/analytics/emotional-trends',
  GET_USAGE_STATISTICS: '/admin/analytics/usage-statistics',
  GENERATE_ADMIN_REPORT: '/admin/reports/generate',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * NOTIFICATIONS
 * ════════════════════════════════════════════════════════════════
 */
export const NOTIFICATIONS_ENDPOINTS = {
  LIST_NOTIFICATIONS: '/notifications/user',
  MARK_AS_READ: '/notifications/:id/read',
  MARK_ALL_AS_READ: '/notifications/mark-all-read',
  GET_UNREAD_COUNT: '/notifications/unread/count',

  // Préférences
  GET_PREFERENCES: '/notifications/preferences',
  UPDATE_PREFERENCES: '/notifications/preferences',

  // Push Notifications
  SUBSCRIBE_PUSH: '/notifications/push/subscribe',
  TEST_NOTIFICATION: '/notifications/test',

  // Templates
  LIST_TEMPLATES: '/notifications/templates',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * PRIVACY & RGPD
 * ════════════════════════════════════════════════════════════════
 */
export const PRIVACY_ENDPOINTS = {
  // Préférences confidentialité
  GET_PREFS: '/privacy/prefs/:userId',
  UPDATE_PREFS: '/privacy/prefs/:userId',

  // Consentement
  GIVE_CONSENT: '/privacy/consent',
  GET_CONSENT: '/privacy/consent/:userId',
  REVOKE_CONSENT: '/privacy/consent/:userId/revoke',

  // Données
  REQUEST_DATA_EXPORT: '/account/user/export',
  REQUEST_DATA_DELETION: '/privacy/data/:userId',
  GET_DATA_USAGE: '/privacy/data-usage',
  OPT_OUT: '/privacy/opt-out',

  // RGPD Dashboard
  GET_GDPR_DASHBOARD: '/gdpr/dashboard',
  LIST_REQUESTS: '/gdpr/requests',
  CREATE_REQUEST: '/gdpr/requests',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * INTEGRATIONS & WEBHOOKS
 * ════════════════════════════════════════════════════════════════
 */
export const WEBHOOKS_ENDPOINTS = {
  LIST_WEBHOOKS: '/webhooks',
  CREATE_WEBHOOK: '/webhooks',
  UPDATE_WEBHOOK: '/webhooks/:id',
  DELETE_WEBHOOK: '/webhooks/:id',
  GET_WEBHOOK_LOGS: '/webhooks/:id/logs',
} as const;

export const INTEGRATIONS_ENDPOINTS = {
  LIST_INTEGRATIONS: '/integrations',
  CONNECT_INTEGRATION: '/integrations/connect',
  DISCONNECT_INTEGRATION: '/integrations/:id',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * BILLING & SUBSCRIPTIONS
 * ════════════════════════════════════════════════════════════════
 */
export const BILLING_ENDPOINTS = {
  GET_SUBSCRIPTION: '/billing/subscription',
  SUBSCRIBE: '/billing/subscribe',
  UPDATE_SUBSCRIPTION: '/billing/subscription',
  CANCEL_SUBSCRIPTION: '/billing/subscription',

  LIST_INVOICES: '/billing/invoices',

  LIST_PAYMENT_METHODS: '/billing/payment-methods',
  ADD_PAYMENT_METHOD: '/billing/payment-methods',
  DELETE_PAYMENT_METHOD: '/billing/payment-methods/:id',

  GET_USAGE: '/billing/usage',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * SEARCH
 * ════════════════════════════════════════════════════════════════
 */
export const SEARCH_ENDPOINTS = {
  GLOBAL_SEARCH: '/search',
  SEARCH_JOURNAL: '/search/journal',
  SEARCH_MUSIC: '/search/music',
  SEARCH_USERS: '/search/users',
  SEARCH_GROUPS: '/search/groups',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * AI SERVICES
 * ════════════════════════════════════════════════════════════════
 */
export const AI_ENDPOINTS = {
  GENERATE_TEXT: '/ai/generate-text',
  GENERATE_IMAGE: '/ai/generate-image',
  TRANSCRIBE: '/ai/transcribe',
  ANALYZE_EMOTION: '/ai/analyze-emotion',
  GET_USAGE: '/ai/usage',
  GET_LIMITS: '/ai/limits',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * HEALTH & MONITORING
 * ════════════════════════════════════════════════════════════════
 */
export const HEALTH_ENDPOINTS = {
  HEALTH_CHECK: '/health',
  GET_METRICS: '/metrics',
  GET_STATUS: '/status',
} as const;

/**
 * ════════════════════════════════════════════════════════════════
 * EXPORT COMPLET DES ENDPOINTS
 * ════════════════════════════════════════════════════════════════
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  SCAN: SCAN_ENDPOINTS,
  ASSESSMENT: ASSESSMENT_ENDPOINTS,
  MUSIC: MUSIC_ENDPOINTS,
  COACH: COACH_ENDPOINTS,
  JOURNAL: JOURNAL_ENDPOINTS,
  VR: VR_ENDPOINTS,
  COMMUNITY: COMMUNITY_ENDPOINTS,
  FRIENDS: FRIENDS_ENDPOINTS,
  MESSAGES: MESSAGES_ENDPOINTS,
  GOALS: GOALS_ENDPOINTS,
  WELLNESS: WELLNESS_ENDPOINTS,
  RITUALS: RITUALS_ENDPOINTS,
  GAMIFICATION: GAMIFICATION_ENDPOINTS,
  GUILDS: GUILDS_ENDPOINTS,
  TOURNAMENTS: TOURNAMENTS_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
  EXPORT: EXPORT_ENDPOINTS,
  INSIGHTS: INSIGHTS_ENDPOINTS,
  MODULES: MODULES_ENDPOINTS,
  FLASH_GLOW: FLASH_GLOW_ENDPOINTS,
  BUBBLE_BEAT: BUBBLE_BEAT_ENDPOINTS,
  NYVEE: NYVEE_ENDPOINTS,
  AR_FILTERS: AR_FILTERS_ENDPOINTS,
  SCREEN_SILK: SCREEN_SILK_ENDPOINTS,
  MOOD_MIXER: MOOD_MIXER_ENDPOINTS,
  PARCOURS_XL: PARCOURS_XL_ENDPOINTS,
  B2B: B2B_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATIONS_ENDPOINTS,
  PRIVACY: PRIVACY_ENDPOINTS,
  WEBHOOKS: WEBHOOKS_ENDPOINTS,
  INTEGRATIONS: INTEGRATIONS_ENDPOINTS,
  BILLING: BILLING_ENDPOINTS,
  SEARCH: SEARCH_ENDPOINTS,
  AI: AI_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS,
} as const;

export default API_ENDPOINTS;
