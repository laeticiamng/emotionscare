// @ts-nocheck
/**
 * Post-processing cinématique : HDR Bloom + Vignette + ChromaticAberration
 * Gracefully degrades if postprocessing fails — scene remains visible without effects.
 *
 * Supports:
 * - Scene-specific presets via `scene` prop (auto-selects from visualDirection)
 * - Device-adaptive: medium-tier reduces bloom/CA, low-tier fully disabled
 * - Manual override via individual props
 * - Error boundary for safe degradation
 */

import React, { Component, useRef, type ReactNode } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { POST_PROCESSING, getDeviceTier, type PostProcessingPreset } from './visualDirection';

type SceneName = 'hero' | 'breathing' | 'galaxy' | 'nebula';

interface ImmersivePostProcessingProps {
  /** Scene name — auto-selects preset from visualDirection */
  scene?: SceneName;
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomRadius?: number;
  vignetteOffset?: number;
  vignetteDarkness?: number;
  chromaticAberration?: boolean;
  chromaticOffset?: number;
  /** Set false to disable all postprocessing (e.g. for low-end devices) */
  enabled?: boolean;
}

/* ── Error boundary to catch postprocessing failures silently ── */

interface PPErrorState {
  hasFailed: boolean;
}

class PostProcessingErrorBoundary extends Component<{ children: ReactNode }, PPErrorState> {
  state: PPErrorState = { hasFailed: false };

  static getDerivedStateFromError() {
    return { hasFailed: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[PostProcessing] Effect failed, rendering without postprocessing:', error.message);
    }
  }

  render() {
    if (this.state.hasFailed) return null; // Scene renders without effects
    return this.props.children;
  }
}

/* ── Device-adaptive preset reduction ─────────────────────────── */

const getAdaptivePreset = (base: PostProcessingPreset, tier: 'high' | 'medium' | 'low'): PostProcessingPreset => {
  if (tier === 'high') return base;
  if (tier === 'medium') {
    // Moderate reduction: keep bloom perceptible, disable CA only
    return {
      ...base,
      bloomIntensity: base.bloomIntensity * 0.85,
      bloomRadius: base.bloomRadius * 0.9,
      chromaticAberration: false,
      chromaticOffset: 0,
    };
  }
  // low — should not reach here as enabled=false, but safety net
  return {
    ...base,
    bloomIntensity: base.bloomIntensity * 0.5,
    bloomRadius: base.bloomRadius * 0.6,
    chromaticAberration: false,
    chromaticOffset: 0,
    vignetteDarkness: base.vignetteDarkness * 0.7,
  };
};

/* ── Stable chromatic offset vector — mutates in place, no realloc ── */

const ChromaticOffsetVector = ({ offset }: { offset: number }) => {
  const vecRef = useRef(new THREE.Vector2(offset, offset));
  // Mutate in place to avoid creating a new Vector2 per render
  // while still reflecting prop changes
  vecRef.current.set(offset, offset);

  return (
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={vecRef.current}
      radialModulation
      modulationOffset={0.5}
    />
  );
};

/* ── Exported component ─────────────────────────────────────── */

const defaultPreset = POST_PROCESSING.hero;

export const ImmersivePostProcessing = (props: ImmersivePostProcessingProps) => {
  const {
    scene,
    enabled = true,
  } = props;

  if (!enabled) return null;

  const tier = getDeviceTier();
  // Low-tier: skip postprocessing entirely for perf
  if (tier === 'low') return null;

  // Resolve preset: scene prop → manual props → hero default
  const basePreset = scene ? (POST_PROCESSING[scene] || defaultPreset) : defaultPreset;
  const adapted = getAdaptivePreset(basePreset, tier);

  // Allow manual overrides
  const bloomIntensity = props.bloomIntensity ?? adapted.bloomIntensity;
  const bloomThreshold = props.bloomThreshold ?? adapted.bloomThreshold;
  const bloomRadius = props.bloomRadius ?? adapted.bloomRadius;
  const vignetteOffset = props.vignetteOffset ?? adapted.vignetteOffset;
  const vignetteDarkness = props.vignetteDarkness ?? adapted.vignetteDarkness;
  const chromaticAberration = props.chromaticAberration ?? adapted.chromaticAberration;
  const chromaticOffset = props.chromaticOffset ?? adapted.chromaticOffset;

  if (chromaticAberration && chromaticOffset > 0) {
    return (
      <PostProcessingErrorBoundary>
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={bloomThreshold}
            luminanceSmoothing={0.85}
            radius={bloomRadius}
          />
          <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
          <ChromaticOffsetVector offset={chromaticOffset} />
        </EffectComposer>
      </PostProcessingErrorBoundary>
    );
  }

  return (
    <PostProcessingErrorBoundary>
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.85}
          radius={bloomRadius}
        />
        <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
      </EffectComposer>
    </PostProcessingErrorBoundary>
  );
};
