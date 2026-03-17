/**
 * Galaxy 3D Scene — Unified visual direction
 * Intention: Exploration / Discovery / Majesty
 * Enhanced: deeper volume, majestic fly-through, dust lanes, core luminosity
 * Includes: WebGL gate, error boundary, graceful degradation, tab-inactive pause
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from '@/components/3d/ImmersiveCanvas';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';
import { CosmicParticleField } from '@/components/3d/CosmicParticleField';
import { InteractiveParticles } from '@/components/3d/InteractiveParticles';
import {
  PALETTE,
  FOG,
  POST_PROCESSING,
  CAMERA,
  getParticleCount,
  getStarsCount,
  prefersReducedMotion,
  shouldEnablePostProcessing,
  isTabVisible,
} from '@/components/3d/visualDirection';

/* ── Spiral galaxy core — 4 arms, Fibonacci distribution ───── */

const ARMS = 4;

const SpiralGalaxy = ({ starCount }: { starCount: number }) => {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color('#6cb4ee'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#f9a8d4'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#c4b5fd'),
    ];

    for (let i = 0; i < starCount; i++) {
      const arm = i % ARMS;
      const baseAngle = (arm / ARMS) * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.55) * 9;
      const spiralAngle = baseAngle + dist * 0.75;
      const scatter = (1 - dist / 11) * 0.9;

      pos[i * 3] = Math.cos(spiralAngle) * dist + (Math.random() - 0.5) * scatter;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25 * (1 + scatter * 0.5);
      pos[i * 3 + 2] = Math.sin(spiralAngle) * dist + (Math.random() - 0.5) * scatter;

      const c = palette[Math.floor(Math.random() * palette.length)];
      const warmth = 1 - dist / 10;
      col[i * 3] = c.r + warmth * 0.2;
      col[i * 3 + 1] = c.g + warmth * 0.1;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [starCount]);

  useFrame(({ clock }) => {
    if (!starsRef.current || !isTabVisible()) return;
    starsRef.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={starCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={starCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

/* ── Dust lanes (volumetric planes for depth) ────────────────── */

const DUST_COUNT = 30;

const DustLane = ({ position, color, scale, index }: {
  position: [number, number, number];
  color: string;
  scale: number;
  index: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !isTabVisible()) return;
    const t = clock.elapsedTime;
    ref.current.rotation.z = t * 0.012 + index * 0.5;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.05 + Math.sin(t * 0.25 + index * 0.8) * 0.02;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} rotation={[Math.PI * 0.5, 0, index * 0.7]}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const DustLanes = () => {
  const clouds = useMemo(() => {
    const c: { position: [number, number, number]; color: string; scale: number; index: number }[] = [];
    const palette = [PALETTE.primary, PALETTE.secondary, PALETTE.warm, PALETTE.accent];
    for (let i = 0; i < DUST_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.8 + Math.random() * 7;
      c.push({
        position: [
          Math.cos(angle) * dist,
          (Math.random() - 0.5) * 1.2,
          Math.sin(angle) * dist,
        ],
        color: palette[i % palette.length],
        scale: 1.5 + Math.random() * 3,
        index: i,
      });
    }
    return c;
  }, []);

  return (
    <>
      {clouds.map((cl) => (
        <DustLane key={cl.index} {...cl} />
      ))}
    </>
  );
};

/* ── Galaxy core — multi-layered glow with MeshPhysicalMaterial ── */

const GalaxyCore = () => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!isTabVisible()) return;
    const t = clock.elapsedTime;
    if (outerRef.current) {
      const mat = outerRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 0.6) * 0.3;
      outerRef.current.scale.setScalar(1 + Math.sin(t * 0.4) * 0.04);
      outerRef.current.rotation.y = t * 0.05;
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.5 + Math.sin(t * 1.0) * 0.5;
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(2.5 + Math.sin(t * 0.3) * 0.2);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 0.4) * 0.015;
    }
  });

  return (
    <group>
      {/* Atmospheric halo — depth and majesty */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={PALETTE.gold}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer shell — translucent physical material */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color="#fde68a"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
          transparent
          opacity={0.35}
          roughness={0.15}
          transmission={0.3}
          thickness={0.3}
          clearcoat={0.8}
        />
      </mesh>
      {/* Inner bright core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fde68a"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

/* ── Majestic fly-through camera ─────────────────────────────── */

const FlyCamera = () => {
  useFrame(({ camera, clock }) => {
    if (!isTabVisible()) return;
    const t = clock.elapsedTime;
    const r = 11 + Math.sin(t * 0.035) * 2;
    const orbitalSpeed = 0.025;
    camera.position.x = Math.cos(t * orbitalSpeed) * r;
    camera.position.z = Math.sin(t * orbitalSpeed) * r;
    camera.position.y = 3.5 + Math.sin(t * 0.05) * 1.8;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

/* ── Dynamic lights ──────────────────────────────────────────── */

const GalaxyLights = () => {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);
  const l3 = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!isTabVisible()) return;
    const t = clock.elapsedTime;
    if (l1.current) {
      l1.current.position.set(Math.sin(t * 0.12) * 6, 3, Math.cos(t * 0.12) * 6);
      l1.current.intensity = 1.8 + Math.sin(t * 0.5) * 0.3;
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.1) * -5, -2, Math.sin(t * 0.1) * 5);
      l2.current.intensity = 1.3 + Math.cos(t * 0.4) * 0.25;
    }
    if (l3.current) {
      l3.current.intensity = 1.0 + Math.sin(t * 0.6) * 0.2;
    }
  });

  return (
    <>
      <pointLight ref={l1} color="#6cb4ee" intensity={1.8} distance={28} />
      <pointLight ref={l2} color={PALETTE.accent} intensity={1.3} distance={22} />
      <pointLight ref={l3} position={[0, 0.5, 0]} color={PALETTE.gold} intensity={1.0} distance={14} />
    </>
  );
};

/* ── Exported scene ──────────────────────────────────────────── */

interface GalaxyScene3DProps {
  height?: string;
  className?: string;
}

const GalaxyReducedMotionFallback = ({ height, className }: { height: string; className?: string }) => (
  <div
    className={`w-full ${height} rounded-2xl overflow-hidden relative ${className || ''}`}
    style={{
      background: `radial-gradient(ellipse at 50% 50%, ${PALETTE.primary}20 0%, transparent 50%),
                   radial-gradient(ellipse at 30% 40%, ${PALETTE.accent}15 0%, transparent 40%),
                   radial-gradient(ellipse at 70% 60%, ${PALETTE.gold}10 0%, transparent 35%),
                   ${PALETTE.deepSpace}`,
    }}
    role="img"
    aria-label="Exploration galaxie"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-4 h-4 rounded-full"
        style={{ background: `radial-gradient(circle, ${PALETTE.gold}, ${PALETTE.primary})`, boxShadow: `0 0 40px ${PALETTE.gold}40` }}
      />
    </div>
  </div>
);

export const GalaxyScene3D = ({ height = 'h-[500px]', className }: GalaxyScene3DProps) => {
  if (prefersReducedMotion()) {
    return <GalaxyReducedMotionFallback height={height} className={className} />;
  }

  const fog = FOG.galaxy;
  const cam = CAMERA.galaxy;
  const pp = POST_PROCESSING.galaxy;
  const starCount = getParticleCount('galaxy');
  const interactiveCount = getParticleCount('interactive');
  const bgStarsCount = getStarsCount('galaxy');
  const ppEnabled = shouldEnablePostProcessing();

  return (
    <ImmersiveCanvas
      height={height}
      fogColor={fog.color}
      fogNear={fog.near}
      fogFar={fog.far}
      cameraPosition={cam.position}
      fov={cam.fov}
      className={className}
      scene="galaxy"
    >
      <GalaxyLights />

      {/* Deep starfield background */}
      <Stars radius={120} depth={90} count={bgStarsCount} factor={4} saturation={0.5} fade speed={0.15} />

      {/* Galaxy structure */}
      <SpiralGalaxy starCount={starCount} />
      <DustLanes />
      <GalaxyCore />

      {/* Ambient cosmic particles */}
      <CosmicParticleField count={280} radius={12} color={PALETTE.accent} size={0.03} speed={0.006} />
      <InteractiveParticles count={interactiveCount} radius={9} color="#6cb4ee" repelStrength={0.35} repelRadius={2} />

      {/* Cinematic camera */}
      <FlyCamera />

      {/* Post-processing — gracefully degrades */}
      <ImmersivePostProcessing
        bloomIntensity={pp.bloomIntensity}
        bloomThreshold={pp.bloomThreshold}
        bloomRadius={pp.bloomRadius}
        vignetteOffset={pp.vignetteOffset}
        vignetteDarkness={pp.vignetteDarkness}
        chromaticAberration={pp.chromaticAberration}
        chromaticOffset={pp.chromaticOffset}
        enabled={ppEnabled}
      />
    </ImmersiveCanvas>
  );
};
