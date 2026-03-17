/**
 * Scène 3D immersive complète pour la respiration
 * Starfield, brouillard, éclairage dynamique et particules
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { BreathingSphere } from './BreathingSphere';
import { BreathingParticles } from './BreathingParticles';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';
import { InteractiveParticles } from '@/components/3d/InteractiveParticles';
import type { BreathingPhase } from '../types';

interface BreathingSceneProps {
  phase: BreathingPhase;
  progress: number;
  fullscreen?: boolean;
}

/** Dynamic lights that shift color with the breathing phase */
const DynamicLights = ({ phase, progress }: { phase: BreathingPhase; progress: number }) => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  const phaseColors: Record<BreathingPhase, THREE.Color> = {
    inhale: new THREE.Color('#4f9eff'),
    hold: new THREE.Color('#a78bfa'),
    exhale: new THREE.Color('#34d399'),
    rest: new THREE.Color('#fbbf24'),
  };

  const color1 = useRef(new THREE.Color('#4f9eff'));
  const color2 = useRef(new THREE.Color('#a78bfa'));

  useFrame((state) => {
    const target = phaseColors[phase];
    color1.current.lerp(target, 0.03);

    const complementary = target.clone();
    complementary.offsetHSL(0.15, 0, -0.1);
    color2.current.lerp(complementary, 0.03);

    if (light1Ref.current) {
      light1Ref.current.color.copy(color1.current);
      light1Ref.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
      light1Ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 6;
      light1Ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 4;
    }

    if (light2Ref.current) {
      light2Ref.current.color.copy(color2.current);
      light2Ref.current.intensity = 1.5 + Math.cos(state.clock.elapsedTime * 1.2) * 0.4;
      light2Ref.current.position.x = Math.cos(state.clock.elapsedTime * 0.25) * -5;
      light2Ref.current.position.z = Math.sin(state.clock.elapsedTime * 0.15) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[5, 5, 5]} intensity={2} distance={20} />
      <pointLight ref={light2Ref} position={[-5, -3, 3]} intensity={1.5} distance={20} />
    </>
  );
};

/** Camera that subtly breathes with the user */
const BreathingCamera = ({ phase, progress }: { phase: BreathingPhase; progress: number }) => {
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const normalizedProgress = progress / 100;

    const breathOffset = phase === 'inhale'
      ? normalizedProgress * 0.3
      : phase === 'exhale'
        ? -normalizedProgress * 0.3
        : 0;

    state.camera.position.z = 5 + breathOffset + Math.sin(time * 0.5) * 0.1;
    state.camera.position.y = Math.sin(time * 0.3) * 0.15;
  });

  return null;
};

export const BreathingScene = ({ phase, progress, fullscreen = false }: BreathingSceneProps) => {
  const height = fullscreen ? 'h-[600px]' : 'h-[500px]';

  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden relative`}>
      {/* CSS glow overlay for extra bloom effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 30%, hsl(var(--background)) 100%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: 'transparent' }}
      >
        {/* Atmospheric fog */}
        <fog attach="fog" args={['#0a0a1a', 6, 18]} />

        {/* Ambient base light */}
        <ambientLight intensity={0.15} />

        {/* Dynamic phase-reactive lights */}
        <DynamicLights phase={phase} progress={progress} />

        {/* Starfield background */}
        <Stars
          radius={80}
          depth={60}
          count={1500}
          factor={3}
          saturation={0.5}
          fade
          speed={0.5}
        />

        {/* Main breathing orb */}
        <BreathingSphere phase={phase} progress={progress} />

        {/* Particle field */}
        <BreathingParticles phase={phase} progress={progress} count={250} />

        {/* Interactive cursor-reactive particles */}
        <InteractiveParticles count={150} radius={4} color="#a78bfa" repelStrength={0.6} repelRadius={1.8} />

        {/* Breathing camera movement */}
        <BreathingCamera phase={phase} progress={progress} />

        {/* Orbit controls (restricted) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI * 0.65}
          minPolarAngle={Math.PI * 0.35}
        />

        {/* HDR Bloom + Vignette */}
        <ImmersivePostProcessing
          bloomIntensity={1.5}
          bloomThreshold={0.2}
          bloomRadius={0.8}
          vignetteDarkness={0.6}
        />
      </Canvas>
    </div>
  );
};
