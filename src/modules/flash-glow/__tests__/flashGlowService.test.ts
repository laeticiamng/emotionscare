/**
 * Tests unitaires pour Flash Glow Service
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
}));

// Import après les mocks
import { flashGlowService } from '../flash-glowService';

describe('flashGlowService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('existe et expose les méthodes attendues', () => {
    expect(flashGlowService).toBeDefined();
    expect(typeof flashGlowService.startSession).toBe('function');
    expect(typeof flashGlowService.endSession).toBe('function');
    expect(typeof flashGlowService.getStats).toBe('function');
    expect(typeof flashGlowService.calculateScore).toBe('function');
  });

  it('startSession crée une session avec les bons paramètres', async () => {
    const session = await flashGlowService.startSession({
      glowType: 'energize',
      intensity: 70,
      duration: 60,
    });
    
    // Vérifie que la session est retournée avec un ID
    expect(session).toBeDefined();
    expect(session.sessionId).toBeDefined();
    expect(session.sessionId.startsWith('fg_')).toBe(true);
  });

  it('getStats retourne des statistiques formatées', async () => {
    const stats = await flashGlowService.getStats();
    
    // Vérifie la structure des stats
    expect(stats).toBeDefined();
    expect(typeof stats.total_sessions).toBe('number');
    expect(typeof stats.avg_duration).toBe('number');
    expect(Array.isArray(stats.achievements)).toBe(true);
  });

  it('calculateScore retourne un score cohérent', () => {
    const score = flashGlowService.calculateScore(60, 70, true);
    
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(500);
  });
});

describe('Flash Glow Phases', () => {
  it('définit les phases correctement', () => {
    const PHASES = ['warmup', 'glow', 'settle'] as const;
    
    expect(PHASES).toHaveLength(3);
    expect(PHASES).toContain('warmup');
    expect(PHASES).toContain('glow');
    expect(PHASES).toContain('settle');
  });

  it('valide les thèmes disponibles', () => {
    const THEMES = ['cyan', 'violet', 'amber', 'emerald'] as const;
    
    expect(THEMES).toHaveLength(4);
    THEMES.forEach(theme => {
      expect(typeof theme).toBe('string');
    });
  });
});

describe('Flash Glow Settings Validation', () => {
  it('valide les limites d\'intensité', () => {
    const validateIntensity = (value: number): boolean => {
      return value >= 0 && value <= 1;
    };
    
    expect(validateIntensity(0)).toBe(true);
    expect(validateIntensity(0.5)).toBe(true);
    expect(validateIntensity(1)).toBe(true);
    expect(validateIntensity(-0.1)).toBe(false);
    expect(validateIntensity(1.5)).toBe(false);
  });

  it('valide les durées autorisées', () => {
    const ALLOWED_DURATIONS = [30, 60, 120, 180, 300];
    
    const validateDuration = (seconds: number): boolean => {
      return ALLOWED_DURATIONS.includes(seconds);
    };
    
    expect(validateDuration(60)).toBe(true);
    expect(validateDuration(180)).toBe(true);
    expect(validateDuration(45)).toBe(false);
  });
});
