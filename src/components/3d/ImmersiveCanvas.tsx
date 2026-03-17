/**
 * Wrapper Canvas 3D réutilisable — fog, tone mapping, CSS bloom overlay
 */

import React, { type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ImmersiveCanvasProps {
  children: ReactNode;
  height?: string;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export const ImmersiveCanvas: React.FC<ImmersiveCanvasProps> = ({
  children,
  height = 'h-[500px]',
  fogColor = '#0a0a1a',
  fogNear = 6,
  fogFar = 18,
  className,
  cameraPosition = [0, 0, 5],
  fov = 50,
}) => (
  <div className={cn(`w-full ${height} rounded-2xl overflow-hidden relative`, className)}>
    {/* Radial vignette overlay */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          'radial-gradient(circle at 50% 50%, transparent 30%, hsl(var(--background)) 100%)',
      }}
    />

    <Canvas
      camera={{ position: cameraPosition, fov }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={0.15} />
      {children}
    </Canvas>
  </div>
);
