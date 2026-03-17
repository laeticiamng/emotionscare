/**
 * Sphère 3D immersive avec vertex shader Simplex noise
 * Déformation organique en temps réel — l'orbe "respire" comme un organisme vivant
 *
 * T3 improvements:
 * - Safe shader injection with try/catch guard
 * - Enhanced material properties for premium organic feel
 * - Better depth separation with inner layers
 * - Reduced ring count for cleaner reads
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, isTabVisible } from '@/components/3d/visualDirection';
import { OUTER_SHELL_PRESET, INNER_CORE_PRESET, RING_PRESET } from '@/components/3d/materialPresets';
import type { BreathingPhase } from '../types';

/* ── Simplex noise GLSL (injecté via onBeforeCompile) ────────── */

const SIMPLEX_NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

const VERTEX_HEADER = /* glsl */ `
  uniform float uTime;
  uniform float uNoiseAmp;
  uniform float uNoiseFreq;
`;

const VERTEX_TRANSFORM = /* glsl */ `
  vec3 pos = transformed;
  float noise = snoise(pos * uNoiseFreq + uTime * 0.4) * uNoiseAmp;
  float noise2 = snoise(pos * uNoiseFreq * 2.0 + uTime * 0.7) * uNoiseAmp * 0.3;
  pos += normal * (noise + noise2);
  transformed = pos;
`;

interface BreathingSphereProps {
  phase: BreathingPhase;
  progress: number;
}

export const BreathingSphere = ({ phase, progress }: BreathingSphereProps) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const phaseColors = useMemo(() => ({
    inhale: new THREE.Color(PALETTE.breathing.inhale),
    hold: new THREE.Color(PALETTE.breathing.hold),
    exhale: new THREE.Color(PALETTE.breathing.exhale),
    rest: new THREE.Color(PALETTE.breathing.rest),
  }), []);

  const currentColor = useRef(new THREE.Color('#4f9eff'));
  const currentEmissive = useRef(new THREE.Color('#4f9eff'));

  // Simplex noise uniforms for organic vertex deformation
  const noiseUniforms = useRef({
    uTime: { value: 0 },
    uNoiseAmp: { value: 0.12 },
    uNoiseFreq: { value: 1.8 },
  });

  const targetScale = phase === 'inhale' ? 2.2 : phase === 'hold' ? 2.2 : phase === 'exhale' ? 1 : 1;

  // Inject Simplex noise vertex shader — with safe try/catch guard
  useEffect(() => {
    if (!outerRef.current) return;
    const mat = outerRef.current.material as THREE.MeshPhysicalMaterial;
    try {
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = noiseUniforms.current.uTime;
        shader.uniforms.uNoiseAmp = noiseUniforms.current.uNoiseAmp;
        shader.uniforms.uNoiseFreq = noiseUniforms.current.uNoiseFreq;

        // Guard: verify the injection point exists
        if (!shader.vertexShader.includes('#include <begin_vertex>')) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[BreathingSphere] Shader injection point not found, skipping deformation');
          }
          return;
        }

        shader.vertexShader = SIMPLEX_NOISE_GLSL + VERTEX_HEADER + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n' + VERTEX_TRANSFORM
        );
      };
      mat.needsUpdate = true;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[BreathingSphere] Shader injection failed, falling back to static mesh:', err);
      }
    }
  }, []);

  useFrame((state) => {
    if (!isTabVisible()) return;
    const time = state.clock.elapsedTime;
    const normalizedProgress = progress / 100;
    const scale = 1 + (targetScale - 1) * normalizedProgress;

    // Update noise uniforms
    noiseUniforms.current.uTime.value = time;
    const breathAmp = phase === 'inhale'
      ? 0.08 + normalizedProgress * 0.15
      : phase === 'hold'
        ? 0.2 + Math.sin(time * 2) * 0.05
        : phase === 'exhale'
          ? 0.2 - normalizedProgress * 0.12
          : 0.08 + Math.sin(time * 1.5) * 0.03;
    noiseUniforms.current.uNoiseAmp.value = breathAmp;

    // Smooth color lerp
    const targetColor = phaseColors[phase];
    currentColor.current.lerp(targetColor, 0.04);
    currentEmissive.current.lerp(targetColor, 0.04);

    // === Outer sphere (translucent shell with organic Simplex deformation) ===
    if (outerRef.current) {
      outerRef.current.scale.setScalar(scale);
      outerRef.current.rotation.y = time * 0.12;
      outerRef.current.rotation.x = Math.sin(time * 0.25) * 0.12;
      const outerMat = outerRef.current.material as THREE.MeshPhysicalMaterial;
      outerMat.color.copy(currentColor.current);
      outerMat.emissive.copy(currentEmissive.current);
      outerMat.emissiveIntensity = 0.35 + Math.sin(time * 1.2) * 0.12;
    }

    // === Inner glow sphere ===
    if (innerRef.current) {
      const innerScale = scale * 0.55;
      innerRef.current.scale.setScalar(innerScale);
      innerRef.current.rotation.y = -time * 0.18;
      const innerMat = innerRef.current.material as THREE.MeshStandardMaterial;
      innerMat.color.copy(currentColor.current);
      innerMat.emissive.copy(currentEmissive.current);
      innerMat.emissiveIntensity = 1.0 + Math.sin(time * 1.8) * 0.35;
    }

    // === Ripple rings (reduced to 2 for cleaner read) ===
    const rings = [ring1Ref, ring2Ref];
    rings.forEach((ref, i) => {
      if (!ref.current) return;
      const offset = i * 1.0;
      const ringScale = scale * (1.4 + i * 0.35) + Math.sin(time * 1.0 + offset) * 0.12;
      ref.current.scale.setScalar(ringScale);
      ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.4 + offset) * 0.25;
      ref.current.rotation.z = time * (0.08 + i * 0.04);
      const ringMat = ref.current.material as THREE.MeshStandardMaterial;
      ringMat.color.copy(currentColor.current);
      ringMat.emissive.copy(currentEmissive.current);
      ringMat.emissiveIntensity = 0.5 + Math.sin(time * 1.2 + offset) * 0.25;
      ringMat.opacity = 0.12 + Math.sin(time + offset) * 0.08;
    });
  });

  return (
    <group>
      {/* Outer translucent sphere with organic Simplex noise deformation */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          {...OUTER_SHELL_PRESET}
        />
      </mesh>

      {/* Inner glow core — warmer, more alive */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          {...INNER_CORE_PRESET}
        />
      </mesh>

      {/* Ripple ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          {...RING_PRESET}
        />
      </mesh>

      {/* Ripple ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          {...RING_PRESET}
          opacity={0.14}
        />
      </mesh>
    </group>
  );
};
