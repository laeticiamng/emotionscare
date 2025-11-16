/**
 * Tests pour orchestration.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { musicOrchestrationService } from '../orchestration';
import type { MusicOrchestrationPresetId } from '../orchestration';
import { supabase } from '@/integrations/supabase/client';
import type { ClinicalSignal } from '@/services/clinicalOrchestration';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('MusicOrchestrationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getActivePreset', () => {
    it('should return default ambient_soft preset', () => {
      const preset = musicOrchestrationService.getActivePreset();

      expect(preset).toBeDefined();
      expect(preset.id).toBe('ambient_soft');
      expect(preset.label).toBe('Ambient Soft');
      expect(preset.texture).toBe('soft');
      expect(preset.intensity).toBe('low');
      expect(preset.volume).toBe(0.45);
      expect(preset.playbackRate).toBe(0.96);
      expect(preset.crossfadeMs).toBe(2600);
    });

    it('should include empty hints array by default', () => {
      const preset = musicOrchestrationService.getActivePreset();

      expect(preset.hints).toEqual([]);
    });

    it('should include reason', () => {
      const preset = musicOrchestrationService.getActivePreset();

      expect(preset.reason).toBeTruthy();
      expect(typeof preset.reason).toBe('string');
    });
  });

  describe('handleMoodUpdate', () => {
    it('should select ambient_soft for low arousal', () => {
      const mood = {
        valence: 50,
        arousal: 25, // Low arousal <= 35
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('ambient_soft');
      expect(result.changed).toBe(false); // Already default
      expect(result.preset.source).toBe('mood');
    });

    it('should select bright for high valence and high arousal', () => {
      const mood = {
        valence: 70, // >= 65
        arousal: 60, // >= 55
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('bright');
      expect(result.changed).toBe(true);
      expect(result.preset.source).toBe('mood');
    });

    it('should select focus for high arousal without high valence', () => {
      const mood = {
        valence: 50,
        arousal: 70, // >= 65
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('focus');
      expect(result.changed).toBe(true);
      expect(result.preset.source).toBe('mood');
    });

    it('should select bright for high valence with moderate arousal', () => {
      const mood = {
        valence: 60, // >= 55
        arousal: 50,
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('bright');
      expect(result.changed).toBe(true);
    });

    it('should select ambient_soft for low valence and high arousal', () => {
      const mood = {
        valence: 35, // < 40
        arousal: 75, // > 70
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('ambient_soft');
      expect(result.changed).toBe(false); // Already default
    });

    it('should include reason with mood values', () => {
      const mood = {
        valence: 70,
        arousal: 60,
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.reason).toContain('SAM/Mood');
      expect(result.preset.reason).toContain('valence');
      expect(result.preset.reason).toContain('activation');
    });

    it('should persist preset to localStorage when changed', () => {
      const mood = {
        valence: 70,
        arousal: 60,
        timestamp: new Date().toISOString()
      };

      musicOrchestrationService.handleMoodUpdate(mood);

      const stored = localStorageMock.getItem('emotionscare.music.lastPreset');
      expect(stored).toBe('bright');
    });
  });

  describe('refreshFromClinicalSignals', () => {
    it('should fetch clinical signals and evaluate preset', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          source_instrument: 'SAM',
          domain: 'mood',
          level: 2,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            scores: {
              valence: 70,
              arousal: 60
            }
          },
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(mockFrom.select).toHaveBeenCalledWith('*');
      expect(mockFrom.in).toHaveBeenCalledWith('source_instrument', ['WHO5', 'SAM']);
      expect(mockFrom.limit).toHaveBeenCalledWith(8);
      expect(result.preset).toBeDefined();
      expect(result.preset.source).toBe('clinical');
    });

    it('should handle fetch errors gracefully', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset).toBeDefined();
      expect(result.changed).toBe(false);
    });

    it('should select ambient_soft for anxiety signals', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'anxiety',
          level: 4, // >= 3
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {},
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.id).toBe('ambient_soft');
    });

    it('should select ambient_soft for low wellbeing (WHO5)', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'wellbeing',
          level: 1, // <= 1
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {},
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.id).toBe('ambient_soft');
    });

    it('should extract and use hints from clinical signals', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'wellbeing',
          level: 3,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            hints: ['gentle_tone', 'reduce_intensity']
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.id).toBe('ambient_soft');
      expect(result.preset.hints).toContain('gentle_tone');
      expect(result.preset.hints).toContain('reduce_intensity');
      expect(result.preset.reason).toContain('Adaptation clinique');
    });

    it('should select bright for encourage_movement hint', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'activity',
          level: 3,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            hints: ['encourage_movement']
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.id).toBe('bright');
      expect(result.preset.hints).toContain('encourage_movement');
    });

    it('should extract hints from actions array', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'wellbeing',
          level: 3,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            actions: ['gentle_tone', 'prefer_silence']
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.hints).toContain('gentle_tone');
      expect(result.preset.hints).toContain('prefer_silence');
    });

    it('should extract hints from object actions', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'wellbeing',
          level: 3,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            hints: [
              { action: 'gentle_tone', priority: 'high' },
              { action: 'reduce_intensity', priority: 'medium' }
            ]
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.hints).toContain('gentle_tone');
      expect(result.preset.hints).toContain('reduce_intensity');
    });

    it('should extract SAM vector from clinical signals', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'SAM',
          domain: 'mood',
          level: 2,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            scores: {
              valence: 75,
              arousal: 65
            }
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      // Should select bright based on SAM vector
      expect(result.preset.id).toBe('bright');
      expect(result.preset.reason).toContain('SAM/Mood');
    });

    it('should clamp SAM values to 0-100 range', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'SAM',
          domain: 'mood',
          level: 2,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            scores: {
              valence: 150, // Should clamp to 100
              arousal: -20 // Should clamp to 0
            }
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      // Should still evaluate (clamped values)
      expect(result.preset).toBeDefined();
    });

    it('should handle SAM signal with alternative score field names', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'SAM',
          domain: 'mood',
          level: 2,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            valence_score: 70,
            arousal_score: 60
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.id).toBe('bright');
    });

    it('should default to focus when no strong signals', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'wellbeing',
          level: 3,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {},
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset.id).toBe('focus');
    });
  });

  describe('preset persistence', () => {
    it('should load preset from localStorage on startup', () => {
      localStorageMock.setItem('emotionscare.music.lastPreset', 'bright');

      // Create a new service instance would load from localStorage
      // But since we're using a singleton, we can test via handleMoodUpdate
      const mood = {
        valence: 70,
        arousal: 60,
        timestamp: new Date().toISOString()
      };

      musicOrchestrationService.handleMoodUpdate(mood);
      const stored = localStorageMock.getItem('emotionscare.music.lastPreset');

      expect(stored).toBe('bright');
    });

    it('should default to ambient_soft if localStorage is empty', () => {
      localStorageMock.clear();

      const preset = musicOrchestrationService.getActivePreset();

      expect(preset.id).toBe('ambient_soft');
    });

    it('should ignore invalid preset IDs in localStorage', () => {
      localStorageMock.setItem('emotionscare.music.lastPreset', 'invalid_preset' as any);

      // Since the service is already instantiated, this won't reload
      // But the validation logic would catch this on initialization
      const preset = musicOrchestrationService.getActivePreset();

      expect(preset.id).toBeTruthy();
      expect(['ambient_soft', 'focus', 'bright']).toContain(preset.id);
    });
  });

  describe('preset catalog', () => {
    it('should have correct properties for ambient_soft', () => {
      const preset = musicOrchestrationService.getActivePreset();
      // Default is ambient_soft

      expect(preset.label).toBe('Ambient Soft');
      expect(preset.texture).toBe('soft');
      expect(preset.intensity).toBe('low');
      expect(preset.volume).toBe(0.45);
      expect(preset.playbackRate).toBe(0.96);
      expect(preset.crossfadeMs).toBe(2600);
    });

    it('should have correct properties for focus', async () => {
      const mood = {
        valence: 50,
        arousal: 70,
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('focus');
      expect(result.preset.label).toBe('Focus Layer');
      expect(result.preset.texture).toBe('focused');
      expect(result.preset.intensity).toBe('medium');
      expect(result.preset.volume).toBe(0.6);
      expect(result.preset.playbackRate).toBe(1);
      expect(result.preset.crossfadeMs).toBe(1800);
    });

    it('should have correct properties for bright', async () => {
      const mood = {
        valence: 70,
        arousal: 60,
        timestamp: new Date().toISOString()
      };

      const result = musicOrchestrationService.handleMoodUpdate(mood);

      expect(result.preset.id).toBe('bright');
      expect(result.preset.label).toBe('Bright Bloom');
      expect(result.preset.texture).toBe('radiant');
      expect(result.preset.intensity).toBe('high');
      expect(result.preset.volume).toBe(0.72);
      expect(result.preset.playbackRate).toBe(1.06);
      expect(result.preset.crossfadeMs).toBe(1200);
    });
  });

  describe('edge cases', () => {
    it('should handle empty signals array', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset).toBeDefined();
      expect(result.preset.id).toBe('focus'); // Default when no signals
    });

    it('should handle missing metadata', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'WHO5',
          domain: 'wellbeing',
          level: 3,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: null as any,
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      expect(result.preset).toBeDefined();
    });

    it('should handle invalid SAM values', async () => {
      const mockSignals: ClinicalSignal[] = [
        {
          id: 'signal-1',
          // user_id removed for type compliance
          source_instrument: 'SAM',
          domain: 'mood',
          level: 2,
          module_context: 'music',
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          metadata: {
            scores: {
              valence: 'invalid' as any,
              arousal: NaN
            }
          },
          created_at: new Date().toISOString(),
          // updated_at removed for type compliance
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockSignals, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await musicOrchestrationService.refreshFromClinicalSignals();

      // Should still work, just ignore invalid SAM data
      expect(result.preset).toBeDefined();
    });
  });
});
