/**
 * BrainViewer3D - Composant principal de visualisation 3D du cerveau
 * Utilise React Three Fiber pour le rendu WebGL
 */

import React, { useRef, useState, useCallback, Suspense, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { BrainScan, BrainRegion, EmotionRegionMap, AALRegion } from './types';
import { AAL_REGIONS, EMOTION_BRAIN_MAPPING, VIEW_MODES } from './types';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// Types
// ============================================================================

interface BrainViewer3DProps {
  scan?: BrainScan | null;
  regions?: BrainRegion[];
  emotionOverlay?: EmotionRegionMap;
  selectedRegion?: string | null;
  onRegionSelect?: (regionCode: string | null) => void;
  viewMode?: 'axial' | 'sagittal' | 'coronal' | '3d';
  showLabels?: boolean;
  opacity?: number;
  wireframe?: boolean;
  isLoading?: boolean;
}

interface BrainMeshProps {
  position?: [number, number, number];
  color?: string;
  opacity?: number;
  wireframe?: boolean;
  isSelected?: boolean;
  emotionIntensity?: number;
  onClick?: () => void;
  regionCode?: string;
  regionName?: string;
  showLabel?: boolean;
}

interface RegionSphereProps {
  region: AALRegion;
  emotionData?: { intensity: number; color: string };
  isSelected?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
}

// ============================================================================
// Brain Mesh Component
// ============================================================================

const BrainMesh = memo<BrainMeshProps>(({
  position = [0, 0, 0],
  color = '#8B5CF6',
  opacity = 0.85,
  wireframe = false,
  isSelected = false,
  emotionIntensity = 0,
  onClick,
  regionCode,
  regionName,
  showLabel = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animation de pulsation pour les régions sélectionnées ou avec émotion
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected || emotionIntensity > 0.5) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05 * emotionIntensity;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  // Calcul de la couleur basée sur l'émotion
  const meshColor = useMemo(() => {
    if (emotionIntensity > 0) {
      return new THREE.Color(color).lerp(new THREE.Color('#FF4444'), emotionIntensity);
    }
    return new THREE.Color(color);
  }, [color, emotionIntensity]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3 + emotionIntensity * 0.2, 32, 32]} />
        <meshStandardMaterial
          color={meshColor}
          transparent
          opacity={hovered ? 1 : opacity}
          wireframe={wireframe}
          emissive={isSelected ? meshColor : new THREE.Color('#000000')}
          emissiveIntensity={isSelected ? 0.5 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {showLabel && (hovered || isSelected) && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={10}
          className="pointer-events-none"
        >
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium whitespace-nowrap border border-border shadow-lg">
            <span className="text-foreground">{regionName || regionCode}</span>
            {emotionIntensity > 0 && (
              <span className="ml-1 text-primary">
                ({Math.round(emotionIntensity * 100)}%)
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
});

BrainMesh.displayName = 'BrainMesh';

// ============================================================================
// Region Sphere Component (AAL Atlas)
// ============================================================================

const RegionSphere = memo<RegionSphereProps>(({
  region,
  emotionData,
  isSelected = false,
  onClick,
  showLabel = false,
}) => {
  // Position basée sur le code de région (simulation)
  const position = useMemo<[number, number, number]>(() => {
    const hemisphereOffset = region.hemisphere === 'left' ? -1 : region.hemisphere === 'right' ? 1 : 0;
    
    // Positions approximatives des régions cérébrales
    const positions: Record<string, [number, number, number]> = {
      'Amygdala_L': [-1.2, -0.5, 0.8],
      'Amygdala_R': [1.2, -0.5, 0.8],
      'Hippocampus_L': [-1.5, -0.8, 0.3],
      'Hippocampus_R': [1.5, -0.8, 0.3],
      'Prefrontal_L': [-1.0, 1.5, 0.8],
      'Prefrontal_R': [1.0, 1.5, 0.8],
      'Insula_L': [-1.8, 0.2, 0.5],
      'Insula_R': [1.8, 0.2, 0.5],
      'ACC': [0, 0.8, 1.2],
      'Nucleus_Accumbens_L': [-0.5, 0.3, 0.2],
      'Nucleus_Accumbens_R': [0.5, 0.3, 0.2],
      'Hypothalamus': [0, -0.3, 0.5],
      'Thalamus_L': [-0.8, 0, 0.8],
      'Thalamus_R': [0.8, 0, 0.8],
      'Caudate_L': [-0.6, 0.5, 0.6],
      'Caudate_R': [0.6, 0.5, 0.6],
      'Putamen_L': [-1.0, 0.3, 0.4],
      'Putamen_R': [1.0, 0.3, 0.4],
      'Cerebellum_L': [-1.5, -1.5, -0.5],
      'Cerebellum_R': [1.5, -1.5, -0.5],
    };

    return positions[region.code] || [hemisphereOffset * 0.5, 0, 0];
  }, [region.code, region.hemisphere]);

  return (
    <BrainMesh
      position={position}
      color={emotionData?.color || region.color}
      opacity={emotionData ? 0.9 : 0.6}
      emotionIntensity={emotionData?.intensity || 0}
      isSelected={isSelected}
      onClick={onClick}
      regionCode={region.code}
      regionName={region.name}
      showLabel={showLabel}
    />
  );
});

RegionSphere.displayName = 'RegionSphere';

// ============================================================================
// Brain Shell (Enveloppe du cerveau)
// ============================================================================

const BrainShell = memo<{ opacity: number; wireframe: boolean }>(({ opacity, wireframe }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Forme de cerveau simplifiée */}
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        color="#E8E0F0"
        transparent
        opacity={opacity * 0.3}
        wireframe={wireframe}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0}
      />
    </mesh>
  );
});

BrainShell.displayName = 'BrainShell';

// ============================================================================
// Camera Controller
// ============================================================================

const CameraController = memo<{ viewMode: string }>(({ viewMode }) => {
  const { camera } = useThree();
  
  React.useEffect(() => {
    const positions: Record<string, [number, number, number]> = {
      axial: [0, 8, 0],
      sagittal: [8, 0, 0],
      coronal: [0, 0, 8],
      '3d': [5, 3, 5],
    };
    
    const pos = positions[viewMode] || positions['3d'];
    camera.position.set(...pos);
    camera.lookAt(0, 0, 0);
  }, [viewMode, camera]);

  return null;
});

CameraController.displayName = 'CameraController';

// ============================================================================
// Loading Fallback
// ============================================================================

const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span className="text-sm text-muted-foreground">Chargement du cerveau 3D...</span>
    </div>
  </Html>
);

// ============================================================================
// Main Component
// ============================================================================

export const BrainViewer3D: React.FC<BrainViewer3DProps> = ({
  scan,
  regions = [],
  emotionOverlay,
  selectedRegion,
  onRegionSelect,
  viewMode = '3d',
  showLabels = true,
  opacity = 0.85,
  wireframe = false,
  isLoading = false,
}) => {
  // Mapper les émotions aux régions AAL
  const regionEmotionMap = useMemo(() => {
    const map = new Map<string, { intensity: number; color: string }>();
    
    if (emotionOverlay) {
      Object.entries(emotionOverlay).forEach(([emotion, data]) => {
        if (data) {
          const mapping = EMOTION_BRAIN_MAPPING[emotion];
          if (mapping) {
            mapping.regions.forEach((regionName) => {
              // Trouver les régions AAL correspondantes
              AAL_REGIONS.forEach((aalRegion) => {
                if (aalRegion.name.includes(regionName) || aalRegion.code.includes(regionName)) {
                  const existing = map.get(aalRegion.code);
                  if (!existing || existing.intensity < data.intensity) {
                    map.set(aalRegion.code, {
                      intensity: data.intensity,
                      color: data.color,
                    });
                  }
                }
              });
            });
          }
        }
      });
    }
    
    return map;
  }, [emotionOverlay]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-64 h-64 rounded-full" />
          <span className="text-muted-foreground">Chargement du scan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-muted/20 rounded-lg overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Éclairage */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-10, -10, -10]} intensity={0.3} />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#8B5CF6" />
          
          {/* Caméra et contrôles */}
          <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={3}
            maxDistance={15}
            autoRotate={viewMode === '3d'}
            autoRotateSpeed={0.5}
          />
          <CameraController viewMode={viewMode} />
          
          {/* Environnement */}
          <Environment preset="studio" />
          
          {/* Enveloppe du cerveau */}
          <BrainShell opacity={opacity} wireframe={wireframe} />
          
          {/* Régions AAL */}
          {AAL_REGIONS.map((region) => (
            <RegionSphere
              key={region.code}
              region={region}
              emotionData={regionEmotionMap.get(region.code)}
              isSelected={selectedRegion === region.code}
              onClick={() => onRegionSelect?.(
                selectedRegion === region.code ? null : region.code
              )}
              showLabel={showLabels}
            />
          ))}
          
          {/* Grille de référence */}
          <gridHelper args={[10, 10, '#444444', '#222222']} position={[0, -3, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BrainViewer3D;
