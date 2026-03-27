// @ts-nocheck
/**
 * Scène 3D immersive pour la respiration — unified visual direction
 * Intention: Calm / Centering / Rhythm
 * Enhanced: light-driven phase reading, deeper atmosphere, cinematic camera
 * Includes: WebGL gate, error boundary, graceful postprocessing degradation
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { BreathingSphere } from './BreathingSphere';
import { BreathingParticles } from './BreathingParticles';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';
import { InteractiveParticles } from '@/components/3d/InteractiveParticles';
import { WebGLGate } from '@/components/3d/Scene3DErrorBoundary';
import {
  PALETTE,
  CAMERA,
  MOTION,
  getGLConfig,
  getDPR,
  getParticleCount,
  getStarsCount,
  prefersReducedMotion,
  shouldEnablePostProcessing,
  isTabVisible,
  getAdaptiveFog,
} from '@/components/3d/visualDirection';
import type { BreathingPhase } from '../types';

interface BreathingSceneProps {
  phase: BreathingPhase;
  progress: number;
  fullscreen?: boolean;
}

/** Dynamic lights that shift color AND intensity with the breathing phase */
const DynamicLights = ({ phase, progress }: { phase: BreathingPhase; progress: number }) => {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);

  const phaseColors = useMemo(() => ({
    inhale: new THREE.Color(PALETTE.breathing.inhale),
    hold: new THREE.Color(PALETTE.breathing.hold),
    exhale: new THREE.Color(PALETTE.breathing.exhale),
    rest: new THREE.Color(PALETTE.breathing.rest),
  }), []);

  const color1 = useRef(new THREE.Color(PALETTE.breathing.inhale));
  const color2 = useRef(new THREE.Color(PALETTE.breathing.hold));
  const complementaryTemp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!isTabVisible()) return;
    const t = state.clock.elapsedTime;
    const normalizedProgress = progress / 100;
    const target = phaseColors[phase];
    color1.current.lerp(target, 0.03);

    complementaryTemp.copy(target);
    complementaryTemp.offsetHSL(0.15, 0, -0.1);
    color2.current.lerp(complementaryTemp, 0.03);

    // Phase-driven intensity: calmer overall, clearer phase distinction
    const phaseIntensity = phase === 'inhale'
      ? 1.8 + normalizedProgress * 0.8
      : phase === 'hold'
        ? 2.4 + Math.sin(t * 2) * 0.2
        : phase === 'exhale'
          ? 2.4 - normalizedProgress * 0.8
          : 1.5 + Math.sin(t * 1.5) * 0.2;

    if (light1Ref.current) {
      light1Ref.current.color.copy(color1.current);
      light1Ref.current.intensity = phaseIntensity + Math.sin(t * 1.5) * 0.2;
      light1Ref.current.position.x = Math.sin(t * 0.2) * 5;
      light1Ref.current.position.y = Math.cos(t * 0.15) * 3.5;
    }

    if (light2Ref.current) {
      light2Ref.current.color.copy(color2.current);
      light2Ref.current.intensity = (phaseIntensity * 0.6) + Math.cos(t * 1.2) * 0.15;
      light2Ref.current.position.x = Math.cos(t * 0.18) * -4.5;
      light2Ref.current.position.z = Math.sin(t * 0.1) * 4;
    }

    // Rim light for depth
    if (light3Ref.current) {
      light3Ref.current.intensity = 0.4 + Math.sin(t * 0.35) * 0.15;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[5, 5, 5]} intensity={2} distance={22} />
      <pointLight ref={light2Ref} position={[-5, -3, 3]} intensity={1.2} distance={22} />
      <pointLight ref={light3Ref} position={[0, -4, -5]} color={PALETTE.primary} intensity={0.4} distance={15} />
    </>
  );
};

/** Atmospheric glow behind the orb — volumetric light simulation */
const BreathingAtmosphere = ({ phase, progress }: { phase: BreathingPhase; progress: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const colorRef = useRef(new THREE.Color(PALETTE.breathing.inhale));

  const phaseColors = useMemo(() => ({
    inhale: new THREE.Color(PALETTE.breathing.inhale),
    hold: new THREE.Color(PALETTE.breathing.hold),
    exhale: new THREE.Color(PALETTE.breathing.exhale),
    rest: new THREE.Color(PALETTE.breathing.rest),
  }), []);

  useFrame(({ clock }) => {
    if (!ref.current || !isTabVisible()) return;
    const t = clock.elapsedTime;
    const normalizedProgress = progress / 100;
    const breathScale = phase === 'inhale'
      ? 2.5 + normalizedProgress * 1.5
      : phase === 'hold'
        ? 4.0
        : phase === 'exhale'
          ? 4.0 - normalizedProgress * 1.5
          : 2.5;

    ref.current.scale.setScalar(breathScale);
    colorRef.current.lerp(phaseColors[phase], 0.03);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.color.copy(colorRef.current);
    mat.opacity = 0.05 + Math.sin(t * 0.5) * 0.015;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        color={PALETTE.breathing.inhale}
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

/** Cinematic camera that breathes with the user */
const BreathingCamera = ({ phase, progress }: { phase: BreathingPhase; progress: number }) => {
  useFrame((state) => {
    if (!isTabVisible()) return;
    const time = state.clock.elapsedTime;
    const normalizedProgress = progress / 100;

    const breathOffset = phase === 'inhale'
      ? MOTION.breathEase(normalizedProgress) * 0.35
      : phase === 'exhale'
        ? -MOTION.breathEase(normalizedProgress) * 0.35
        : phase === 'hold'
          ? Math.sin(time * 2) * 0.04
          : 0;

    state.camera.position.z = 5 + breathOffset + Math.sin(time * 0.35) * 0.06;
    state.camera.position.y = Math.sin(time * 0.2) * 0.1;
    state.camera.position.x = Math.cos(time * 0.15) * 0.06;
  });

  return null;
};

const BreathingReducedMotionFallback = ({ phase }: { phase: BreathingPhase }) => {
  const height = 'h-[300px] sm:h-[400px] md:h-[500px]';
  const colors: Record<BreathingPhase, string> = {
    inhale: PALETTE.breathing.inhale,
    hold: PALETTE.breathing.hold,
    exhale: PALETTE.breathing.exhale,
    rest: PALETTE.breathing.rest,
  };
  const color = colors[phase];
  return (
    <div
      className={`w-full ${height} rounded-2xl overflow-hidden relative flex items-center justify-center`}
      style={{ background: PALETTE.darkVoid }}
      role="img"
      aria-label={`Exercice de respiration - phase: ${phase}`}
    >
      <div
        className="w-24 h-24 rounded-full transition-all duration-[2000ms] ease-in-out"
        style={{
          background: `radial-gradient(circle, ${color}, transparent)`,
          boxShadow: `0 0 60px ${color}40`,
          transform: phase === 'inhale' || phase === 'hold' ? 'scale(1.5)' : 'scale(1)',
        }}
      />
    </div>
  );
};

export const BreathingScene = ({ phase, progress, fullscreen = false }: BreathingSceneProps) => {
  const height = fullscreen ? 'h-[400px] sm:h-[500px] md:h-[600px]' : 'h-[300px] sm:h-[400px] md:h-[500px]';

  if (prefersReducedMotion()) {
    return <BreathingReducedMotionFallback phase={phase} />;
  }

  const fog = getAdaptiveFog('breathing');
  const cam = CAMERA.breathing;
  const particleCount = getParticleCount('breathing');
  const interactiveCount = getParticleCount('interactive');
  const starsCount = getStarsCount('breathing');
  const ppEnabled = shouldEnablePostProcessing();

  return (
    <WebGLGate scene="breathing" height={height}>
      <div className={`w-full ${height} rounded-2xl overflow-hidden relative`}>
        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, hsl(var(--background)) 95%)',
          }}
        />

        <Canvas
          camera={{ position: cam.position, fov: cam.fov }}
          gl={getGLConfig()}
          style={{ background: 'transparent' }}
          dpr={getDPR()}
        >
          <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
          <ambientLight intensity={0.18} />

          <DynamicLights phase={phase} progress={progress} />

          {/* Deep starfield */}
          <Stars radius={90} depth={70} count={starsCount} factor={3} saturation={0.4} fade speed={0.2} />

          {/* Volumetric atmosphere behind orb */}
          <BreathingAtmosphere phase={phase} progress={progress} />

          {/* Main organic breathing orb */}
          <BreathingSphere phase={phase} progress={progress} />

          {/* Breathing-reactive particle field */}
          <BreathingParticles phase={phase} progress={progress} count={particleCount} />

          {/* Interactive cursor-reactive particles */}
          <InteractiveParticles count={interactiveCount} radius={4} color={PALETTE.accent} repelStrength={0.5} repelRadius={1.5} />

          {/* Cinematic breathing camera */}
          <BreathingCamera phase={phase} progress={progress} />

          {/* Post-processing — scene-adaptive, gracefully degrades */}
          <ImmersivePostProcessing scene="breathing" enabled={ppEnabled} />
        </Canvas>
      </div>
    </WebGLGate>
  );
};
