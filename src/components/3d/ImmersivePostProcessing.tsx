/**
 * Post-processing cinématique : HDR Bloom + Vignette + ChromaticAberration
 * Gracefully degrades if postprocessing fails — scene remains visible without effects.
 * Defaults aligned with unified visual direction system.
 */

import React, { Component, type ReactNode } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { POST_PROCESSING } from './visualDirection';

interface ImmersivePostProcessingProps {
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

/* ── Internal effect renderers ──────────────────────────────── */

const PostProcessingWithCA = ({
  bloomIntensity, bloomThreshold, bloomRadius, vignetteOffset, vignetteDarkness, chromaticOffset,
}: Omit<ImmersivePostProcessingProps, 'chromaticAberration' | 'enabled'>) => (
  <EffectComposer multisampling={0}>
    <Bloom
      intensity={bloomIntensity}
      luminanceThreshold={bloomThreshold}
      luminanceSmoothing={0.85}
      radius={bloomRadius}
    />
    <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={new THREE.Vector2(chromaticOffset, chromaticOffset)}
      radialModulation
      modulationOffset={0.5}
    />
  </EffectComposer>
);

const PostProcessingWithoutCA = ({
  bloomIntensity, bloomThreshold, bloomRadius, vignetteOffset, vignetteDarkness,
}: Omit<ImmersivePostProcessingProps, 'chromaticAberration' | 'chromaticOffset' | 'enabled'>) => (
  <EffectComposer multisampling={0}>
    <Bloom
      intensity={bloomIntensity}
      luminanceThreshold={bloomThreshold}
      luminanceSmoothing={0.85}
      radius={bloomRadius}
    />
    <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
  </EffectComposer>
);

/* ── Exported component ─────────────────────────────────────── */

const defaults = POST_PROCESSING.hero;

export const ImmersivePostProcessing = ({
  bloomIntensity = defaults.bloomIntensity,
  bloomThreshold = defaults.bloomThreshold,
  bloomRadius = defaults.bloomRadius,
  vignetteOffset = defaults.vignetteOffset,
  vignetteDarkness = defaults.vignetteDarkness,
  chromaticAberration = defaults.chromaticAberration,
  chromaticOffset = defaults.chromaticOffset,
  enabled = true,
}: ImmersivePostProcessingProps) => {
  if (!enabled) return null;

  return (
    <PostProcessingErrorBoundary>
      {chromaticAberration ? (
        <PostProcessingWithCA
          bloomIntensity={bloomIntensity} bloomThreshold={bloomThreshold} bloomRadius={bloomRadius}
          vignetteOffset={vignetteOffset} vignetteDarkness={vignetteDarkness} chromaticOffset={chromaticOffset}
        />
      ) : (
        <PostProcessingWithoutCA
          bloomIntensity={bloomIntensity} bloomThreshold={bloomThreshold} bloomRadius={bloomRadius}
          vignetteOffset={vignetteOffset} vignetteDarkness={vignetteDarkness}
        />
      )}
    </PostProcessingErrorBoundary>
  );
};
