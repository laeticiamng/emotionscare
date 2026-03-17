/**
 * Dev-only overlay for real-time visual tuning of post-processing parameters.
 * Renders sliders for bloom, vignette, exposure, and fog.
 *
 * Usage: add <PostProcessingDebugOverlay scene="hero" /> next to your scene
 * in development to visually calibrate values, then copy the logged config
 * back into visualDirection.ts.
 *
 * Does NOT render in production.
 */

import React, { useState, useCallback } from 'react';
import { POST_PROCESSING, FOG, TONE_MAPPING } from './visualDirection';

type SceneName = 'hero' | 'breathing' | 'galaxy' | 'nebula';

interface PostProcessingDebugOverlayProps {
  scene: SceneName;
  /** Callback fired on value change — wire to ImmersivePostProcessing props for live tuning */
  onUpdate?: (values: {
    bloomIntensity: number;
    bloomThreshold: number;
    bloomRadius: number;
    vignetteOffset: number;
    vignetteDarkness: number;
    chromaticOffset: number;
    fogNear: number;
    fogFar: number;
    exposure: number;
  }) => void;
}

export const PostProcessingDebugOverlay: React.FC<PostProcessingDebugOverlayProps> = ({ scene, onUpdate }) => {
  if (process.env.NODE_ENV === 'production') return null;

  const preset = POST_PROCESSING[scene] || POST_PROCESSING.hero;
  const fog = FOG[scene] || FOG.hero;

  const [values, setValues] = useState({
    bloomIntensity: preset.bloomIntensity,
    bloomThreshold: preset.bloomThreshold,
    bloomRadius: preset.bloomRadius,
    vignetteOffset: preset.vignetteOffset,
    vignetteDarkness: preset.vignetteDarkness,
    chromaticOffset: preset.chromaticOffset,
    fogNear: fog.near,
    fogFar: fog.far,
    exposure: TONE_MAPPING.exposure,
  });

  const update = useCallback((key: string, value: number) => {
    setValues(prev => {
      const next = { ...prev, [key]: value };
      onUpdate?.(next);
      return next;
    });
  }, [onUpdate]);

  const logConfig = useCallback(() => {
    console.log(`[PostProcessingDebug] Scene: ${scene}`, JSON.stringify(values, null, 2));
  }, [scene, values]);

  const sliders: { key: string; label: string; min: number; max: number; step: number }[] = [
    { key: 'bloomIntensity', label: 'Bloom Int.', min: 0, max: 3, step: 0.05 },
    { key: 'bloomThreshold', label: 'Bloom Thresh.', min: 0, max: 1, step: 0.02 },
    { key: 'bloomRadius', label: 'Bloom Radius', min: 0, max: 1.5, step: 0.05 },
    { key: 'vignetteOffset', label: 'Vign. Offset', min: 0, max: 1, step: 0.05 },
    { key: 'vignetteDarkness', label: 'Vign. Dark.', min: 0, max: 1, step: 0.05 },
    { key: 'chromaticOffset', label: 'Chroma Off.', min: 0, max: 0.003, step: 0.0001 },
    { key: 'fogNear', label: 'Fog Near', min: 0, max: 30, step: 0.5 },
    { key: 'fogFar', label: 'Fog Far', min: 5, max: 60, step: 1 },
    { key: 'exposure', label: 'Exposure', min: 0.5, max: 3, step: 0.05 },
  ];

  return (
    <div
      className="fixed top-2 left-2 z-[9999] bg-black/85 text-white/90 text-xs font-mono px-3 py-2 rounded-lg space-y-1 max-w-[260px] select-none"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="font-bold text-[10px] uppercase tracking-wider text-white/60 mb-1">
        PP Debug — {scene}
      </div>
      {sliders.map(({ key, label, min, max, step }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-[72px] text-right text-white/60 shrink-0">{label}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[key as keyof typeof values]}
            onChange={(e) => update(key, parseFloat(e.target.value))}
            className="flex-1 h-1 accent-violet-400"
          />
          <span className="w-[42px] text-right tabular-nums">
            {values[key as keyof typeof values].toFixed(key === 'chromaticOffset' ? 4 : 2)}
          </span>
        </div>
      ))}
      <button
        onClick={logConfig}
        className="mt-1 w-full text-[10px] bg-violet-600/60 hover:bg-violet-600/80 rounded px-2 py-0.5 transition-colors"
      >
        Log config to console
      </button>
    </div>
  );
};
