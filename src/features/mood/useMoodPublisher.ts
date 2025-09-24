import { useCallback } from 'react';
import * as Sentry from '@sentry/react';

import { MOOD_UPDATED, publishMoodUpdated, type MoodEventDetail } from './mood-bus';

export function toLevel(value: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 20) return 0;
  if (value <= 40) return 1;
  if (value <= 60) return 2;
  if (value <= 80) return 3;
  return 4;
}

export function quadrant(valence: number, arousal: number): MoodEventDetail['quadrant'] {
  const hv = valence >= 50;
  const ha = arousal >= 50;
  if (hv && ha) return 'HVAL_HAROUS';
  if (hv && !ha) return 'HVAL_LAROUS';
  if (!hv && ha) return 'LVAL_HAROUS';
  return 'LVAL_LAROUS';
}

export function summary(valLevel: number, aroLevel: number): string {
  if (valLevel <= 1 && aroLevel >= 3) return 'tension vive';
  if (valLevel <= 1 && aroLevel <= 1) return 'ton plus bas';
  if (valLevel >= 3 && aroLevel >= 3) return 'énergie haute';
  if (valLevel >= 3 && aroLevel <= 1) return 'calme positif';
  return 'état mixte';
}

const clamp01 = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

export function useMoodPublisher() {
  return useCallback(
    (source: MoodEventDetail['source'], valence01: number, arousal01: number) => {
      const v = Math.round(clamp01(valence01) * 100);
      const a = Math.round(clamp01(arousal01) * 100);
      const valenceLevel = toLevel(v);
      const arousalLevel = toLevel(a);
      const detail: MoodEventDetail = {
        source,
        valence: v,
        arousal: a,
        valenceLevel,
        arousalLevel,
        quadrant: quadrant(v, a),
        summary: summary(valenceLevel, arousalLevel),
        ts: new Date().toISOString(),
      };

      publishMoodUpdated(detail);
      Sentry.addBreadcrumb({
        category: 'scan',
        level: 'info',
        message: 'scan:sam:update',
        data: {
          source: detail.source,
          summary: detail.summary,
        },
      });

      return detail;
    },
    [],
  );
}
