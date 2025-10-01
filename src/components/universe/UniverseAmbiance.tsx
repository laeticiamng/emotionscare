// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Universe } from '@/types/universes';

interface UniverseAmbianceProps {
  universe: Universe;
  intensity?: number; // 0-1
  interactive?: boolean;
  className?: string;
}

export const UniverseAmbiance: React.FC<UniverseAmbianceProps> = ({
  universe,
  intensity = 0.6,
  interactive = false,
  className = ""
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate ambient particles based on universe type
    const particleCount = Math.floor(8 + intensity * 12);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: 0.5 + Math.random() * 1.5
    }));
    setParticles(newParticles);
  }, [universe.id, intensity]);

  const getParticleStyle = (particle: any) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}rem`,
      height: `${particle.size}rem`,
      borderRadius: '50%',
      animationDelay: `${particle.delay}s`,
      pointerEvents: 'none' as const
    };

    switch (universe.id) {
      case 'home':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${universe.ambiance.colors.accent}80, transparent)`,
          animation: 'pulse 3s ease-in-out infinite'
        };
      case 'scan':
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${universe.ambiance.colors.primary}60, ${universe.ambiance.colors.accent}60)`,
          animation: 'scale-in 4s ease-in-out infinite alternate'
        };
      case 'breath':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${universe.ambiance.colors.primary}70, transparent)`,
          animation: 'fade-in 4s ease-in-out infinite alternate'
        };
      case 'flash-glow':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${universe.ambiance.colors.accent}90, transparent)`,
          animation: 'pulse 0.8s ease-in-out infinite',
          filter: 'blur(1px)'
        };
      case 'journal':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${universe.ambiance.colors.primary}50, transparent)`,
          animation: 'float 6s ease-in-out infinite'
        };
      default:
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${universe.ambiance.colors.primary}60, transparent)`,
          animation: 'pulse 3s ease-in-out infinite'
        };
    }
  };

  const getAmbianceOverlay = () => {
    switch (universe.id) {
      case 'home':
        return (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, ${universe.ambiance.colors.accent}15, transparent 50%),
                radial-gradient(circle at 80% 70%, ${universe.ambiance.colors.primary}10, transparent 50%),
                linear-gradient(135deg, ${universe.ambiance.colors.secondary}05, transparent)
              `
            }}
          />
        );
      case 'scan':
        return (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                conic-gradient(from 45deg, ${universe.ambiance.colors.primary}08, ${universe.ambiance.colors.accent}08, ${universe.ambiance.colors.primary}08),
                radial-gradient(circle at center, transparent 30%, ${universe.ambiance.colors.secondary}10)
              `
            }}
          />
        );
      case 'breath':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(circle at center, ${universe.ambiance.colors.primary}12, transparent 70%)`,
                animationDuration: '4s'
              }}
            />
          </div>
        );
      case 'flash-glow':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 30% 20%, ${universe.ambiance.colors.accent}20, transparent 40%),
                  radial-gradient(circle at 70% 80%, ${universe.ambiance.colors.primary}15, transparent 40%)
                `,
                filter: 'blur(40px)'
              }}
            />
          </div>
        );
      case 'journal':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(135deg, ${universe.ambiance.colors.background}),
                  radial-gradient(circle at 60% 40%, ${universe.ambiance.colors.accent}08, transparent 60%)
                `
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Background ambiance */}
      {getAmbianceOverlay()}
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      ))}
      
      {/* Interactive glow effect */}
      {interactive && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 hover:opacity-80"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${universe.ambiance.colors.primary}15, transparent 30%)`
          }}
        />
      )}
    </div>
  );
};

// Add custom keyframes for floating effect
const floatKeyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(2deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }
`;

// Inject keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = floatKeyframes;
  document.head.appendChild(style);
}