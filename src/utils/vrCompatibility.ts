// @ts-nocheck
/**
 * VR Compatibility - Utilitaires de compatibilité VR/XR complets
 * Détection de capacités, extraction de données et helpers WebXR
 */

import { VRSession, VRSessionTemplate } from '@/types/vr';

/** Type de casque VR */
export type VRHeadsetType =
  | 'meta_quest'
  | 'meta_quest_pro'
  | 'htc_vive'
  | 'valve_index'
  | 'playstation_vr'
  | 'pico'
  | 'apple_vision'
  | 'unknown';

/** Capacités XR */
export interface XRCapabilities {
  webXRSupported: boolean;
  immersiveVRSupported: boolean;
  immersiveARSupported: boolean;
  inlineSupported: boolean;
  handTrackingSupported: boolean;
  eyeTrackingSupported: boolean;
  meshDetectionSupported: boolean;
  planeDetectionSupported: boolean;
  hitTestSupported: boolean;
  anchorsSupported: boolean;
  depthSensingSupported: boolean;
  lightEstimationSupported: boolean;
}

/** Info du casque */
export interface HeadsetInfo {
  type: VRHeadsetType;
  name: string;
  manufacturer: string;
  resolution?: { width: number; height: number };
  refreshRate?: number;
  fieldOfView?: number;
  controllers: ControllerType[];
  features: string[];
}

/** Type de contrôleur */
export type ControllerType =
  | 'touch'
  | 'knuckles'
  | 'wand'
  | 'hand'
  | 'eye_gaze'
  | 'unknown';

/** Stats de session VR */
export interface VRSessionStats {
  totalDuration: number;
  activeTime: number;
  idleTime: number;
  interactionCount: number;
  movementDistance: number;
  averageFrameRate: number;
  droppedFrames: number;
  comfortScore: number;
}

/** Position VR */
export interface VRPosition {
  x: number;
  y: number;
  z: number;
}

/** Rotation VR */
export interface VRRotation {
  pitch: number;
  yaw: number;
  roll: number;
}

/** Pose complète */
export interface VRPose {
  position: VRPosition;
  rotation: VRRotation;
  timestamp: number;
}

/** Configuration d'environnement */
export interface VREnvironmentConfig {
  skybox?: string;
  lighting?: 'day' | 'night' | 'sunset' | 'custom';
  ambientSound?: string;
  particles?: boolean;
  weather?: 'clear' | 'rain' | 'snow' | 'fog';
  scale?: number;
}

// Cache des capacités
let cachedCapabilities: XRCapabilities | null = null;
let cachedHeadsetInfo: HeadsetInfo | null = null;

/** Obtenir l'heure de début d'une session */
export const getVRSessionStartTime = (session: VRSession): string | Date => {
  return session.startTime;
};

/** Obtenir l'heure de fin d'une session */
export const getVRSessionEndTime = (session: VRSession): string | Date | undefined => {
  return session.endTime;
};

/** Obtenir l'URL audio d'un template */
export const getVRTemplateAudioUrl = (template: VRSessionTemplate): string | undefined => {
  // Retourne l'URL audio si disponible dans le template
  return (template as { audioUrl?: string }).audioUrl;
};

/** Calculer la durée d'une session */
export function getSessionDuration(session: VRSession): number {
  const start = new Date(session.startTime).getTime();
  const end = session.endTime ? new Date(session.endTime).getTime() : Date.now();
  return end - start;
}

/** Formater la durée en texte lisible */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/** Vérifier si WebXR est supporté */
export async function isWebXRSupported(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  if (!('xr' in navigator)) return false;

  try {
    return await (navigator as any).xr.isSessionSupported('immersive-vr');
  } catch {
    return false;
  }
}

/** Obtenir les capacités XR complètes */
export async function getXRCapabilities(): Promise<XRCapabilities> {
  if (cachedCapabilities) return cachedCapabilities;

  const capabilities: XRCapabilities = {
    webXRSupported: false,
    immersiveVRSupported: false,
    immersiveARSupported: false,
    inlineSupported: false,
    handTrackingSupported: false,
    eyeTrackingSupported: false,
    meshDetectionSupported: false,
    planeDetectionSupported: false,
    hitTestSupported: false,
    anchorsSupported: false,
    depthSensingSupported: false,
    lightEstimationSupported: false
  };

  if (typeof navigator === 'undefined' || !('xr' in navigator)) {
    return capabilities;
  }

  const xr = (navigator as any).xr;
  capabilities.webXRSupported = true;

  try {
    capabilities.immersiveVRSupported = await xr.isSessionSupported('immersive-vr');
  } catch {}

  try {
    capabilities.immersiveARSupported = await xr.isSessionSupported('immersive-ar');
  } catch {}

  try {
    capabilities.inlineSupported = await xr.isSessionSupported('inline');
  } catch {}

  // Vérifier les features avancées
  const advancedFeatures = [
    'hand-tracking',
    'eye-gaze-interaction',
    'mesh-detection',
    'plane-detection',
    'hit-test',
    'anchors',
    'depth-sensing',
    'light-estimation'
  ];

  for (const feature of advancedFeatures) {
    try {
      const supported = await xr.isSessionSupported('immersive-vr', {
        requiredFeatures: [feature]
      });
      switch (feature) {
        case 'hand-tracking': capabilities.handTrackingSupported = supported; break;
        case 'eye-gaze-interaction': capabilities.eyeTrackingSupported = supported; break;
        case 'mesh-detection': capabilities.meshDetectionSupported = supported; break;
        case 'plane-detection': capabilities.planeDetectionSupported = supported; break;
        case 'hit-test': capabilities.hitTestSupported = supported; break;
        case 'anchors': capabilities.anchorsSupported = supported; break;
        case 'depth-sensing': capabilities.depthSensingSupported = supported; break;
        case 'light-estimation': capabilities.lightEstimationSupported = supported; break;
      }
    } catch {}
  }

  cachedCapabilities = capabilities;
  return capabilities;
}

/** Détecter le type de casque */
export function detectHeadsetType(): HeadsetInfo {
  if (cachedHeadsetInfo) return cachedHeadsetInfo;

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';

  const info: HeadsetInfo = {
    type: 'unknown',
    name: 'Unknown VR Headset',
    manufacturer: 'Unknown',
    controllers: ['unknown'],
    features: []
  };

  if (userAgent.includes('oculus') || userAgent.includes('quest')) {
    if (userAgent.includes('quest pro') || userAgent.includes('quest_pro')) {
      info.type = 'meta_quest_pro';
      info.name = 'Meta Quest Pro';
      info.manufacturer = 'Meta';
      info.resolution = { width: 1800, height: 1920 };
      info.refreshRate = 90;
      info.fieldOfView = 106;
      info.controllers = ['touch', 'hand', 'eye_gaze'];
      info.features = ['hand-tracking', 'eye-tracking', 'mixed-reality', 'color-passthrough'];
    } else {
      info.type = 'meta_quest';
      info.name = 'Meta Quest';
      info.manufacturer = 'Meta';
      info.resolution = { width: 1832, height: 1920 };
      info.refreshRate = 120;
      info.fieldOfView = 104;
      info.controllers = ['touch', 'hand'];
      info.features = ['hand-tracking', 'passthrough'];
    }
  } else if (userAgent.includes('vive')) {
    info.type = 'htc_vive';
    info.name = 'HTC Vive';
    info.manufacturer = 'HTC';
    info.resolution = { width: 1080, height: 1200 };
    info.refreshRate = 90;
    info.fieldOfView = 110;
    info.controllers = ['wand'];
    info.features = ['room-scale'];
  } else if (userAgent.includes('index')) {
    info.type = 'valve_index';
    info.name = 'Valve Index';
    info.manufacturer = 'Valve';
    info.resolution = { width: 1440, height: 1600 };
    info.refreshRate = 144;
    info.fieldOfView = 130;
    info.controllers = ['knuckles'];
    info.features = ['finger-tracking', 'high-refresh'];
  } else if (userAgent.includes('pico')) {
    info.type = 'pico';
    info.name = 'Pico';
    info.manufacturer = 'Pico';
    info.resolution = { width: 2160, height: 2160 };
    info.refreshRate = 90;
    info.controllers = ['touch', 'hand'];
    info.features = ['hand-tracking', 'standalone'];
  } else if (userAgent.includes('playstation') || userAgent.includes('psvr')) {
    info.type = 'playstation_vr';
    info.name = 'PlayStation VR';
    info.manufacturer = 'Sony';
    info.resolution = { width: 960, height: 1080 };
    info.refreshRate = 120;
    info.controllers = ['wand'];
    info.features = ['console-based'];
  }

  cachedHeadsetInfo = info;
  return info;
}

/** Vérifier la compatibilité d'une feature */
export async function isFeatureSupported(feature: string): Promise<boolean> {
  const capabilities = await getXRCapabilities();

  switch (feature) {
    case 'vr': return capabilities.immersiveVRSupported;
    case 'ar': return capabilities.immersiveARSupported;
    case 'hand-tracking': return capabilities.handTrackingSupported;
    case 'eye-tracking': return capabilities.eyeTrackingSupported;
    case 'plane-detection': return capabilities.planeDetectionSupported;
    case 'mesh-detection': return capabilities.meshDetectionSupported;
    case 'hit-test': return capabilities.hitTestSupported;
    case 'anchors': return capabilities.anchorsSupported;
    default: return false;
  }
}

/** Créer une configuration de session XR */
export function createSessionConfig(options: {
  mode?: 'vr' | 'ar' | 'inline';
  features?: string[];
  optionalFeatures?: string[];
}): XRSessionInit {
  const config: XRSessionInit = {
    requiredFeatures: options.features || ['local-floor'],
    optionalFeatures: options.optionalFeatures || ['bounded-floor', 'hand-tracking']
  };

  return config;
}

interface XRSessionInit {
  requiredFeatures?: string[];
  optionalFeatures?: string[];
}

/** Convertir une position 3D en coordonnées écran */
export function worldToScreen(
  position: VRPosition,
  viewMatrix: Float32Array,
  projectionMatrix: Float32Array,
  viewport: { width: number; height: number }
): { x: number; y: number; visible: boolean } {
  // Simplified world-to-screen conversion
  const clipSpace = {
    x: position.x * projectionMatrix[0] + position.y * projectionMatrix[4] + position.z * projectionMatrix[8] + projectionMatrix[12],
    y: position.x * projectionMatrix[1] + position.y * projectionMatrix[5] + position.z * projectionMatrix[9] + projectionMatrix[13],
    z: position.x * projectionMatrix[2] + position.y * projectionMatrix[6] + position.z * projectionMatrix[10] + projectionMatrix[14],
    w: position.x * projectionMatrix[3] + position.y * projectionMatrix[7] + position.z * projectionMatrix[11] + projectionMatrix[15]
  };

  const ndcX = clipSpace.x / clipSpace.w;
  const ndcY = clipSpace.y / clipSpace.w;
  const ndcZ = clipSpace.z / clipSpace.w;

  const screenX = (ndcX + 1) * 0.5 * viewport.width;
  const screenY = (1 - ndcY) * 0.5 * viewport.height;

  return {
    x: screenX,
    y: screenY,
    visible: ndcZ >= -1 && ndcZ <= 1
  };
}

/** Calculer la distance entre deux positions */
export function calculateDistance(a: VRPosition, b: VRPosition): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Interpoler entre deux positions */
export function lerpPosition(a: VRPosition, b: VRPosition, t: number): VRPosition {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t
  };
}

/** Interpoler entre deux rotations (slerp simplifié) */
export function lerpRotation(a: VRRotation, b: VRRotation, t: number): VRRotation {
  return {
    pitch: a.pitch + (b.pitch - a.pitch) * t,
    yaw: a.yaw + (b.yaw - a.yaw) * t,
    roll: a.roll + (b.roll - a.roll) * t
  };
}

/** Convertir des degrés en radians */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Convertir des radians en degrés */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/** Limiter une valeur entre min et max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Calculer le score de confort basé sur le mouvement */
export function calculateComfortScore(poses: VRPose[]): number {
  if (poses.length < 2) return 100;

  let totalAcceleration = 0;
  let totalRotationSpeed = 0;

  for (let i = 1; i < poses.length; i++) {
    const prev = poses[i - 1];
    const curr = poses[i];
    const dt = (curr.timestamp - prev.timestamp) / 1000; // en secondes

    if (dt > 0) {
      // Calculer l'accélération
      const distance = calculateDistance(prev.position, curr.position);
      const speed = distance / dt;
      totalAcceleration += Math.abs(speed);

      // Calculer la vitesse de rotation
      const rotationDelta = Math.abs(curr.rotation.yaw - prev.rotation.yaw);
      totalRotationSpeed += rotationDelta / dt;
    }
  }

  const avgAcceleration = totalAcceleration / (poses.length - 1);
  const avgRotationSpeed = totalRotationSpeed / (poses.length - 1);

  // Score basé sur des seuils de confort
  let score = 100;
  score -= Math.min(avgAcceleration * 10, 30); // Pénalité pour mouvement rapide
  score -= Math.min(avgRotationSpeed * 0.5, 30); // Pénalité pour rotation rapide

  return Math.max(0, Math.min(100, score));
}

/** Vérifier si l'utilisateur est en zone de confort */
export function isInComfortZone(
  pose: VRPose,
  center: VRPosition = { x: 0, y: 1.6, z: 0 },
  radius: number = 2
): boolean {
  const distance = calculateDistance(pose.position, center);
  return distance <= radius;
}

/** Générer des statistiques de session */
export function generateSessionStats(
  session: VRSession,
  poses: VRPose[]
): VRSessionStats {
  const duration = getSessionDuration(session);

  let activeTime = 0;
  let movementDistance = 0;
  let interactionCount = 0;

  for (let i = 1; i < poses.length; i++) {
    const prev = poses[i - 1];
    const curr = poses[i];
    const distance = calculateDistance(prev.position, curr.position);

    movementDistance += distance;

    // Considérer actif si mouvement > seuil
    if (distance > 0.01) {
      activeTime += curr.timestamp - prev.timestamp;
    }
  }

  return {
    totalDuration: duration,
    activeTime,
    idleTime: duration - activeTime,
    interactionCount,
    movementDistance,
    averageFrameRate: poses.length > 0 ? (poses.length / (duration / 1000)) : 0,
    droppedFrames: 0,
    comfortScore: calculateComfortScore(poses)
  };
}

/** Créer une configuration d'environnement par défaut */
export function createDefaultEnvironment(type: 'beach' | 'forest' | 'mountain' | 'space'): VREnvironmentConfig {
  const configs: Record<string, VREnvironmentConfig> = {
    beach: {
      skybox: 'beach_sunset',
      lighting: 'sunset',
      ambientSound: 'waves',
      particles: false,
      weather: 'clear',
      scale: 1
    },
    forest: {
      skybox: 'forest_day',
      lighting: 'day',
      ambientSound: 'birds',
      particles: true,
      weather: 'clear',
      scale: 1
    },
    mountain: {
      skybox: 'mountain_dawn',
      lighting: 'day',
      ambientSound: 'wind',
      particles: false,
      weather: 'clear',
      scale: 1.5
    },
    space: {
      skybox: 'space_nebula',
      lighting: 'night',
      ambientSound: 'ambient',
      particles: true,
      weather: 'clear',
      scale: 2
    }
  };

  return configs[type] || configs.forest;
}

/** Invalider le cache */
export function invalidateCache(): void {
  cachedCapabilities = null;
  cachedHeadsetInfo = null;
}

export default {
  getVRSessionStartTime,
  getVRSessionEndTime,
  getVRTemplateAudioUrl,
  getSessionDuration,
  formatDuration,
  isWebXRSupported,
  getXRCapabilities,
  detectHeadsetType,
  isFeatureSupported,
  createSessionConfig,
  worldToScreen,
  calculateDistance,
  lerpPosition,
  lerpRotation,
  degreesToRadians,
  radiansToDegrees,
  clamp,
  calculateComfortScore,
  isInComfortZone,
  generateSessionStats,
  createDefaultEnvironment,
  invalidateCache
};
