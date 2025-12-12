/**
 * Screen Silk Service Unified - Service consolidé pour les micro-pauses écran
 *
 * Ce service unifie toutes les fonctionnalités :
 * - Gestion des sessions de micro-pause
 * - Thérapie visuelle adaptative
 * - Suivi du regard (gaze tracking)
 * - Patterns de silk personnalisés
 * - Statistiques et insights
 */

import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import {
  ScreenSilkSession,
  ScreenSilkSessionSchema,
  CreateScreenSilkSession,
  CreateScreenSilkSessionSchema,
  CompleteScreenSilkSession,
  CompleteScreenSilkSessionSchema,
  InterruptScreenSilkSession,
  InterruptScreenSilkSessionSchema,
  ScreenSilkStats,
  ScreenSilkStatsSchema,
  BreakLabel,
} from './types';

// ─────────────────────────────────────────────────────────────
// Types étendus pour la thérapie visuelle
// ─────────────────────────────────────────────────────────────

export interface VisualAdaptation {
  timestamp: number;
  pattern_complexity: number;
  color_palette: string[];
  movement_speed: number;
  therapeutic_intensity: number;
  user_response?: number;
}

export interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
  fixation_duration: number;
  emotional_zone?: string;
}

export interface SilkPattern {
  name: string;
  type: 'flowing' | 'geometric' | 'organic' | 'fractal';
  complexity: number;
  therapeutic_properties: {
    stress_reduction: number;
    focus_enhancement: number;
    emotional_balance: number;
  };
  color_schemes: ColorScheme[];
}

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  therapeutic_effect: string;
}

export interface EnrichedSession extends ScreenSilkSession {
  silk_pattern?: string;
  color_therapy_mode?: string;
  visual_adaptations?: VisualAdaptation[];
  gaze_tracking_data?: GazePoint[];
  therapeutic_effectiveness?: number;
  wallpaper_url?: string;
  theme?: string;
  mood_context?: string;
}

export interface VisualStats extends ScreenSilkStats {
  average_complexity: number;
  therapeutic_progress: number;
  favorite_patterns: string[];
  visual_mastery: number;
  favorite_theme?: string;
  themes_used?: string[];
}

// ─────────────────────────────────────────────────────────────
// Session Management (Base)
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateScreenSilkSession,
): Promise<ScreenSilkSession> {
  try {
    const validated = CreateScreenSilkSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .insert({
        user_id: user.id,
        duration_seconds: validated.duration_seconds,
        blink_count: 0,
        interrupted: false,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Analytics
    trackEvent('silk_start', { duration: validated.duration_seconds });

    return ScreenSilkSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteScreenSilkSession,
): Promise<ScreenSilkSession> {
  try {
    const validated = CompleteScreenSilkSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .update({
        blink_count: validated.blink_count,
        completion_label: validated.completion_label,
        interrupted: false,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    // Analytics
    trackEvent('silk_finish', {
      label: validated.completion_label,
      blinks: validated.blink_count
    });

    return ScreenSilkSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

export async function interruptSession(
  payload: InterruptScreenSilkSession,
): Promise<ScreenSilkSession> {
  try {
    const validated = InterruptScreenSilkSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .update({
        blink_count: validated.blink_count,
        completion_label: 'incertain',
        interrupted: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    // Analytics
    trackEvent('silk_interrupt', { blinks: validated.blink_count });

    return ScreenSilkSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.interruptSession' } });
    throw err instanceof Error ? err : new Error('interrupt_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Visual Therapy - Patterns & Adaptations
// ─────────────────────────────────────────────────────────────

export async function generatePersonalizedSilk(
  preferences: {
    therapeuticGoal?: string;
    complexity?: number;
    colorPreference?: string;
    sensitivity?: number;
  }
): Promise<SilkPattern> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const history = await getRecentSessions(10);
    const profile = await getUserVisualProfile(user.id);

    const { data, error } = await supabase.functions.invoke('generate-silk-pattern', {
      body: {
        userId: user.id,
        preferences,
        profile,
        history: history.slice(0, 3)
      }
    });

    if (error || !data?.pattern) {
      logger.warn('[ScreenSilk] Pattern generation failed, using default', 'MODULE');
      return generateDefaultPattern(preferences);
    }

    return data.pattern;
  } catch (err) {
    logger.error('[ScreenSilk] generatePersonalizedSilk error:', err, 'MODULE');
    return generateDefaultPattern(preferences);
  }
}

function generateDefaultPattern(preferences: Record<string, unknown>): SilkPattern {
  const complexityValue = typeof preferences.complexity === 'number' ? preferences.complexity : 5;

  return {
    name: 'Peaceful Flow',
    type: 'flowing',
    complexity: complexityValue,
    therapeutic_properties: {
      stress_reduction: 0.8,
      focus_enhancement: 0.6,
      emotional_balance: 0.7
    },
    color_schemes: [
      {
        name: 'Serene Blue',
        primary: '#4A90E2',
        secondary: '#7FB3D5',
        accent: '#A2D9CE',
        therapeutic_effect: 'calming'
      },
      {
        name: 'Sunset Warmth',
        primary: '#F5B041',
        secondary: '#F8C471',
        accent: '#FAD7A0',
        therapeutic_effect: 'energizing'
      },
      {
        name: 'Forest Calm',
        primary: '#27AE60',
        secondary: '#58D68D',
        accent: '#ABEBC6',
        therapeutic_effect: 'grounding'
      }
    ]
  };
}

export async function createVisualSession(
  pattern: SilkPattern,
  colorScheme: ColorScheme
): Promise<EnrichedSession> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .insert({
        user_id: user.id,
        silk_pattern: pattern.name,
        color_therapy_mode: colorScheme.therapeutic_effect,
        visual_adaptations: [],
        gaze_tracking_data: [],
        duration_seconds: 180,
        blink_count: 0,
        interrupted: false,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as EnrichedSession;
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.createVisualSession' } });
    throw err instanceof Error ? err : new Error('create_visual_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Visual Adaptation Engine
// ─────────────────────────────────────────────────────────────

export async function recordVisualAdaptation(
  sessionId: string,
  adaptation: VisualAdaptation
): Promise<{
  shouldAdapt: boolean;
  newSettings?: Partial<VisualAdaptation>;
  reason?: string;
}> {
  try {
    const { data: session } = await supabase
      .from('screen_silk_sessions')
      .select('visual_adaptations')
      .eq('id', sessionId)
      .single();

    if (!session) return { shouldAdapt: false };

    const adaptations = [...(session.visual_adaptations || []), adaptation];

    await supabase
      .from('screen_silk_sessions')
      .update({ visual_adaptations: adaptations })
      .eq('id', sessionId);

    // Analyser si adaptation nécessaire
    const analysis = analyzeVisualStimulation(adaptations);

    if (analysis.needsAdjustment) {
      const newSettings = generateAdaptiveSettings(adaptations, analysis);
      return {
        shouldAdapt: true,
        newSettings,
        reason: analysis.reason
      };
    }

    return { shouldAdapt: false };
  } catch (err) {
    logger.error('[ScreenSilk] recordVisualAdaptation error:', err, 'MODULE');
    return { shouldAdapt: false };
  }
}

function analyzeVisualStimulation(
  adaptations: VisualAdaptation[]
): { needsAdjustment: boolean; reason?: string; urgency?: number } {
  if (adaptations.length < 3) return { needsAdjustment: false };

  const recent = adaptations.slice(-5);

  // Vérifier l'intensité thérapeutique
  const avgIntensity = recent.reduce((sum, a) => sum + a.therapeutic_intensity, 0) / recent.length;

  if (avgIntensity > 0.9) {
    return {
      needsAdjustment: true,
      reason: 'excessive_stimulation',
      urgency: 0.9
    };
  }

  // Vérifier les réponses utilisateur
  const responses = recent.filter(a => a.user_response !== undefined);
  if (responses.length >= 3) {
    const avgResponse = responses.reduce((sum, a) => sum + a.user_response!, 0) / responses.length;

    if (avgResponse < 3) {
      return {
        needsAdjustment: true,
        reason: 'poor_user_response',
        urgency: 0.7
      };
    }
  }

  // Vérifier la monotonie
  const complexityValues = recent.map(a => a.pattern_complexity);
  const complexityVariance = calculateVariance(complexityValues);

  if (complexityVariance < 0.1 && adaptations.length > 10) {
    return {
      needsAdjustment: true,
      reason: 'visual_monotony',
      urgency: 0.6
    };
  }

  return { needsAdjustment: false };
}

function generateAdaptiveSettings(
  adaptations: VisualAdaptation[],
  analysis: { reason?: string }
): Partial<VisualAdaptation> {
  const current = adaptations[adaptations.length - 1];

  if (analysis.reason === 'excessive_stimulation') {
    return {
      pattern_complexity: Math.max(1, current.pattern_complexity - 2),
      movement_speed: current.movement_speed * 0.7,
      therapeutic_intensity: current.therapeutic_intensity * 0.8
    };
  } else if (analysis.reason === 'visual_monotony') {
    return {
      pattern_complexity: Math.min(10, current.pattern_complexity + 2),
      color_palette: generateNewColorPalette(),
      movement_speed: current.movement_speed * 1.2
    };
  } else if (analysis.reason === 'poor_user_response') {
    return {
      pattern_complexity: Math.max(3, Math.min(7, current.pattern_complexity)),
      movement_speed: Math.max(0.5, current.movement_speed * 0.9),
      therapeutic_intensity: Math.min(0.7, current.therapeutic_intensity)
    };
  }

  // Fallback équilibré
  return {
    pattern_complexity: 5,
    movement_speed: 1.0,
    therapeutic_intensity: 0.6,
    color_palette: generateNewColorPalette()
  };
}

function generateNewColorPalette(): string[] {
  const palettes = [
    ['#4A90E2', '#7FB3D5', '#A2D9CE'],  // Ocean calm
    ['#FF6B6B', '#4ECDC4', '#45B7D1'],  // Vibrant energy
    ['#A8E6CF', '#FFD3B6', '#FFAAA5'],  // Soft sunset
    ['#98D8C8', '#F7DC6F', '#BB8FCE'],  // Garden harmony
    ['#85C1E2', '#F8B88B', '#A8DADC'],  // Morning light
    ['#27AE60', '#58D68D', '#ABEBC6'],  // Forest fresh
    ['#9B59B6', '#E8DAEF', '#D7BDE2'],  // Lavender dream
    ['#E74C3C', '#F5B7B1', '#FADBD8']   // Rose warmth
  ];

  return palettes[Math.floor(Math.random() * palettes.length)];
}

// ─────────────────────────────────────────────────────────────
// Gaze Tracking
// ─────────────────────────────────────────────────────────────

export async function recordGazeTracking(
  sessionId: string,
  gazePoints: GazePoint[]
): Promise<{ insights: string[]; heatmap: number[][] | null }> {
  try {
    const { data: session } = await supabase
      .from('screen_silk_sessions')
      .select('gaze_tracking_data')
      .eq('id', sessionId)
      .single();

    if (!session) return { insights: [], heatmap: null };

    const allGazeData = [...(session.gaze_tracking_data || []), ...gazePoints];

    await supabase
      .from('screen_silk_sessions')
      .update({ gaze_tracking_data: allGazeData })
      .eq('id', sessionId);

    const insights = analyzeGazePatterns(allGazeData);
    const heatmap = generateGazeHeatmap(allGazeData);

    return { insights, heatmap };
  } catch (err) {
    logger.error('[ScreenSilk] recordGazeTracking error:', err, 'MODULE');
    return { insights: [], heatmap: null };
  }
}

function analyzeGazePatterns(gazeData: GazePoint[]): string[] {
  const insights: string[] = [];

  if (gazeData.length === 0) return insights;

  // Calculer les zones de fixation
  const fixationZones: Record<string, number> = {};
  gazeData.forEach(point => {
    if (point.emotional_zone) {
      fixationZones[point.emotional_zone] = (fixationZones[point.emotional_zone] || 0) + 1;
    }
  });

  const dominantZone = Object.entries(fixationZones)
    .sort(([, a], [, b]) => b - a)[0];

  if (dominantZone) {
    insights.push(`Zone de fixation principale: ${dominantZone[0]}`);
  }

  // Analyser la durée de fixation moyenne
  const avgFixation = gazeData.reduce((sum, p) => sum + p.fixation_duration, 0) / gazeData.length;

  if (avgFixation > 500) {
    insights.push('Haute concentration visuelle détectée');
  } else if (avgFixation < 200) {
    insights.push('Attention visuelle dispersée - suggérer exercice de focus');
  } else {
    insights.push('Attention visuelle équilibrée');
  }

  // Détecter patterns de mouvement
  if (gazeData.length > 20) {
    const movements = calculateGazeMovements(gazeData);
    if (movements.avgDistance < 50) {
      insights.push('Regard stable - bon état de relaxation');
    } else if (movements.avgDistance > 150) {
      insights.push('Regard agité - recommander respiration profonde');
    }
  }

  return insights;
}

function calculateGazeMovements(gazeData: GazePoint[]): { avgDistance: number; totalDistance: number } {
  let totalDistance = 0;
  for (let i = 1; i < gazeData.length; i++) {
    const dx = gazeData[i].x - gazeData[i - 1].x;
    const dy = gazeData[i].y - gazeData[i - 1].y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
  }
  return {
    avgDistance: totalDistance / (gazeData.length - 1),
    totalDistance
  };
}

function generateGazeHeatmap(gazeData: GazePoint[]): number[][] {
  const gridSize = 20;
  const heatmap: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));

  gazeData.forEach(point => {
    const gridX = Math.floor((point.x / 100) * gridSize);
    const gridY = Math.floor((point.y / 100) * gridSize);

    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      heatmap[gridY][gridX]++;
    }
  });

  return heatmap;
}

// ─────────────────────────────────────────────────────────────
// Session Completion with Report
// ─────────────────────────────────────────────────────────────

export async function completeSessionWithReport(
  sessionId: string,
  completion: {
    durationSeconds: number;
    blinkCount: number;
    label: BreakLabel;
    userFeedback?: string;
  }
): Promise<{
  session: EnrichedSession;
  visualReport: {
    effectiveness: number;
    totalAdaptations: number;
  };
  therapeuticInsights: string[];
  gazeAnalysis: { insights: string[]; heatmap: number[][] | null } | null;
  achievementsUnlocked: string[];
}> {
  try {
    const { data: session } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const enrichedSession = session as EnrichedSession;
    const adaptations = enrichedSession.visual_adaptations || [];
    const gazeData = enrichedSession.gaze_tracking_data || [];

    // Calculer l'efficacité thérapeutique
    const effectiveness = calculateTherapeuticEffectiveness(adaptations, gazeData);

    // Calculer les achievements
    const achievements = calculateAchievements(enrichedSession, completion);

    // Mettre à jour la session
    await supabase
      .from('screen_silk_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        blink_count: completion.blinkCount,
        completion_label: completion.label,
        therapeutic_effectiveness: effectiveness,
        interrupted: false,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // Générer l'analyse du regard si données disponibles
    const gazeAnalysis = gazeData.length > 0
      ? {
          insights: analyzeGazePatterns(gazeData),
          heatmap: generateGazeHeatmap(gazeData)
        }
      : null;

    // Analytics
    trackEvent('silk_complete_with_report', {
      effectiveness,
      adaptations: adaptations.length,
      label: completion.label
    });

    return {
      session: { ...enrichedSession, therapeutic_effectiveness: effectiveness },
      visualReport: {
        effectiveness,
        totalAdaptations: adaptations.length
      },
      therapeuticInsights: generateTherapeuticInsights(enrichedSession, adaptations),
      gazeAnalysis,
      achievementsUnlocked: achievements
    };
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.completeSessionWithReport' } });
    throw err instanceof Error ? err : new Error('complete_session_report_failed');
  }
}

function calculateTherapeuticEffectiveness(
  adaptations: VisualAdaptation[],
  gazeData: GazePoint[]
): number {
  if (adaptations.length === 0) return 0.5;

  const avgIntensity = adaptations.reduce((sum, a) => sum + a.therapeutic_intensity, 0) / adaptations.length;

  const responses = adaptations.filter(a => a.user_response !== undefined);
  const responseQuality = responses.length > 0
    ? responses.reduce((sum, a) => sum + a.user_response!, 0) / (responses.length * 10)
    : 0.5;

  let gazeScore = 0.5;
  if (gazeData.length > 0) {
    const avgFixation = gazeData.reduce((sum, p) => sum + p.fixation_duration, 0) / gazeData.length;
    gazeScore = Math.min(1, avgFixation / 500);
  }

  return Math.round((avgIntensity * 0.4 + responseQuality * 0.4 + gazeScore * 0.2) * 100) / 100;
}

function generateTherapeuticInsights(session: EnrichedSession, adaptations: VisualAdaptation[]): string[] {
  const insights: string[] = [];

  if (adaptations.length === 0) {
    insights.push('Session de base complétée');
    return insights;
  }

  const avgComplexity = adaptations.reduce((sum, a) => sum + a.pattern_complexity, 0) / adaptations.length;

  if (avgComplexity > 7) {
    insights.push('Préférence pour les patterns complexes - excellent focus mental');
  } else if (avgComplexity < 3) {
    insights.push('Préférence pour la simplicité visuelle - état de relaxation profonde');
  } else {
    insights.push('Équilibre visuel optimal atteint');
  }

  if (adaptations.length > 15) {
    insights.push('Excellente adaptation visuelle tout au long de la session');
  }

  if (session.color_therapy_mode) {
    insights.push(`Thérapie par les couleurs: ${session.color_therapy_mode}`);
  }

  return insights;
}

function calculateAchievements(session: EnrichedSession, completion: { durationSeconds: number; blinkCount: number }): string[] {
  const achievements: string[] = [];

  // Achievements basés sur la durée
  if (completion.durationSeconds >= 1200) achievements.push('VISUAL_MASTER');
  if (completion.durationSeconds >= 600) achievements.push('FOCUSED_MIND');
  if (completion.durationSeconds >= 300) achievements.push('SCREEN_BREAK_PRO');

  // Achievements basés sur les adaptations
  const adaptations = session.visual_adaptations || [];
  if (adaptations.length >= 20) achievements.push('ADAPTIVE_PRO');
  if (adaptations.length >= 10) achievements.push('VISUAL_EXPLORER');

  // Achievements basés sur le gaze tracking
  const gazeData = session.gaze_tracking_data || [];
  if (gazeData.length >= 100) achievements.push('FOCUS_CHAMPION');
  if (gazeData.length >= 50) achievements.push('GAZE_TRACKER');

  // Achievements basés sur les clignements
  if (completion.blinkCount >= 60) achievements.push('BLINK_MASTER');

  return achievements;
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<ScreenSilkStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('duration_seconds, interrupted, completed_at')
      .eq('user_id', user.id);

    if (error) throw error;

    const sessions = data || [];
    const total_sessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed_at);
    const total_completed = completedSessions.filter(s => !s.interrupted).length;
    const total_interrupted = completedSessions.filter(s => s.interrupted).length;

    const total_break_time_minutes =
      completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;

    const average_duration_minutes = completedSessions.length > 0
      ? total_break_time_minutes / completedSessions.length
      : 0;

    const completion_rate = total_sessions > 0
      ? (total_completed / total_sessions) * 100
      : 0;

    return ScreenSilkStatsSchema.parse({
      total_sessions,
      total_completed,
      total_interrupted,
      total_break_time_minutes,
      average_duration_minutes,
      completion_rate,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getVisualStats(): Promise<VisualStats> {
  try {
    const baseStats = await getStats();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data: sessions } = await supabase
      .from('screen_silk_sessions')
      .select('silk_pattern, visual_adaptations, therapeutic_effectiveness, theme')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null);

    const enrichedSessions = (sessions || []) as EnrichedSession[];

    // Calculer complexité moyenne
    const allAdaptations = enrichedSessions.flatMap(s => s.visual_adaptations || []);
    const avgComplexity = allAdaptations.length > 0
      ? allAdaptations.reduce((sum, a) => sum + a.pattern_complexity, 0) / allAdaptations.length
      : 5;

    // Calculer progression thérapeutique
    const sessionsWithEffectiveness = enrichedSessions.filter(s => s.therapeutic_effectiveness);
    const therapeuticProgress = sessionsWithEffectiveness.length > 0
      ? sessionsWithEffectiveness.reduce((sum, s) => sum + s.therapeutic_effectiveness!, 0) / sessionsWithEffectiveness.length
      : 0;

    // Trouver les patterns favoris
    const patternCounts: Record<string, number> = {};
    enrichedSessions.forEach(s => {
      if (s.silk_pattern) {
        patternCounts[s.silk_pattern] = (patternCounts[s.silk_pattern] || 0) + 1;
      }
    });
    const favoritePatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern);

    // Thèmes
    const themeCounts: Record<string, number> = {};
    enrichedSessions.forEach(s => {
      if (s.theme) {
        themeCounts[s.theme] = (themeCounts[s.theme] || 0) + 1;
      }
    });
    const favoriteTheme = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    const themesUsed = Object.keys(themeCounts);

    return {
      ...baseStats,
      average_complexity: Math.round(avgComplexity * 10) / 10,
      therapeutic_progress: Math.round(therapeuticProgress * 100) / 100,
      favorite_patterns: favoritePatterns,
      visual_mastery: Math.min(10, Math.floor(baseStats.total_completed / 10)),
      favorite_theme: favoriteTheme,
      themes_used: themesUsed
    };
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.getVisualStats' } });
    throw err instanceof Error ? err : new Error('get_visual_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<EnrichedSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []) as EnrichedSession[];
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// User Visual Profile
// ─────────────────────────────────────────────────────────────

async function getUserVisualProfile(userId: string): Promise<{
  preferred_complexity: number;
  color_sensitivity: number;
  motion_tolerance: number;
}> {
  try {
    const { data } = await supabase
      .from('user_visual_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || {
      preferred_complexity: 5,
      color_sensitivity: 0.7,
      motion_tolerance: 0.8
    };
  } catch {
    return {
      preferred_complexity: 5,
      color_sensitivity: 0.7,
      motion_tolerance: 0.8
    };
  }
}

export async function updateVisualProfile(
  preferences: Partial<{
    preferred_complexity: number;
    color_sensitivity: number;
    motion_tolerance: number;
  }>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { error } = await supabase
      .from('user_visual_profiles')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (err) {
    logger.error('[ScreenSilk] updateVisualProfile error:', err, 'MODULE');
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// Wallpaper Management
// ─────────────────────────────────────────────────────────────

export async function updateWallpaper(
  sessionId: string,
  wallpaperUrl: string,
  theme?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('screen_silk_sessions')
      .update({
        wallpaper_url: wallpaperUrl,
        theme
      })
      .eq('id', sessionId);

    if (error) throw error;
  } catch (err) {
    logger.error('[ScreenSilk] updateWallpaper error:', err, 'MODULE');
    throw err;
  }
}

export async function getLatestWallpaper(): Promise<EnrichedSession | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('user_id', user.id)
      .not('wallpaper_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as EnrichedSession | null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
}

function trackEvent(eventName: string, params: Record<string, unknown>): void {
  try {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, {
        event_category: 'screen_silk',
        ...params
      });
    }

    // Log for monitoring
    logger.info(`[ScreenSilk] Event: ${eventName}`, params, 'ANALYTICS');
  } catch {
    // Silent fail for analytics
  }
}

// ─────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────

export const ScreenSilkService = {
  // Session Management
  createSession,
  completeSession,
  interruptSession,
  completeSessionWithReport,

  // Visual Therapy
  generatePersonalizedSilk,
  createVisualSession,
  recordVisualAdaptation,

  // Gaze Tracking
  recordGazeTracking,

  // Statistics
  getStats,
  getVisualStats,
  getRecentSessions,

  // Profile
  updateVisualProfile,

  // Wallpaper
  updateWallpaper,
  getLatestWallpaper
};

export default ScreenSilkService;
