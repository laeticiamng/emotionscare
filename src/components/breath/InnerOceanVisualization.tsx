// @ts-nocheck
/**
 * Inner Ocean Visualization for Breathwork
 * Calming ocean waves synchronized with breathing patterns
 */

import React, { useEffect, useRef, useState } from 'react';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { cn } from '@/lib/utils';

interface InnerOceanVisualizationProps {
  phase: 'inhale' | 'hold' | 'exhale';
  progress?: number; // 0-1 of current breath cycle
  ambience?: 'very_soft' | 'soft' | 'standard';
  intensity?: number; // 0-1
}

export const InnerOceanVisualization: React.FC<InnerOceanVisualizationProps> = ({
  phase,
  progress = 0,
  ambience = 'soft',
  intensity = 0.7,
}) => {
  const { prefersReducedMotion } = useMotionPrefs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [waveOffset, setWaveOffset] = useState(0);

  const allowMotion = !prefersReducedMotion;

  // Ocean color palettes based on ambience
  const oceanPalettes = {
    very_soft: {
      deep: 'rgba(16, 24, 48, 1)',      // Deep blue-black
      mid: 'rgba(30, 58, 138, 0.8)',     // Mid ocean blue
      surface: 'rgba(59, 130, 246, 0.4)', // Light blue
      foam: 'rgba(147, 197, 253, 0.6)',   // Foam/highlights
      glow: 'rgba(96, 165, 250, 0.3)',    // Ambient glow
    },
    soft: {
      deep: 'rgba(15, 23, 42, 1)',       // Slate deep
      mid: 'rgba(51, 65, 85, 0.8)',      // Slate mid
      surface: 'rgba(100, 116, 139, 0.4)', // Slate surface
      foam: 'rgba(148, 163, 184, 0.6)',   // Slate light
      glow: 'rgba(71, 85, 105, 0.3)',     // Slate glow
    },
    standard: {
      deep: 'rgba(17, 24, 39, 1)',       // Gray deep
      mid: 'rgba(55, 65, 81, 0.8)',      // Gray mid
      surface: 'rgba(107, 114, 128, 0.4)', // Gray surface
      foam: 'rgba(156, 163, 175, 0.6)',   // Gray light
      glow: 'rgba(75, 85, 99, 0.3)',      // Gray glow
    },
  };

  const palette = oceanPalettes[ambience];

  // Wave parameters based on breath phase
  const getWaveParams = () => {
    switch (phase) {
      case 'inhale':
        return {
          amplitude: 20 * intensity,
          frequency: 0.02,
          speed: 0.015,
          layers: 3,
        };
      case 'hold':
        return {
          amplitude: 12 * intensity,
          frequency: 0.015,
          speed: 0.008,
          layers: 2,
        };
      case 'exhale':
        return {
          amplitude: 30 * intensity,
          frequency: 0.025,
          speed: 0.02,
          layers: 4,
        };
      default:
        return {
          amplitude: 15 * intensity,
          frequency: 0.02,
          speed: 0.01,
          layers: 3,
        };
    }
  };

  useEffect(() => {
    if (!allowMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Draw wave function
    const drawWave = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      phase: number,
      color: string,
      blur: number = 0,
    ) => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      if (blur > 0) {
        ctx.filter = `blur(${blur}px)`;
      }

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 2) {
        const y =
          yOffset +
          Math.sin(x * frequency + phase) * amplitude +
          Math.sin(x * frequency * 0.5 + phase * 1.3) * (amplitude * 0.5);

        if (x === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      if (blur > 0) {
        ctx.filter = 'none';
      }
    };

    // Animation loop
    const animate = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background gradient (deep ocean)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, palette.deep);
      bgGradient.addColorStop(0.5, palette.mid);
      bgGradient.addColorStop(1, palette.surface);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Get wave parameters
      const params = getWaveParams();

      // Animate wave offset
      setWaveOffset((prev) => prev + params.speed);

      // Draw multiple wave layers
      const baseY = height * 0.6;

      // Back waves (darker, blurred)
      if (params.layers >= 4) {
        drawWave(
          baseY + 40,
          params.amplitude * 0.4,
          params.frequency * 0.8,
          waveOffset * 0.6,
          palette.mid,
          4,
        );
      }

      if (params.layers >= 3) {
        drawWave(
          baseY + 30,
          params.amplitude * 0.6,
          params.frequency * 0.9,
          waveOffset * 0.8,
          palette.mid,
          3,
        );
      }

      // Middle wave
      if (params.layers >= 2) {
        drawWave(
          baseY + 20,
          params.amplitude * 0.8,
          params.frequency,
          waveOffset,
          palette.surface,
          2,
        );
      }

      // Front wave (brightest)
      drawWave(baseY, params.amplitude, params.frequency * 1.1, waveOffset * 1.2, palette.foam, 0);

      // Add glow effect on surface
      const glowGradient = ctx.createRadialGradient(
        width / 2,
        baseY,
        0,
        width / 2,
        baseY,
        width * 0.5,
      );
      glowGradient.addColorStop(0, palette.glow);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, allowMotion, intensity, ambience, waveOffset, palette]);

  // Static ocean for reduced motion
  if (!allowMotion) {
    const staticY = 60;

    return (
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ height: '280px' }}
        aria-label="Ocean intérieur (mode réduit)"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${palette.deep} 0%, ${palette.mid} 50%, ${palette.surface} 100%)`,
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={`M 0,${staticY} Q 25,${staticY - 5} 50,${staticY} T 100,${staticY} L 100,100 L 0,100 Z`}
            fill={palette.foam}
            opacity="0.6"
          />
          <path
            d={`M 0,${staticY + 5} Q 25,${staticY} 50,${staticY + 5} T 100,${staticY + 5} L 100,100 L 0,100 Z`}
            fill={palette.surface}
            opacity="0.4"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '280px' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-label="Ocean intérieur animé"
      />

      {/* Overlay hints */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center space-y-1 pointer-events-none">
        <div
          className={cn(
            'text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm transition-opacity',
            'bg-white/10 text-white/80',
          )}
        >
          {phase === 'inhale' && 'La marée monte doucement...'}
          {phase === 'hold' && 'L\'océan se stabilise...'}
          {phase === 'exhale' && 'Les vagues s\'apaisent...'}
        </div>
      </div>
    </div>
  );
};
