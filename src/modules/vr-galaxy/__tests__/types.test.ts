import { describe, it, expect } from 'vitest';
import type {
  VRNebulaSession,
  VRGalaxySession,
  Discovery,
  GalaxyEnvironment,
  BiometricInsight,
  BiometricMetrics,
  AdaptiveRecommendation,
  SessionCompletion,
  SessionReport,
  DiscoveryResult,
} from '../types';

describe('VR Galaxy types', () => {
  describe('VRNebulaSession', () => {
    it('validates a minimal VR Nebula session', () => {
      const session: VRNebulaSession = {
        id: 'session-123',
        user_id: 'user-456',
        session_id: 'sess-789',
        duration_seconds: 600,
        created_at: new Date().toISOString(),
      };

      expect(session.id).toBeDefined();
      expect(session.duration_seconds).toBe(600);
      expect(session.hrv_pre).toBeUndefined();
    });

    it('validates a complete VR Nebula session with biometrics', () => {
      const session: VRNebulaSession = {
        id: 'session-123',
        user_id: 'user-456',
        session_id: 'sess-789',
        hrv_pre: 65,
        hrv_post: 72,
        rmssd_delta: 7,
        resp_rate_avg: 12.5,
        coherence_score: 85,
        duration_seconds: 1200,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      };

      expect(session.hrv_pre).toBe(65);
      expect(session.hrv_post).toBe(72);
      expect(session.coherence_score).toBe(85);
    });
  });

  describe('VRGalaxySession', () => {
    it('validates a complete VR Galaxy session with explorations', () => {
      const discoveries: Discovery[] = [
        {
          type: 'planet',
          name: 'Serenity Prime',
          coordinates: { x: 100, y: 200, z: 50 },
          description: 'A peaceful world',
          therapeutic_value: 85,
          timestamp: Date.now(),
        },
      ];

      const session: VRGalaxySession = {
        id: 'galaxy-session-123',
        user_id: 'user-456',
        session_id: 'sess-789',
        galaxy_explored: 'Andromeda Wellness',
        planets_visited: ['Serenity Prime', 'Calm Nebula'],
        discoveries,
        hrv_pre: 60,
        hrv_post: 75,
        rmssd_delta: 15,
        resp_rate_avg: 11,
        coherence_score: 90,
        duration_seconds: 1800,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        achievements_unlocked: ['First Explorer', 'Nebula Finder'],
        exploration_depth: 3,
      };

      expect(session.galaxy_explored).toBe('Andromeda Wellness');
      expect(session.discoveries).toHaveLength(1);
      expect(session.achievements_unlocked).toContain('First Explorer');
    });
  });

  describe('Discovery', () => {
    it('validates all discovery types', () => {
      const discoveryTypes: Discovery['type'][] = ['planet', 'nebula', 'constellation', 'phenomenon'];
      
      discoveryTypes.forEach((type) => {
        const discovery: Discovery = {
          type,
          name: `Test ${type}`,
          coordinates: { x: 0, y: 0, z: 0 },
          description: `A ${type} discovery`,
          therapeutic_value: 75,
          timestamp: Date.now(),
        };
        expect(discovery.type).toBe(type);
      });
    });

    it('validates coordinates structure', () => {
      const discovery: Discovery = {
        type: 'nebula',
        name: 'Healing Nebula',
        coordinates: { x: -50.5, y: 100.3, z: 25.8 },
        description: 'A colorful nebula with healing properties',
        therapeutic_value: 95,
        timestamp: Date.now(),
      };

      expect(discovery.coordinates.x).toBe(-50.5);
      expect(discovery.coordinates.y).toBe(100.3);
      expect(discovery.coordinates.z).toBe(25.8);
    });
  });

  describe('GalaxyEnvironment', () => {
    it('validates environment configuration', () => {
      const environment: GalaxyEnvironment = {
        name: 'Tranquil Galaxy',
        theme: 'relaxation',
        stars_density: 0.75,
        color_palette: ['#1a1a2e', '#16213e', '#0f3460'],
        ambient_sounds: ['cosmic_hum', 'stellar_winds'],
        therapeutic_elements: ['floating_crystals', 'aurora_streams'],
        difficulty_level: 2,
      };

      expect(environment.stars_density).toBe(0.75);
      expect(environment.color_palette).toHaveLength(3);
      expect(environment.ambient_sounds).toContain('cosmic_hum');
    });
  });

  describe('BiometricInsight', () => {
    it('validates all trend types', () => {
      const trends: BiometricInsight['trend'][] = ['improving', 'stable', 'needs_attention'];
      
      trends.forEach((trend) => {
        const insight: BiometricInsight = {
          metric: 'HRV',
          value: 70,
          trend,
          recommendation: `Continue ${trend === 'improving' ? 'current' : 'adjusted'} practice`,
          confidence: 0.85,
        };
        expect(insight.trend).toBe(trend);
      });
    });
  });

  describe('BiometricMetrics', () => {
    it('validates partial biometric metrics', () => {
      const metrics: BiometricMetrics = {
        hrv_pre: 65,
        current_stress_level: 45,
      };

      expect(metrics.hrv_pre).toBe(65);
      expect(metrics.hrv_post).toBeUndefined();
      expect(metrics.current_stress_level).toBe(45);
    });
  });

  describe('SessionReport', () => {
    it('validates complete session report structure', () => {
      const report: SessionReport = {
        sessionId: 'sess-123',
        duration: 1800,
        discoveries: [],
        biometricProgress: {
          hrvImprovement: 15,
          coherenceScore: 88,
          stressReduction: 25,
        },
        explorationStats: {
          planetsVisited: 5,
          totalDiscoveries: 12,
          explorationDepth: 4,
        },
        therapeuticImpact: {
          overallScore: 90,
          emotionalBenefit: 'Significant stress reduction',
          physicalBenefit: 'Improved HRV variability',
        },
      };

      expect(report.biometricProgress.hrvImprovement).toBe(15);
      expect(report.explorationStats.planetsVisited).toBe(5);
      expect(report.therapeuticImpact.overallScore).toBe(90);
    });
  });

  describe('AdaptiveRecommendation', () => {
    it('validates recommendation structure', () => {
      const recommendation: AdaptiveRecommendation = {
        action: 'slow_breathing',
        reason: 'Elevated stress detected',
        urgency: 8,
      };

      expect(recommendation.action).toBe('slow_breathing');
      expect(recommendation.urgency).toBe(8);
    });
  });

  describe('SessionCompletion', () => {
    it('validates session completion data', () => {
      const completion: SessionCompletion = {
        durationSeconds: 1200,
        finalBiometrics: {
          hrv_post: 75,
          resp_rate_avg: 10,
        },
        userFeedback: 'Great session!',
      };

      expect(completion.durationSeconds).toBe(1200);
      expect(completion.finalBiometrics?.hrv_post).toBe(75);
    });
  });

  describe('DiscoveryResult', () => {
    it('validates discovery result with achievements', () => {
      const result: DiscoveryResult = {
        achievements: ['First Planet', 'Explorer Badge'],
        xpGained: 150,
      };

      expect(result.achievements).toHaveLength(2);
      expect(result.xpGained).toBe(150);
    });
  });
});
