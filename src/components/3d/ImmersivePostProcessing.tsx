/**
 * Post-processing cinématique : HDR Bloom + Vignette + ChromaticAberration
 * Defaults aligned with unified visual direction system
 */

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
}

const PostProcessingWithCA = ({
  bloomIntensity, bloomThreshold, bloomRadius, vignetteOffset, vignetteDarkness, chromaticOffset,
}: Omit<ImmersivePostProcessingProps, 'chromaticAberration'>) => (
  <EffectComposer>
    <Bloom intensity={bloomIntensity} luminanceThreshold={bloomThreshold} luminanceSmoothing={0.9} radius={bloomRadius} />
    <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={new THREE.Vector2(chromaticOffset, chromaticOffset)}
      radialModulation={true}
      modulationOffset={0.5}
    />
  </EffectComposer>
);

const PostProcessingWithoutCA = ({
  bloomIntensity, bloomThreshold, bloomRadius, vignetteOffset, vignetteDarkness,
}: Omit<ImmersivePostProcessingProps, 'chromaticAberration' | 'chromaticOffset'>) => (
  <EffectComposer>
    <Bloom intensity={bloomIntensity} luminanceThreshold={bloomThreshold} luminanceSmoothing={0.9} radius={bloomRadius} />
    <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
  </EffectComposer>
);

const defaults = POST_PROCESSING.hero;

export const ImmersivePostProcessing = ({
  bloomIntensity = defaults.bloomIntensity,
  bloomThreshold = defaults.bloomThreshold,
  bloomRadius = defaults.bloomRadius,
  vignetteOffset = defaults.vignetteOffset,
  vignetteDarkness = defaults.vignetteDarkness,
  chromaticAberration = defaults.chromaticAberration,
  chromaticOffset = defaults.chromaticOffset,
}: ImmersivePostProcessingProps) =>
  chromaticAberration ? (
    <PostProcessingWithCA
      bloomIntensity={bloomIntensity} bloomThreshold={bloomThreshold} bloomRadius={bloomRadius}
      vignetteOffset={vignetteOffset} vignetteDarkness={vignetteDarkness} chromaticOffset={chromaticOffset}
    />
  ) : (
    <PostProcessingWithoutCA
      bloomIntensity={bloomIntensity} bloomThreshold={bloomThreshold} bloomRadius={bloomRadius}
      vignetteOffset={vignetteOffset} vignetteDarkness={vignetteDarkness}
    />
  );
