/**
 * Particules interactives réagissant au curseur/touch
 * Effet "champ de force" — les particules s'écartent au passage de la souris
 * Uses unified visual direction defaults
 */

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, MOTION } from './visualDirection';

interface InteractiveParticlesProps {
  count?: number;
  radius?: number;
  color?: string;
  repelStrength?: number;
  repelRadius?: number;
}

export const InteractiveParticles = ({
  count = 200,
  radius = 5,
  color = PALETTE.accent,
  repelStrength = 0.8,
  repelRadius = 2,
}: InteractiveParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePos = useRef(new THREE.Vector3());
  const { camera, gl } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseNDC = useRef(new THREE.Vector2(9999, 9999));

  // Track mouse/touch in NDC
  useMemo(() => {
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

  // Generate initial positions
  const { basePositions, currentPositions } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const current = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      current[i * 3] = x;
      current[i * 3 + 1] = y;
      current[i * 3 + 2] = z;
    }
    return { basePositions: base, currentPositions: current };
  }, [count, radius]);

  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;

    // Project mouse into 3D world at z=0
    raycaster.setFromCamera(mouseNDC.current, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    raycaster.ray.intersectPlane(plane, mousePos.current);

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Base with gentle drift
      const bx = basePositions[ix] + Math.sin(time * 0.2 + i * 0.1) * 0.05;
      const by = basePositions[ix + 1] + Math.cos(time * 0.15 + i * 0.15) * 0.05;
      const bz = basePositions[ix + 2] + Math.sin(time * 0.25 + i * 0.05) * 0.05;

      // Repulsion from cursor
      tempVec.set(bx, by, bz);
      const dist = tempVec.distanceTo(mousePos.current);
      let rx = 0, ry = 0, rz = 0;
      if (dist < repelRadius && dist > 0.001) {
        const force = (1 - dist / repelRadius) * repelStrength;
        const dx = (bx - mousePos.current.x);
        const dy = (by - mousePos.current.y);
        const dz = (bz - mousePos.current.z);
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        rx = (dx / len) * force;
        ry = (dy / len) * force;
        rz = (dz / len) * force;
      }

      // Smooth interpolation toward target
      const tx = bx + rx;
      const ty = by + ry;
      const tz = bz + rz;
      currentPositions[ix] += (tx - currentPositions[ix]) * 0.08;
      currentPositions[ix + 1] += (ty - currentPositions[ix + 1]) * 0.08;
      currentPositions[ix + 2] += (tz - currentPositions[ix + 2]) * 0.08;

      posAttr.setXYZ(i, currentPositions[ix], currentPositions[ix + 1], currentPositions[ix + 2]);
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};
