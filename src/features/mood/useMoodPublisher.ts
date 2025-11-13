// @ts-nocheck
import { useCallback } from 'react';
import { captureException } from '@/lib/ai-monitoring';

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
  // Négatif + Haute énergie (valence basse, arousal haut)
  if (valLevel === 0 && aroLevel >= 4) return 'tension intense';
  if (valLevel === 0 && aroLevel === 3) return 'agitation vive';
  if (valLevel === 1 && aroLevel >= 3) return 'tension présente';
  
  // Négatif + Basse énergie (valence basse, arousal bas)
  if (valLevel === 0 && aroLevel <= 1) return 'épuisement';
  if (valLevel === 0 && aroLevel === 2) return 'ton très bas';
  if (valLevel === 1 && aroLevel <= 1) return 'ton plus bas';
  if (valLevel === 1 && aroLevel === 2) return 'énergie faible';
  
  // Positif + Haute énergie (valence haute, arousal haut)
  if (valLevel === 4 && aroLevel >= 4) return 'joie intense';
  if (valLevel === 4 && aroLevel === 3) return 'énergie joyeuse';
  if (valLevel === 3 && aroLevel >= 3) return 'énergie haute';
  
  // Positif + Basse énergie (valence haute, arousal bas)
  if (valLevel === 4 && aroLevel <= 1) return 'sérénité profonde';
  if (valLevel === 4 && aroLevel === 2) return 'calme heureux';
  if (valLevel === 3 && aroLevel <= 1) return 'calme positif';
  if (valLevel === 3 && aroLevel === 2) return 'détente agréable';
  
  // États intermédiaires avec valence moyenne
  if (valLevel === 2 && aroLevel >= 4) return 'éveil neutre';
  if (valLevel === 2 && aroLevel === 3) return 'activation modérée';
  if (valLevel === 2 && aroLevel === 2) return 'état équilibré';
  if (valLevel === 2 && aroLevel === 1) return 'repos tranquille';
  if (valLevel === 2 && aroLevel === 0) return 'calme neutre';
  
  // États mixtes avec transitions
  if (valLevel === 1 && aroLevel === 3) return 'tension modérée';
  if (valLevel === 3 && aroLevel === 3) return 'dynamisme positif';
  
  return 'état équilibré';
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
