// @ts-nocheck
// Utilitaires audio : normalisation simple, crossfade, clamp helpers
export function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

export async function crossfadeVolumes(
  setA: (vol: number) => void, setB: (vol: number) => void,
  fromA = 1, toA = 0, fromB = 0, toB = 1, ms = 800
) {
  const steps = 16;
  const dt = ms / steps;
  for (let i=0;i<=steps;i++) {
    const t = i/steps;
    setA(fromA + (toA - fromA) * t);
    setB(fromB + (toB - fromB) * t);
    await new Promise(r => setTimeout(r, dt));
  }
}
