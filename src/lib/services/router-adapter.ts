// @ts-nocheck
/**
 * Router Adapter Service
 * Couche d'abstraction pour la migration vers les routeurs consolidés
 * 
 * Permet de migrer progressivement le frontend sans casser les appels existants
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types pour les routeurs
type RouterName = 
  | 'router-ai'
  | 'router-music'
  | 'router-b2b'
  | 'router-system'
  | 'router-wellness'
  | 'router-gdpr'
  | 'router-context-lens'
  | 'router-community';

interface RouterCall<T = any> {
  action: string;
  payload?: T;
}

interface RouterResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

/**
 * Appel générique à un routeur
 */
export async function callRouter<TPayload = any, TResponse = any>(
  router: RouterName,
  action: string,
  payload?: TPayload
): Promise<RouterResponse<TResponse>> {
  try {
    const { data, error } = await supabase.functions.invoke(router, {
      body: { action, payload: payload || {} },
    });

    if (error) {
      logger.error(`[Router] ${router}/${action} error:`, error, 'API');
      return { success: false, error: error.message };
    }

    return data as RouterResponse<TResponse>;
  } catch (err) {
    logger.error(`[Router] ${router}/${action} exception:`, err, 'API');
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

// ==========================================
// ROUTER AI - Fonctions IA
// ==========================================

export const aiRouter = {
  coach: (message: string, context?: string, personality?: string) =>
    callRouter('router-ai', 'coach', { message, context, personality }),

  analyze: (text: string, type?: string) =>
    callRouter('router-ai', 'analyze', { text, type }),

  moderate: (text: string, context?: string) =>
    callRouter('router-ai', 'moderate', { text, context }),

  chat: (messages: Array<{ role: string; content: string }>, maxTokens?: number) =>
    callRouter('router-ai', 'chat', { messages, maxTokens }),

  embed: (text: string, model?: string) =>
    callRouter('router-ai', 'embed', { text, model }),

  summarize: (text: string, maxLength?: number) =>
    callRouter('router-ai', 'summarize', { text, maxLength }),

  translate: (text: string, targetLang?: string) =>
    callRouter('router-ai', 'translate', { text, targetLang }),

  crisisDetect: (text: string, context?: string) =>
    callRouter('router-ai', 'crisis-detect', { text, context }),

  emotionAnalyze: (input_type: string, raw_input: string, intensity?: number, context_tags?: string[]) =>
    callRouter('router-ai', 'emotion-analyze', { input_type, raw_input, intensity, context_tags }),
};

// ==========================================
// ROUTER MUSIC - Génération musicale
// ==========================================

export const musicRouter = {
  generate: (emotion: string, prompt?: string, options?: {
    style?: string;
    title?: string;
    instrumental?: boolean;
    bpmMin?: number;
    bpmMax?: number;
  }) => callRouter('router-music', 'generate', { emotion, prompt, ...options }),

  status: (taskId: string, trackId?: string) =>
    callRouter('router-music', 'status', { taskId, trackId }),

  extend: (audioId: string, continueAt?: number, prompt?: string) =>
    callRouter('router-music', 'extend', { audioId, continueAt, prompt }),

  analyzeEmotions: () =>
    callRouter('router-music', 'analyze-emotions', {}),

  recommendations: () =>
    callRouter('router-music', 'recommendations', {}),

  credits: () =>
    callRouter('router-music', 'credits', {}),

  fallback: (mood?: string) =>
    callRouter('router-music', 'fallback', { mood }),

  savePreferences: (prefs: {
    favorite_genres?: string[];
    preferred_tempos?: { min: number; max: number };
    favorite_moods?: string[];
    instrumental_preference?: boolean;
  }) => callRouter('router-music', 'save-preferences', prefs),

  health: () =>
    callRouter('router-music', 'health', {}),
};

// ==========================================
// ROUTER B2B - Enterprise
// ==========================================

export const b2bRouter = {
  aggregate: (orgId?: string, period?: string) =>
    callRouter('router-b2b', 'aggregate', { orgId, period }),

  report: (type?: string, format?: string) =>
    callRouter('router-b2b', 'report', { type, format }),

  auditExport: (startDate?: string, endDate?: string) =>
    callRouter('router-b2b', 'audit-export', { startDate, endDate }),

  heatmap: (period?: string) =>
    callRouter('router-b2b', 'heatmap', { period }),

  teamInvite: (email: string, role?: string) =>
    callRouter('router-b2b', 'team-invite', { email, role }),

  teamAccept: (invitationId: string) =>
    callRouter('router-b2b', 'team-accept', { invitationId }),

  teamRole: (memberId: string, newRole: string) =>
    callRouter('router-b2b', 'team-role', { memberId, newRole }),

  eventsList: (limit?: number, upcoming?: boolean) =>
    callRouter('router-b2b', 'events-list', { limit, upcoming }),

  eventsCreate: (title: string, event_date: string, options?: {
    description?: string;
    location?: string;
    event_type?: string;
  }) => callRouter('router-b2b', 'events-create', { title, event_date, ...options }),

  eventsUpdate: (eventId: string, updates: Record<string, any>) =>
    callRouter('router-b2b', 'events-update', { eventId, ...updates }),

  eventsDelete: (eventId: string) =>
    callRouter('router-b2b', 'events-delete', { eventId }),

  eventsRsvp: (eventId: string, status: string) =>
    callRouter('router-b2b', 'events-rsvp', { eventId, status }),

  securityRoles: (action: string, userId?: string, role?: string) =>
    callRouter('router-b2b', 'security-roles', { action, userId, role }),

  monthlyReport: (month?: number, year?: number) =>
    callRouter('router-b2b', 'monthly-report', { month, year }),

  optimisation: () =>
    callRouter('router-b2b', 'optimisation', {}),
};

// ==========================================
// ROUTER SYSTEM - Système
// ==========================================

export const systemRouter = {
  health: () =>
    callRouter('router-system', 'health', {}),

  metrics: (type?: string) =>
    callRouter('router-system', 'metrics', { type }),

  notify: (title: string, message: string, type?: string, targetUserId?: string) =>
    callRouter('router-system', 'notify', { title, message, type, targetUserId }),

  push: (title: string, body: string, data?: Record<string, any>) =>
    callRouter('router-system', 'push', { title, body, data }),

  email: (to: string, subject: string, body?: string, template?: string) =>
    callRouter('router-system', 'email', { to, subject, body, template }),

  webhook: (url: string, data?: Record<string, any>, method?: string) =>
    callRouter('router-system', 'webhook', { url, data, method }),

  quota: () =>
    callRouter('router-system', 'quota', {}),

  rateLimit: (route?: string) =>
    callRouter('router-system', 'rate-limit', { route }),

  logs: (level: string, message: string, context?: Record<string, any>) =>
    callRouter('router-system', 'logs', { level, message, context }),

  sessionCreate: (type: string, metadata?: Record<string, any>) =>
    callRouter('router-system', 'session-create', { type, metadata }),

  sessionUpdate: (sessionId: string, completed?: boolean, metrics?: Record<string, any>) =>
    callRouter('router-system', 'session-update', { sessionId, completed, metrics }),
};

// ==========================================
// ROUTER WELLNESS - Bien-être
// ==========================================

export const wellnessRouter = {
  meditationStart: (type?: string, duration?: number, theme?: string) =>
    callRouter('router-wellness', 'meditation-start', { type, duration, theme }),

  meditationComplete: (sessionId: string, options?: {
    actualDuration?: number;
    rating?: number;
    notes?: string;
    moodAfter?: string;
  }) => callRouter('router-wellness', 'meditation-complete', { sessionId, ...options }),

  activityLog: (activityId: string, duration: number, options?: {
    rating?: number;
    notes?: string;
    moodBefore?: string;
    moodAfter?: string;
  }) => callRouter('router-wellness', 'activity-log', { activityId, duration, ...options }),

  activityHistory: (limit?: number, offset?: number) =>
    callRouter('router-wellness', 'activity-history', { limit, offset }),

  breathingStart: (pattern?: string, duration?: number) =>
    callRouter('router-wellness', 'breathing-start', { pattern, duration }),

  breathingComplete: (sessionId: string, options?: {
    actualDuration?: number;
    rating?: number;
    heartRateBefore?: number;
    heartRateAfter?: number;
  }) => callRouter('router-wellness', 'breathing-complete', { sessionId, ...options }),

  journalCreate: (content: string, options?: {
    title?: string;
    mood?: string;
    tags?: string[];
    isPrivate?: boolean;
  }) => callRouter('router-wellness', 'journal-create', { content, ...options }),

  journalList: (limit?: number, offset?: number, search?: string) =>
    callRouter('router-wellness', 'journal-list', { limit, offset, search }),

  moodLog: (mood: string, intensity?: number, notes?: string, context?: string[]) =>
    callRouter('router-wellness', 'mood-log', { mood, intensity, notes, context }),

  moodHistory: (days?: number) =>
    callRouter('router-wellness', 'mood-history', { days }),

  streak: () =>
    callRouter('router-wellness', 'streak', {}),

  goals: (action: string, options?: {
    type?: string;
    target?: number;
    deadline?: string;
  }) => callRouter('router-wellness', 'goals', { action, ...options }),

  recommendations: () =>
    callRouter('router-wellness', 'recommendations', {}),
};

// ==========================================
// ROUTER GDPR - Conformité
// ==========================================

export const gdprRouter = {
  export: () =>
    callRouter('router-gdpr', 'export', {}),

  delete: (confirm: string, reason?: string) =>
    callRouter('router-gdpr', 'delete', { confirm, reason }),

  consentGet: () =>
    callRouter('router-gdpr', 'consent-get', {}),

  consentUpdate: (consentType: string, granted: boolean, version?: string) =>
    callRouter('router-gdpr', 'consent-update', { consentType, granted, version }),

  consentHistory: () =>
    callRouter('router-gdpr', 'consent-history', {}),

  dsarCreate: (type: string, details?: string) =>
    callRouter('router-gdpr', 'dsar-create', { type, details }),

  dsarStatus: (requestId?: string) =>
    callRouter('router-gdpr', 'dsar-status', { requestId }),

  complianceScore: () =>
    callRouter('router-gdpr', 'compliance-score', {}),

  anonymize: (tables?: string[], olderThanDays?: number) =>
    callRouter('router-gdpr', 'anonymize', { tables, olderThanDays }),

  retentionCheck: () =>
    callRouter('router-gdpr', 'retention-check', {}),
};

// ==========================================
// ROUTER CONTEXT LENS - Clinique
// ==========================================

export const contextLensRouter = {
  auth: () =>
    callRouter('router-context-lens', 'auth', {}),

  patientsList: (limit?: number, offset?: number, search?: string) =>
    callRouter('router-context-lens', 'patients-list', { limit, offset, search }),

  patientsCreate: (firstName: string, lastName: string, options?: {
    dateOfBirth?: string;
    email?: string;
    notes?: string;
  }) => callRouter('router-context-lens', 'patients-create', { firstName, lastName, ...options }),

  patientsGet: (patientId: string) =>
    callRouter('router-context-lens', 'patients-get', { patientId }),

  notesCreate: (patientId: string, content: string, type?: string, tags?: string[]) =>
    callRouter('router-context-lens', 'notes-create', { patientId, content, type, tags }),

  notesList: (patientId: string, limit?: number) =>
    callRouter('router-context-lens', 'notes-list', { patientId, limit }),

  brainAnalyze: (data: any, type?: string) =>
    callRouter('router-context-lens', 'brain-analyze', { data, type }),

  emotions: (patientId: string, period?: string) =>
    callRouter('router-context-lens', 'emotions', { patientId, period }),

  patterns: (patientId: string, type?: string) =>
    callRouter('router-context-lens', 'patterns', { patientId, type }),

  insights: (patientId: string) =>
    callRouter('router-context-lens', 'insights', { patientId }),

  reportsGenerate: (patientId: string, type?: string, period?: string) =>
    callRouter('router-context-lens', 'reports-generate', { patientId, type, period }),

  nlpAnalyze: (text: string, type?: string) =>
    callRouter('router-context-lens', 'nlp-analyze', { text, type }),
};

// ==========================================
// ROUTER COMMUNITY - Communauté
// ==========================================

export const communityRouter = {
  groupsList: (limit?: number, myGroups?: boolean) =>
    callRouter('router-community', 'groups-list', { limit, myGroups }),

  groupsCreate: (name: string, description?: string, category?: string, isPrivate?: boolean) =>
    callRouter('router-community', 'groups-create', { name, description, category, isPrivate }),

  groupsJoin: (groupId: string) =>
    callRouter('router-community', 'groups-join', { groupId }),

  groupsLeave: (groupId: string) =>
    callRouter('router-community', 'groups-leave', { groupId }),

  postsCreate: (content: string, groupId?: string, type?: string, tags?: string[]) =>
    callRouter('router-community', 'posts-create', { content, groupId, type, tags }),

  postsList: (groupId?: string, limit?: number, offset?: number) =>
    callRouter('router-community', 'posts-list', { groupId, limit, offset }),

  postsReact: (postId: string, reaction: string) =>
    callRouter('router-community', 'posts-react', { postId, reaction }),

  leaderboard: (period?: string, limit?: number) =>
    callRouter('router-community', 'leaderboard', { period, limit }),

  badgesList: (earnedOnly?: boolean) =>
    callRouter('router-community', 'badges-list', { earnedOnly }),

  badgesEarn: (badgeId: string) =>
    callRouter('router-community', 'badges-earn', { badgeId }),

  challengesList: (active?: boolean) =>
    callRouter('router-community', 'challenges-list', { active }),

  challengesJoin: (challengeId: string) =>
    callRouter('router-community', 'challenges-join', { challengeId }),

  challengesComplete: (challengeId: string, proof?: string) =>
    callRouter('router-community', 'challenges-complete', { challengeId, proof }),
};

// ==========================================
// MIGRATION HELPERS - Compatibilité legacy
// ==========================================

/**
 * Mapping des anciennes fonctions vers les nouveaux routeurs
 * Pour faciliter la migration progressive
 */
export const legacyMapping = {
  // AI Functions
  'ai-coach': (payload: any) => aiRouter.coach(payload.message, payload.context),
  'ai-analysis': (payload: any) => aiRouter.analyze(payload.text, payload.type),
  'ai-moderate': (payload: any) => aiRouter.moderate(payload.text, payload.context),
  'openai-chat': (payload: any) => aiRouter.chat(payload.messages),
  'crisis-detection': (payload: any) => aiRouter.crisisDetect(payload.text, payload.context),
  'analyze-emotion': (payload: any) => aiRouter.emotionAnalyze(
    payload.input_type, 
    payload.raw_input, 
    payload.intensity, 
    payload.context_tags
  ),

  // Music Functions
  'suno-music': (payload: any) => {
    switch (payload.action) {
      case 'generate':
      case 'start':
        return musicRouter.generate(payload.mood || payload.emotion, payload.prompt);
      case 'status':
        return musicRouter.status(payload.trackIds?.[0] || payload.taskId);
      case 'extend':
        return musicRouter.extend(payload.audioId, payload.continueAt);
      case 'credits':
        return musicRouter.credits();
      default:
        return musicRouter.fallback(payload.mood);
    }
  },
  'generate-music': (payload: any) => musicRouter.generate(payload.emotion, payload.prompt),
  'emotion-music-ai': (payload: any) => {
    switch (payload.action) {
      case 'analyze-emotions':
        return musicRouter.analyzeEmotions();
      case 'generate-music':
        return musicRouter.generate(payload.emotion, payload.customPrompt);
      case 'check-status':
        return musicRouter.status(payload.sunoTaskId, payload.trackId);
      default:
        return musicRouter.recommendations();
    }
  },

  // Wellness Functions
  'meditation-api': (payload: any) => {
    if (payload.action === 'start') {
      return wellnessRouter.meditationStart(payload.type, payload.duration);
    }
    return wellnessRouter.meditationComplete(payload.sessionId, payload);
  },
  'activities-api': (payload: any) => wellnessRouter.activityLog(
    payload.activityId, 
    payload.duration, 
    payload
  ),
  'journal': (payload: any) => wellnessRouter.journalCreate(payload.content, payload),

  // B2B Functions
  'b2b-aggregate': (payload: any) => b2bRouter.aggregate(payload.orgId, payload.period),
  'b2b-report': (payload: any) => b2bRouter.report(payload.type, payload.format),

  // GDPR Functions
  'data-export': () => gdprRouter.export(),
  'consent-manager': (payload: any) => gdprRouter.consentUpdate(
    payload.consentType, 
    payload.granted
  ),
};

/**
 * Wrapper de migration - Appelle l'ancien endpoint ou le nouveau selon le mapping
 */
export async function callLegacyOrRouter(
  functionName: string,
  payload: any
): Promise<any> {
  const mapper = legacyMapping[functionName as keyof typeof legacyMapping];
  
  if (mapper) {
    logger.info(`[Migration] Routing ${functionName} to consolidated router`, undefined, 'API');
    return mapper(payload);
  }

  // Fallback sur l'ancienne fonction
  logger.warn(`[Migration] No router mapping for ${functionName}, using legacy`, undefined, 'API');
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) throw error;
  return data;
}
