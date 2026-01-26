import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MusicTrack } from '@/types/music';
import * as THREE from 'three';

interface AnimatedSphereProps {
  isPlaying: boolean;
  audioData: number[];
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ isPlaying, audioData }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate audio-reactive values
  const bassLevel = audioData.slice(0, 4).reduce((a, b) => a + b, 0) / 4 / 255;
  const midLevel = audioData.slice(4, 12).reduce((a, b) => a + b, 0) / 8 / 255;
  const highLevel = audioData.slice(12, 20).reduce((a, b) => a + b, 0) / 8 / 255;

  useFrame((state) => {
    if (meshRef.current) {
      if (isPlaying) {
        // Audio-reactive rotation
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.5 + bassLevel * 0.5;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + midLevel * 0.3;
        
        // Audio-reactive scale based on bass
        const targetScale = 1 + bassLevel * 0.4;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      } else {
        // Slow idle animation
        meshRef.current.rotation.x += 0.002;
        meshRef.current.rotation.y += 0.001;
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    }
  });

  // Dynamic color based on audio
  const hue = 0.65 + highLevel * 0.2; // Purple to blue range
  const color = new THREE.Color().setHSL(hue, 0.7, 0.5 + midLevel * 0.2);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.6 + bassLevel * 0.3}
      />
    </mesh>
  );
};

interface FloatingElementsProps {
  isPlaying: boolean;
  audioData: number[];
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ isPlaying, audioData }) => {
  const positions = useRef<Array<[number, number, number]>>([]);
  const colors = useRef<string[]>([]);
  const count = 16;
  
  // Generate random positions and colors once
  useEffect(() => {
    positions.current = Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6
    ] as [number, number, number]);
    
    colors.current = Array.from({ length: count }, () => 
      `hsl(${Math.random() * 60 + 220}, 70%, 60%)`
    );
  }, []);

  return (
    <>
      {positions.current.map((pos, i) => (
        <FloatingBox 
          key={i} 
          position={pos}
          isPlaying={isPlaying}
          audioLevel={audioData[i % audioData.length] / 255}
          color={colors.current[i]}
          index={i}
        />
      ))}
    </>
  );
};

interface FloatingBoxProps {
  position: [number, number, number];
  isPlaying: boolean;
  audioLevel: number;
  color: string;
  index: number;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({ position, isPlaying, audioLevel, color, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isPlaying) {
        // Audio-reactive rotation
        meshRef.current.rotation.x += 0.01 + audioLevel * 0.03;
        meshRef.current.rotation.y += 0.02 + audioLevel * 0.02;
        
        // Audio-reactive floating
        const baseY = position[1];
        const offset = index * 0.5;
        meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2 + offset) * (0.3 + audioLevel * 0.5);
        
        // Audio-reactive scale
        const scale = 0.15 + audioLevel * 0.15;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.rotation.x += 0.002;
        meshRef.current.rotation.y += 0.003;
        meshRef.current.scale.setScalar(0.15);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.4 + audioLevel * 0.4}
      />
    </mesh>
  );
};

const TorusBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <torusGeometry args={[3, 0.1, 16, 100]} />
      <meshStandardMaterial 
        color="#8b5cf6" 
        wireframe 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
};

interface SceneProps {
  isPlaying: boolean;
  audioData: number[];
}

const Scene: React.FC<SceneProps> = ({ isPlaying, audioData }) => {
  const bassLevel = audioData.slice(0, 4).reduce((a, b) => a + b, 0) / 4 / 255;
  
  return (
    <>
      <ambientLight intensity={0.2 + bassLevel * 0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.3 + bassLevel * 0.5} 
        color="#ff6b6b" 
      />
      <pointLight 
        position={[10, -10, 5]} 
        intensity={0.3 + bassLevel * 0.3} 
        color="#4ecdc4" 
      />
      
      <AnimatedSphere isPlaying={isPlaying} audioData={audioData} />
      <FloatingElements isPlaying={isPlaying} audioData={audioData} />
      <TorusBackground />
    </>
  );
};

const LoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <div className="text-white text-center">
      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
      <p className="text-sm">Chargement de la visualisation 3D...</p>
    </div>
  </div>
);

const ErrorFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <div className="text-white text-center">
      <p className="text-sm">Visualisation 3D non disponible</p>
      <p className="text-xs opacity-60 mt-1">Mode audio seulement</p>
    </div>
  </div>
);

interface ThreeDVisualizerProps {
  isPlaying: boolean;
  track?: MusicTrack | null;
  fullscreen?: boolean;
  audioData?: number[];
}

const ThreeDVisualizer: React.FC<ThreeDVisualizerProps> = ({
  isPlaying,
  track,
  audioData = []
}) => {
  const [hasError, setHasError] = useState(false);
  const [simulatedData, setSimulatedData] = useState<number[]>(new Array(32).fill(0));

  // Generate simulated audio data when real data not available
  useEffect(() => {
    if (audioData.length > 0) return;
    
    if (!isPlaying) {
      setSimulatedData(new Array(32).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setSimulatedData(prev => prev.map((_, i) => {
        const base = Math.sin(Date.now() * 0.003 + i * 0.5) * 0.5 + 0.5;
        const variation = Math.random() * 0.3;
        return Math.floor((base + variation) * 200);
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, audioData.length]);

  const effectiveAudioData = audioData.length > 0 ? audioData : simulatedData;

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          onError={() => setHasError(true)}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Scene isPlaying={isPlaying} audioData={Array.from(effectiveAudioData)} />
        </Canvas>
      </Suspense>
      
      {/* Overlay d'informations */}
      {track && (
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-60">Visualisation 3D</p>
          <p className="text-xs opacity-40">
            {track.emotion && `Ambiance: ${track.emotion}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreeDVisualizer;
