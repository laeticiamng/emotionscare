// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Avatar3DPreviewProps {
  emoji: string;
  isUnlocked: boolean;
  isNew?: boolean;
  size?: number;
}

// Particle system component
const Particles = ({ count = 50, isNew }: { count?: number; isNew?: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || !isNew) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      const dummy = new THREE.Object3D();
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhongMaterial color="#ffcc00" />
    </instancedMesh>
  );
};

// Avatar mesh component
const AvatarMesh = ({ emoji, isUnlocked, isNew }: { emoji: string; isUnlocked: boolean; isNew?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Subtle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    
    // Auto-rotation if new
    if (isNew && meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main avatar sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        {isUnlocked ? (
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        ) : (
          <meshStandardMaterial color="#999999" opacity={0.5} transparent />
        )}
      </mesh>

      {/* Emoji as 3D text */}
      {isUnlocked && (
        <Text
          position={[0, 0, 1.6]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {emoji}
        </Text>
      )}

      {/* Lock icon for locked avatars */}
      {!isUnlocked && (
        <Text
          position={[0, 0, 1.6]}
          fontSize={1.2}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          🔒
        </Text>
      )}

      {/* Particles for unlocked/new avatars */}
      {isUnlocked && <Particles count={isNew ? 100 : 30} isNew={isNew} />}
    </group>
  );
};

// Main component
export const Avatar3DPreview: React.FC<Avatar3DPreviewProps> = ({
  emoji,
  isUnlocked,
  isNew = false,
  size = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: size, height: size }}
      className="rounded-xl overflow-hidden bg-gradient-to-br from-background to-primary/10"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          color="#ec4899"
        />

        {/* Avatar */}
        <AvatarMesh emoji={emoji} isUnlocked={isUnlocked} isNew={isNew} />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isNew}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Badge overlay for new items */}
      {isNew && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          NOUVEAU !
        </motion.div>
      )}
    </motion.div>
  );
};
