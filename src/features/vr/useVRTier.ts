// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';

import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { logger } from '@/lib/logger';

import type { VRTier } from './types';

type FallbackReason = 'no_xr' | 'prm' | 'low_capability' | null;

type TierDetails = {
  xrSupported: boolean;
  webgl2: boolean;
  missingExtensions: string[];
  avgFrameMs: number;
};

const initialDetails: TierDetails = {
  xrSupported: false,
  webgl2: false,
  missingExtensions: [],
  avgFrameMs: 0,
};

interface TierState {
  checking: boolean;
  supported: boolean;
  vrTier: VRTier;
  prm: boolean;
  fallbackReason: FallbackReason;
  details: TierDetails;
}

const initialState: TierState = {
  checking: true,
  supported: false,
  vrTier: 'low',
  prm: false,
  fallbackReason: null,
  details: initialDetails,
};

const REQUIRED_EXTENSIONS = ['EXT_color_buffer_float', 'EXT_texture_filter_anisotropic', 'EXT_disjoint_timer_query_webgl2'] as const;

const detectXRSupport = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const xr = (navigator as Navigator & { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }).xr;
  if (!xr || typeof xr.isSessionSupported !== 'function') {
    return false;
  }

  try {
    return await xr.isSessionSupported('immersive-vr');
  } catch (error) {
    logger.warn('[useVRTier] xr.isSessionSupported failed', error as Error, 'VR');
    return false;
  }
};

const detectWebGLSupport = () => {
  if (typeof document === 'undefined') {
    return { webgl2: false, missingExtensions: Array.from(REQUIRED_EXTENSIONS) };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      return { webgl2: false, missingExtensions: Array.from(REQUIRED_EXTENSIONS) };
    }

    const missingExtensions = REQUIRED_EXTENSIONS.filter((ext) => !gl.getExtension(ext));
    return { webgl2: true, missingExtensions };
  } catch (error) {
    logger.warn('[useVRTier] webgl detection failed', error as Error, 'VR');
    return { webgl2: false, missingExtensions: Array.from(REQUIRED_EXTENSIONS) };
  }
};

const measureFramePacing = (): Promise<number> =>
  new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') {
      resolve(16.6);
      return;
    }

    let done = false;
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let previous = start;
    const samples: number[] = [];

    const finish = () => {
      if (done) return;
      done = true;
      const avg = samples.length > 0 ? samples.reduce((acc, value) => acc + value, 0) / samples.length : 16.6;
      resolve(Math.max(0, avg));
    };

    const step = (timestamp: number) => {
      if (done) {
        return;
      }
      samples.push(Math.max(0, timestamp - previous));
      previous = timestamp;
      if (timestamp - start >= 2000) {
        finish();
        return;
      }
      window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
    window.setTimeout(finish, 2200);
  });

const resolveTier = (input: { webgl2: boolean; missingExtensions: string[]; avgFrameMs: number }): VRTier => {
  if (!input.webgl2) {
    return 'low';
  }

  const hasCriticalMissing = input.missingExtensions.length > 1;
  if (hasCriticalMissing) {
    return 'low';
  }

  if (input.avgFrameMs >= 26) {
    return 'low';
  }

  if (input.avgFrameMs >= 20 || input.missingExtensions.length === 1) {
    return 'mid';
  }

  return 'high';
};

export const useVRTier = () => {
  const { prefersReducedMotion } = useMotionPrefs();
  const [state, setState] = useState<TierState>({ ...initialState, prm: prefersReducedMotion });

  useEffect(() => {
    let cancelled = false;

    const runDetection = async () => {
      setState((prev) => ({ ...prev, checking: true, prm: prefersReducedMotion }));

      const [xrSupported, webglInfo, avgFrameMs] = await Promise.all([
        detectXRSupport(),
        Promise.resolve().then(() => detectWebGLSupport()),
        measureFramePacing(),
      ]);

      if (cancelled) {
        return;
      }

      const vrTier = resolveTier({ webgl2: webglInfo.webgl2, missingExtensions: webglInfo.missingExtensions, avgFrameMs });
      const fallbackReason: FallbackReason = !xrSupported
        ? 'no_xr'
        : prefersReducedMotion
          ? 'prm'
          : vrTier === 'low' || webglInfo.missingExtensions.length > 0
            ? 'low_capability'
            : null;

      if (!xrSupported) {
        Sentry.addBreadcrumb({
          category: 'vr',
          level: 'warning',
          message: 'vr:capability:xr_unsupported',
        });
      }

      setState({
        checking: false,
        supported: xrSupported && !prefersReducedMotion,
        vrTier,
        prm: prefersReducedMotion,
        fallbackReason,
        details: {
          xrSupported,
          webgl2: webglInfo.webgl2,
          missingExtensions: webglInfo.missingExtensions,
          avgFrameMs: Number.isFinite(avgFrameMs) ? Number(avgFrameMs.toFixed(2)) : 0,
        },
      });
    };

    runDetection().catch((error) => {
      logger.error('[useVRTier] detection failed', error as Error, 'VR');
      if (cancelled) {
        return;
      }
      setState({
        checking: false,
        supported: false,
        vrTier: 'low',
        prm: prefersReducedMotion,
        fallbackReason: 'low_capability',
        details: initialDetails,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion]);

  return useMemo(
    () => ({
      ...state,
    }),
    [state],
  );
};

export type UseVRTierResult = ReturnType<typeof useVRTier>;

export default useVRTier;
