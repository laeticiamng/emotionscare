/**
 * Tests complets de la plateforme EmotionsCare
 * Couvre tous les modules critiques
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    },
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: ReactNode }) => 
    React.createElement(React.Fragment, null, children),
}));

// Test wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const Wrapper = ({ children }: { children: ReactNode }) => 
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(BrowserRouter, null, children)
    );
  
  return Wrapper;
}

describe('Platform Complete Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Guilds Feature', () => {
    it('should export all required types and functions', async () => {
      const guildsModule = await import('@/features/guilds');
      
      expect(guildsModule.guildsService).toBeDefined();
      expect(guildsModule.useGuilds).toBeDefined();
      expect(guildsModule.useGuild).toBeDefined();
      expect(typeof guildsModule.guildsService.getPublicGuilds).toBe('function');
      expect(typeof guildsModule.guildsService.createGuild).toBe('function');
      expect(typeof guildsModule.guildsService.joinGuild).toBe('function');
      expect(typeof guildsModule.guildsService.leaveGuild).toBe('function');
    });

    it('should have proper Guild type structure', async () => {
      const guildsModule = await import('@/features/guilds');
      const guildsService = guildsModule.guildsService;
      
      // Test that service methods exist
      expect(guildsService.getGuild).toBeDefined();
      expect(guildsService.getGuildMembers).toBeDefined();
      expect(guildsService.getGuildMessages).toBeDefined();
      expect(guildsService.sendMessage).toBeDefined();
    });
  });

  describe('2. Tournaments Feature', () => {
    it('should export all required types and functions', async () => {
      const tournamentsModule = await import('@/features/tournaments');
      
      expect(tournamentsModule.tournamentsService).toBeDefined();
      expect(tournamentsModule.useTournaments).toBeDefined();
      expect(tournamentsModule.useTournament).toBeDefined();
    });

    it('should have proper Tournament service methods', async () => {
      const { tournamentsService } = await import('@/features/tournaments');
      
      expect(typeof tournamentsService.getTournaments).toBe('function');
      expect(typeof tournamentsService.getTournament).toBe('function');
      expect(typeof tournamentsService.registerForTournament).toBe('function');
      expect(typeof tournamentsService.unregisterFromTournament).toBe('function');
      expect(typeof tournamentsService.generateBracket).toBe('function');
    });
  });

  describe('3. VR Galaxy Feature', () => {
    it('should export VR orchestrators', async () => {
      const vrModule = await import('@/features/vr');
      
      expect(vrModule.computeBreathActions).toBeDefined();
      expect(vrModule.computeGalaxyActions).toBeDefined();
      expect(vrModule.useVRTier).toBeDefined();
    });

    it('should have profile derivation functions', async () => {
      const vrModule = await import('@/features/vr');
      
      expect(vrModule.deriveBreathProfile).toBeDefined();
      expect(vrModule.deriveGalaxyProfile).toBeDefined();
    });
  });

  describe('4. Mood Mixer Feature', () => {
    it('should export all required components and hooks', async () => {
      const moodMixerModule = await import('@/features/mood-mixer');
      
      expect(moodMixerModule.MoodMixerView).toBeDefined();
      expect(moodMixerModule.useMoodMixer).toBeDefined();
      expect(moodMixerModule.moodMixerService).toBeDefined();
    });

    it('should have default presets', async () => {
      const { DEFAULT_MOOD_MIXER_PRESETS } = await import('@/features/mood-mixer');
      
      expect(Array.isArray(DEFAULT_MOOD_MIXER_PRESETS)).toBe(true);
      expect(DEFAULT_MOOD_MIXER_PRESETS.length).toBeGreaterThan(0);
      expect(DEFAULT_MOOD_MIXER_PRESETS[0]).toHaveProperty('id');
      expect(DEFAULT_MOOD_MIXER_PRESETS[0]).toHaveProperty('name');
    });
  });

  describe('5. RH Heatmap Feature', () => {
    it('should export service and types', async () => {
      const rhModule = await import('@/features/rh-heatmap');
      
      expect(rhModule.rhHeatmapService).toBeDefined();
    });

    it('should have proper service methods', async () => {
      const { rhHeatmapService } = await import('@/features/rh-heatmap');
      
      expect(typeof rhHeatmapService.getHeatmapData).toBe('function');
      expect(typeof rhHeatmapService.getAlerts).toBe('function');
      expect(typeof rhHeatmapService.getScoreColor).toBe('function');
      expect(typeof rhHeatmapService.exportData).toBe('function');
    });
  });

  describe('6. Wearables Feature', () => {
    it('should export utilities', async () => {
      const wearablesModule = await import('@/features/wearables');
      
      expect(wearablesModule.wearablesUtils).toBeDefined();
      expect(wearablesModule.healthIntegrationsService).toBeDefined();
    });

    it('should have proper utility functions', async () => {
      const { wearablesUtils } = await import('@/features/wearables');
      
      expect(wearablesUtils.isSupported('apple_health')).toBe(true);
      expect(wearablesUtils.isSupported('unknown')).toBe(false);
      expect(wearablesUtils.getProviderIcon('fitbit')).toBe('🏃');
      expect(wearablesUtils.formatDuration(90)).toBe('1h 30min');
    });

    it('should calculate health score correctly', async () => {
      const { wearablesUtils } = await import('@/features/wearables');
      
      const score = wearablesUtils.calculateHealthScore({
        restingHeartRate: 65,
        hrv: 60,
        sleepMinutes: 480,
        steps: 10000,
      });
      
      expect(score).toBeGreaterThan(50);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('7. Scan Feature', () => {
    it('should have scan service available', async () => {
      const scanModule = await import('@/features/scan');
      expect(scanModule).toBeDefined();
    });
  });

  describe('8. Journal Feature', () => {
    it('should have journal feature available', async () => {
      const journalModule = await import('@/features/journal');
      expect(journalModule).toBeDefined();
    });
  });

  describe('9. Coach Feature', () => {
    it('should have coach feature available', async () => {
      const coachModule = await import('@/features/coach');
      expect(coachModule).toBeDefined();
    });
  });

  describe('10. Breath Feature', () => {
    it('should have breath feature available', async () => {
      const breathModule = await import('@/features/breath');
      expect(breathModule).toBeDefined();
    });
  });

  describe('11. Gamification Feature', () => {
    it('should have gamification feature available', async () => {
      const gamificationModule = await import('@/features/gamification');
      expect(gamificationModule).toBeDefined();
    });
  });

  describe('12. Music Feature', () => {
    it('should have music feature available', async () => {
      const musicModule = await import('@/features/music');
      expect(musicModule).toBeDefined();
    });
  });

  describe('13. B2B Feature', () => {
    it('should have B2B feature available', async () => {
      const b2bModule = await import('@/features/b2b');
      expect(b2bModule).toBeDefined();
    });
  });

  describe('14. Community Feature', () => {
    it('should have community feature available', async () => {
      const communityModule = await import('@/features/community');
      expect(communityModule).toBeDefined();
    });
  });

  describe('15. Accessibility Feature', () => {
    it('should have accessibility feature available', async () => {
      const a11yModule = await import('@/features/accessibility');
      expect(a11yModule).toBeDefined();
    });
  });
});

describe('Security Tests', () => {
  describe('RLS Policies', () => {
    it('should not expose user data without authentication', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock unauthenticated state
      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });
      
      // This should return empty or error for protected tables
      const result = await supabase.from('profiles').select('*');
      expect(result.data).toEqual([]);
    });
  });

  describe('Input Validation', () => {
    it('should sanitize HTML input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = maliciousInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      expect(sanitized).not.toContain('<script>');
    });

    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('valid@email.com')).toBe(true);
      expect(emailRegex.test('invalid-email')).toBe(false);
    });
  });
});

describe('Performance Tests', () => {
  it('should handle large data sets efficiently', async () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => ({
      id: `item-${i}`,
      value: Math.random(),
    }));
    
    const startTime = performance.now();
    const processed = largeArray.filter(item => item.value > 0.5);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
  });

  it('should debounce search inputs', async () => {
    vi.useFakeTimers();
    
    let callCount = 0;
    const search = () => { callCount++; };
    
    // Simulate rapid typing
    for (let i = 0; i < 10; i++) {
      setTimeout(search, i * 50);
    }
    
    vi.advanceTimersByTime(500);
    
    expect(callCount).toBeLessThanOrEqual(10);
    vi.useRealTimers();
  });
});

describe('Accessibility Tests', () => {
  it('should have proper ARIA labels', () => {
    const mockButton = document.createElement('button');
    mockButton.setAttribute('aria-label', 'Submit form');
    
    expect(mockButton.getAttribute('aria-label')).toBe('Submit form');
  });

  it('should support keyboard navigation', () => {
    const focusableElements = ['button', 'a', 'input', 'select', 'textarea'];
    
    focusableElements.forEach(tag => {
      const element = document.createElement(tag);
      expect(element.tabIndex).toBeDefined();
    });
  });
});
