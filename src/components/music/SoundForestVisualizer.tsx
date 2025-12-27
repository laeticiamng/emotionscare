/**
 * Sound Forest 3D Visualizer for Music Therapy
 * Audio-reactive 3D forest with trees that sway and glow to music
 */

import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import * as THREE from 'three';

interface TreeProps {
  position: [number, number, number];
  audioLevel?: number; // 0-1
  index: number;
  totalTrees: number;
}

const Tree: React.FC<TreeProps> = ({ position, audioLevel = 0, index, totalTrees }) => {
  const trunkRef = useRef<THREE.Mesh>(null);
  const canopyRef = useRef<THREE.Mesh>(null);
  const [swayPhase] = useState(() => Math.random() * Math.PI * 2);
  const [baseColor] = useState(() => {
    const hue = 90 + (index / totalTrees) * 60; // Green to cyan spectrum
    return new THREE.Color(`hsl(${hue}, 70%, 50%)`);
  });

  useFrame((state) => {
    if (!trunkRef.current || !canopyRef.current) return;

    const time = state.clock.elapsedTime;

    // Natural sway motion
    const sway = Math.sin(time * 0.8 + swayPhase) * 0.05;
    const audioSway = audioLevel * 0.1;

    trunkRef.current.rotation.z = sway + audioSway;
    canopyRef.current.rotation.z = sway * 1.5 + audioSway * 1.2;

    // Audio-reactive scale
    const scale = 1 + audioLevel * 0.2;
    canopyRef.current.scale.setScalar(scale);

    // Audio-reactive glow
    const emissiveIntensity = audioLevel * 0.5;
    if (canopyRef.current.material) {
      (canopyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
    }

    // Subtle floating
    const float = Math.sin(time * 0.5 + swayPhase) * 0.1;
    canopyRef.current.position.y = 1.5 + float;
  });

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#4a3520" roughness={0.8} />
      </mesh>

      {/* Canopy */}
      <mesh ref={canopyRef} position={[0, 1.5, 0]}>
        <coneGeometry args={[0.6, 1.2, 8]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.2}
          roughness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Fireflies/particles around tree */}
      {audioLevel > 0.3 && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={audioLevel * 0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};

interface SoundWavesProps {
  audioLevel: number;
}

const SoundWaves: React.FC<SoundWavesProps> = ({ audioLevel }) => {
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!waveRef.current) return;

    const time = state.clock.elapsedTime;

    // Animate the wave geometry
    const positions = (waveRef.current.geometry as THREE.PlaneGeometry).attributes.position;
    const array = positions.array as Float32Array;

    for (let i = 0; i < positions.count; i++) {
      const x = array[i * 3];
      const y = array[i * 3 + 1];

      const wave1 = Math.sin(x * 2 + time) * 0.1;
      const wave2 = Math.sin(y * 2 + time * 1.3) * 0.1;
      const audioWave = Math.sin(x * 3 + time * 2) * audioLevel * 0.3;

      array[i * 3 + 2] = wave1 + wave2 + audioWave;
    }

    positions.needsUpdate = true;
  });

  return (
    <mesh ref={waveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshStandardMaterial
        color="#1a4d2e"
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

interface ForestSceneProps {
  audioLevel: number;
  isPlaying: boolean;
}

const ForestScene: React.FC<ForestSceneProps> = ({ audioLevel, isPlaying }) => {
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const gridSize = 4;

    for (let x = -gridSize; x <= gridSize; x += 1.5) {
      for (let z = -gridSize; z <= gridSize; z += 1.5) {
        // Add some randomness
        const offsetX = (Math.random() - 0.5) * 0.5;
        const offsetZ = (Math.random() - 0.5) * 0.5;
        positions.push([x + offsetX, 0, z + offsetZ]);
      }
    }

    return positions;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} castShadow />
      <pointLight position={[0, 5, 0]} intensity={audioLevel * 2} color="#90ee90" />

      {/* Moon/sun */}
      <mesh position={[-8, 8, -8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
      </mesh>

      {/* Fog atmosphere */}
      <fog attach="fog" args={['#0a1f1f', 5, 15]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.9} />
      </mesh>

      {/* Sound waves on ground */}
      <SoundWaves audioLevel={isPlaying ? audioLevel : 0} />

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree
          key={i}
          position={pos}
          audioLevel={isPlaying ? audioLevel : 0}
          index={i}
          totalTrees={treePositions.length}
        />
      ))}

      {/* Floating particles */}
      {isPlaying &&
        Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} audioLevel={audioLevel} index={i} />
        ))}
    </>
  );
};

interface ParticleProps {
  audioLevel: number;
  index: number;
}

const Particle: React.FC<ParticleProps> = ({ audioLevel, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [initialPos] = useState(() => ({
    x: (Math.random() - 0.5) * 10,
    y: Math.random() * 5,
    z: (Math.random() - 0.5) * 10,
  }));

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const offset = index * 0.5;

    meshRef.current.position.x = initialPos.x + Math.sin(time * 0.5 + offset) * 2;
    meshRef.current.position.y = initialPos.y + Math.sin(time * 0.7 + offset) * 1;
    meshRef.current.position.z = initialPos.z + Math.cos(time * 0.5 + offset) * 2;

    // Audio-reactive brightness
    const scale = 0.05 + audioLevel * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#90ee90" transparent opacity={0.6} />
    </mesh>
  );
};

interface SoundForestVisualizerProps {
  isPlaying: boolean;
  audioLevel?: number; // 0-1, from actual audio analysis
  className?: string;
}

export const SoundForestVisualizer: React.FC<SoundForestVisualizerProps> = ({
  isPlaying,
  audioLevel = 0.5,
  className = '',
}) => {
  const { prefersReducedMotion } = useMotionPrefs();
  const [simulatedAudioLevel, setSimulatedAudioLevel] = useState(0.5);

  // Simulate audio level changes if not provided
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSimulatedAudioLevel(0.3 + Math.random() * 0.5);
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const effectiveAudioLevel = audioLevel || simulatedAudioLevel;

  // Static forest for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 relative ${className}`}
        aria-label="Forêt sonore (mode réduit)"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-emerald-300/60 space-y-2">
            <div className="text-6xl">🌲</div>
            <p className="text-sm">Forêt sonore</p>
            {isPlaying && <p className="text-xs opacity-60">En lecture...</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 relative ${className}`}
      aria-label="Forêt sonore 3D"
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-emerald-300/60 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Chargement de la forêt sonore...</p>
            </div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 3, 8], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ForestScene audioLevel={effectiveAudioLevel} isPlaying={isPlaying} />
        </Canvas>
      </Suspense>

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 text-emerald-300/80 text-xs space-y-1">
        <p className="font-medium">Forêt sonore 3D</p>
        {isPlaying && <p className="opacity-60">Les arbres dansent avec la musique...</p>}
      </div>

      {/* Audio level indicator */}
      {isPlaying && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-xs text-emerald-300/60">Niveau</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 rounded-full transition-all ${
                  i < effectiveAudioLevel * 5
                    ? 'bg-emerald-400'
                    : 'bg-emerald-900/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
