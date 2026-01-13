/**
 * Service pour le module Breath Constellation
 * Gestion des sessions de respiration avec visualisation constellation
 */

import { supabase } from '@/integrations/supabase/client';
import {
  BreathConstellationSession,
  BreathConstellationStats,
  CreateBreathConstellationSession,
  CompleteBreathConstellationSession,
  ConstellationData,
  ConstellationType,
  CONSTELLATION_PRESETS,
} from './types';

// ============================================================================
// CONSTELLATION DATA
// ============================================================================

const CONSTELLATIONS: Record<ConstellationType, ConstellationData> = {
  orion: {
    type: 'orion',
    name: 'Orion',
    stars: [
      { id: 'betelgeuse', x: 20, y: 20, brightness: 1.0, connected: false },
      { id: 'bellatrix', x: 80, y: 20, brightness: 0.9, connected: false },
      { id: 'alnitak', x: 35, y: 50, brightness: 0.85, connected: false },
      { id: 'alnilam', x: 50, y: 50, brightness: 0.9, connected: false },
      { id: 'mintaka', x: 65, y: 50, brightness: 0.85, connected: false },
      { id: 'saiph', x: 25, y: 85, brightness: 0.8, connected: false },
      { id: 'rigel', x: 75, y: 85, brightness: 1.0, connected: false },
    ],
    connections: [
      ['betelgeuse', 'bellatrix'],
      ['betelgeuse', 'alnitak'],
      ['bellatrix', 'mintaka'],
      ['alnitak', 'alnilam'],
      ['alnilam', 'mintaka'],
      ['alnitak', 'saiph'],
      ['mintaka', 'rigel'],
    ],
    mythology: 'Le chasseur géant de la mythologie grecque',
    therapeuticMeaning: 'Force, courage et protection - chaque étoile connectée renforce votre ancrage',
  },
  cassiopeia: {
    type: 'cassiopeia',
    name: 'Cassiopée',
    stars: [
      { id: 'schedar', x: 10, y: 40, brightness: 0.95, connected: false },
      { id: 'caph', x: 30, y: 20, brightness: 0.9, connected: false },
      { id: 'gamma', x: 50, y: 50, brightness: 0.85, connected: false },
      { id: 'ruchbah', x: 70, y: 30, brightness: 0.8, connected: false },
      { id: 'segin', x: 90, y: 45, brightness: 0.75, connected: false },
    ],
    connections: [
      ['schedar', 'caph'],
      ['caph', 'gamma'],
      ['gamma', 'ruchbah'],
      ['ruchbah', 'segin'],
    ],
    mythology: 'La reine vaniteuse transformée en constellation',
    therapeuticMeaning: 'Transformation et acceptation de soi - un W céleste pour la sagesse',
  },
  'ursa-major': {
    type: 'ursa-major',
    name: 'Grande Ourse',
    stars: [
      { id: 'dubhe', x: 20, y: 30, brightness: 0.95, connected: false },
      { id: 'merak', x: 20, y: 50, brightness: 0.9, connected: false },
      { id: 'phecda', x: 40, y: 55, brightness: 0.85, connected: false },
      { id: 'megrez', x: 50, y: 40, brightness: 0.7, connected: false },
      { id: 'alioth', x: 65, y: 35, brightness: 0.9, connected: false },
      { id: 'mizar', x: 80, y: 30, brightness: 0.85, connected: false },
      { id: 'alkaid', x: 95, y: 20, brightness: 0.9, connected: false },
    ],
    connections: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
    ],
    mythology: 'La grande ourse, guide des voyageurs',
    therapeuticMeaning: 'Direction et guidance - trouvez votre étoile polaire intérieure',
  },
  pleiades: {
    type: 'pleiades',
    name: 'Pléiades',
    stars: [
      { id: 'alcyone', x: 50, y: 40, brightness: 1.0, connected: false },
      { id: 'atlas', x: 55, y: 55, brightness: 0.85, connected: false },
      { id: 'electra', x: 40, y: 50, brightness: 0.9, connected: false },
      { id: 'maia', x: 60, y: 35, brightness: 0.88, connected: false },
      { id: 'merope', x: 45, y: 60, brightness: 0.82, connected: false },
      { id: 'taygeta', x: 35, y: 35, brightness: 0.8, connected: false },
      { id: 'celaeno', x: 65, y: 50, brightness: 0.75, connected: false },
    ],
    connections: [
      ['alcyone', 'atlas'],
      ['alcyone', 'electra'],
      ['alcyone', 'maia'],
      ['atlas', 'merope'],
      ['electra', 'taygeta'],
      ['maia', 'celaeno'],
    ],
    mythology: 'Les sept sœurs, filles d\'Atlas',
    therapeuticMeaning: 'Unité et connexion - sept lumières qui brillent ensemble plus fort',
  },
  custom: {
    type: 'custom',
    name: 'Personnalisée',
    stars: [
      { id: 'center', x: 50, y: 50, brightness: 1.0, connected: false },
      { id: 'north', x: 50, y: 20, brightness: 0.8, connected: false },
      { id: 'south', x: 50, y: 80, brightness: 0.8, connected: false },
      { id: 'east', x: 80, y: 50, brightness: 0.8, connected: false },
      { id: 'west', x: 20, y: 50, brightness: 0.8, connected: false },
    ],
    connections: [
      ['center', 'north'],
      ['center', 'south'],
      ['center', 'east'],
      ['center', 'west'],
    ],
    mythology: 'Votre propre constellation',
    therapeuticMeaning: 'Créez votre propre chemin de lumière',
  },
};

// ============================================================================
// SERVICE
// ============================================================================

export const breathConstellationService = {
  /**
   * Récupérer les données d'une constellation
   */
  getConstellationData(type: ConstellationType): ConstellationData {
    return CONSTELLATIONS[type];
  },

  /**
   * Récupérer tous les presets disponibles
   */
  getPresets() {
    return CONSTELLATION_PRESETS;
  },

  /**
   * Créer une nouvelle session
   */
  async createSession(payload: CreateBreathConstellationSession): Promise<BreathConstellationSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const session: BreathConstellationSession = {
      id: sessionId,
      userId: user.id,
      config: payload.config,
      startedAt: now,
      cyclesCompleted: 0,
      durationSeconds: 0,
      moodBefore: payload.moodBefore,
      starsConnected: 0,
      breathingRegularity: 0,
    };

    // Stocker en localStorage pour session active (pas de table dédiée)
    const storageKey = `breath_constellation_session_${sessionId}`;
    localStorage.setItem(storageKey, JSON.stringify(session));

    return session;
  },

  /**
   * Compléter une session
   */
  async completeSession(payload: CompleteBreathConstellationSession): Promise<BreathConstellationSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const storageKey = `breath_constellation_session_${payload.sessionId}`;
    const storedSession = localStorage.getItem(storageKey);
    
    if (!storedSession) {
      throw new Error('Session not found');
    }

    const session: BreathConstellationSession = JSON.parse(storedSession);
    
    const completedSession: BreathConstellationSession = {
      ...session,
      completedAt: new Date().toISOString(),
      cyclesCompleted: payload.cyclesCompleted,
      durationSeconds: payload.durationSeconds,
      moodAfter: payload.moodAfter,
      notes: payload.notes,
      starsConnected: payload.starsConnected,
      breathingRegularity: payload.breathingRegularity,
    };

    // Sauvegarder dans l'historique
    const historyKey = `breath_constellation_history_${user.id}`;
    const history: BreathConstellationSession[] = JSON.parse(
      localStorage.getItem(historyKey) || '[]'
    );
    history.unshift(completedSession);
    
    // Garder les 50 dernières sessions
    if (history.length > 50) history.pop();
    
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.removeItem(storageKey);

    return completedSession;
  },

  /**
   * Récupérer l'historique des sessions
   */
  async fetchHistory(limit = 10): Promise<BreathConstellationSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const historyKey = `breath_constellation_history_${user.id}`;
    const history: BreathConstellationSession[] = JSON.parse(
      localStorage.getItem(historyKey) || '[]'
    );

    return history.slice(0, limit);
  },

  /**
   * Calculer les statistiques
   */
  async getStats(): Promise<BreathConstellationStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return this.getDefaultStats();
    }

    const history = await this.fetchHistory(100);

    if (history.length === 0) {
      return this.getDefaultStats();
    }

    const totalSessions = history.length;
    const totalMinutes = history.reduce((sum, s) => sum + (s.durationSeconds / 60), 0);
    const avgCycles = history.reduce((sum, s) => sum + s.cyclesCompleted, 0) / totalSessions;

    // Constellation favorite
    const constellationCounts: Record<string, number> = {};
    history.forEach(s => {
      const c = s.config.constellation;
      constellationCounts[c] = (constellationCounts[c] || 0) + 1;
    });
    const favoriteConstellation = Object.entries(constellationCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] as ConstellationType || null;

    // Mood improvement
    const sessionsWithMood = history.filter(s => s.moodBefore && s.moodAfter);
    const avgMoodImprovement = sessionsWithMood.length > 0
      ? sessionsWithMood.reduce((sum, s) => sum + ((s.moodAfter || 0) - (s.moodBefore || 0)), 0) / sessionsWithMood.length
      : 0;

    // Streak calculation
    const today = new Date().toDateString();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: string | null = null;

    const sortedByDate = [...history].sort(
      (a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime()
    );

    for (const session of sortedByDate) {
      const sessionDate = new Date(session.completedAt || session.startedAt).toDateString();
      
      if (lastDate === null) {
        tempStreak = 1;
        if (sessionDate === today) currentStreak = 1;
      } else {
        const lastDateObj = new Date(lastDate);
        const sessionDateObj = new Date(sessionDate);
        const diffDays = Math.floor((lastDateObj.getTime() - sessionDateObj.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else if (diffDays > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (currentStreak > 0) currentStreak = 0;
        }
      }
      
      lastDate = sessionDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const totalStarsConnected = history.reduce((sum, s) => sum + s.starsConnected, 0);
    const avgBreathingRegularity = history.reduce((sum, s) => sum + s.breathingRegularity, 0) / totalSessions;

    return {
      totalSessions,
      totalMinutes: Math.round(totalMinutes),
      averageCyclesPerSession: Math.round(avgCycles * 10) / 10,
      favoriteConstellation,
      averageMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
      currentStreak,
      longestStreak,
      totalStarsConnected,
      averageBreathingRegularity: Math.round(avgBreathingRegularity),
      lastSessionAt: sortedByDate[0]?.completedAt || sortedByDate[0]?.startedAt,
    };
  },

  getDefaultStats(): BreathConstellationStats {
    return {
      totalSessions: 0,
      totalMinutes: 0,
      averageCyclesPerSession: 0,
      favoriteConstellation: null,
      averageMoodImprovement: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalStarsConnected: 0,
      averageBreathingRegularity: 0,
    };
  },
};

export default breathConstellationService;
