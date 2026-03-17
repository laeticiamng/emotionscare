/**
 * Wrapper Canvas 3D réutilisable — fog, tone mapping, vignette overlay
 * Now uses unified visual direction system
 */

import React, { type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { cn } from '@/lib/utils';
import { getGLConfig, getDPR } from './visualDirection';

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
  height = 'h-[300px] sm:h-[400px] md:h-[500px]',
  fogColor = '#0a0a1a',
  fogNear = 6,
  fogFar = 18,
  className,
  cameraPosition = [0, 0, 5],
  fov = 50,
}) => (
  <div className={cn(`w-full ${height} rounded-2xl overflow-hidden relative`, className)}>
    {/* Radial vignette overlay — enhanced for depth */}
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, transparent 25%, hsl(var(--background)) 95%)',
      }}
    />

    <Canvas
      camera={{ position: cameraPosition, fov }}
      gl={getGLConfig()}
      style={{ background: 'transparent' }}
      dpr={getDPR()}
    >
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={0.1} />
      {children}
    </Canvas>
  </div>
);
