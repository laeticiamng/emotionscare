/**
 * Tests for breath-unified service
 * Tests des fonctions de protocoles et recommandations
 */

import { describe, expect, it } from 'vitest';
import { BreathUnifiedService } from '../breathUnifiedService';
import type { BreathProtocol, ProtocolConfig } from '../types';

describe('BreathUnifiedService', () => {
  const service = new BreathUnifiedService();

  describe('Protocol generation', () => {
    describe('generateProtocol', () => {
      it('generates 4-7-8 protocol steps for 1 minute', () => {
        const config: ProtocolConfig = {
          protocol: '478',
          duration_minutes: 1,
        };

        const steps = service.generateProtocol(config);

        expect(steps.length).toBeGreaterThan(0);

        // Vérifier la séquence : in (4s), hold (7s), out (8s)
        expect(steps[0].kind).toBe('in');
        expect(steps[0].duration_ms).toBe(4000);
        expect(steps[1].kind).toBe('hold');
        expect(steps[1].duration_ms).toBe(7000);
        expect(steps[2].kind).toBe('out');
        expect(steps[2].duration_ms).toBe(8000);

        // Total duration should not exceed 1 minute
        const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);
        expect(totalDuration).toBeLessThanOrEqual(60000);
      });

      it('generates coherence protocol (5s in, 5s out)', () => {
        const config: ProtocolConfig = {
          protocol: 'coherence',
          duration_minutes: 2,
        };

        const steps = service.generateProtocol(config);

        expect(steps.length).toBeGreaterThan(0);
        expect(steps[0].kind).toBe('in');
        expect(steps[0].duration_ms).toBe(5000);
        expect(steps[1].kind).toBe('out');
        expect(steps[1].duration_ms).toBe(5000);

        // Should generate cycles for ~2 minutes
        const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);
        expect(totalDuration).toBeGreaterThanOrEqual(100000);
        expect(totalDuration).toBeLessThanOrEqual(120000);
      });

      it('generates box breathing protocol (4 equal steps)', () => {
        const config: ProtocolConfig = {
          protocol: 'box',
          duration_minutes: 1,
        };

        const steps = service.generateProtocol(config);

        expect(steps.length).toBeGreaterThan(0);

        // Box: in(4), hold(4), out(4), hold(4)
        expect(steps[0].kind).toBe('in');
        expect(steps[0].duration_ms).toBe(4000);
        expect(steps[1].kind).toBe('hold');
        expect(steps[1].duration_ms).toBe(4000);
        expect(steps[2].kind).toBe('out');
        expect(steps[2].duration_ms).toBe(4000);
        expect(steps[3].kind).toBe('hold');
        expect(steps[3].duration_ms).toBe(4000);
      });

      it('generates relax protocol (4s in, 6s out)', () => {
        const config: ProtocolConfig = {
          protocol: 'relax',
          duration_minutes: 1,
        };

        const steps = service.generateProtocol(config);

        expect(steps.length).toBeGreaterThan(0);
        expect(steps[0].kind).toBe('in');
        expect(steps[0].duration_ms).toBe(4000);
        expect(steps[1].kind).toBe('out');
        expect(steps[1].duration_ms).toBe(6000);
      });

      it('handles 5-minute sessions', () => {
        const config: ProtocolConfig = {
          protocol: 'coherence',
          duration_minutes: 5,
        };

        const steps = service.generateProtocol(config);

        const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);
        expect(totalDuration).toBeLessThanOrEqual(300000); // 5 minutes max
        expect(totalDuration).toBeGreaterThanOrEqual(290000); // Close to 5 minutes
      });

      it('handles 15-minute sessions', () => {
        const config: ProtocolConfig = {
          protocol: '478',
          duration_minutes: 15,
        };

        const steps = service.generateProtocol(config);

        const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);
        expect(totalDuration).toBeLessThanOrEqual(900000); // 15 minutes max
      });

      it('repeats cycles to fill the duration', () => {
        const config: ProtocolConfig = {
          protocol: 'coherence', // 10s per cycle
          duration_minutes: 1, // 60s total
        };

        const steps = service.generateProtocol(config);

        // Should have approximately 6 cycles (60s / 10s)
        // Each cycle has 2 steps (in, out)
        expect(steps.length).toBeGreaterThanOrEqual(10);
        expect(steps.length).toBeLessThanOrEqual(12);
      });

      it('does not exceed requested duration', () => {
        const protocols: BreathProtocol[] = ['478', 'coherence', 'box', 'relax'];

        protocols.forEach((protocol) => {
          const config: ProtocolConfig = {
            protocol,
            duration_minutes: 3,
          };

          const steps = service.generateProtocol(config);
          const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);

          expect(totalDuration).toBeLessThanOrEqual(180000); // 3 minutes
        });
      });
    });

    describe('getTotalProtocolDuration', () => {
      it('returns correct duration in milliseconds', () => {
        const config: ProtocolConfig = {
          protocol: 'coherence',
          duration_minutes: 5,
        };

        const duration = service.getTotalProtocolDuration(config);

        expect(duration).toBe(300000); // 5 * 60 * 1000
      });

      it('handles 1 minute', () => {
        const config: ProtocolConfig = {
          protocol: '478',
          duration_minutes: 1,
        };

        expect(service.getTotalProtocolDuration(config)).toBe(60000);
      });

      it('handles 15 minutes', () => {
        const config: ProtocolConfig = {
          protocol: 'box',
          duration_minutes: 15,
        };

        expect(service.getTotalProtocolDuration(config)).toBe(900000);
      });
    });

    describe('getCycleDuration', () => {
      it('calculates 4-7-8 cycle duration (19 seconds)', () => {
        const duration = service.getCycleDuration('478');
        expect(duration).toBe(19000); // 4 + 7 + 8
      });

      it('calculates coherence cycle duration (10 seconds)', () => {
        const duration = service.getCycleDuration('coherence');
        expect(duration).toBe(10000); // 5 + 5
      });

      it('calculates box breathing cycle duration (16 seconds)', () => {
        const duration = service.getCycleDuration('box');
        expect(duration).toBe(16000); // 4 + 4 + 4 + 4
      });

      it('calculates relax cycle duration (10 seconds)', () => {
        const duration = service.getCycleDuration('relax');
        expect(duration).toBe(10000); // 4 + 6
      });
    });
  });

  describe('Recommendations', () => {
    describe('getRecommendation', () => {
      it('recommends 4-7-8 + immersive for high stress (delta > 5)', async () => {
        const recommendation = await service.getRecommendation('user-123', 8, 2);

        expect(recommendation.protocol).toBe('478');
        expect(recommendation.session_type).toBe('immersive');
        expect(recommendation.reasoning).toContain('4-7-8');
        expect(recommendation.expected_benefits).toContain('Réduction rapide de l\'anxiété');
        expect(recommendation.confidence_score).toBeGreaterThan(0.8);
      });

      it('recommends coherence + visual for moderate stress (delta 3-5)', async () => {
        const recommendation = await service.getRecommendation('user-123', 7, 3);

        expect(recommendation.protocol).toBe('coherence');
        expect(recommendation.session_type).toBe('visual');
        expect(recommendation.reasoning).toContain('Cohérence cardiaque');
        expect(recommendation.expected_benefits).toContain('Équilibre du système nerveux');
      });

      it('recommends box + basic for light stress (delta 0-3)', async () => {
        const recommendation = await service.getRecommendation('user-123', 4, 2);

        expect(recommendation.protocol).toBe('box');
        expect(recommendation.session_type).toBe('basic');
        expect(recommendation.reasoning).toContain('Respiration en carré');
        expect(recommendation.expected_benefits).toContain('Concentration accrue');
      });

      it('recommends relax + gamified for relaxation (delta <= 0)', async () => {
        const recommendation = await service.getRecommendation('user-123', 2, 3);

        expect(recommendation.protocol).toBe('relax');
        expect(recommendation.session_type).toBe('gamified');
        expect(recommendation.reasoning).toContain('Respiration relaxante');
        expect(recommendation.expected_benefits).toContain('Détente profonde');
      });

      it('respects available minutes constraint', async () => {
        const recommendation = await service.getRecommendation('user-123', 8, 2, {
          availableMinutes: 5,
        });

        expect(recommendation.duration_minutes).toBeLessThanOrEqual(5);
        expect(recommendation.protocol_config?.duration_minutes).toBeLessThanOrEqual(5);
      });

      it('caps duration at 15 minutes', async () => {
        const recommendation = await service.getRecommendation('user-123', 8, 2, {
          availableMinutes: 30,
        });

        expect(recommendation.duration_minutes).toBeLessThanOrEqual(15);
      });

      it('uses default 10 minutes when not specified', async () => {
        const recommendation = await service.getRecommendation('user-123', 6, 1);

        expect(recommendation.duration_minutes).toBe(10);
      });

      it('provides night-specific timing for bedtime', async () => {
        const recommendation = await service.getRecommendation('user-123', 7, 2, {
          timeOfDay: 'night',
        });

        expect(recommendation.optimal_timing).toBe('Avant le coucher');
      });

      it('provides generic timing for other times', async () => {
        const recommendation = await service.getRecommendation('user-123', 7, 2, {
          timeOfDay: 'morning',
        });

        expect(recommendation.optimal_timing).toBe('À tout moment');
      });

      it('returns valid protocol config', async () => {
        const recommendation = await service.getRecommendation('user-123', 8, 2);

        expect(recommendation.protocol_config).toBeDefined();
        expect(recommendation.protocol_config?.protocol).toBe(recommendation.protocol);
        expect(recommendation.protocol_config?.duration_minutes).toBe(
          recommendation.duration_minutes
        );
      });

      it('handles edge case: zero stress delta', async () => {
        const recommendation = await service.getRecommendation('user-123', 5, 5);

        expect(recommendation.protocol).toBe('relax');
        expect(recommendation.session_type).toBe('gamified');
      });

      it('handles edge case: negative stress delta (already calm)', async () => {
        const recommendation = await service.getRecommendation('user-123', 2, 6);

        expect(recommendation.protocol).toBe('relax');
        expect(recommendation.session_type).toBe('gamified');
      });

      it('handles edge case: extremely high stress (delta 10)', async () => {
        const recommendation = await service.getRecommendation('user-123', 10, 0);

        expect(recommendation.protocol).toBe('478');
        expect(recommendation.session_type).toBe('immersive');
      });

      it('provides different reasoning based on stress level', async () => {
        const highStress = await service.getRecommendation('user-123', 10, 1);
        const moderateStress = await service.getRecommendation('user-123', 6, 2);
        const lowStress = await service.getRecommendation('user-123', 3, 2);

        expect(highStress.reasoning).not.toBe(moderateStress.reasoning);
        expect(moderateStress.reasoning).not.toBe(lowStress.reasoning);
      });
    });

    describe('Expected benefits', () => {
      it('provides 4-7-8 benefits', async () => {
        const recommendation = await service.getRecommendation('user-123', 9, 1);

        expect(recommendation.expected_benefits).toEqual([
          'Réduction rapide de l\'anxiété',
          'Amélioration du sommeil',
          'Activation parasympathique',
        ]);
      });

      it('provides coherence benefits', async () => {
        const recommendation = await service.getRecommendation('user-123', 7, 3);

        expect(recommendation.expected_benefits).toEqual([
          'Équilibre du système nerveux',
          'Régulation émotionnelle',
          'Amélioration HRV',
        ]);
      });

      it('provides box breathing benefits', async () => {
        const recommendation = await service.getRecommendation('user-123', 4, 2);

        expect(recommendation.expected_benefits).toEqual([
          'Concentration accrue',
          'Réduction du stress',
          'Équilibre mental',
        ]);
      });

      it('provides relax protocol benefits', async () => {
        const recommendation = await service.getRecommendation('user-123', 2, 3);

        expect(recommendation.expected_benefits).toEqual([
          'Détente profonde',
          'Calme mental',
          'Relaxation musculaire',
        ]);
      });
    });
  });

  describe('Protocol characteristics', () => {
    it('4-7-8 has longest hold phase', () => {
      const cycle478 = service.getCycleDuration('478');
      const cycleCoherence = service.getCycleDuration('coherence');
      const cycleBox = service.getCycleDuration('box');

      // 4-7-8 has 19s cycle (longest)
      expect(cycle478).toBeGreaterThan(cycleCoherence);
      expect(cycle478).toBeGreaterThan(cycleBox);
    });

    it('coherence and relax have same cycle duration', () => {
      const cycleCoherence = service.getCycleDuration('coherence');
      const cycleRelax = service.getCycleDuration('relax');

      expect(cycleCoherence).toBe(cycleRelax);
      expect(cycleCoherence).toBe(10000);
    });

    it('box breathing has 4 equal phases', () => {
      const config: ProtocolConfig = {
        protocol: 'box',
        duration_minutes: 1,
      };

      const steps = service.generateProtocol(config);

      // Check first cycle
      expect(steps[0].duration_ms).toBe(4000);
      expect(steps[1].duration_ms).toBe(4000);
      expect(steps[2].duration_ms).toBe(4000);
      expect(steps[3].duration_ms).toBe(4000);
    });

    it('relax has longer exhale than inhale', () => {
      const config: ProtocolConfig = {
        protocol: 'relax',
        duration_minutes: 1,
      };

      const steps = service.generateProtocol(config);

      expect(steps[0].kind).toBe('in');
      expect(steps[0].duration_ms).toBe(4000);
      expect(steps[1].kind).toBe('out');
      expect(steps[1].duration_ms).toBe(6000);
      expect(steps[1].duration_ms).toBeGreaterThan(steps[0].duration_ms);
    });
  });

  describe('Edge cases', () => {
    it('handles very short duration (1 minute)', () => {
      const protocols: BreathProtocol[] = ['478', 'coherence', 'box', 'relax'];

      protocols.forEach((protocol) => {
        const config: ProtocolConfig = {
          protocol,
          duration_minutes: 1,
        };

        const steps = service.generateProtocol(config);
        expect(steps.length).toBeGreaterThan(0);

        const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);
        expect(totalDuration).toBeLessThanOrEqual(60000);
      });
    });

    it('handles maximum duration (15 minutes)', () => {
      const protocols: BreathProtocol[] = ['478', 'coherence', 'box', 'relax'];

      protocols.forEach((protocol) => {
        const config: ProtocolConfig = {
          protocol,
          duration_minutes: 15,
        };

        const steps = service.generateProtocol(config);
        expect(steps.length).toBeGreaterThan(0);

        const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);
        expect(totalDuration).toBeLessThanOrEqual(900000);
      });
    });

    it('handles non-integer minutes cleanly', () => {
      const config: ProtocolConfig = {
        protocol: 'coherence',
        duration_minutes: 2.5,
      };

      const steps = service.generateProtocol(config);
      const totalDuration = steps.reduce((sum, step) => sum + step.duration_ms, 0);

      expect(totalDuration).toBeLessThanOrEqual(150000); // 2.5 minutes
    });

    it('handles stress levels at exact boundaries', async () => {
      // Exactly at boundary: delta = 5
      const rec5 = await service.getRecommendation('user-123', 8, 3);
      expect(rec5.protocol).toBe('coherence');

      // Exactly at boundary: delta = 3
      const rec3 = await service.getRecommendation('user-123', 5, 2);
      expect(rec3.protocol).toBe('box');

      // Exactly at boundary: delta = 0
      const rec0 = await service.getRecommendation('user-123', 3, 3);
      expect(rec0.protocol).toBe('relax');
    });
  });

  describe('Cycles calculation', () => {
    it('calculates correct number of cycles for 5 minutes coherence', () => {
      const config: ProtocolConfig = {
        protocol: 'coherence', // 10s per cycle
        duration_minutes: 5, // 300s total
      };

      const steps = service.generateProtocol(config);

      // 300s / 10s = 30 cycles
      // Each cycle has 2 steps (in, out)
      expect(steps.length).toBeGreaterThanOrEqual(58);
      expect(steps.length).toBeLessThanOrEqual(60);
    });

    it('calculates correct number of cycles for 5 minutes 4-7-8', () => {
      const config: ProtocolConfig = {
        protocol: '478', // 19s per cycle
        duration_minutes: 5, // 300s total
      };

      const steps = service.generateProtocol(config);

      // 300s / 19s ≈ 15.78 cycles
      // Each cycle has 3 steps (in, hold, out)
      expect(steps.length).toBeGreaterThanOrEqual(45);
      expect(steps.length).toBeLessThanOrEqual(48);
    });
  });
});
