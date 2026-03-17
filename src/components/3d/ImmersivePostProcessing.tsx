/**
 * Post-processing cinématique : HDR Bloom + Vignette + ChromaticAberration
 */

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface ImmersivePostProcessingProps {
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomRadius?: number;
  vignetteOffset?: number;
  vignetteDarkness?: number;
  chromaticAberration?: boolean;
  chromaticOffset?: number;
}

export const ImmersivePostProcessing = ({
  bloomIntensity = 1.5,
  bloomThreshold = 0.2,
  bloomRadius = 0.8,
  vignetteOffset = 0.3,
  vignetteDarkness = 0.7,
  chromaticAberration = true,
  chromaticOffset = 0.0006,
}: ImmersivePostProcessingProps) => (
  <EffectComposer>
    <Bloom
      intensity={bloomIntensity}
      luminanceThreshold={bloomThreshold}
      luminanceSmoothing={0.9}
      radius={bloomRadius}
    />
    <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
    {chromaticAberration ? (
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(chromaticOffset, chromaticOffset)}
        radialModulation={true}
        modulationOffset={0.5}
      />
    ) : null}
  </EffectComposer>
);
