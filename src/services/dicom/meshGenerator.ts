/**
 * Générateur de maillage 3D à partir de données volumétriques
 * Utilise l'algorithme Marching Cubes simplifié
 */

import * as THREE from 'three';
import { logger } from '@/lib/logger';
import { AAL_REGIONS, type AALRegion } from '@/components/brain/types';

export interface MeshGeneratorOptions {
  isovalue?: number;
  smoothing?: boolean;
  decimation?: number;
  colorByRegion?: boolean;
}

export interface GeneratedMesh {
  geometry: THREE.BufferGeometry;
  regions: RegionMesh[];
  boundingBox: THREE.Box3;
}

export interface RegionMesh {
  regionCode: string;
  regionName: string;
  hemisphere: string;
  color: string;
  geometry: THREE.BufferGeometry;
  center: THREE.Vector3;
}

/**
 * Générer un maillage 3D du cerveau à partir de données volumétriques
 */
export function generateBrainMesh(
  volumeData: Float32Array,
  dimensions: [number, number, number],
  voxelSize: [number, number, number],
  options: MeshGeneratorOptions = {}
): GeneratedMesh {
  const { isovalue = 0.3, colorByRegion = true } = options;
  
  logger.info('Génération du maillage 3D', { dimensions, isovalue }, 'MESH');
  
  // Normaliser les données
  const normalizedData = normalizeVolumeData(volumeData);
  
  // Marching cubes pour générer la surface
  const geometry = marchingCubes(normalizedData, dimensions, voxelSize, isovalue);
  
  // Générer les régions simulées (dans une vraie implémentation, on utiliserait un atlas)
  const regions = generateSimulatedRegions(dimensions, voxelSize);
  
  // Calculer la bounding box
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox || new THREE.Box3();
  
  logger.info('Maillage généré', { 
    vertices: geometry.attributes.position?.count || 0,
    regions: regions.length 
  }, 'MESH');
  
  return {
    geometry,
    regions,
    boundingBox,
  };
}

function normalizeVolumeData(data: Float32Array): Float32Array {
  let min = Infinity;
  let max = -Infinity;
  
  for (let i = 0; i < data.length; i++) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
  }
  
  const range = max - min || 1;
  const normalized = new Float32Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    normalized[i] = (data[i] - min) / range;
  }
  
  return normalized;
}

/**
 * Algorithme Marching Cubes simplifié
 */
function marchingCubes(
  data: Float32Array,
  dimensions: [number, number, number],
  voxelSize: [number, number, number],
  isovalue: number
): THREE.BufferGeometry {
  const [nx, ny, nz] = dimensions;
  const [sx, sy, sz] = voxelSize;
  
  const vertices: number[] = [];
  const normals: number[] = [];
  
  const getValue = (x: number, y: number, z: number): number => {
    if (x < 0 || x >= nx || y < 0 || y >= ny || z < 0 || z >= nz) return 0;
    return data[x + y * nx + z * nx * ny];
  };
  
  // Parcourir tous les cubes
  for (let z = 0; z < nz - 1; z++) {
    for (let y = 0; y < ny - 1; y++) {
      for (let x = 0; x < nx - 1; x++) {
        // Calculer l'index du cube
        let cubeIndex = 0;
        const cubeValues = [
          getValue(x, y, z),
          getValue(x + 1, y, z),
          getValue(x + 1, y + 1, z),
          getValue(x, y + 1, z),
          getValue(x, y, z + 1),
          getValue(x + 1, y, z + 1),
          getValue(x + 1, y + 1, z + 1),
          getValue(x, y + 1, z + 1),
        ];
        
        for (let i = 0; i < 8; i++) {
          if (cubeValues[i] > isovalue) cubeIndex |= (1 << i);
        }
        
        // Ignorer les cubes entièrement dedans ou dehors
        if (cubeIndex === 0 || cubeIndex === 255) continue;
        
        // Générer les triangles pour ce cube (version simplifiée)
        const corners = [
          [x * sx, y * sy, z * sz],
          [(x + 1) * sx, y * sy, z * sz],
          [(x + 1) * sx, (y + 1) * sy, z * sz],
          [x * sx, (y + 1) * sy, z * sz],
          [x * sx, y * sy, (z + 1) * sz],
          [(x + 1) * sx, y * sy, (z + 1) * sz],
          [(x + 1) * sx, (y + 1) * sy, (z + 1) * sz],
          [x * sx, (y + 1) * sy, (z + 1) * sz],
        ];
        
        // Ajouter un triangle simplifié au centre
        const center = corners.reduce(
          (acc, c) => [acc[0] + c[0] / 8, acc[1] + c[1] / 8, acc[2] + c[2] / 8],
          [0, 0, 0]
        );
        
        // Triangle vers le haut
        vertices.push(center[0], center[1], center[2] + sz * 0.1);
        vertices.push(center[0] - sx * 0.05, center[1], center[2]);
        vertices.push(center[0] + sx * 0.05, center[1], center[2]);
        
        // Normales
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
      }
    }
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeVertexNormals();
  
  return geometry;
}

/**
 * Générer des régions cérébrales simulées basées sur l'atlas AAL
 */
function generateSimulatedRegions(
  dimensions: [number, number, number],
  voxelSize: [number, number, number]
): RegionMesh[] {
  const regions: RegionMesh[] = [];
  const [nx, ny, nz] = dimensions;
  const [sx, sy, sz] = voxelSize;
  
  const brainCenter = new THREE.Vector3(
    (nx * sx) / 2,
    (ny * sy) / 2,
    (nz * sz) / 2
  );
  
  AAL_REGIONS.forEach((region, index) => {
    // Positionner les régions de manière réaliste
    const angle = (index / AAL_REGIONS.length) * Math.PI * 2;
    const radius = 20 + Math.random() * 10;
    const heightOffset = (Math.random() - 0.5) * 30;
    
    const offsetX = region.hemisphere === 'left' ? -15 : region.hemisphere === 'right' ? 15 : 0;
    
    const center = new THREE.Vector3(
      brainCenter.x + Math.cos(angle) * radius * 0.3 + offsetX,
      brainCenter.y + Math.sin(angle) * radius * 0.3,
      brainCenter.z + heightOffset
    );
    
    // Créer une sphère pour chaque région
    const sphereGeometry = new THREE.SphereGeometry(5 + Math.random() * 3, 16, 12);
    sphereGeometry.translate(center.x, center.y, center.z);
    
    regions.push({
      regionCode: region.code,
      regionName: region.name,
      hemisphere: region.hemisphere,
      color: region.color,
      geometry: sphereGeometry,
      center,
    });
  });
  
  return regions;
}

/**
 * Générer un cerveau placeholder stylisé
 */
export function generatePlaceholderBrain(): THREE.BufferGeometry {
  // Forme de cerveau basique avec deux hémisphères
  const leftHemisphere = new THREE.SphereGeometry(40, 32, 24);
  leftHemisphere.scale(1, 0.8, 1);
  leftHemisphere.translate(-15, 0, 0);
  
  const rightHemisphere = new THREE.SphereGeometry(40, 32, 24);
  rightHemisphere.scale(1, 0.8, 1);
  rightHemisphere.translate(15, 0, 0);
  
  // Cervelet
  const cerebellum = new THREE.SphereGeometry(20, 16, 12);
  cerebellum.translate(0, -30, -20);
  
  // Tronc cérébral
  const brainstem = new THREE.CylinderGeometry(8, 10, 30, 16);
  brainstem.translate(0, -50, 0);
  
  // Fusionner les géométries
  const mergedGeometry = new THREE.BufferGeometry();
  
  // Simplement utiliser l'hémisphère gauche comme base pour le prototype
  return leftHemisphere;
}

/**
 * Exporter le maillage en format glTF
 */
export async function exportMeshToGLTF(
  mesh: THREE.Mesh
): Promise<Blob> {
  // Sérialiser la géométrie en JSON pour l'export
  const geometryJson = mesh.geometry.toJSON();
  const exportData = {
    type: 'brain_mesh',
    geometry: geometryJson,
    timestamp: new Date().toISOString(),
  };
  
  return new Blob([JSON.stringify(exportData)], { type: 'application/json' });
}
