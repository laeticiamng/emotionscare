import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton } from '@react-three/xr';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';

interface XRCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export const XRCanvas: React.FC<XRCanvasProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`w-full h-screen relative ${className}`}>
      {/* VR Entry Button */}
      <div className="absolute top-4 right-4 z-10">
        <VRButton 
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Three.js Canvas with WebXR */}
      <Canvas
        camera={{
          position: [0, 1.6, 3], // Standard VR height (1.6m) + some distance
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          // Optimize renderer for VR
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.shadowMap.enabled = false; // Disable shadows for better performance
        }}
        className="w-full h-full"
      >
        {/* Performance optimizations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        {/* WebXR Provider */}
        <XR>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
};