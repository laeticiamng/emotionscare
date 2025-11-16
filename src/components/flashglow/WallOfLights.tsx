// @ts-nocheck
/**
 * Wall of Lights Visualization for Flash Glow (SUDS)
 * Grid of animated light bulbs that pulse and glow
 */

import React, { useEffect, useState } from 'react';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { cn } from '@/lib/utils';

interface LightBulb {
  id: number;
  x: number;
  y: number;
  active: boolean;
  pulseDelay: number;
  brightness: number;
}

interface WallOfLightsProps {
  phase?: 'warmup' | 'glow' | 'settle';
  intensity?: number; // 0-1
  theme?: 'cyan' | 'violet' | 'amber' | 'emerald';
  progress?: number; // 0-1 session progress
}

export const WallOfLights: React.FC<WallOfLightsProps> = ({
  phase = 'glow',
  intensity = 0.7,
  theme = 'amber',
  progress = 0,
}) => {
  const { prefersReducedMotion } = useMotionPrefs();
  const [lights, setLights] = useState<LightBulb[]>([]);
  const allowMotion = !prefersReducedMotion;

  // Grid configuration
  const COLS = 8;
  const ROWS = 5;
  const TOTAL_LIGHTS = COLS * ROWS;

  // Theme colors
  const themeColors = {
    cyan: {
      base: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.6)',
      bright: '#22d3ee',
      dim: 'rgba(6, 182, 212, 0.2)',
    },
    violet: {
      base: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.6)',
      bright: '#a78bfa',
      dim: 'rgba(139, 92, 246, 0.2)',
    },
    amber: {
      base: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.6)',
      bright: '#fbbf24',
      dim: 'rgba(245, 158, 11, 0.2)',
    },
    emerald: {
      base: '#10b981',
      glow: 'rgba(16, 185, 129, 0.6)',
      bright: '#34d399',
      dim: 'rgba(16, 185, 129, 0.2)',
    },
  };

  const colors = themeColors[theme];

  // Initialize lights
  useEffect(() => {
    const newLights: LightBulb[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const id = row * COLS + col;
        newLights.push({
          id,
          x: col,
          y: row,
          active: false,
          pulseDelay: Math.random() * 2000,
          brightness: 0.5 + Math.random() * 0.5,
        });
      }
    }
    setLights(newLights);
  }, []);

  // Activate lights based on progress and phase
  useEffect(() => {
    if (!lights.length) return;

    setLights((prevLights) =>
      prevLights.map((light) => {
        const totalProgress = progress * TOTAL_LIGHTS;
        const shouldActivate = light.id < totalProgress;

        let active = shouldActivate;
        let brightness = light.brightness;

        // Phase-specific behavior
        if (phase === 'warmup') {
          // Gradually turn on lights from left to right, top to bottom
          active = light.id < totalProgress;
          brightness = 0.3 + (progress * 0.7);
        } else if (phase === 'glow') {
          // All lights at full brightness with pulsing
          active = true;
          brightness = 0.8 + Math.sin(Date.now() / 1000 + light.pulseDelay / 1000) * 0.2;
        } else if (phase === 'settle') {
          // Gradually dim lights
          active = true;
          brightness = 0.6 * (1 - progress * 0.5);
        }

        return {
          ...light,
          active,
          brightness: Math.max(0, Math.min(1, brightness * intensity)),
        };
      })
    );
  }, [progress, phase, intensity, lights.length]);

  // Animation loop for pulsing effect
  useEffect(() => {
    if (!allowMotion || phase !== 'glow') return;

    const interval = setInterval(() => {
      setLights((prevLights) =>
        prevLights.map((light) => ({
          ...light,
          brightness: light.active
            ? 0.6 + Math.sin(Date.now() / 1000 + light.pulseDelay / 1000) * 0.4 * intensity
            : 0,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [allowMotion, phase, intensity]);

  // Static grid for reduced motion
  if (!allowMotion) {
    return (
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-slate-800/50"
        style={{
          height: '280px',
          backgroundColor: '#0a0e1a',
        }}
        aria-label="Mur de lumières (mode réduit)"
      >
        <div className="absolute inset-0 p-6">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              height: '100%',
            }}
          >
            {lights.map((light) => (
              <div
                key={light.id}
                className={cn('rounded-full transition-all duration-500')}
                style={{
                  backgroundColor: light.active ? colors.base : colors.dim,
                  opacity: light.active ? light.brightness : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-800/50"
      style={{
        height: '280px',
        backgroundColor: '#0a0e1a',
      }}
      aria-label="Mur de lumières animé"
    >
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.glow}, transparent 70%)`,
        }}
      />

      {/* Light grid */}
      <div className="absolute inset-0 p-6">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            height: '100%',
          }}
        >
          {lights.map((light) => (
            <div
              key={light.id}
              className={cn(
                'rounded-full transition-all duration-300 relative',
                light.active && 'animate-pulse-subtle'
              )}
              style={{
                backgroundColor: light.active ? colors.base : colors.dim,
                opacity: light.active ? light.brightness : 0.15,
                boxShadow: light.active
                  ? `0 0 ${10 + light.brightness * 20}px ${colors.glow}, 0 0 ${5 + light.brightness * 10}px ${colors.bright}`
                  : 'none',
                animationDelay: `${light.pulseDelay}ms`,
              }}
            >
              {/* Inner glow */}
              {light.active && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${colors.bright}, transparent)`,
                    opacity: light.brightness * 0.6,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase indicator */}
      <div className="absolute bottom-3 right-3 text-xs font-medium text-white/60 backdrop-blur-sm bg-black/20 px-2 py-1 rounded-full">
        {phase === 'warmup' && 'Allumage...'}
        {phase === 'glow' && 'Pleine lumière'}
        {phase === 'settle' && 'Apaisement...'}
      </div>

      <style jsx>{`
        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
