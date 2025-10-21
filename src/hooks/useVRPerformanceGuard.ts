// @ts-nocheck
import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/react';

import { useToast } from '@/hooks/use-toast';
import { useVRSafetyStore } from '@/store/vrSafety.store';
import { logger } from '@/lib/logger';

const FPS_SAMPLE_WINDOW_MS = 3_000;
const LOW_FPS_THRESHOLD = 28;

const hasWebGLSupport = (): boolean => {
  if (typeof document === 'undefined') {
    return true;
  }

  try {
    const canvas = document.createElement('canvas');
    const contexts: Array<'webgl2' | 'webgl' | 'experimental-webgl'> = ['webgl2', 'webgl', 'experimental-webgl'];

    return contexts.some((context) => {
      const gl = canvas.getContext(context);
      if (gl && typeof gl.getParameter === 'function') {
        gl.getParameter(gl.VERSION);
        return true;
      }
      return false;
    });
  } catch (error) {
    logger.warn('WebGL detection error', error as Error, 'VR');
    return false;
  }
};

export const useVRPerformanceGuard = (module: 'vr_breath' | 'vr_galaxy') => {
  const { toast } = useToast();
  const markFallback = useVRSafetyStore((state) => state.markFallback);
  const recordPerformanceSample = useVRSafetyStore((state) => state.recordPerformanceSample);
  const fallbackEnabled = useVRSafetyStore((state) => state.fallbackEnabled);
  const fallbackReason = useVRSafetyStore((state) => state.fallbackReason);
  const hasAnnouncedRef = useRef(false);

  useEffect(() => {
    if (!hasWebGLSupport()) {
      markFallback('webgl_unavailable');
      Sentry.addBreadcrumb({
        category: 'vr',
        message: 'vr:fallback2d',
        level: 'warning',
        data: { module, reason: 'webgl' },
      });
      return;
    }

    if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
      const memory = Number((navigator as unknown as { deviceMemory?: number }).deviceMemory);
      if (Number.isFinite(memory) && memory > 0 && memory < 2) {
        markFallback('low_memory');
        Sentry.addBreadcrumb({
          category: 'vr',
          message: 'vr:fallback2d',
          level: 'warning',
          data: { module, reason: 'memory', deviceMemory: memory },
        });
      }
    }

    let rafId = 0;
    let start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let frames = 0;
    let cancelled = false;

    const measure = (timestamp: number) => {
      if (cancelled) {
        return;
      }
      frames += 1;
      const elapsed = timestamp - start;
      if (elapsed >= FPS_SAMPLE_WINDOW_MS) {
        const fps = (frames * 1000) / elapsed;
        recordPerformanceSample(fps);
        if (fps < LOW_FPS_THRESHOLD) {
          markFallback('low_fps');
          Sentry.addBreadcrumb({
            category: 'vr',
            message: 'vr:fallback2d',
            level: 'warning',
            data: { module, reason: 'fps', fps: Number(fps.toFixed(1)) },
          });
        }
        frames = 0;
        start = timestamp;
      }
      rafId = requestAnimationFrame(measure);
    };

    rafId = requestAnimationFrame(measure);

    return () => {
      cancelled = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [markFallback, module, recordPerformanceSample]);

  useEffect(() => {
    if (fallbackEnabled && fallbackReason && !hasAnnouncedRef.current) {
      toast({
        title: 'Version douce activée',
        description: "Nous passons en mode 2D sécurisé pour préserver ton confort.",
      });
      hasAnnouncedRef.current = true;
    }
  }, [fallbackEnabled, fallbackReason, toast]);
};

export default useVRPerformanceGuard;
