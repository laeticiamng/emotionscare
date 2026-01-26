/**
 * Tests unitaires - Services DICOM
 * EmotionsCare - DICOM Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mapEmotionsToBrainRegions,
  getAffectedRegions,
  getSimulatedEmotions,
  type HumeEmotionScore,
} from '../emotionMapper';
import {
  voxelToMNI,
  mniToVoxel,
  findNearestRegion,
  getRegionByCode,
  getRegionsByHemisphere,
  getRegionsByEmotion,
  getRegionDistance,
} from '../atlasMapper';
import {
  generateBrainMesh,
  generatePlaceholderBrain,
  type GeneratedMesh,
} from '../meshGenerator';

describe('emotionMapper', () => {
  describe('mapEmotionsToBrainRegions', () => {
    it('maps anxiety to amygdala region', () => {
      const emotions: HumeEmotionScore[] = [
        { name: 'Anxiety', score: 0.8 },
      ];

      const result = mapEmotionsToBrainRegions(emotions);

      expect(result.anxiety).toBeDefined();
      expect(result.anxiety?.region).toBe('Amygdala');
      expect(result.anxiety?.intensity).toBe(0.8);
    });

    it('maps joy to nucleus accumbens', () => {
      const emotions: HumeEmotionScore[] = [
        { name: 'Joy', score: 0.65 },
      ];

      const result = mapEmotionsToBrainRegions(emotions);

      expect(result.joy).toBeDefined();
      expect(result.joy?.region).toBe('Nucleus_Accumbens');
    });

    it('handles multiple emotions', () => {
      const emotions: HumeEmotionScore[] = [
        { name: 'Anxiety', score: 0.7 },
        { name: 'Sadness', score: 0.5 },
        { name: 'Anger', score: 0.3 },
      ];

      const result = mapEmotionsToBrainRegions(emotions);

      expect(Object.keys(result).length).toBe(3);
      expect(result.anxiety).toBeDefined();
      expect(result.sadness).toBeDefined();
      expect(result.anger).toBeDefined();
    });

    it('adjusts color based on intensity', () => {
      const lowIntensity: HumeEmotionScore[] = [
        { name: 'Fear', score: 0.2 },
      ];
      const highIntensity: HumeEmotionScore[] = [
        { name: 'Fear', score: 0.9 },
      ];

      const lowResult = mapEmotionsToBrainRegions(lowIntensity);
      const highResult = mapEmotionsToBrainRegions(highIntensity);

      // Colors should be different based on intensity
      expect(lowResult.fear?.color).not.toBe(highResult.fear?.color);
    });
  });

  describe('getAffectedRegions', () => {
    it('returns regions for anxiety', () => {
      const regions = getAffectedRegions('anxiety');

      expect(regions).toContain('Amygdala');
      expect(regions).toContain('Insula');
      expect(regions).toContain('ACC');
    });

    it('returns empty array for unknown emotion', () => {
      const regions = getAffectedRegions('unknown_emotion');

      expect(regions).toEqual([]);
    });

    it('is case insensitive', () => {
      const regions1 = getAffectedRegions('ANXIETY');
      const regions2 = getAffectedRegions('anxiety');

      expect(regions1).toEqual(regions2);
    });
  });

  describe('getSimulatedEmotions', () => {
    it('returns array of emotions', () => {
      const emotions = getSimulatedEmotions();

      expect(Array.isArray(emotions)).toBe(true);
      expect(emotions.length).toBeGreaterThan(0);
    });

    it('emotions have valid scores between 0 and 1', () => {
      const emotions = getSimulatedEmotions();

      emotions.forEach(emotion => {
        expect(emotion.score).toBeGreaterThanOrEqual(0);
        expect(emotion.score).toBeLessThanOrEqual(1);
      });
    });

    it('returns sorted emotions by score', () => {
      const emotions = getSimulatedEmotions();

      for (let i = 0; i < emotions.length - 1; i++) {
        expect(emotions[i].score).toBeGreaterThanOrEqual(emotions[i + 1].score);
      }
    });
  });
});

describe('atlasMapper', () => {
  describe('voxelToMNI', () => {
    it('converts center voxel to origin', () => {
      const dimensions: [number, number, number] = [256, 256, 256];
      const result = voxelToMNI(128, 128, 128, dimensions);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it('applies voxel size correctly', () => {
      const dimensions: [number, number, number] = [256, 256, 256];
      const voxelSize: [number, number, number] = [2, 2, 2];
      const result = voxelToMNI(138, 128, 128, dimensions, voxelSize);

      expect(result.x).toBe(20); // (138 - 128) * 2
    });
  });

  describe('mniToVoxel', () => {
    it('converts origin to center voxel', () => {
      const dimensions: [number, number, number] = [256, 256, 256];
      const result = mniToVoxel(0, 0, 0, dimensions);

      expect(result.x).toBe(128);
      expect(result.y).toBe(128);
      expect(result.z).toBe(128);
    });

    it('is inverse of voxelToMNI', () => {
      const dimensions: [number, number, number] = [256, 256, 256];
      const voxelSize: [number, number, number] = [1, 1, 1];
      
      const original = { x: 100, y: 150, z: 200 };
      const mni = voxelToMNI(original.x, original.y, original.z, dimensions, voxelSize);
      const back = mniToVoxel(mni.x, mni.y, mni.z, dimensions, voxelSize);

      expect(back.x).toBe(original.x);
      expect(back.y).toBe(original.y);
      expect(back.z).toBe(original.z);
    });
  });

  describe('findNearestRegion', () => {
    it('finds amygdala for nearby coordinates', () => {
      const mniCoord = { x: -24, y: -4, z: -20 }; // Exact amygdala L coordinates
      const result = findNearestRegion(mniCoord);

      expect(result?.code).toBe('Amygdala_L');
      expect(result?.confidence).toBeCloseTo(1, 1);
    });

    it('returns null for distant coordinates', () => {
      const mniCoord = { x: 100, y: 100, z: 100 };
      const result = findNearestRegion(mniCoord, 10);

      expect(result).toBeNull();
    });

    it('decreases confidence with distance', () => {
      const exact = { x: -24, y: -4, z: -20 };
      const nearby = { x: -24, y: -4, z: -15 };

      const exactResult = findNearestRegion(exact);
      const nearbyResult = findNearestRegion(nearby);

      expect(exactResult?.confidence).toBeGreaterThan(nearbyResult?.confidence || 0);
    });
  });

  describe('getRegionByCode', () => {
    it('returns region for valid code', () => {
      const region = getRegionByCode('Amygdala_L');

      expect(region).toBeDefined();
      expect(region?.name).toBe('Amygdale');
    });

    it('returns undefined for invalid code', () => {
      const region = getRegionByCode('Invalid_Code');

      expect(region).toBeUndefined();
    });
  });

  describe('getRegionsByHemisphere', () => {
    it('returns left hemisphere regions', () => {
      const regions = getRegionsByHemisphere('left');

      expect(regions.length).toBeGreaterThan(0);
      regions.forEach(r => expect(r.hemisphere).toBe('left'));
    });

    it('returns bilateral regions', () => {
      const regions = getRegionsByHemisphere('bilateral');

      expect(regions.length).toBeGreaterThan(0);
      regions.forEach(r => expect(r.hemisphere).toBe('bilateral'));
    });
  });

  describe('getRegionsByEmotion', () => {
    it('returns regions for fear', () => {
      const regions = getRegionsByEmotion('fear');

      expect(regions.length).toBeGreaterThan(0);
      const codes = regions.map(r => r.code);
      expect(codes.some(c => c.includes('Amygdala'))).toBe(true);
    });

    it('returns empty for unknown emotion', () => {
      const regions = getRegionsByEmotion('nonexistent');

      expect(regions).toEqual([]);
    });
  });

  describe('getRegionDistance', () => {
    it('calculates distance between regions', () => {
      const distance = getRegionDistance('Amygdala_L', 'Amygdala_R');

      expect(distance).toBeDefined();
      expect(distance).toBeGreaterThan(0);
    });

    it('returns null for invalid codes', () => {
      const distance = getRegionDistance('Invalid', 'Amygdala_L');

      expect(distance).toBeNull();
    });
  });
});

describe('meshGenerator', () => {
  describe('generateBrainMesh', () => {
    it('generates mesh with geometry and regions', () => {
      const volumeData = new Float32Array(32 * 32 * 32).fill(0);
      // Create a simple sphere
      for (let z = 10; z < 22; z++) {
        for (let y = 10; y < 22; y++) {
          for (let x = 10; x < 22; x++) {
            const dx = x - 16;
            const dy = y - 16;
            const dz = z - 16;
            if (dx * dx + dy * dy + dz * dz < 36) {
              volumeData[x + y * 32 + z * 32 * 32] = 1;
            }
          }
        }
      }

      const mesh = generateBrainMesh(volumeData, [32, 32, 32], [1, 1, 1]);

      expect(mesh.geometry).toBeDefined();
      expect(mesh.regions).toBeDefined();
      expect(mesh.regions.length).toBe(20);
      expect(mesh.boundingBox).toBeDefined();
    });

    it('generates regions with correct structure', () => {
      const volumeData = new Float32Array(16 * 16 * 16).fill(0.5);
      const mesh = generateBrainMesh(volumeData, [16, 16, 16], [1, 1, 1]);

      mesh.regions.forEach(region => {
        expect(region.regionCode).toBeDefined();
        expect(region.regionName).toBeDefined();
        expect(region.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(region.geometry).toBeDefined();
        expect(region.center).toBeDefined();
      });
    });
  });

  describe('generatePlaceholderBrain', () => {
    it('generates a placeholder geometry', () => {
      const geometry = generatePlaceholderBrain();

      expect(geometry).toBeDefined();
      expect(geometry.attributes.position).toBeDefined();
    });
  });
});
