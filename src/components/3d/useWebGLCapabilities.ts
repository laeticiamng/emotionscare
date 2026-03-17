/**
 * Hook: WebGL capability detection & device adaptation
 * Provides reactive state for WebGL status, device tier, DPR, reduced-motion,
 * and context loss recovery. Used by all 3D scenes to adapt or fallback gracefully.
 */

import { useState, useEffect, useMemo } from 'react';
import { getDeviceTier, prefersReducedMotion, getDPR, shouldEnablePostProcessing } from './visualDirection';
import { detectWebGL, type WebGLStatus } from './Scene3DErrorBoundary';

export interface WebGLCapabilities {
  /** WebGL availability: 'available' | 'webgl1-only' | 'unavailable' | 'unknown' */
  webglStatus: WebGLStatus;
  /** Device performance tier: 'high' | 'medium' | 'low' */
  deviceTier: 'high' | 'medium' | 'low';
  /** User prefers reduced motion */
  reducedMotion: boolean;
  /** Recommended DPR range [min, max] */
  dpr: [number, number];
  /** Whether postprocessing should be enabled */
  postProcessingEnabled: boolean;
  /** Whether the WebGL context was lost and not yet restored */
  contextLost: boolean;
  /** Whether WebGL is actually usable (available + not lost) */
  canRender3D: boolean;
  /** GPU renderer string (best-effort, may be 'unknown') */
  gpuRenderer: string;
}

/** Detect GPU renderer string (best-effort) */
const detectGPURenderer = (): string => {
  if (typeof document === 'undefined') return 'unknown';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return 'unknown';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
    // Cleanup
    const loseCtx = gl.getExtension('WEBGL_lose_context');
    loseCtx?.loseContext();
    return renderer || 'unknown';
  } catch {
    return 'unknown';
  }
};

export const useWebGLCapabilities = (): WebGLCapabilities => {
  const [webglStatus, setWebglStatus] = useState<WebGLStatus>('unknown');
  const [contextLost, setContextLost] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [gpuRenderer, setGpuRenderer] = useState('unknown');

  // Initial detection
  useEffect(() => {
    setWebglStatus(detectWebGL());
    setReducedMotion(prefersReducedMotion());
    setGpuRenderer(detectGPURenderer());
  }, []);

  // Listen for reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } catch {
      // matchMedia not supported
    }
  }, []);

  const deviceTier = useMemo(() => getDeviceTier(), []);
  const dpr = useMemo(() => getDPR(), []);
  const postProcessingEnabled = useMemo(() => shouldEnablePostProcessing(), []);

  const canRender3D = webglStatus === 'available' || webglStatus === 'webgl1-only';

  return {
    webglStatus,
    deviceTier,
    reducedMotion,
    dpr,
    postProcessingEnabled,
    contextLost,
    canRender3D: canRender3D && !contextLost,
    gpuRenderer,
  };
};
