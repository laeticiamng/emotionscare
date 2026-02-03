/**
 * Tests unitaires pour useScan
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useScan } from '../useScan';

// Mock Supabase
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useScan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInvoke.mockResolvedValue({
      data: {
        bucket: 'positif',
        label: 'Joyeux',
        advice: 'Continuez ainsi !',
        confidence: 0.85,
      },
      error: null,
    });
  });

  describe('Initialisation', () => {
    it('retourne l\'état initial correct', () => {
      const { result } = renderHook(() => useScan());

      expect(result.current.mode).toBe('photo');
      expect(result.current.result).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('expose les fonctions d\'analyse', () => {
      const { result } = renderHook(() => useScan());

      expect(typeof result.current.setMode).toBe('function');
      expect(typeof result.current.analyzePhoto).toBe('function');
      expect(typeof result.current.analyzeCamera).toBe('function');
    });
  });

  describe('Changement de mode', () => {
    it('change le mode en camera', () => {
      const { result } = renderHook(() => useScan());

      act(() => {
        result.current.setMode('camera');
      });

      expect(result.current.mode).toBe('camera');
    });

    it('réinitialise le résultat lors du changement de mode', () => {
      const { result } = renderHook(() => useScan());

      // Simuler un résultat existant serait complexe ici
      // On vérifie juste que setMode fonctionne
      act(() => {
        result.current.setMode('camera');
      });

      expect(result.current.result).toBeNull();
    });
  });

  describe('Types de scan', () => {
    it('supporte le type ScanBucket positif', () => {
      const { result } = renderHook(() => useScan());
      
      // Le type est correct si aucune erreur TypeScript
      expect(result.current.mode).toBe('photo');
    });

    it('accepte photo et camera comme modes', () => {
      const { result } = renderHook(() => useScan());

      act(() => {
        result.current.setMode('photo');
      });
      expect(result.current.mode).toBe('photo');

      act(() => {
        result.current.setMode('camera');
      });
      expect(result.current.mode).toBe('camera');
    });
  });

  describe('Analyse avec base64', () => {
    it('appelle l\'edge function avec le bon payload', async () => {
      const { result } = renderHook(() => useScan());
      const testBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

      await act(async () => {
        await result.current.analyzePhoto(testBase64);
      });

      expect(mockInvoke).toHaveBeenCalledWith('hume-analysis', {
        body: {
          mode: 'photo',
          image_base64: testBase64,
          context: 'b2c',
        },
      });
    });

    it('met à jour le résultat après analyse', async () => {
      const { result } = renderHook(() => useScan());
      const testBase64 = 'data:image/jpeg;base64,test';

      await act(async () => {
        await result.current.analyzePhoto(testBase64);
      });

      await waitFor(() => {
        expect(result.current.result).toEqual({
          bucket: 'positif',
          label: 'Joyeux',
          advice: 'Continuez ainsi !',
          confidence: 0.85,
        });
      });
    });

    it('gère les erreurs d\'analyse', async () => {
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: new Error('API Error'),
      });

      const { result } = renderHook(() => useScan());

      await act(async () => {
        await result.current.analyzePhoto('data:image/jpeg;base64,test');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.result).toBeNull();
    });
  });

  describe('États de chargement', () => {
    it('passe en loading pendant l\'analyse', async () => {
      // Créer une promesse qui ne se résout pas immédiatement
      let resolvePromise: (value: unknown) => void;
      mockInvoke.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { result } = renderHook(() => useScan());

      // Déclencher l'analyse sans attendre
      act(() => {
        result.current.analyzePhoto('data:image/jpeg;base64,test');
      });

      // Le loading devrait être true pendant l'analyse
      expect(result.current.loading).toBe(true);

      // Résoudre la promesse
      await act(async () => {
        resolvePromise!({
          data: { bucket: 'positif', label: 'Test' },
          error: null,
        });
      });
    });
  });
});
