/**
 * Parcours XL - Mode dégradé
 * Playlists de secours si Suno API est indisponible
 */

export interface FallbackSegment {
  title: string;
  url: string;
  duration: number;
}

export interface FallbackPlaylist {
  presetKey: string;
  emotion: string;
  segments: FallbackSegment[];
}

/**
 * Playlists de secours locales (Creative Commons / Royalty-free)
 * À remplacer par vos propres assets audio hébergés
 */
export const FALLBACK_PLAYLISTS: FallbackPlaylist[] = [
  {
    presetKey: 'universel-reset',
    emotion: 'Neutre → Équilibre',
    segments: [
      {
        title: 'Respiration guidée',
        url: '/audio/fallback/calm-breathing.mp3',
        duration: 120
      },
      {
        title: 'Attention au présent',
        url: '/audio/fallback/mindful-presence.mp3',
        duration: 120
      },
      {
        title: 'Défusion cognitive',
        url: '/audio/fallback/cognitive-space.mp3',
        duration: 120
      },
      {
        title: 'Recadrage & Ancrage',
        url: '/audio/fallback/grounding-reframe.mp3',
        duration: 240
      },
      {
        title: 'Retour doux',
        url: '/audio/fallback/gentle-return.mp3',
        duration: 120
      }
    ]
  },
  {
    presetKey: 'panique-anxiete',
    emotion: 'Panique → Calme',
    segments: [
      {
        title: 'Respiration 4/6',
        url: '/audio/fallback/breath-46.mp3',
        duration: 120
      },
      {
        title: 'Ancrage 5-4-3-2-1',
        url: '/audio/fallback/grounding-54321.mp3',
        duration: 120
      },
      {
        title: 'Exposition interoceptive',
        url: '/audio/fallback/interoceptive.mp3',
        duration: 240
      },
      {
        title: 'Restructuration',
        url: '/audio/fallback/restructure.mp3',
        duration: 240
      },
      {
        title: 'Consolidation',
        url: '/audio/fallback/consolidate.mp3',
        duration: 240
      },
      {
        title: 'Sortie douce',
        url: '/audio/fallback/gentle-exit.mp3',
        duration: 240
      }
    ]
  },
  {
    presetKey: 'tristesse-deuil',
    emotion: 'Tristesse → Lumière',
    segments: [
      {
        title: 'Accueil de la tristesse',
        url: '/audio/fallback/embrace-sadness.mp3',
        duration: 120
      },
      {
        title: 'Scan corporel',
        url: '/audio/fallback/body-scan.mp3',
        duration: 180
      },
      {
        title: 'Activation comportementale',
        url: '/audio/fallback/behavioral-activation.mp3',
        duration: 300
      },
      {
        title: 'Recadrage socratique',
        url: '/audio/fallback/socratic-reframe.mp3',
        duration: 300
      },
      {
        title: 'Lumière progressive',
        url: '/audio/fallback/progressive-light.mp3',
        duration: 300
      },
      {
        title: 'Sortie douce',
        url: '/audio/fallback/gentle-return-2.mp3',
        duration: 120
      }
    ]
  }
];

/**
 * Récupère une playlist de secours
 */
export function getFallbackPlaylist(presetKey: string): FallbackPlaylist | null {
  return FALLBACK_PLAYLISTS.find(p => p.presetKey === presetKey) || null;
}

/**
 * Vérifie si le mode dégradé est disponible pour ce preset
 */
export function hasFallbackPlaylist(presetKey: string): boolean {
  return FALLBACK_PLAYLISTS.some(p => p.presetKey === presetKey);
}

/**
 * Retourne la liste de tous les presets avec fallback
 */
export function getAvailableFallbackPresets(): string[] {
  return FALLBACK_PLAYLISTS.map(p => p.presetKey);
}
