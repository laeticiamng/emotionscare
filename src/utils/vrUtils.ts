// @ts-nocheck
/**
 * vrUtils - Utilitaires pour les sessions VR
 * Extraction d'IDs, formatage, validation et helpers
 */

import { logger } from '@/lib/logger';

/** Types de plateforme VR */
export type VRPlatform = 'youtube' | 'vimeo' | 'twitch' | 'dailymotion' | 'custom' | 'unknown';

/** Type d'environnement VR */
export type VREnvironment = 'nature' | 'urban' | 'space' | 'underwater' | 'fantasy' | 'meditation' | 'custom';

/** Qualité VR */
export type VRQuality = '4k' | '1440p' | '1080p' | '720p' | '480p' | 'auto';

/** Mode de projection */
export type ProjectionMode = 'equirectangular' | 'cubemap' | 'fisheye' | 'flat';

/** Configuration VR */
export interface VRConfig {
  quality: VRQuality;
  projection: ProjectionMode;
  stereo: boolean;
  fieldOfView: number;
  autoRotate: boolean;
  rotationSpeed: number;
  audioSpatial: boolean;
}

/** Métadonnées vidéo */
export interface VideoMetadata {
  id: string;
  platform: VRPlatform;
  title?: string;
  duration?: number;
  thumbnail?: string;
  embedUrl?: string;
  rawUrl: string;
}

/** Stats de session VR */
export interface VRSessionStats {
  totalDuration: number;
  averageDuration: number;
  completionRate: number;
  mostUsedEnvironment: VREnvironment | null;
  sessionsCount: number;
}

/** Pattern de validation */
interface PlatformPattern {
  pattern: RegExp;
  platform: VRPlatform;
  idGroup: number;
}

// Patterns pour extraction d'IDs
const PLATFORM_PATTERNS: PlatformPattern[] = [
  {
    pattern: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    platform: 'youtube',
    idGroup: 1
  },
  {
    pattern: /(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:$|\/|\?)/,
    platform: 'vimeo',
    idGroup: 1
  },
  {
    pattern: /(?:twitch\.tv\/videos\/)(\d+)/,
    platform: 'twitch',
    idGroup: 1
  },
  {
    pattern: /(?:dailymotion\.com\/(?:video|embed\/video)\/)([a-zA-Z0-9]+)/,
    platform: 'dailymotion',
    idGroup: 1
  }
];

// Configuration par défaut
const DEFAULT_VR_CONFIG: VRConfig = {
  quality: 'auto',
  projection: 'equirectangular',
  stereo: false,
  fieldOfView: 100,
  autoRotate: false,
  rotationSpeed: 0.5,
  audioSpatial: true
};

/** Extraire l'ID YouTube d'une URL */
export const extractYoutubeID = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/** Extraire l'ID Vimeo d'une URL */
export const extractVimeoID = (url: string): string | null => {
  const regex = /(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/** Extraire l'ID Twitch d'une URL */
export const extractTwitchID = (url: string): string | null => {
  const regex = /(?:twitch\.tv\/videos\/)(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/** Extraire l'ID Dailymotion d'une URL */
export const extractDailymotionID = (url: string): string | null => {
  const regex = /(?:dailymotion\.com\/(?:video|embed\/video)\/)([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/** Détecter la plateforme et extraire l'ID */
export const extractVideoInfo = (url: string): VideoMetadata => {
  for (const { pattern, platform, idGroup } of PLATFORM_PATTERNS) {
    const match = url.match(pattern);
    if (match) {
      const id = match[idGroup];
      return {
        id,
        platform,
        rawUrl: url,
        embedUrl: getEmbedUrl(platform, id)
      };
    }
  }

  return {
    id: url,
    platform: 'unknown',
    rawUrl: url
  };
};

/** Obtenir l'URL d'embed pour une plateforme */
export const getEmbedUrl = (platform: VRPlatform, id: string): string | undefined => {
  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    case 'twitch':
      return `https://player.twitch.tv/?video=${id}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
    case 'dailymotion':
      return `https://www.dailymotion.com/embed/video/${id}?autoplay=1`;
    default:
      return undefined;
  }
};

/** Obtenir l'URL de thumbnail */
export const getThumbnailUrl = (platform: VRPlatform, id: string, quality: 'default' | 'medium' | 'high' | 'max' = 'high'): string | undefined => {
  switch (platform) {
    case 'youtube':
      const ytQualities = {
        default: 'default',
        medium: 'mqdefault',
        high: 'hqdefault',
        max: 'maxresdefault'
      };
      return `https://img.youtube.com/vi/${id}/${ytQualities[quality]}.jpg`;
    case 'vimeo':
      return `https://vumbnail.com/${id}.jpg`;
    default:
      return undefined;
  }
};

/** Formater une durée en minutes/heures */
export const formatDuration = (duration: number | string): string => {
  const numDuration = typeof duration === 'string' ? parseInt(duration) : duration;

  if (isNaN(numDuration) || numDuration < 0) {
    return '0 min';
  }

  if (numDuration < 60) {
    return `${numDuration} min`;
  }

  const hours = Math.floor(numDuration / 60);
  const minutes = numDuration % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
};

/** Formater une durée en format compact */
export const formatDurationCompact = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${minutes}:00`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/** Parser une durée formatée en secondes */
export const parseDuration = (formatted: string): number | null => {
  // Format "Xh Ymin"
  const hourMinMatch = formatted.match(/(\d+)h\s*(\d+)?\s*min?/i);
  if (hourMinMatch) {
    const hours = parseInt(hourMinMatch[1]);
    const minutes = parseInt(hourMinMatch[2] || '0');
    return (hours * 60 + minutes) * 60;
  }

  // Format "X min"
  const minMatch = formatted.match(/(\d+)\s*min/i);
  if (minMatch) {
    return parseInt(minMatch[1]) * 60;
  }

  // Format "HH:MM:SS" ou "MM:SS"
  const colonMatch = formatted.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (colonMatch) {
    if (colonMatch[3]) {
      return parseInt(colonMatch[1]) * 3600 + parseInt(colonMatch[2]) * 60 + parseInt(colonMatch[3]);
    }
    return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2]);
  }

  return null;
};

/** Valider une URL vidéo */
export const isValidVideoUrl = (url: string): boolean => {
  try {
    new URL(url);
    return PLATFORM_PATTERNS.some(({ pattern }) => pattern.test(url));
  } catch {
    return false;
  }
};

/** Valider une URL VR (360) */
export const isVR360Url = (url: string): boolean => {
  const vrKeywords = ['360', 'vr', 'immersive', 'spherical', 'panoramic'];
  const lowerUrl = url.toLowerCase();
  return vrKeywords.some(keyword => lowerUrl.includes(keyword));
};

/** Obtenir la configuration VR par défaut */
export const getDefaultVRConfig = (): VRConfig => ({ ...DEFAULT_VR_CONFIG });

/** Créer une configuration VR personnalisée */
export const createVRConfig = (overrides: Partial<VRConfig> = {}): VRConfig => ({
  ...DEFAULT_VR_CONFIG,
  ...overrides
});

/** Calculer le champ de vision optimal */
export const calculateOptimalFOV = (screenWidth: number, screenHeight: number, distance: number): number => {
  const diagonalInches = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight) / 96;
  const fov = 2 * Math.atan(diagonalInches / (2 * distance)) * (180 / Math.PI);
  return Math.min(Math.max(fov, 60), 120);
};

/** Convertir des coordonnées sphériques en cartésiennes */
export const sphericalToCartesian = (
  theta: number,
  phi: number,
  radius: number = 1
): { x: number; y: number; z: number } => {
  const sinPhi = Math.sin(phi);
  return {
    x: radius * sinPhi * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * sinPhi * Math.sin(theta)
  };
};

/** Convertir des coordonnées cartésiennes en sphériques */
export const cartesianToSpherical = (
  x: number,
  y: number,
  z: number
): { theta: number; phi: number; radius: number } => {
  const radius = Math.sqrt(x * x + y * y + z * z);
  return {
    theta: Math.atan2(z, x),
    phi: Math.acos(y / radius),
    radius
  };
};

/** Interpoler entre deux quaternions */
export const slerpQuaternion = (
  q1: { w: number; x: number; y: number; z: number },
  q2: { w: number; x: number; y: number; z: number },
  t: number
): { w: number; x: number; y: number; z: number } => {
  let dot = q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;

  if (dot < 0) {
    q2 = { w: -q2.w, x: -q2.x, y: -q2.y, z: -q2.z };
    dot = -dot;
  }

  if (dot > 0.9995) {
    return {
      w: q1.w + t * (q2.w - q1.w),
      x: q1.x + t * (q2.x - q1.x),
      y: q1.y + t * (q2.y - q1.y),
      z: q1.z + t * (q2.z - q1.z)
    };
  }

  const theta0 = Math.acos(dot);
  const theta = theta0 * t;
  const sinTheta = Math.sin(theta);
  const sinTheta0 = Math.sin(theta0);

  const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
  const s1 = sinTheta / sinTheta0;

  return {
    w: s0 * q1.w + s1 * q2.w,
    x: s0 * q1.x + s1 * q2.x,
    y: s0 * q1.y + s1 * q2.y,
    z: s0 * q1.z + s1 * q2.z
  };
};

/** Calculer les stats de session */
export const calculateSessionStats = (sessions: Array<{
  duration: number;
  completed: boolean;
  environment?: VREnvironment;
}>): VRSessionStats => {
  if (sessions.length === 0) {
    return {
      totalDuration: 0,
      averageDuration: 0,
      completionRate: 0,
      mostUsedEnvironment: null,
      sessionsCount: 0
    };
  }

  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const completedCount = sessions.filter(s => s.completed).length;

  // Trouver l'environnement le plus utilisé
  const envCounts = sessions.reduce((acc, s) => {
    if (s.environment) {
      acc[s.environment] = (acc[s.environment] || 0) + 1;
    }
    return acc;
  }, {} as Record<VREnvironment, number>);

  const mostUsedEnvironment = Object.entries(envCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as VREnvironment | null;

  return {
    totalDuration,
    averageDuration: totalDuration / sessions.length,
    completionRate: (completedCount / sessions.length) * 100,
    mostUsedEnvironment,
    sessionsCount: sessions.length
  };
};

/** Vérifier le support WebXR */
export const checkWebXRSupport = async (): Promise<{
  supported: boolean;
  vrSupported: boolean;
  arSupported: boolean;
  features: string[];
}> => {
  const result = {
    supported: false,
    vrSupported: false,
    arSupported: false,
    features: [] as string[]
  };

  if (typeof navigator === 'undefined' || !('xr' in navigator)) {
    return result;
  }

  try {
    result.vrSupported = await (navigator as any).xr?.isSessionSupported('immersive-vr') || false;
    result.arSupported = await (navigator as any).xr?.isSessionSupported('immersive-ar') || false;
    result.supported = result.vrSupported || result.arSupported;

    if (result.vrSupported) result.features.push('immersive-vr');
    if (result.arSupported) result.features.push('immersive-ar');

    logger.info('WebXR support checked', result, 'VR');
  } catch (error) {
    logger.warn('WebXR support check failed', error as Error, 'VR');
  }

  return result;
};

/** Générer un point d'intérêt aléatoire */
export const generateRandomHotspot = (
  minTheta: number = 0,
  maxTheta: number = Math.PI * 2,
  minPhi: number = Math.PI * 0.25,
  maxPhi: number = Math.PI * 0.75
): { theta: number; phi: number; label: string } => {
  const theta = minTheta + Math.random() * (maxTheta - minTheta);
  const phi = minPhi + Math.random() * (maxPhi - minPhi);

  return {
    theta,
    phi,
    label: `Hotspot ${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  };
};

export default {
  extractYoutubeID,
  extractVimeoID,
  extractTwitchID,
  extractDailymotionID,
  extractVideoInfo,
  getEmbedUrl,
  getThumbnailUrl,
  formatDuration,
  formatDurationCompact,
  parseDuration,
  isValidVideoUrl,
  isVR360Url,
  getDefaultVRConfig,
  createVRConfig,
  calculateOptimalFOV,
  sphericalToCartesian,
  cartesianToSpherical,
  slerpQuaternion,
  calculateSessionStats,
  checkWebXRSupport,
  generateRandomHotspot
};
