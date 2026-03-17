/**
 * Post-processing HDR Bloom + Vignette réutilisable
 */

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

interface ImmersivePostProcessingProps {
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomRadius?: number;
  vignetteOffset?: number;
  vignetteDarkness?: number;
}

export const ImmersivePostProcessing = ({
  bloomIntensity = 1.5,
  bloomThreshold = 0.2,
  bloomRadius = 0.8,
  vignetteOffset = 0.3,
  vignetteDarkness = 0.7,
}: ImmersivePostProcessingProps) => (
  <EffectComposer>
    <Bloom
      intensity={bloomIntensity}
      luminanceThreshold={bloomThreshold}
      luminanceSmoothing={0.9}
      radius={bloomRadius}
    />
    <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
  </EffectComposer>
);
