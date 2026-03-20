export type MoodQuadrant = 'HVAL_HAROUS' | 'HVAL_LAROUS' | 'LVAL_HAROUS' | 'LVAL_LAROUS';

export interface MoodEventDetail {
  source: 'scan_camera' | 'scan_sliders' | 'manual';
  valence: number;
  arousal: number;
  valenceLevel: 0 | 1 | 2 | 3 | 4;
  arousalLevel: 0 | 1 | 2 | 3 | 4;
  quadrant: MoodQuadrant;
  summary: string;
  ts: string;
}

export const MOOD_UPDATED = 'mood.updated' as const;

export function publishMoodUpdated(detail: MoodEventDetail) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent<MoodEventDetail>(MOOD_UPDATED, { detail }));
}
