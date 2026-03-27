// @ts-nocheck
/**
 * Premium Hero 3D Scene — Immersive background for the homepage hero
 *
 * Intention: Promise / Inspiration / Aspiration
 * Clean, premium atmosphere — not overwhelming. Supports product CTA readability.
 *
 * Architecture:
 *   Background layer — Deep starfield + volumetric fog glow
 *   Midground layer  — Interactive particle field (cursor-reactive)
 *   Foreground layer  — Soft floating orbs with parallax depth
 *
 * Includes: WebGL gate, error boundary, context-loss handling,
 * reduced-motion fallback, device-tier adaptation, tab-inactive pause.
 */

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersivePostProcessing } from './ImmersivePostProcessing';
import { WebGLGate } from './Scene3DErrorBoundary';
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
} from './visualDirection';

/* ── Background: Deep atmospheric glow spheres ───────────────── */

const AtmosphericGlow = () => {
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const ref3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!isTabVisible()) return;
    const t = clock.elapsedTime;
    if (ref1.current) {
      ref1.current.position.y = -1 + Math.sin(t * 0.12) * 0.5;
      (ref1.current.material as THREE.MeshBasicMaterial).opacity = 0.07 + Math.sin(t * 0.3) * 0.02;
    }
    if (ref2.current) {
      ref2.current.position.x = 2 + Math.cos(t * 0.1) * 0.4;
      (ref2.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(t * 0.25 + 1) * 0.02;
    }
    if (ref3.current) {
      ref3.current.position.y = 1.5 + Math.sin(t * 0.15 + 2) * 0.3;
      (ref3.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(t * 0.2 + 2) * 0.015;
    }
  });

  return (
    <>
      <mesh ref={ref1} position={[-3, -1, -8]}>
        <sphereGeometry args={[4, 24, 24]} />
        <meshBasicMaterial
          color={PALETTE.primary}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ref2} position={[2, 0.5, -10]}>
        <sphereGeometry args={[5, 24, 24]} />
        <meshBasicMaterial
          color={PALETTE.secondary}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ref3} position={[0, 1.5, -12]}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial
          color={PALETTE.warm}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

/* ── Midground: Interactive particles with cursor response ──── */

const HeroParticles = ({ count }: { count: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePos = useRef(new THREE.Vector3(9999, 9999, 0));
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseNDC = useRef(new THREE.Vector2(9999, 9999));

  useEffect(() => {
    const canvas = gl.domElement;
    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseNDC.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => mouseNDC.current.set(9999, 9999);

    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [gl]);

  const { basePositions, currentPositions, depths } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const current = new Float32Array(count * 3);
    const d = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) - 3;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      current[i * 3] = x;
      current[i * 3 + 1] = y;
      current[i * 3 + 2] = z;
      d[i] = Math.random();
    }
    return { basePositions: base, currentPositions: current, depths: d };
  }, [count]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const intersectPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !isTabVisible()) return;
    const t = clock.elapsedTime;

    raycaster.setFromCamera(mouseNDC.current, camera);
    raycaster.ray.intersectPlane(intersectPlane, mousePos.current);

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const depth = depths[i];
      const driftSpeed = 0.12 + depth * 0.08;
      const bx = basePositions[ix] + Math.sin(t * driftSpeed + i * 0.3) * 0.06;
      const by = basePositions[ix + 1] + Math.cos(t * driftSpeed * 0.8 + i * 0.2) * 0.06;
      const bz = basePositions[ix + 2] + Math.sin(t * 0.08 + i * 0.1) * 0.04;

      tempVec.set(bx, by, bz);
      const dist = tempVec.distanceTo(mousePos.current);
      let ax = 0, ay = 0;
      if (dist < 2.5 && dist > 0.001) {
        const force = (1 - dist / 2.5) * 0.25;
        const dx = mousePos.current.x - bx;
        const dy = mousePos.current.y - by;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        ax = (dx / len) * force;
        ay = (dy / len) * force;
      }

      const tx = bx + ax;
      const ty = by + ay;
      const tz = bz;
      currentPositions[ix] += (tx - currentPositions[ix]) * 0.05;
      currentPositions[ix + 1] += (ty - currentPositions[ix + 1]) * 0.05;
      currentPositions[ix + 2] += (tz - currentPositions[ix + 2]) * 0.05;

      posAttr.setXYZ(i, currentPositions[ix], currentPositions[ix + 1], currentPositions[ix + 2]);
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * MOTION.particleRotation.slow;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={currentPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.accent}
        size={0.04}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

/* ── Foreground: Soft luminous orbs with parallax ────────────── */

const LuminousOrb = ({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !isTabVisible()) return;
    const t = clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed) * 0.4;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.7) * 0.25;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.4 + Math.sin(t * speed * 1.5) * 0.15;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.12}
        roughness={0.2}
        metalness={0}
      />
    </mesh>
  );
};

const ForegroundOrbs = () => {
  const orbs = useMemo(
    () => [
      { position: [-3.5, 0.8, -1] as [number, number, number], color: PALETTE.primary, scale: 0.6, speed: 0.2 },
      { position: [3, -0.5, -2] as [number, number, number], color: PALETTE.secondary, scale: 0.8, speed: 0.17 },
      { position: [-1, 2, -3] as [number, number, number], color: PALETTE.warm, scale: 0.5, speed: 0.25 },
      { position: [2, -1.5, 0] as [number, number, number], color: PALETTE.accent, scale: 0.7, speed: 0.18 },
      { position: [0, 0.3, -4] as [number, number, number], color: PALETTE.primary, scale: 1.0, speed: 0.12 },
    ],
    [],
  );

  return (
    <>
      {orbs.map((orb, i) => (
        <LuminousOrb key={i} {...orb} />
      ))}
    </>
  );
};

/* ── Volumetric light rays (subtle god rays effect) ──────────── */

const VolumetricRay = ({
  position,
  rotation,
  color,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  index: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !isTabVisible()) return;
    const t = clock.elapsedTime;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.018 + Math.sin(t * 0.15 + index * 1.5) * 0.008;
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.04 + index) * 0.015;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[0.3, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.02}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const LightRays = () => (
  <>
    <VolumetricRay position={[-2, 0, -8]} rotation={[0, 0, 0.3]} color={PALETTE.primary} index={0} />
    <VolumetricRay position={[1.5, 0, -9]} rotation={[0, 0, -0.2]} color={PALETTE.secondary} index={1} />
    <VolumetricRay position={[0, 0, -7]} rotation={[0, 0, 0.1]} color={PALETTE.accent} index={2} />
  </>
);

/* ── Cinematic camera sway ──────────────────────────────────── */

const CinematicCamera = () => {
  useFrame(({ camera, clock }) => {
    if (!isTabVisible()) return;
    const t = clock.elapsedTime;
    const amp = MOTION.cameraSway.amplitude;
    const spd = MOTION.cameraSway.speed;
    camera.position.x = Math.sin(t * spd) * amp;
    camera.position.y = Math.cos(t * spd * 0.7) * amp * 0.5;
  });
  return null;
};

/* ── Scene content (inside Canvas) ──────────────────────────── */

const HeroSceneContent = ({ particleCount, starsCount }: { particleCount: number; starsCount: number }) => {
  const fog = getAdaptiveFog('hero');
  const ppEnabled = shouldEnablePostProcessing();

  return (
    <>
      <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
      <ambientLight intensity={0.18} />
      <pointLight position={[5, 4, 5]} color={PALETTE.primary} intensity={1.8} distance={24} />
      <pointLight position={[-4, -2, 3]} color={PALETTE.secondary} intensity={1.2} distance={22} />
      <pointLight position={[0, 3, -5]} color={PALETTE.warm} intensity={0.7} distance={20} />

      {/* Background layer */}
      <Stars radius={100} depth={70} count={starsCount} factor={3} saturation={0.4} fade speed={0.15} />
      <AtmosphericGlow />
      <LightRays />

      {/* Midground layer */}
      <HeroParticles count={particleCount} />

      {/* Foreground layer */}
      <ForegroundOrbs />

      {/* Camera */}
      <CinematicCamera />

      {/* Post-processing — scene-adaptive, gracefully degrades */}
      <ImmersivePostProcessing scene="hero" enabled={ppEnabled} />
    </>
  );
};

/* ── Reduced motion fallback ────────────────────────────────── */

const ReducedMotionFallback = () => (
  <div
    className="absolute inset-0 -z-10"
    style={{
      background: `radial-gradient(ellipse at 30% 40%, ${PALETTE.primary}18 0%, transparent 55%),
                   radial-gradient(ellipse at 70% 60%, ${PALETTE.secondary}14 0%, transparent 50%),
                   radial-gradient(ellipse at 50% 80%, ${PALETTE.warm}0a 0%, transparent 40%),
                   ${PALETTE.darkVoid}`,
    }}
    role="img"
    aria-label="Arrière-plan décoratif EmotionsCare"
  />
);

/* ── Exported Component ─────────────────────────────────────── */

const HeroScene3D = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const timer = requestAnimationFrame(() => setShouldRender(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  if (reducedMotion) {
    return <ReducedMotionFallback />;
  }

  if (!shouldRender) {
    return <ReducedMotionFallback />;
  }

  const cam = CAMERA.hero;
  const particleCount = getParticleCount('hero');
  const starsCount = getStarsCount('hero');

  return (
    <WebGLGate scene="hero" height="h-full">
      <div className="absolute inset-0 -z-10">
        {/* Vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, transparent 40%, hsl(var(--background)) 95%)',
          }}
        />

        <Canvas
          camera={{ position: cam.position, fov: cam.fov }}
          gl={getGLConfig()}
          style={{ background: 'transparent' }}
          dpr={getDPR()}
        >
          <HeroSceneContent particleCount={particleCount} starsCount={starsCount} />
        </Canvas>
      </div>
    </WebGLGate>
  );
};

export default HeroScene3D;
