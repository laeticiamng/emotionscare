// @ts-nocheck
/**
 * Constantes et configuration du module SEUIL
 */

import type { SeuilZoneConfig } from './types';

export const SEUIL_ZONES: SeuilZoneConfig[] = [
  {
    zone: 'low',
    range: [0, 30],
    message: 'Rien de grave.\nTu viens juste de sentir un petit décalage.\nOn regarde ça tranquillement.',
    actions: [],
    ambiance: {
      gradient: 'from-emerald-500/20 via-background to-teal-500/10',
      iconColor: 'text-emerald-500',
    },
  },
  {
    zone: 'intermediate',
    range: [31, 60],
    message: 'Là, c\'est le bon moment pour faire quelque chose.\nPas grand. Juste un pas.',
    actions: [
      { id: '3min', label: 'Faire 3 minutes', icon: '⏱️' },
      { id: 'change_activity', label: 'Changer d\'activité', icon: '🔄' },
      { id: 'postpone', label: 'Reporter proprement', icon: '📅' },
    ],
    ambiance: {
      gradient: 'from-amber-500/20 via-background to-orange-500/10',
      iconColor: 'text-amber-500',
    },
  },
  {
    zone: 'critical',
    range: [61, 85],
    message: 'Si tu continues comme ça, tu risques de décrocher pour de vrai.\nTu préfères avancer un peu ou t\'arrêter sans culpabiliser ?',
    actions: [
      { id: '5min_guided', label: '5 minutes guidées', icon: '🧘' },
      { id: 'stop_today', label: 'J\'arrête pour aujourd\'hui', icon: '🛑' },
    ],
    ambiance: {
      gradient: 'from-rose-500/20 via-background to-red-500/10',
      iconColor: 'text-rose-500',
    },
  },
  {
    zone: 'closure',
    range: [86, 100],
    message: 'C\'est ok. Aujourd\'hui, c\'est trop chargé.\nTu n\'as rien raté.\nOn prépare demain.',
    actions: [
      { id: 'close_day', label: 'Clôturer pour aujourd\'hui', icon: '🌙' },
    ],
    ambiance: {
      gradient: 'from-indigo-500/20 via-background to-purple-500/10',
      iconColor: 'text-indigo-500',
    },
  },
];

export const EXIT_MESSAGE = 'Merci d\'avoir écouté le signal.\nC\'est ça, prendre soin de soi.';

export const SEUIL_BUTTON_TEXT = 'Ça commence';

export function getZoneFromLevel(
  level: number, 
  customThresholds?: { intermediate: number; critical: number; closure: number }
): SeuilZoneConfig {
  const thresholds = customThresholds || {
    intermediate: 31,
    critical: 61,
    closure: 86,
  };

  // Build dynamic zones based on custom thresholds
  if (level < thresholds.intermediate) {
    return SEUIL_ZONES[0]; // low
  } else if (level < thresholds.critical) {
    return SEUIL_ZONES[1]; // intermediate
  } else if (level < thresholds.closure) {
    return SEUIL_ZONES[2]; // critical
  } else {
    return SEUIL_ZONES[3]; // closure
  }
}
