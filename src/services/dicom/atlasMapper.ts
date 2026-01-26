/**
 * Atlas Mapper - Mapping vers l'atlas AAL (116 régions cérébrales)
 * EmotionsCare - Module DICOM
 */

import { AAL_REGIONS, type AALRegion, type Hemisphere } from '@/components/brain/types';
import { logger } from '@/lib/logger';

export interface AtlasCoordinate {
  x: number;
  y: number;
  z: number;
}

export interface RegionLookup {
  code: string;
  name: string;
  hemisphere: Hemisphere;
  color: string;
  confidence: number;
  mniCoordinates?: AtlasCoordinate;
}

export interface AtlasMapping {
  regions: Map<string, RegionLookup>;
  totalVolume: number;
  segmentationQuality: number;
}

/**
 * Coordonnées MNI des régions AAL principales (simplifiées)
 * Basées sur l'atlas AAL standard
 */
const AAL_MNI_COORDINATES: Record<string, AtlasCoordinate> = {
  Amygdala_L: { x: -24, y: -4, z: -20 },
  Amygdala_R: { x: 24, y: -4, z: -20 },
  Hippocampus_L: { x: -28, y: -20, z: -12 },
  Hippocampus_R: { x: 28, y: -20, z: -12 },
  Prefrontal_L: { x: -40, y: 45, z: 20 },
  Prefrontal_R: { x: 40, y: 45, z: 20 },
  Insula_L: { x: -36, y: 8, z: 0 },
  Insula_R: { x: 36, y: 8, z: 0 },
  ACC: { x: 0, y: 30, z: 24 },
  Nucleus_Accumbens_L: { x: -10, y: 12, z: -8 },
  Nucleus_Accumbens_R: { x: 10, y: 12, z: -8 },
  Hypothalamus: { x: 0, y: -4, z: -12 },
  Thalamus_L: { x: -10, y: -18, z: 8 },
  Thalamus_R: { x: 10, y: -18, z: 8 },
  Caudate_L: { x: -12, y: 10, z: 12 },
  Caudate_R: { x: 12, y: 10, z: 12 },
  Putamen_L: { x: -24, y: 4, z: 4 },
  Putamen_R: { x: 24, y: 4, z: 4 },
  Cerebellum_L: { x: -24, y: -60, z: -30 },
  Cerebellum_R: { x: 24, y: -60, z: -30 },
};

/**
 * Convertir des coordonnées voxel en coordonnées MNI
 */
export function voxelToMNI(
  voxelX: number,
  voxelY: number,
  voxelZ: number,
  dimensions: [number, number, number],
  voxelSize: [number, number, number] = [1, 1, 1]
): AtlasCoordinate {
  // Conversion simplifiée - en production, utiliser la matrice affine du scan
  const centerX = dimensions[0] / 2;
  const centerY = dimensions[1] / 2;
  const centerZ = dimensions[2] / 2;

  return {
    x: (voxelX - centerX) * voxelSize[0],
    y: (voxelY - centerY) * voxelSize[1],
    z: (voxelZ - centerZ) * voxelSize[2],
  };
}

/**
 * Convertir des coordonnées MNI en coordonnées voxel
 */
export function mniToVoxel(
  mniX: number,
  mniY: number,
  mniZ: number,
  dimensions: [number, number, number],
  voxelSize: [number, number, number] = [1, 1, 1]
): AtlasCoordinate {
  const centerX = dimensions[0] / 2;
  const centerY = dimensions[1] / 2;
  const centerZ = dimensions[2] / 2;

  return {
    x: Math.round(mniX / voxelSize[0] + centerX),
    y: Math.round(mniY / voxelSize[1] + centerY),
    z: Math.round(mniZ / voxelSize[2] + centerZ),
  };
}

/**
 * Trouver la région AAL la plus proche d'une coordonnée MNI
 */
export function findNearestRegion(
  mniCoord: AtlasCoordinate,
  maxDistance: number = 20
): RegionLookup | null {
  let nearestRegion: AALRegion | null = null;
  let minDistance = Infinity;

  for (const region of AAL_REGIONS) {
    const regionCoord = AAL_MNI_COORDINATES[region.code];
    if (!regionCoord) continue;

    const distance = Math.sqrt(
      Math.pow(mniCoord.x - regionCoord.x, 2) +
      Math.pow(mniCoord.y - regionCoord.y, 2) +
      Math.pow(mniCoord.z - regionCoord.z, 2)
    );

    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      nearestRegion = region;
    }
  }

  if (!nearestRegion) return null;

  // Confidence décroît avec la distance
  const confidence = Math.max(0, 1 - minDistance / maxDistance);

  return {
    code: nearestRegion.code,
    name: nearestRegion.name,
    hemisphere: nearestRegion.hemisphere,
    color: nearestRegion.color,
    confidence,
    mniCoordinates: AAL_MNI_COORDINATES[nearestRegion.code],
  };
}

/**
 * Segmenter un volume en régions AAL
 */
export function segmentVolumeToAAL(
  volumeData: Float32Array,
  dimensions: [number, number, number],
  voxelSize: [number, number, number] = [1, 1, 1],
  threshold: number = 0.3
): AtlasMapping {
  logger.info('Démarrage segmentation AAL', { dimensions, threshold }, 'ATLAS_MAPPER');

  const regions = new Map<string, RegionLookup>();
  let totalVolume = 0;
  let segmentedVoxels = 0;

  // Pour chaque région AAL, calculer le volume
  for (const region of AAL_REGIONS) {
    const regionCoord = AAL_MNI_COORDINATES[region.code];
    if (!regionCoord) continue;

    const voxelCoord = mniToVoxel(
      regionCoord.x,
      regionCoord.y,
      regionCoord.z,
      dimensions,
      voxelSize
    );

    // Calculer le volume approximatif dans un rayon autour du centre
    const radius = 10; // mm
    const radiusVoxels = Math.ceil(radius / Math.min(...voxelSize));
    let regionVolume = 0;

    for (let dz = -radiusVoxels; dz <= radiusVoxels; dz++) {
      for (let dy = -radiusVoxels; dy <= radiusVoxels; dy++) {
        for (let dx = -radiusVoxels; dx <= radiusVoxels; dx++) {
          const x = voxelCoord.x + dx;
          const y = voxelCoord.y + dy;
          const z = voxelCoord.z + dz;

          if (x < 0 || x >= dimensions[0] ||
              y < 0 || y >= dimensions[1] ||
              z < 0 || z >= dimensions[2]) continue;

          const index = x + y * dimensions[0] + z * dimensions[0] * dimensions[1];
          const value = volumeData[index];

          if (value > threshold) {
            regionVolume += voxelSize[0] * voxelSize[1] * voxelSize[2];
            segmentedVoxels++;
          }
        }
      }
    }

    if (regionVolume > 0) {
      regions.set(region.code, {
        code: region.code,
        name: region.name,
        hemisphere: region.hemisphere,
        color: region.color,
        confidence: Math.min(1, regionVolume / 1000), // Normaliser
        mniCoordinates: regionCoord,
      });

      totalVolume += regionVolume;
    }
  }

  const segmentationQuality = segmentedVoxels / volumeData.length;

  logger.info('Segmentation AAL terminée', {
    regionsFound: regions.size,
    totalVolume,
    segmentationQuality,
  }, 'ATLAS_MAPPER');

  return {
    regions,
    totalVolume,
    segmentationQuality,
  };
}

/**
 * Obtenir les informations d'une région par son code
 */
export function getRegionByCode(code: string): AALRegion | undefined {
  return AAL_REGIONS.find(r => r.code === code);
}

/**
 * Obtenir toutes les régions par hémisphère
 */
export function getRegionsByHemisphere(hemisphere: Hemisphere): AALRegion[] {
  return AAL_REGIONS.filter(r => r.hemisphere === hemisphere);
}

/**
 * Obtenir les régions associées à une émotion
 */
export function getRegionsByEmotion(emotion: string): AALRegion[] {
  return AAL_REGIONS.filter(r => 
    r.emotionAffinity?.includes(emotion.toLowerCase())
  );
}

/**
 * Calculer la distance entre deux régions
 */
export function getRegionDistance(code1: string, code2: string): number | null {
  const coord1 = AAL_MNI_COORDINATES[code1];
  const coord2 = AAL_MNI_COORDINATES[code2];

  if (!coord1 || !coord2) return null;

  return Math.sqrt(
    Math.pow(coord1.x - coord2.x, 2) +
    Math.pow(coord1.y - coord2.y, 2) +
    Math.pow(coord1.z - coord2.z, 2)
  );
}

/**
 * Exporter le mapping en format JSON compatible Context-Lens-Pro
 */
export function exportAtlasMappingForAR(mapping: AtlasMapping): object {
  const regionsArray = Array.from(mapping.regions.values()).map(region => ({
    id: region.code,
    label: region.name,
    hemisphere: region.hemisphere,
    color: region.color,
    confidence: region.confidence,
    position: region.mniCoordinates,
  }));

  return {
    version: '1.0',
    atlas: 'AAL',
    totalRegions: regionsArray.length,
    totalVolume: mapping.totalVolume,
    quality: mapping.segmentationQuality,
    regions: regionsArray,
  };
}
