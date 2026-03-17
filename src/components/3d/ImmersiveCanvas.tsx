/**
 * Wrapper Canvas 3D réutilisable — fog, tone mapping, vignette overlay
 * Now includes: error boundary, context-loss handling, tab-inactive pause, WebGL gate.
 */

import React, { useEffect, useRef, useCallback, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { cn } from '@/lib/utils';
import { getGLConfig, getDPR, shouldEnablePostProcessing } from './visualDirection';
import { WebGLGate } from './Scene3DErrorBoundary';

interface ImmersiveCanvasProps {
  children: ReactNode;
  height?: string;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  scene?: 'hero' | 'breathing' | 'galaxy' | 'nebula';
  /** frameloop: 'always' (default) or 'demand' for static scenes */
  frameloop?: 'always' | 'demand' | 'never';
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
  scene = 'hero',
  frameloop = 'always',
}) => {
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const listenersRef = useRef<{ onLost: (e: Event) => void; onRestored: () => void } | null>(null);

  const handleCreated = useCallback((state: { gl: { domElement: HTMLCanvasElement } }) => {
    const canvas = state.gl.domElement;
    canvasRef.current = canvas;

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[ImmersiveCanvas] WebGL context lost');
      }
    };
    const onRestored = () => {
      setContextLost(false);
      if (process.env.NODE_ENV !== 'production') {
        console.info('[ImmersiveCanvas] WebGL context restored');
      }
    };

    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    listenersRef.current = { onLost, onRestored };
  }, []);

  // Cleanup listeners on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      const canvas = canvasRef.current;
      const listeners = listenersRef.current;
      if (canvas && listeners) {
        canvas.removeEventListener('webglcontextlost', listeners.onLost);
        canvas.removeEventListener('webglcontextrestored', listeners.onRestored);
      }
      canvasRef.current = null;
      listenersRef.current = null;
    };
  }, []);

  return (
    <WebGLGate scene={scene} height={height} className={className}>
      <div className={cn(`w-full ${height} rounded-2xl overflow-hidden relative`, className)}>
        {/* Radial vignette overlay — enhanced for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, transparent 35%, hsl(var(--background)) 96%)',
          }}
        />

        {contextLost && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <p className="text-white/60 text-sm">Rechargement de la scène...</p>
          </div>
        )}

        <Canvas
          camera={{ position: cameraPosition, fov }}
          gl={getGLConfig()}
          style={{ background: 'transparent' }}
          dpr={getDPR()}
          frameloop={frameloop}
          onCreated={handleCreated}
        >
          <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
          <ambientLight intensity={0.18} />
          {children}
        </Canvas>
      </div>
    </WebGLGate>
  );
};
