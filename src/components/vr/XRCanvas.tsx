import React from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { useVRBreathStore } from '@/store/vrbreath.store';

interface XRCanvasProps {
  children: React.ReactNode;
}

const store = createXRStore();

export const XRCanvas: React.FC<XRCanvasProps> = ({ children }) => {
  const { inXR } = useVRBreathStore();

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ 
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true 
      }}
    >
      <XR store={store}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        {children}
      </XR>
    </Canvas>
  );
};

export default XRCanvas;