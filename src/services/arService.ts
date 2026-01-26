/**
 * AR Service - Phase 4.5
 * Core AR functionality with WebXR integration, plane detection, and experience management
 */

import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export interface ARSessionConfig {
  experienceType: 'aura' | 'breathing' | 'bubbles' | 'music';
  moodBefore?: string;
  customSettings?: Record<string, any>;
}

export interface ARPlane {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  extent: { width: number; height: number };
  semantic: 'floor' | 'wall' | 'ceiling' | 'unknown';
}

export interface EmotionData {
  joy: number;
  calm: number;
  focus: number;
  energy: number;
  love: number;
}

export interface AuraVisualization {
  dominantEmotion: string;
  emotionScores: EmotionData;
  colorRGB: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  sizeMultiplier: number;
}

export interface BreathingPattern {
  type: '4-4-4' | '4-7-8' | 'box' | 'coherent';
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  pauseSeconds: number;
}

export class ARService {
  private arSession: XRSession | null = null;
  private planes: Map<string, ARPlane> = new Map();
  private sessionId: string | null = null;
  private startTime: number = 0;
  private eventLog: Array<{ type: string; data: any; timestamp: number }> = [];

  /**
   * Initialize an AR session
   */
  async initARSession(config: ARSessionConfig): Promise<boolean> {
    try {
      // Check WebXR support
      if (!navigator.xr) {
        logger.warn('WebXR not supported on this device', {}, 'AR');
        return false;
      }

      // Request AR session
      const sessionInit: XRSessionInit = {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        optionalFeatures: [
          'hit-test',
          'dom-overlay',
          'plane-detection',
          'hit-test-on-contingent-planes',
          'geometry-plane-detection'
        ],
        domOverlay: { root: document.body }
      };

      this.arSession = await navigator.xr!.requestSession('immersive-ar', sessionInit);
      this.startTime = Date.now();

      // Create session in DB
      const { data: session, error } = await supabase
        .from('ar_sessions')
        .insert({
          experience_type: config.experienceType,
          xr_mode: 'immersive-ar',
          has_ar_support: true,
          mood_before: config.moodBefore,
          custom_settings: config.customSettings || {}
        })
        .select()
        .single();

      if (error) throw error;
      this.sessionId = session.id;

      logger.info('AR session initialized', { sessionId: this.sessionId }, 'AR');
      return true;
    } catch (err) {
      logger.error('Failed to initialize AR session', err as Error, 'AR');
      return false;
    }
  }

  /**
   * Detect planes in the AR environment
   */
  async detectPlanes(): Promise<ARPlane[]> {
    if (!this.arSession) {
      logger.warn('AR session not initialized', {}, 'AR');
      return [];
    }

    try {
      // This would be called from the render loop with actual frame data
      // For now, return cached planes
      return Array.from(this.planes.values());
    } catch (err) {
      logger.error('Failed to detect planes', err as Error, 'AR');
      return [];
    }
  }

  /**
   * Register a detected plane
   */
  addPlane(plane: ARPlane): void {
    this.planes.set(plane.id, plane);
    this.logEvent('plane_detected', { plane });
  }

  /**
   * Get emotion-based aura visualization
   */
  getEmotionColor(emotion: string): string {
    const emotionColors: Record<string, string> = {
      joy: '#FFD700', // Gold
      calm: '#87CEEB', // Sky blue
      focus: '#6366F1', // Indigo
      energy: '#FF6B6B', // Red
      love: '#FF69B4', // Hot pink
      neutral: '#A0AEC0', // Gray
      sad: '#4B5563', // Dark gray
      anxious: '#F97316', // Orange
      frustrated: '#DC2626', // Red
      content: '#10B981' // Emerald
    };

    return emotionColors[emotion] || emotionColors.neutral;
  }

  /**
   * Create aura visualization from current emotion state
   */
  async createAuraVisualization(
    userId: string,
    emotionScores: EmotionData
  ): Promise<AuraVisualization> {
    // Find dominant emotion
    let dominantEmotion = 'neutral';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(emotionScores)) {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }

    // Calculate intensity (1-5) based on max score
    const intensity = Math.min(5, Math.max(1, Math.ceil(maxScore / 20))) as 1 | 2 | 3 | 4 | 5;

    // Calculate size multiplier
    const sizeMultiplier = 0.8 + (maxScore / 100) * 0.4;

    const aura: AuraVisualization = {
      dominantEmotion,
      emotionScores,
      colorRGB: this.getEmotionColor(dominantEmotion),
      intensity,
      sizeMultiplier
    };

    // Save to database
    if (this.sessionId) {
      await supabase.from('emotional_aura_history').insert({
        user_id: userId,
        ar_session_id: this.sessionId,
        dominant_emotion: dominantEmotion,
        emotion_scores: emotionScores,
        aura_color_rgb: aura.colorRGB,
        aura_intensity: intensity,
        aura_size_multiplier: sizeMultiplier
      });
    }

    this.logEvent('aura_created', { aura });
    return aura;
  }

  /**
   * Get breathing pattern configuration
   */
  getBreathingPattern(patternType: '4-4-4' | '4-7-8' | 'box' | 'coherent'): BreathingPattern {
    const patterns: Record<string, BreathingPattern> = {
      '4-4-4': {
        type: '4-4-4',
        inhaleSeconds: 4,
        holdSeconds: 4,
        exhaleSeconds: 4,
        pauseSeconds: 0
      },
      '4-7-8': {
        type: '4-7-8',
        inhaleSeconds: 4,
        holdSeconds: 7,
        exhaleSeconds: 8,
        pauseSeconds: 0
      },
      'box': {
        type: 'box',
        inhaleSeconds: 4,
        holdSeconds: 4,
        exhaleSeconds: 4,
        pauseSeconds: 4
      },
      'coherent': {
        type: 'coherent',
        inhaleSeconds: 5.5,
        holdSeconds: 0,
        exhaleSeconds: 5.5,
        pauseSeconds: 0
      }
    };

    return patterns[patternType] || patterns['4-4-4'];
  }

  /**
   * Calculate cycle duration for breathing pattern
   */
  calculateCycleDuration(pattern: BreathingPattern): number {
    return pattern.inhaleSeconds + pattern.holdSeconds + pattern.exhaleSeconds + pattern.pauseSeconds;
  }

  /**
   * Log event for AR session
   */
  private logEvent(eventType: string, eventData: any = {}): void {
    this.eventLog.push({
      type: eventType,
      data: eventData,
      timestamp: Date.now() - this.startTime
    });

    // Persist to database if session exists
    if (this.sessionId) {
      supabase
        .from('ar_experience_logs')
        .insert({
          ar_session_id: this.sessionId,
          event_type: eventType,
          event_data: eventData,
          timestamp: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) logger.error('Failed to log AR event', error, 'AR');
        });
    }
  }

  /**
   * Log performance metrics
   */
  async logPerformanceMetrics(metrics: {
    frameTimeMs: number;
    gpuTimeMs: number;
    cpuTimeMs: number;
    memoryUsedMb: number;
    textureMemoryMb: number;
    geometryMemoryMb: number;
    triangleCount: number;
    drawCallCount: number;
  }): Promise<void> {
    if (!this.sessionId) return;

    try {
      await supabase.from('ar_performance_metrics').insert({
        ar_session_id: this.sessionId,
        frame_time_ms: metrics.frameTimeMs,
        gpu_time_ms: metrics.gpuTimeMs,
        cpu_time_ms: metrics.cpuTimeMs,
        memory_used_mb: metrics.memoryUsedMb,
        texture_memory_mb: metrics.textureMemoryMb,
        geometry_memory_mb: metrics.geometryMemoryMb,
        triangle_count: metrics.triangleCount,
        draw_call_count: metrics.drawCallCount
      });
    } catch (err) {
      logger.error('Failed to log performance metrics', err as Error, 'AR');
    }
  }

  /**
   * End AR session
   */
  async endARSession(moodAfter?: string): Promise<void> {
    if (!this.arSession) return;

    try {
      await this.arSession.end();

      const sessionDuration = Math.floor((Date.now() - this.startTime) / 1000);

      // Update session in database
      if (this.sessionId) {
        await supabase
          .from('ar_sessions')
          .update({
            ended_at: new Date().toISOString(),
            duration_seconds: sessionDuration,
            mood_after: moodAfter
          })
          .eq('id', this.sessionId);
      }

      logger.info('AR session ended', { sessionId: this.sessionId, duration: sessionDuration }, 'AR');

      this.arSession = null;
      this.sessionId = null;
      this.planes.clear();
      this.eventLog = [];
    } catch (err) {
      logger.error('Failed to end AR session', err as Error, 'AR');
    }
  }

  /**
   * Create breathing AR session
   */
  async createBreathingARSession(
    userId: string,
    patternType: '4-4-4' | '4-7-8' | 'box' | 'coherent',
    totalCycles: number
  ): Promise<string | null> {
    if (!this.sessionId) return null;

    try {
      const { data, error } = await supabase
        .from('breathing_ar_sessions')
        .insert({
          ar_session_id: this.sessionId,
          user_id: userId,
          pattern_type: patternType,
          total_planned_cycles: totalCycles
        })
        .select()
        .single();

      if (error) throw error;

      this.logEvent('breathing_session_created', {
        patternType,
        totalCycles,
        sessionId: data.id
      });

      return data.id;
    } catch (err) {
      logger.error('Failed to create breathing AR session', err as Error, 'AR');
      return null;
    }
  }

  /**
   * Update breathing session progress
   */
  async updateBreathingProgress(
    breathingSessionId: string,
    cyclesCompleted: number,
    avgBreathDepth: number,
    avgBreathDuration: number,
    consistencyScore: number
  ): Promise<void> {
    try {
      await supabase
        .from('breathing_ar_sessions')
        .update({
          cycles_completed: cyclesCompleted,
          avg_breath_depth: avgBreathDepth,
          avg_breath_duration: avgBreathDuration,
          consistency_score: consistencyScore
        })
        .eq('id', breathingSessionId);

      this.logEvent('breathing_progress_updated', {
        cyclesCompleted,
        consistencyScore
      });
    } catch (err) {
      logger.error('Failed to update breathing progress', err as Error, 'AR');
    }
  }

  /**
   * Create music AR session
   */
  async createMusicARSession(
    userId: string,
    playlistId: string | null,
    trackIds: string[],
    visualTheme: 'galaxy' | 'waves' | 'particles'
  ): Promise<string | null> {
    if (!this.sessionId) return null;

    try {
      const { data, error } = await supabase
        .from('music_ar_sessions')
        .insert({
          ar_session_id: this.sessionId,
          user_id: userId,
          playlist_id: playlistId,
          track_ids: trackIds,
          visual_theme: visualTheme
        })
        .select()
        .single();

      if (error) throw error;

      this.logEvent('music_session_created', {
        visualTheme,
        trackCount: trackIds.length
      });

      return data.id;
    } catch (err) {
      logger.error('Failed to create music AR session', err as Error, 'AR');
      return null;
    }
  }

  /**
   * Update music session metrics
   */
  async updateMusicMetrics(
    musicSessionId: string,
    timeWatchedSeconds: number,
    averageFps: number,
    trackInteractions: number,
    immersionRating: number,
    visualQualityRating: number
  ): Promise<void> {
    try {
      await supabase
        .from('music_ar_sessions')
        .update({
          time_watched_seconds: timeWatchedSeconds,
          average_fps: averageFps,
          track_interactions: trackInteractions,
          immersion_rating: immersionRating,
          visual_quality_rating: visualQualityRating
        })
        .eq('id', musicSessionId);

      this.logEvent('music_metrics_updated', {
        immersionRating,
        visualQualityRating
      });
    } catch (err) {
      logger.error('Failed to update music metrics', err as Error, 'AR');
    }
  }

  /**
   * Check if AR is supported on this device
   */
  static async isARSupported(): Promise<boolean> {
    if (!navigator.xr) return false;

    try {
      const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
      return isSupported;
    } catch (err) {
      logger.error('Failed to check AR support', err as Error, 'AR');
      return false;
    }
  }

  /**
   * Get device AR capabilities
   */
  static async getARCapabilities(): Promise<{
    supported: boolean;
    features: string[];
    deviceType: string;
  }> {
    const supported = await ARService.isARSupported();

    if (!supported) {
      return {
        supported: false,
        features: [],
        deviceType: 'unknown'
      };
    }

    let features: string[] = [];
    const xrSession = await navigator.xr!.requestSession('immersive-ar', {
      optionalFeatures: [
        'hit-test',
        'dom-overlay',
        'plane-detection',
        'hit-test-on-contingent-planes'
      ],
      domOverlay: { root: document.body }
    });

    if (xrSession.supportedFrameRates) features.push('variable-rate');
    if (xrSession.visibilityState) features.push('visibility-tracking');

    // Detect device type
    const userAgent = navigator.userAgent;
    let deviceType = 'unknown';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      deviceType = 'ios';
    } else if (userAgent.includes('Android')) {
      deviceType = 'android';
    } else if (userAgent.includes('Windows')) {
      deviceType = 'windows-mixed-reality';
    }

    await xrSession.end();

    return {
      supported: true,
      features,
      deviceType
    };
  }

  /**
   * Get AR session status
   */
  getSessionStatus(): {
    isActive: boolean;
    sessionId: string | null;
    uptime: number;
    eventCount: number;
  } {
    return {
      isActive: this.arSession !== null,
      sessionId: this.sessionId,
      uptime: this.arSession ? Date.now() - this.startTime : 0,
      eventCount: this.eventLog.length
    };
  }
}

// Singleton instance
export const arService = new ARService();
