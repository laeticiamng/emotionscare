// @ts-nocheck
import type { Sliders } from './types';

const descriptors: Record<keyof Sliders, Array<{ max: number; label: string }>> = {
  energy: [
    { max: 16, label: 'repos suspendu' },
    { max: 36, label: 'élan feutré' },
    { max: 66, label: 'pulsation douce' },
    { max: 86, label: 'pulsation vive' },
    { max: 101, label: 'flamme solaire' },
  ],
  calm: [
    { max: 16, label: 'étincelle audacieuse' },
    { max: 36, label: 'onde légère' },
    { max: 66, label: 'nappe apaisée' },
    { max: 86, label: 'paisibilité profonde' },
    { max: 101, label: 'silence cotonneux' },
  ],
  focus: [
    { max: 16, label: 'regard flottant' },
    { max: 36, label: 'idées nuageuses' },
    { max: 66, label: 'attention posée' },
    { max: 86, label: 'clarté précise' },
    { max: 101, label: 'faisceau cristallin' },
  ],
  light: [
    { max: 16, label: 'ombre douce' },
    { max: 36, label: 'lueur tamisée' },
    { max: 66, label: 'halo poudré' },
    { max: 86, label: 'éclat doré' },
    { max: 101, label: 'rayon étincelant' },
  ],
};

const dimensionLabels: Record<keyof Sliders, string> = {
  energy: 'Énergie',
  calm: 'Calme',
  focus: 'Focus',
  light: 'Lumière',
};

const sanitize = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function describeLevel(dimension: keyof Sliders, value: number): string {
  const safeValue = sanitize(value);
  const candidates = descriptors[dimension];
  const descriptor = candidates.find((entry) => safeValue < entry.max) ?? candidates[candidates.length - 1];
  return descriptor.label;
}

export function buildMoodSummary(sliders: Sliders): string {
  return (Object.keys(sliders) as Array<keyof Sliders>)
    .map((dimension) => `${dimensionLabels[dimension]} ${describeLevel(dimension, sliders[dimension])}`)
    .join(' · ');
}

function hslFromValue(baseHue: number, span: number, value: number, lightnessBase: number, lightnessSpan: number, alpha = 0.85) {
  const ratio = sanitize(value) / 100;
  const hue = baseHue + span * ratio;
  const lightness = lightnessBase + lightnessSpan * ratio;
  return `hsla(${hue.toFixed(1)}, 85%, ${lightness.toFixed(1)}%, ${alpha})`;
}

export function computeGradient(sliders: Sliders): string {
  const energyColor = hslFromValue(18, 24, sliders.energy, 36, 20, 0.85);
  const calmColor = `hsla(${(210 - (sliders.calm / 100) * 40).toFixed(1)}, 70%, ${(58 + (sliders.calm / 100) * 12).toFixed(1)}%, 0.8)`;
  const focusColor = `hsla(${(250 - (sliders.focus / 100) * 30).toFixed(1)}, 65%, ${(50 + (sliders.focus / 100) * 15).toFixed(1)}%, 0.82)`;
  const lightColor = hslFromValue(48, 26, sliders.light, 62, 18, 0.9);

  return `linear-gradient(135deg, ${energyColor} 0%, ${calmColor} 32%, ${focusColor} 68%, ${lightColor} 100%)`;
}

const PRESET_EMOJIS = ['🌅', '🌙', '🌿', '🔥', '💧', '🌤️', '🌸', '🌀', '✨', '🌈', '🌾', '🌋'];

export function presetEmoji(name: string): string {
  if (!name) {
    return '✨';
  }
  const normalized = name.normalize('NFKD');
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash + normalized.charCodeAt(i) * (i + 1)) % PRESET_EMOJIS.length;
  }
  return PRESET_EMOJIS[hash];
}

export function sortPresetsByFreshness<T extends { createdAt?: string }>(presets: T[]): T[] {
  return [...presets].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });
}
