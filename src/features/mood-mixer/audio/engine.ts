// @ts-nocheck
export type MixerParams = {
  warmth: 'low' | 'med' | 'high';
  brightness: 'low' | 'med' | 'high';
  tempo: 'slow' | 'mid' | 'fast';
  rhythm: 'sparse' | 'normal' | 'dense';
  dynamics: 'soft' | 'balanced' | 'punchy';
  reverb: 'dry' | 'soft' | 'lush';
};

type EngineEvent =
  | { type: 'preview'; params: MixerParams; crossfadeMs: number }
  | { type: 'applied'; params: MixerParams; crossfadeMs: number };

type EngineListener = (event: EngineEvent) => void;

const DEFAULT_PARAMS: MixerParams = {
  warmth: 'med',
  brightness: 'med',
  tempo: 'mid',
  rhythm: 'normal',
  dynamics: 'balanced',
  reverb: 'soft',
};

let appliedParams: MixerParams = { ...DEFAULT_PARAMS };
let previewParams: MixerParams = { ...DEFAULT_PARAMS };
const listeners = new Set<EngineListener>();

const notify = (event: EngineEvent) => {
  listeners.forEach((listener) => listener(event));
};

const resolvePreview = (partial: Partial<MixerParams>): MixerParams => ({
  ...appliedParams,
  ...partial,
});

export const getCurrentParams = (): MixerParams => ({ ...appliedParams });

export const getPreviewParams = (): MixerParams => ({ ...previewParams });

export const subscribe = (listener: EngineListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function reset(): void {
  appliedParams = { ...DEFAULT_PARAMS };
  previewParams = { ...DEFAULT_PARAMS };
}

export function preview(params: Partial<MixerParams>, crossfadeMs: number): void {
  previewParams = resolvePreview(params);
  notify({ type: 'preview', params: { ...previewParams }, crossfadeMs });
}

const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    if (duration <= 0) {
      resolve();
      return;
    }
    setTimeout(() => resolve(), Math.min(duration, 500));
  });

export async function apply(params: MixerParams, crossfadeMs: number): Promise<void> {
  previewParams = { ...params };
  await wait(crossfadeMs);
  appliedParams = { ...params };
  notify({ type: 'applied', params: { ...appliedParams }, crossfadeMs });
}
