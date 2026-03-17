/**
 * Error Boundary + WebGL detection for 3D scenes
 * Provides graceful fallback when WebGL fails, context is lost, or postprocessing crashes.
 * Dev diagnostic badge for debugging.
 */

import React, { Component, type ReactNode, useEffect, useState } from 'react';
import { PALETTE, getDeviceTier } from './visualDirection';

/* ── WebGL Detection ──────────────────────────────────────── */

export type WebGLStatus = 'available' | 'webgl1-only' | 'unavailable' | 'unknown';

export const detectWebGL = (): WebGLStatus => {
  if (typeof document === 'undefined') return 'unknown';
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      gl2.getExtension('WEBGL_lose_context')?.loseContext();
      return 'available';
    }
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) return 'webgl1-only';
    return 'unavailable';
  } catch {
    return 'unavailable';
  }
};

/* ── Premium Fallback ─────────────────────────────────────── */

interface PremiumFallbackProps {
  scene?: 'hero' | 'breathing' | 'galaxy' | 'nebula';
  height?: string;
  className?: string;
  reason?: string;
}

const SCENE_GRADIENTS: Record<string, { colors: string[]; label: string }> = {
  hero: {
    colors: [PALETTE.primary, PALETTE.secondary, PALETTE.warm],
    label: 'EmotionsCare',
  },
  breathing: {
    colors: [PALETTE.breathing.inhale, PALETTE.breathing.hold, PALETTE.breathing.exhale],
    label: 'Respiration',
  },
  galaxy: {
    colors: [PALETTE.primary, PALETTE.accent, PALETTE.gold],
    label: 'Exploration',
  },
  nebula: {
    colors: ['#34d399', '#06b6d4', PALETTE.accent],
    label: 'Introspection',
  },
};

export const PremiumFallback: React.FC<PremiumFallbackProps> = ({
  scene = 'hero',
  height = 'h-[400px]',
  className = '',
  reason,
}) => {
  const config = SCENE_GRADIENTS[scene] || SCENE_GRADIENTS.hero;
  const [c1, c2, c3] = config.colors;

  return (
    <div
      className={`w-full ${height} rounded-2xl overflow-hidden relative ${className}`}
      style={{
        background: `
          radial-gradient(ellipse at 30% 35%, ${c1}20 0%, transparent 55%),
          radial-gradient(ellipse at 70% 55%, ${c2}18 0%, transparent 50%),
          radial-gradient(ellipse at 50% 75%, ${c3}12 0%, transparent 45%),
          ${PALETTE.darkVoid}
        `,
      }}
      role="img"
      aria-label={`${config.label} - visualisation`}
    >
      {/* Animated gradient pulse for life */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${c1}10 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 25%, hsl(var(--background)) 95%)',
        }}
      />
      {/* Dev diagnostic */}
      {reason && process.env.NODE_ENV !== 'production' && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white/70 text-xs rounded font-mono z-20">
          3D fallback: {reason}
        </div>
      )}
    </div>
  );
};

/* ── Error Boundary ───────────────────────────────────────── */

interface Scene3DErrorBoundaryProps {
  children: ReactNode;
  scene?: 'hero' | 'breathing' | 'galaxy' | 'nebula';
  height?: string;
  className?: string;
}

interface Scene3DErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class Scene3DErrorBoundary extends Component<Scene3DErrorBoundaryProps, Scene3DErrorBoundaryState> {
  state: Scene3DErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error.message || 'Unknown 3D rendering error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Scene3D] Error caught by boundary:', error.message, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <PremiumFallback
          scene={this.props.scene}
          height={this.props.height}
          className={this.props.className}
          reason={this.state.errorMessage}
        />
      );
    }
    return this.props.children;
  }
}

/* ── WebGL Gate — checks WebGL before rendering children ──── */

interface WebGLGateProps {
  children: ReactNode;
  scene?: 'hero' | 'breathing' | 'galaxy' | 'nebula';
  height?: string;
  className?: string;
}

export const WebGLGate: React.FC<WebGLGateProps> = ({ children, scene, height, className }) => {
  const [webglStatus, setWebglStatus] = useState<WebGLStatus>('unknown');

  useEffect(() => {
    setWebglStatus(detectWebGL());
  }, []);

  if (webglStatus === 'unknown') {
    // Still detecting — show fallback briefly to avoid flash
    return <PremiumFallback scene={scene} height={height} className={className} reason="Detecting WebGL..." />;
  }

  if (webglStatus === 'unavailable') {
    return <PremiumFallback scene={scene} height={height} className={className} reason="WebGL unavailable" />;
  }

  return (
    <Scene3DErrorBoundary scene={scene} height={height} className={className}>
      {children}
    </Scene3DErrorBoundary>
  );
};

/* ── Diagnostic Badge (dev/preview only) ──────────────────── */

export const WebGLDiagnosticBadge: React.FC = () => {
  const [info, setInfo] = useState<{
    webgl: WebGLStatus;
    tier: string;
    dpr: number;
    gpu: string;
  } | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;

    const webgl = detectWebGL();
    const dpr = window.devicePixelRatio || 1;

    let gpu = 'unknown';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || 'unknown';
        }
      }
    } catch { /* ignore */ }

    const tier = getDeviceTier();

    setInfo({ webgl, tier, dpr, gpu });
  }, []);

  if (!info || process.env.NODE_ENV === 'production') return null;

  const statusColor = info.webgl === 'available' ? 'bg-green-500' : info.webgl === 'webgl1-only' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="fixed bottom-2 right-2 z-[9999] text-xs font-mono bg-black/80 text-white/80 px-3 py-2 rounded-lg space-y-0.5 max-w-[240px]">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span>WebGL: {info.webgl}</span>
      </div>
      <div>Tier: {info.tier} | DPR: {info.dpr.toFixed(1)}</div>
      <div className="truncate" title={info.gpu}>GPU: {info.gpu}</div>
    </div>
  );
};
