import { SlidersSchema, type Sliders } from '@/modules/mood-mixer/types';

export const PREVIEW_FALLBACK_URL = '/samples/preview-30s.mp3';
const PREVIEW_TIMEOUT_MS = 4000;

export class PreviewUnavailableError extends Error {
  fallbackUrl?: string;

  constructor(message: string, fallbackUrl?: string) {
    super(message);
    this.name = 'PreviewUnavailableError';
    this.fallbackUrl = fallbackUrl;
  }
}

export async function previewFromMood(sliders: Sliders): Promise<string> {
  const payload = SlidersSchema.parse(sliders);
  const params = new URLSearchParams({
    energy: String(payload.energy),
    calm: String(payload.calm),
    focus: String(payload.focus),
    light: String(payload.light),
  });

  const endpoint =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADAPTIVE_MUSIC_PREVIEW_URL
      ? import.meta.env.VITE_ADAPTIVE_MUSIC_PREVIEW_URL
      : '/api/modules/adaptive-music/preview';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PREVIEW_TIMEOUT_MS);

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new PreviewUnavailableError(`Preview failed with status ${response.status}`, PREVIEW_FALLBACK_URL);
    }

    const data = await response.json().catch(() => null);

    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data.previewUrl === 'string') {
      return data.previewUrl;
    }

    if (data && typeof data.url === 'string') {
      return data.url;
    }

    return PREVIEW_FALLBACK_URL;
  } catch (error) {
    if (error instanceof PreviewUnavailableError) {
      throw error;
    }

    if ((error as Error)?.name === 'AbortError') {
      throw new PreviewUnavailableError('Preview timed out', PREVIEW_FALLBACK_URL);
    }

    throw new PreviewUnavailableError('Preview request failed', PREVIEW_FALLBACK_URL);
  } finally {
    clearTimeout(timeout);
  }
}
