/**
 * Module Breath Unified - Service principal
 * Service unifié pour toutes les fonctionnalités de respiration
 * Consolide breath, bubble-beat, breath-constellation, et breathing-vr
 *
 * @module breath-unified
 */

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type {
  BreathSession,
  BreathSessionType,
  ProtocolConfig,
  BreathProtocol,
  BreathStep,
  GameDifficulty,
  GameMood,
  GameStats,
  VisualConfig,
  ImmersiveConfig,
  BiofeedbackData,
  BreathCycle,
  SessionStatistics,
  ProtocolRecommendation,
} from './types';

// ============================================================================
// PROTOCOLS (basic capability)
// ============================================================================

const PROTOCOL_DEFINITIONS: Record<BreathProtocol, BreathStep[]> = {
  '478': [
    { kind: 'in', duration_ms: 4000 },
    { kind: 'hold', duration_ms: 7000 },
    { kind: 'out', duration_ms: 8000 },
  ],
  coherence: [
    { kind: 'in', duration_ms: 5000 },
    { kind: 'out', duration_ms: 5000 },
  ],
  box: [
    { kind: 'in', duration_ms: 4000 },
    { kind: 'hold', duration_ms: 4000 },
    { kind: 'out', duration_ms: 4000 },
    { kind: 'hold', duration_ms: 4000 },
  ],
  relax: [
    { kind: 'in', duration_ms: 4000 },
    { kind: 'out', duration_ms: 6000 },
  ],
};

function generateProtocolSteps(config: ProtocolConfig): BreathStep[] {
  const baseSteps = PROTOCOL_DEFINITIONS[config.protocol];
  const durationMs = config.duration_minutes * 60 * 1000;

  const steps: BreathStep[] = [];
  let elapsed = 0;

  while (elapsed < durationMs) {
    for (const step of baseSteps) {
      if (elapsed >= durationMs) break;

      const duration = Math.min(step.duration_ms, durationMs - elapsed);
      steps.push({ kind: step.kind, duration_ms: duration });
      elapsed += duration;
    }
  }

  return steps;
}

// ============================================================================
// MAIN SERVICE
// ============================================================================

export class BreathUnifiedService {
  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  async createSession(
    userId: string,
    sessionType: BreathSessionType,
    config?: {
      protocolConfig?: ProtocolConfig;
      gameDifficulty?: GameDifficulty;
      gameMood?: GameMood;
      visualConfig?: VisualConfig;
      immersiveConfig?: ImmersiveConfig;
    }
  ): Promise<BreathSession> {
    const now = new Date().toISOString();

    const session: BreathSession = {
      id: uuidv4(),
      user_id: userId,
      session_type: sessionType,
      protocol_config: config?.protocolConfig,
      game_difficulty: config?.gameDifficulty,
      game_mood: config?.gameMood,
      visual_config: config?.visualConfig,
      immersive_config: config?.immersiveConfig,
      duration_seconds: 0,
      breaths_completed: 0,
      completion_rate: 0,
      created_at: now,
    };

    const { data, error } = await supabase
      .from('breath_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async startSession(sessionId: string): Promise<void> {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('breath_sessions')
      .update({ started_at: now })
      .eq('id', sessionId);

    if (error) throw error;
  }

  async completeSession(
    sessionId: string,
    completion: {
      durationSeconds: number;
      breathsCompleted: number;
      completionRate: number;
      stressLevelAfter?: number;
      moodAfter?: string;
      gameStats?: GameStats;
      biofeedbackData?: BiofeedbackData[];
      therapeuticEffectiveness?: number;
    }
  ): Promise<BreathSession> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('breath_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        breaths_completed: completion.breathsCompleted,
        completion_rate: completion.completionRate,
        stress_level_after: completion.stressLevelAfter,
        mood_after: completion.moodAfter,
        game_stats: completion.gameStats,
        biofeedback_data: completion.biofeedbackData,
        therapeutic_effectiveness: completion.therapeuticEffectiveness,
        completed_at: now,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ==========================================================================
  // BASIC CAPABILITY
  // ==========================================================================

  generateProtocol(config: ProtocolConfig): BreathStep[] {
    return generateProtocolSteps(config);
  }

  getTotalProtocolDuration(config: ProtocolConfig): number {
    return config.duration_minutes * 60 * 1000;
  }

  getCycleDuration(protocol: BreathProtocol): number {
    const steps = PROTOCOL_DEFINITIONS[protocol];
    return steps.reduce((sum, step) => sum + step.duration_ms, 0);
  }

  // ==========================================================================
  // RECOMMENDATIONS
  // ==========================================================================

  async getRecommendation(
    userId: string,
    currentStressLevel: number,
    targetStressLevel: number,
    context?: {
      timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
      availableMinutes?: number;
    }
  ): Promise<ProtocolRecommendation> {
    const stressDelta = currentStressLevel - targetStressLevel;
    const availableMinutes = context?.availableMinutes || 10;

    // Logic de recommandation
    let protocol: BreathProtocol;
    let sessionType: BreathSessionType;

    if (stressDelta > 5) {
      protocol = '478';  // Haute anxiété
      sessionType = 'immersive';
    } else if (stressDelta > 3) {
      protocol = 'coherence';  // Anxiété modérée
      sessionType = 'visual';
    } else if (stressDelta > 0) {
      protocol = 'box';  // Légère tension
      sessionType = 'basic';
    } else {
      protocol = 'relax';  // Détente
      sessionType = 'gamified';
    }

    return {
      protocol,
      session_type: sessionType,
      duration_minutes: Math.min(availableMinutes, 15),
      protocol_config: {
        protocol,
        duration_minutes: Math.min(availableMinutes, 15),
      },
      reasoning: this.generateReasoning(stressDelta, protocol),
      expected_benefits: this.getExpectedBenefits(protocol),
      optimal_timing: context?.timeOfDay === 'night' ? 'Avant le coucher' : 'À tout moment',
      confidence_score: 0.85,
    };
  }

  private generateReasoning(stressDelta: number, protocol: BreathProtocol): string {
    const protocolNames = {
      '478': '4-7-8',
      coherence: 'Cohérence cardiaque',
      box: 'Respiration en carré',
      relax: 'Respiration relaxante',
    };

    if (stressDelta > 5) {
      return `Le protocole ${protocolNames[protocol]} est recommandé pour gérer un stress élevé grâce à son rythme apaisant.`;
    } else if (stressDelta > 3) {
      return `${protocolNames[protocol]} aide à retrouver votre équilibre émotionnel progressivement.`;
    } else {
      return `${protocolNames[protocol]} maintient votre état de calme et renforce la détente.`;
    }
  }

  private getExpectedBenefits(protocol: BreathProtocol): string[] {
    const benefits: Record<BreathProtocol, string[]> = {
      '478': ['Réduction rapide de l\'anxiété', 'Amélioration du sommeil', 'Activation parasympathique'],
      coherence: ['Équilibre du système nerveux', 'Régulation émotionnelle', 'Amélioration HRV'],
      box: ['Concentration accrue', 'Réduction du stress', 'Équilibre mental'],
      relax: ['Détente profonde', 'Calme mental', 'Relaxation musculaire'],
    };

    return benefits[protocol] || [];
  }

  // ==========================================================================
  // STATISTICS
  // ==========================================================================

  async getStatistics(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<SessionStatistics> {
    const { data: sessions, error } = await supabase
      .from('breath_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const completedSessions = (sessions || []).filter((s) => s.completed_at);
    const totalSessions = sessions?.length || 0;
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const totalBreaths = completedSessions.reduce((sum, s) => sum + (s.breaths_completed || 0), 0);

    // Sessions par type
    const sessionsByType: Record<string, number> = {};
    (sessions || []).forEach((s) => {
      sessionsByType[s.session_type] = (sessionsByType[s.session_type] || 0) + 1;
    });

    // Efficacité moyenne
    const avgCompletionRate =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.completion_rate || 0), 0) /
          completedSessions.length
        : 0;

    const avgConsistency =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.consistency_score || 0), 0) /
          completedSessions.length
        : 0;

    const stressReductionSessions = completedSessions.filter(
      (s) => s.stress_level_before !== null && s.stress_level_after !== null
    );
    const avgStressReduction =
      stressReductionSessions.length > 0
        ? stressReductionSessions.reduce(
            (sum, s) => sum + ((s.stress_level_before || 0) - (s.stress_level_after || 0)),
            0
          ) / stressReductionSessions.length
        : 0;

    return {
      user_id: userId,
      total_sessions: totalSessions,
      total_duration_seconds: totalDuration,
      total_breaths: totalBreaths,
      sessions_by_type: sessionsByType,
      average_completion_rate: avgCompletionRate,
      average_consistency: avgConsistency,
      average_stress_reduction: avgStressReduction,
      period_start: startDate.toISOString(),
      period_end: endDate.toISOString(),
    };
  }

  async getSessionHistory(
    userId: string,
    limit: number = 20,
    sessionType?: BreathSessionType
  ): Promise<BreathSession[]> {
    let query = supabase
      .from('breath_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sessionType) {
      query = query.eq('session_type', sessionType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
}

// Export singleton instance
export const breathUnifiedService = new BreathUnifiedService();
