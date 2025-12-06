// @ts-nocheck

import React from 'react';
import { type BreathPhase } from '@/store/screenSilk.store';

interface SilkOverlayProps {
  phase: BreathPhase;
  progress: number; // 0-1
  reduceMotion: boolean;
  isComplete?: boolean;
  className?: string;
}

export const SilkOverlay: React.FC<SilkOverlayProps> = ({
  phase,
  progress,
  reduceMotion,
  isComplete = false,
  className = ''
}) => {
  // Calculate opacity based on phase and progress
  const getOpacity = () => {
    if (isComplete) return 0.95; // High opacity for completion state
    
    switch (phase) {
      case 'inhale':
        return 0.2 + (progress * 0.4); // 0.2 to 0.6
      case 'hold':
        return 0.6; // Steady during hold
      case 'exhale':
        return 0.6 - (progress * 0.4); // 0.6 to 0.2
      case 'pause':
        return 0.2; // Minimal during pause
      default:
        return 0.3;
    }
  };

  // Calculate scale based on breathing phase
  const getScale = () => {
    if (reduceMotion) return 1; // No scaling in reduced motion mode
    if (isComplete) return 1;
    
    switch (phase) {
      case 'inhale':
        return 1 + (progress * 0.1); // Gentle expansion
      case 'hold':
        return 1.1; // Slightly expanded during hold
      case 'exhale':
        return 1.1 - (progress * 0.1); // Gentle contraction
      case 'pause':
        return 1; // Normal size during pause
      default:
        return 1;
    }
  };

  const opacity = getOpacity();
  const scale = getScale();

  // Silk gradient colors that change subtly with phase
  const getGradientColors = () => {
    if (isComplete) {
      return {
        primary: 'from-emerald-500/30',
        secondary: 'via-teal-400/20', 
        tertiary: 'to-cyan-300/30'
      };
    }
    
    switch (phase) {
      case 'inhale':
        return {
          primary: 'from-blue-500/20',
          secondary: 'via-indigo-400/15',
          tertiary: 'to-purple-300/20'
        };
      case 'hold':
        return {
          primary: 'from-purple-500/25',
          secondary: 'via-violet-400/20',
          tertiary: 'to-fuchsia-300/25'
        };
      case 'exhale':
        return {
          primary: 'from-teal-500/20',
          secondary: 'via-cyan-400/15',
          tertiary: 'to-blue-300/20'
        };
      case 'pause':
        return {
          primary: 'from-slate-500/10',
          secondary: 'via-gray-400/8',
          tertiary: 'to-zinc-300/10'
        };
      default:
        return {
          primary: 'from-blue-500/20',
          secondary: 'via-indigo-400/15',
          tertiary: 'to-purple-300/20'
        };
    }
  };

  const colors = getGradientColors();

  return (
    <div 
      className={`fixed inset-0 pointer-events-none transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
      aria-hidden="true"
    >
      {/* Primary silk layer */}
      <div 
        className={`absolute inset-0 bg-gradient-radial ${colors.primary} ${colors.secondary} ${colors.tertiary}`}
        style={{
          background: `
            radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.1) 0%, transparent 70%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary) / 0.08) 0%, transparent 60%),
            radial-gradient(circle at 40% 80%, hsl(var(--accent) / 0.06) 0%, transparent 50%),
            linear-gradient(135deg, 
              hsl(var(--primary) / 0.05) 0%, 
              hsl(var(--secondary) / 0.03) 50%, 
              hsl(var(--accent) / 0.04) 100%
            )
          `
        }}
      />

      {/* Silk texture overlay - subtle animated pattern */}
      {!reduceMotion && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                hsl(var(--primary) / 0.02) 2px,
                hsl(var(--primary) / 0.02) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 3px,
                hsl(var(--secondary) / 0.01) 3px,
                hsl(var(--secondary) / 0.01) 6px
              )
            `,
            animation: phase === 'inhale' ? 'gentle-drift 8s ease-in-out infinite' : 
                      phase === 'exhale' ? 'gentle-drift 8s ease-in-out infinite reverse' : 
                      'none'
          }}
        />
      )}

      {/* Completion sparkles */}
      {isComplete && !reduceMotion && (
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
              style={{
                left: `${20 + (i * 6)}%`,
                top: `${30 + ((i % 3) * 20)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gentle-drift {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(1px) translateY(-1px); }
          50% { transform: translateX(-0.5px) translateY(0.5px); }
          75% { transform: translateX(0.5px) translateY(-0.5px); }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};