// @ts-nocheck
import dayjs from 'dayjs';
import { GlobalInterceptor } from '@/utils/globalInterceptor';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Données hebdomadaires de respiration */
export interface BreathRow {
  week: string;
  hrv_stress_idx: number;
  coherence_avg: number;
  mvpa_minutes: number;
  relax_pct: number;
  mindfulness_pct: number;
  mood_avg: number;
}

/** Données organisation */
export interface BreathOrgRow extends BreathRow {
  member_count: number;
}

/** Session de respiration */
export interface BreathSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  protocol: string;
  breathsPerMinute: number;
  coherenceScore: number;
  hrvData?: number[];
  moodBefore?: string;
  moodAfter?: string;
  notes?: string;
}

/** Protocole de respiration */
export interface BreathProtocol {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cycles: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/** Statistiques de respiration */
export interface BreathStats {
  totalSessions: number;
  totalDuration: number;
  averageCoherence: number;
  bestStreak: number;
  currentStreak: number;
  favoriteProtocol: string;
  improvementRate: number;
}

/** Récupère les données hebdomadaires utilisateur */
export const fetchUserWeekly = async (since?: string): Promise<BreathRow[]> => {
  const qs = since ? `?since=${since}` : '';
  const res = await GlobalInterceptor.secureFetch(`/me/breath/weekly${qs}`);
  if (!res) throw new Error('Request failed');
  const { data } = await res.json();
  return data as BreathRow[];
};

/** Récupère les données hebdomadaires organisation */
export const fetchOrgWeekly = async (
  orgId: string,
  since?: string
): Promise<BreathOrgRow[]> => {
  const qs = since ? `?since=${since}` : '';
  const res = await GlobalInterceptor.secureFetch(
    `/org/${orgId}/breath/weekly${qs}`
  );
  if (!res) throw new Error('Request failed');
  const { data } = await res.json();
  return data as BreathOrgRow[];
};

/** Démarre une session de respiration */
export const startBreathSession = async (
  protocol: string,
  moodBefore?: string
): Promise<BreathSession> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('breath_sessions')
      .insert({
        user_id: userData.user.id,
        protocol,
        mood_before: moodBefore,
        start_time: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    logger.info('Breath session started', { protocol }, 'BREATH');

    return mapSessionFromDb(data);
  } catch (error) {
    logger.error('Error starting session', error as Error, 'BREATH');
    throw error;
  }
};

/** Termine une session de respiration */
export const completeBreathSession = async (
  sessionId: string,
  coherenceScore: number,
  hrvData?: number[],
  moodAfter?: string,
  notes?: string
): Promise<BreathSession> => {
  try {
    const { data, error } = await supabase
      .from('breath_sessions')
      .update({
        end_time: new Date().toISOString(),
        coherence_score: coherenceScore,
        hrv_data: hrvData,
        mood_after: moodAfter,
        notes
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    logger.info('Breath session completed', { sessionId, coherenceScore }, 'BREATH');

    return mapSessionFromDb(data);
  } catch (error) {
    logger.error('Error completing session', error as Error, 'BREATH');
    throw error;
  }
};

/** Récupère les sessions utilisateur */
export const getUserSessions = async (
  limit = 20,
  offset = 0
): Promise<BreathSession[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data, error } = await supabase
      .from('breath_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data || []).map(mapSessionFromDb);
  } catch (error) {
    logger.error('Error fetching sessions', error as Error, 'BREATH');
    return [];
  }
};

/** Récupère les statistiques de respiration */
export const getBreathStats = async (): Promise<BreathStats> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return getDefaultStats();

    const { data } = await supabase
      .from('breath_stats')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (!data) return getDefaultStats();

    return {
      totalSessions: data.total_sessions || 0,
      totalDuration: data.total_duration || 0,
      averageCoherence: data.average_coherence || 0,
      bestStreak: data.best_streak || 0,
      currentStreak: data.current_streak || 0,
      favoriteProtocol: data.favorite_protocol || 'basic',
      improvementRate: data.improvement_rate || 0
    };
  } catch (error) {
    return getDefaultStats();
  }
};

/** Récupère les protocoles disponibles */
export const getProtocols = (): BreathProtocol[] => [
  {
    id: 'box',
    name: 'Respiration carrée',
    description: 'Technique d\'apaisement rapide',
    inhale: 4, hold1: 4, exhale: 4, hold2: 4,
    cycles: 4, difficulty: 'beginner'
  },
  {
    id: '478',
    name: 'Technique 4-7-8',
    description: 'Pour le sommeil et la relaxation profonde',
    inhale: 4, hold1: 7, exhale: 8, hold2: 0,
    cycles: 4, difficulty: 'intermediate'
  },
  {
    id: 'coherence',
    name: 'Cohérence cardiaque',
    description: 'Synchronisation cœur-cerveau',
    inhale: 5, hold1: 0, exhale: 5, hold2: 0,
    cycles: 6, difficulty: 'beginner'
  },
  {
    id: 'energizing',
    name: 'Respiration énergisante',
    description: 'Boost d\'énergie naturel',
    inhale: 3, hold1: 3, exhale: 3, hold2: 3,
    cycles: 8, difficulty: 'intermediate'
  },
  {
    id: 'calming',
    name: 'Apaisement profond',
    description: 'Réduction du stress avancée',
    inhale: 4, hold1: 4, exhale: 6, hold2: 2,
    cycles: 6, difficulty: 'advanced'
  }
];

/** Récupère un protocole par ID */
export const getProtocolById = (id: string): BreathProtocol | undefined => {
  return getProtocols().find(p => p.id === id);
};

/** Calcule le score de cohérence */
export const calculateCoherenceScore = (hrvData: number[]): number => {
  if (hrvData.length < 2) return 0;

  // Calcul simplifié basé sur la variabilité
  const mean = hrvData.reduce((a, b) => a + b, 0) / hrvData.length;
  const variance = hrvData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / hrvData.length;
  const stdDev = Math.sqrt(variance);

  // Score inversement proportionnel à la variabilité (cohérence = régularité)
  const normalizedScore = Math.max(0, 100 - stdDev * 2);
  return Math.round(normalizedScore);
};

/** Analyse les tendances de respiration */
export const analyzeBreathTrends = async (days = 30): Promise<{
  coherenceTrend: number[];
  durationTrend: number[];
  improvementPct: number;
}> => {
  try {
    const sessions = await getUserSessions(100);
    const cutoffDate = dayjs().subtract(days, 'day');

    const recentSessions = sessions.filter(
      s => dayjs(s.startTime).isAfter(cutoffDate)
    );

    const coherenceTrend = recentSessions.map(s => s.coherenceScore);
    const durationTrend = recentSessions.map(s => s.duration);

    const firstWeek = coherenceTrend.slice(-7);
    const lastWeek = coherenceTrend.slice(0, 7);

    const firstAvg = firstWeek.length ? firstWeek.reduce((a, b) => a + b, 0) / firstWeek.length : 0;
    const lastAvg = lastWeek.length ? lastWeek.reduce((a, b) => a + b, 0) / lastWeek.length : 0;

    const improvementPct = firstAvg > 0 ? ((lastAvg - firstAvg) / firstAvg) * 100 : 0;

    return { coherenceTrend, durationTrend, improvementPct };
  } catch (error) {
    return { coherenceTrend: [], durationTrend: [], improvementPct: 0 };
  }
};

/** Exporte les données de respiration */
export const exportBreathData = async (): Promise<string> => {
  const sessions = await getUserSessions(1000);
  const stats = await getBreathStats();

  let csv = 'Date,Protocole,Durée(s),Score cohérence,Humeur avant,Humeur après\n';

  for (const session of sessions) {
    csv += `${dayjs(session.startTime).format('YYYY-MM-DD HH:mm')},`;
    csv += `${session.protocol},${session.duration},${session.coherenceScore},`;
    csv += `${session.moodBefore || ''},${session.moodAfter || ''}\n`;
  }

  return csv;
};

function mapSessionFromDb(data: any): BreathSession {
  return {
    id: data.id,
    userId: data.user_id,
    startTime: new Date(data.start_time),
    endTime: data.end_time ? new Date(data.end_time) : undefined,
    duration: data.duration || 0,
    protocol: data.protocol,
    breathsPerMinute: data.breaths_per_minute || 6,
    coherenceScore: data.coherence_score || 0,
    hrvData: data.hrv_data,
    moodBefore: data.mood_before,
    moodAfter: data.mood_after,
    notes: data.notes
  };
}

function getDefaultStats(): BreathStats {
  return {
    totalSessions: 0,
    totalDuration: 0,
    averageCoherence: 0,
    bestStreak: 0,
    currentStreak: 0,
    favoriteProtocol: 'box',
    improvementRate: 0
  };
}
