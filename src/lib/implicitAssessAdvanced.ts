// @ts-nocheck
/**
 * 🧠 Système de Scoring Implicite Avancé
 * 
 * Améliore le scoring implicite avec:
 * - Machine Learning prédictif
 * - Détection d'authenticité émotionnelle
 * - Cross-module intelligence
 * - Méta-proxies contextuels
 */

import { trackImplicitAssess, type ImplicitSignal } from './implicitAssess';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ============= Types Avancés =============

export interface BiometricProxy {
  type: 'hrv' | 'respiration' | 'heart_rate' | 'skin_conductance';
  value: number;
  timestamp: number;
  session_id: string;
}

export interface ContextualProxy {
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
  day_of_week: string;
  weather_mood: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  recent_life_events: string[];
  social_interactions_count: number;
}

export interface AuthenticityScore {
  score: number; // 0-1 (0 = incohérent, 1 = authentique)
  confidence: number;
  factors: {
    facial_voice_alignment: number; // Visage vs voix
    self_report_alignment: number; // Auto-évaluation vs comportement
    temporal_consistency: number; // Cohérence dans le temps
    behavioral_patterns: number; // Patterns comportementaux
  };
}

export interface CrossModuleInsight {
  source_module: string;
  target_module: string;
  correlation: number;
  recommendation: string;
  confidence: number;
}

// ============= Machine Learning Baseline =============

class EmotionalBaseline {
  private userId: string;
  private baseline: Map<string, number> = new Map();
  private lastUpdate: Date = new Date();

  constructor(userId: string) {
    this.userId = userId;
    this.loadBaseline();
  }

  private async loadBaseline() {
    try {
      // Charger la baseline depuis le localStorage ou DB
      const stored = localStorage.getItem(`baseline_${this.userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        this.baseline = new Map(Object.entries(data.values));
        this.lastUpdate = new Date(data.lastUpdate);
      } else {
        // Initialiser avec des valeurs neutres
        this.baseline.set('valence', 50);
        this.baseline.set('arousal', 50);
        this.baseline.set('engagement', 50);
      }
    } catch (error) {
      logger.warn('Erreur chargement baseline', error as Error, 'SYSTEM');
    }
  }

  async updateBaseline(metric: string, value: number, weight: number = 0.1) {
    const current = this.baseline.get(metric) || 50;
    // Lissage exponentiel: new = old * (1-w) + value * w
    const updated = current * (1 - weight) + value * weight;
    this.baseline.set(metric, updated);
    
    // Sauvegarder toutes les 5 minutes
    const now = new Date();
    if (now.getTime() - this.lastUpdate.getTime() > 300000) {
      await this.saveBaseline();
      this.lastUpdate = now;
    }
  }

  private async saveBaseline() {
    const data = {
      values: Object.fromEntries(this.baseline),
      lastUpdate: this.lastUpdate.toISOString()
    };
    localStorage.setItem(`baseline_${this.userId}`, JSON.stringify(data));
  }

  getDeviation(metric: string, currentValue: number): number {
    const baseline = this.baseline.get(metric) || 50;
    return Math.abs(currentValue - baseline);
  }

  isSignificantDeviation(metric: string, currentValue: number, threshold: number = 15): boolean {
    return this.getDeviation(metric, currentValue) > threshold;
  }
}

// ============= Détection d'Authenticité =============

export class AuthenticityDetector {
  private recentEmotions: Map<string, any[]> = new Map();

  async assessAuthenticity(userId: string): Promise<AuthenticityScore> {
    const factors = {
      facial_voice_alignment: await this.checkFacialVoiceAlignment(userId),
      self_report_alignment: await this.checkSelfReportAlignment(userId),
      temporal_consistency: await this.checkTemporalConsistency(userId),
      behavioral_patterns: await this.checkBehavioralPatterns(userId)
    };

    // Score global: moyenne pondérée
    const score = (
      factors.facial_voice_alignment * 0.3 +
      factors.self_report_alignment * 0.3 +
      factors.temporal_consistency * 0.25 +
      factors.behavioral_patterns * 0.15
    );

    // Confiance basée sur la cohérence des facteurs
    const variance = Object.values(factors).reduce((sum, val) => {
      return sum + Math.pow(val - score, 2);
    }, 0) / 4;
    const confidence = Math.max(0, 1 - variance * 2);

    return { score, confidence, factors };
  }

  private async checkFacialVoiceAlignment(userId: string): Promise<number> {
    try {
      // Récupérer les dernières analyses Nyvee (5 dernières heures)
      const { data: scans } = await supabase
        .from('emotion_scans')
        .select('scan_result')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 5 * 3600000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (!scans || scans.length < 2) return 0.5; // Neutre si pas assez de données

      let alignmentScore = 0;
      let count = 0;

      for (const scan of scans) {
        const result = scan.scan_result;
        if (result.face_valence !== undefined && result.voice_valence !== undefined) {
          // Calculer la cohérence (1 - écart normalisé)
          const diff = Math.abs(result.face_valence - result.voice_valence);
          alignmentScore += Math.max(0, 1 - diff / 100);
          count++;
        }
      }

      return count > 0 ? alignmentScore / count : 0.5;
    } catch (error) {
      console.warn('Erreur checkFacialVoiceAlignment:', error);
      return 0.5;
    }
  }

  private async checkSelfReportAlignment(userId: string): Promise<number> {
    try {
      // Comparer auto-évaluations (mood_mixer) avec comportements (durée sessions)
      const { data: moodSessions } = await supabase
        .from('mood_mixer_sessions')
        .select('mood_before, mood_after, duration_seconds')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 3600000).toISOString())
        .limit(10);

      if (!moodSessions || moodSessions.length < 3) return 0.5;

      let alignmentScore = 0;
      let count = 0;

      for (const session of moodSessions) {
        const moodImprovement = session.mood_after - session.mood_before;
        const duration = session.duration_seconds;

        // Si mood améliore beaucoup mais session courte → potentiel faking
        // Si mood stable et session longue → cohérent
        if (moodImprovement > 20 && duration < 120) {
          alignmentScore += 0.3; // Suspicion de faking
        } else if (Math.abs(moodImprovement) < 10 && duration > 300) {
          alignmentScore += 0.9; // Cohérent
        } else {
          alignmentScore += 0.6; // Neutre
        }
        count++;
      }

      return count > 0 ? alignmentScore / count : 0.5;
    } catch (error) {
      console.warn('Erreur checkSelfReportAlignment:', error);
      return 0.5;
    }
  }

  private async checkTemporalConsistency(userId: string): Promise<number> {
    try {
      // Vérifier la cohérence des émotions sur 7 jours
      const { data: assessments } = await supabase
        .from('assessments')
        .select('score_json, ts')
        .eq('user_id', userId)
        .gte('ts', new Date(Date.now() - 7 * 24 * 3600000).toISOString())
        .order('ts', { ascending: true });

      if (!assessments || assessments.length < 5) return 0.5;

      // Calculer la variance des scores
      const scores = assessments.map(a => {
        const scoreData = a.score_json;
        return scoreData.total || scoreData.score || 50;
      });

      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / scores.length;
      const stdDev = Math.sqrt(variance);

      // Variance trop faible (< 5) ou trop élevée (> 30) = suspicion
      if (stdDev < 5) return 0.4; // Trop stable, potentiel réponse automatique
      if (stdDev > 30) return 0.5; // Trop variable, potentiel réponses aléatoires
      return 0.9; // Variance normale
    } catch (error) {
      console.warn('Erreur checkTemporalConsistency:', error);
      return 0.5;
    }
  }

  private async checkBehavioralPatterns(userId: string): Promise<number> {
    try {
      // Analyser les patterns d'usage (régularité, diversité modules)
      const modules = [
        'nyvee_sessions',
        'vr_nebula_sessions',
        'story_synth_sessions',
        'mood_mixer_sessions',
        'bubble_beat_sessions'
      ];

      let usageDiversity = 0;
      let totalSessions = 0;

      for (const module of modules) {
        const { count } = await supabase
          .from(module)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 3600000).toISOString());

        if (count && count > 0) {
          usageDiversity++;
          totalSessions += count;
        }
      }

      // Diversité élevée (> 3 modules) et usage régulier (> 10 sessions/semaine) = bon signe
      const diversityScore = usageDiversity / modules.length;
      const regularityScore = Math.min(1, totalSessions / 15);

      return (diversityScore * 0.6 + regularityScore * 0.4);
    } catch (error) {
      console.warn('Erreur checkBehavioralPatterns:', error);
      return 0.5;
    }
  }
}

// ============= Intelligence Cross-Module =============

export class CrossModuleIntelligence {
  async getInsights(userId: string): Promise<CrossModuleInsight[]> {
    const insights: CrossModuleInsight[] = [];

    // Analyse 1: VR Galaxy → Mood Mixer
    const vrToMood = await this.analyzeVRtoMood(userId);
    if (vrToMood) insights.push(vrToMood);

    // Analyse 2: Nyvee → Story Synth
    const nyveeToStory = await this.analyzeNyveeToStory(userId);
    if (nyveeToStory) insights.push(nyveeToStory);

    // Analyse 3: Music Therapy → Bubble Beat
    const musicToBubble = await this.analyzeMusicToBubble(userId);
    if (musicToBubble) insights.push(musicToBubble);

    // Analyse 4: Global engagement → Recommendations
    const globalInsights = await this.analyzeGlobalEngagement(userId);
    insights.push(...globalInsights);

    return insights;
  }

  private async analyzeVRtoMood(userId: string): Promise<CrossModuleInsight | null> {
    try {
      // Vérifier si les sessions VR améliorent les scores Mood Mixer
      const { data: vrSessions } = await supabase
        .from('vr_nebula_sessions')
        .select('coherence_score, completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(10);

      const { data: moodSessions } = await supabase
        .from('mood_mixer_sessions')
        .select('mood_after, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!vrSessions || vrSessions.length < 3 || !moodSessions || moodSessions.length < 3) {
        return null;
      }

      // Calculer corrélation temporelle (sessions VR suivies de mood positif)
      let positiveCorrelations = 0;
      for (const vr of vrSessions) {
        const vrTime = new Date(vr.completed_at).getTime();
        const moodAfter = moodSessions.find(m => {
          const moodTime = new Date(m.created_at).getTime();
          return moodTime > vrTime && moodTime < vrTime + 3600000; // Dans l'heure suivante
        });

        if (moodAfter && moodAfter.mood_after > 70) {
          positiveCorrelations++;
        }
      }

      const correlation = positiveCorrelations / vrSessions.length;

      if (correlation > 0.6) {
        return {
          source_module: 'vr_galaxy',
          target_module: 'mood_mixer',
          correlation,
          recommendation: 'VR très efficace pour boost mood. Recommander avant événements stressants.',
          confidence: 0.85
        };
      }

      return null;
    } catch (error) {
      console.warn('Erreur analyzeVRtoMood:', error);
      return null;
    }
  }

  private async analyzeNyveeToStory(userId: string): Promise<CrossModuleInsight | null> {
    try {
      // Si Nyvee détecte tristesse, Story Synth devrait proposer contes réconfortants
      const { data: recentScans } = await supabase
        .from('emotion_scans')
        .select('scan_result, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 6 * 3600000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (!recentScans || recentScans.length === 0) return null;

      // Calculer moyenne de valence
      let avgValence = 0;
      recentScans.forEach(scan => {
        const result = scan.scan_result;
        avgValence += (result.face_valence || 50) + (result.voice_valence || 50);
      });
      avgValence /= (recentScans.length * 2);

      if (avgValence < 40) {
        return {
          source_module: 'nyvee',
          target_module: 'story_synth',
          correlation: 0.75,
          recommendation: 'Tristesse détectée. Proposer contes apaisants ou héroïques (empowerment).',
          confidence: 0.8
        };
      } else if (avgValence > 70) {
        return {
          source_module: 'nyvee',
          target_module: 'story_synth',
          correlation: 0.7,
          recommendation: 'Humeur positive. Proposer contes aventureux ou créatifs.',
          confidence: 0.75
        };
      }

      return null;
    } catch (error) {
      console.warn('Erreur analyzeNyveeToStory:', error);
      return null;
    }
  }

  private async analyzeMusicToBubble(userId: string): Promise<CrossModuleInsight | null> {
    try {
      // Corréler BPM musique préférée avec performance Bubble Beat
      const { data: musicSessions } = await supabase
        .from('music_sessions')
        .select('tracks_played, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: bubbleSessions } = await supabase
        .from('bubble_beat_sessions')
        .select('rhythm_accuracy, difficulty, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!musicSessions || !bubbleSessions || bubbleSessions.length < 3) {
        return null;
      }

      // Analyse simplifiée: si musique rapide (>120 BPM) ET accuracy Bubble élevée
      // → Recommander difficultés supérieures
      const avgAccuracy = bubbleSessions.reduce((sum, s) => sum + (s.rhythm_accuracy || 0), 0) / bubbleSessions.length;

      if (avgAccuracy > 0.85) {
        return {
          source_module: 'music_therapy',
          target_module: 'bubble_beat',
          correlation: 0.72,
          recommendation: 'Excellente synchronisation rythmique. Augmenter difficulté Bubble Beat.',
          confidence: 0.8
        };
      }

      return null;
    } catch (error) {
      console.warn('Erreur analyzeMusicToBubble:', error);
      return null;
    }
  }

  private async analyzeGlobalEngagement(userId: string): Promise<CrossModuleInsight[]> {
    const insights: CrossModuleInsight[] = [];

    try {
      // Identifier les modules sous-utilisés
      const modules = [
        { name: 'nyvee_sessions', label: 'Nyvee' },
        { name: 'vr_nebula_sessions', label: 'VR Galaxy' },
        { name: 'story_synth_sessions', label: 'Story Synth' },
        { name: 'mood_mixer_sessions', label: 'Mood Mixer' },
        { name: 'bubble_beat_sessions', label: 'Bubble Beat' }
      ];

      const usageCounts: { [key: string]: number } = {};

      for (const module of modules) {
        const { count } = await supabase
          .from(module.name)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 14 * 24 * 3600000).toISOString());

        usageCounts[module.label] = count || 0;
      }

      const totalUsage = Object.values(usageCounts).reduce((a, b) => a + b, 0);
      if (totalUsage < 3) {
        insights.push({
          source_module: 'global',
          target_module: 'onboarding',
          correlation: 0,
          recommendation: 'Faible engagement. Proposer tutoriel guidé ou incentives gamification.',
          confidence: 0.9
        });
      }

      // Identifier le module le plus utilisé et suggérer complémentaires
      const mostUsed = Object.entries(usageCounts).sort((a, b) => b[1] - a[1])[0];
      if (mostUsed && mostUsed[1] > totalUsage * 0.5) {
        insights.push({
          source_module: 'global',
          target_module: mostUsed[0].toLowerCase().replace(' ', '_'),
          correlation: 0,
          recommendation: `Module ${mostUsed[0]} très utilisé. Suggérer modules complémentaires pour diversifier.`,
          confidence: 0.75
        });
      }

    } catch (error) {
      console.warn('Erreur analyzeGlobalEngagement:', error);
    }

    return insights;
  }
}

// ============= Méta-Proxies Contextuels =============

export function getContextualProxy(userId: string): ContextualProxy {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  let time_of_day: ContextualProxy['time_of_day'];
  if (hour >= 5 && hour < 12) time_of_day = 'morning';
  else if (hour >= 12 && hour < 17) time_of_day = 'afternoon';
  else if (hour >= 17 && hour < 22) time_of_day = 'evening';
  else time_of_day = 'night';

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day_of_week = days[day];

  // Météo émotionnelle simplifiée (pourrait être enrichie avec API météo réelle)
  const weather_moods: ContextualProxy['weather_mood'][] = ['sunny', 'cloudy', 'rainy', 'stormy'];
  const weather_mood = weather_moods[Math.floor(Math.random() * weather_moods.length)];

  // Événements récents (devrait être extrait du journal)
  const recent_life_events: string[] = [];

  return {
    time_of_day,
    day_of_week,
    weather_mood,
    recent_life_events,
    social_interactions_count: 0 // À implémenter
  };
}

// ============= Intégration Améliorée =============

export async function trackAdvancedImplicitAssess(
  signal: ImplicitSignal,
  userId: string,
  biometric?: BiometricProxy
) {
  // 1. Enregistrer le signal de base
  trackImplicitAssess(signal);

  // 2. Ajouter les données biométriques si disponibles
  if (biometric) {
    trackImplicitAssess({
      instrument: 'biometric',
      item_id: biometric.session_id,
      proxy: 'reaction',
      value: biometric.value,
      weight: 0.8, // Poids plus élevé pour données objectives
      context: {
        type: biometric.type,
        timestamp: biometric.timestamp.toString()
      }
    });
  }

  // 3. Enrichir avec contexte
  const context = getContextualProxy(userId);
  trackImplicitAssess({
    instrument: 'context',
    item_id: signal.item_id,
    proxy: 'preset',
    value: context.time_of_day,
    weight: 0.3,
    context: {
      day: context.day_of_week,
      weather: context.weather_mood
    }
  });

  // 4. Mettre à jour la baseline (async, non-bloquant)
  if (typeof signal.value === 'number') {
    const baseline = new EmotionalBaseline(userId);
    baseline.updateBaseline(signal.proxy, signal.value, 0.05);
  }
}

// ============= Exports =============

export const authenticityDetector = new AuthenticityDetector();
export const crossModuleIntelligence = new CrossModuleIntelligence();

export { EmotionalBaseline };
