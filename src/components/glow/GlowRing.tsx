// @ts-nocheck
import React, { useMemo } from 'react';
import { type GlowPhase } from '@/store/glow.store';

interface GlowRingProps {
  phase: GlowPhase;
  progress?: number; // 0-1 pour le progrès dans la phase actuelle
  reduceMotion?: boolean;
  className?: string;
  size?: number;
}

const GlowRing: React.FC<GlowRingProps> = ({ 
  phase, 
  progress = 0,
  reduceMotion = false,
  className = '',
  size = 200 
}) => {
  // Configuration des couleurs et effets par phase
  const phaseConfig = useMemo(() => {
    switch (phase) {
      case 'inhale':
        return {
          stroke: 'url(#inhale-gradient)',
          scale: 1 + progress * 0.3, // Expansion progressive
          opacity: 0.8 + progress * 0.2,
          glowColor: '#3b82f6', // Bleu
          message: 'Inspire',
        };
      case 'hold':
        return {
          stroke: 'url(#hold-gradient)',
          scale: 1.3, // Taille maintenue
          opacity: 1,
          glowColor: '#10b981', // Vert
          message: 'Tiens',
        };
      case 'exhale':
        return {
          stroke: 'url(#exhale-gradient)',
          scale: 1.3 - progress * 0.3, // Contraction progressive
          opacity: 1 - progress * 0.2,
          glowColor: '#f59e0b', // Orange
          message: 'Expire',
        };
      case 'paused':
        return {
          stroke: 'url(#paused-gradient)',
          scale: 1.1,
          opacity: 0.6,
          glowColor: '#6b7280', // Gris
          message: 'En pause',
        };
      case 'finished':
        return {
          stroke: 'url(#finished-gradient)',
          scale: 1,
          opacity: 0.9,
          glowColor: '#8b5cf6', // Violet
          message: 'Terminé',
        };
      default:
        return {
          stroke: 'url(#idle-gradient)',
          scale: 1,
          opacity: 0.5,
          glowColor: '#6b7280',
          message: 'Prêt',
        };
    }
  }, [phase, progress]);

  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference}`;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`glow-ring ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* SVG Ring */}
        <svg
          width={size}
          height={size}
          className={`
            absolute inset-0 
            ${reduceMotion ? '' : 'transition-all duration-300 ease-out'}
          `}
          style={{
            transform: `scale(${phaseConfig.scale})`,
            filter: reduceMotion ? 'none' : `drop-shadow(0 0 20px ${phaseConfig.glowColor}40)`,
          }}
        >
          <defs>
            {/* Gradients pour chaque phase */}
            <radialGradient id="inhale-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
            </radialGradient>
            
            <radialGradient id="hold-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
            </radialGradient>
            
            <radialGradient id="exhale-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
            </radialGradient>
            
            <radialGradient id="paused-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6b7280" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4b5563" stopOpacity="0.3" />
            </radialGradient>
            
            <radialGradient id="finished-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
            </radialGradient>
            
            <radialGradient id="idle-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6b7280" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4b5563" stopOpacity="0.2" />
            </radialGradient>

            {/* Filtre de lueur */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Cercle de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
            opacity="0.3"
          />

          {/* Cercle principal animé */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={phaseConfig.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={phase === 'inhale' || phase === 'exhale' ? strokeDasharray : 'none'}
            strokeDashoffset={phase === 'inhale' || phase === 'exhale' ? strokeDashoffset : 0}
            opacity={phaseConfig.opacity}
            filter={reduceMotion ? 'none' : 'url(#glow)'}
            className={`
              ${reduceMotion ? '' : 'transition-all duration-300 ease-out'}
              ${!reduceMotion && phase !== 'idle' && phase !== 'paused' ? 'animate-pulse' : ''}
            `}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />

          {/* Particules décoratives (si reduce motion désactivé) */}
          {!reduceMotion && phase !== 'idle' && phase !== 'paused' && (
            <g className="animate-spin" style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}>
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x = size / 2 + radius * 1.2 * Math.cos(angle);
                const y = size / 2 + radius * 1.2 * Math.sin(angle);
                
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={phaseConfig.glowColor}
                    opacity="0.6"
                    className="animate-pulse"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Contenu central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <div 
            className={`
              transition-all duration-300 ease-out
              ${phase !== 'idle' ? 'scale-110' : 'scale-100'}
            `}
          >
            <p 
              className="text-2xl font-bold mb-1"
              style={{ color: phaseConfig.glowColor }}
              aria-live="polite"
            >
              {phaseConfig.message}
            </p>
            
            {progress > 0 && (phase === 'inhale' || phase === 'exhale') && (
              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-current transition-all duration-100 ease-linear"
                  style={{ 
                    width: `${progress * 100}%`,
                    backgroundColor: phaseConfig.glowColor 
                  }}
                />
              </div>
            )}
          </div>

          {/* Indication tactile pour mobile */}
          <div className="mt-4 text-xs text-muted-foreground">
            {phase === 'idle' && (
              <p>Appuyez pour commencer</p>
            )}
            {phase !== 'idle' && phase !== 'finished' && (
              <p>Suivez le rythme de l'anneau</p>
            )}
          </div>
        </div>

        {/* Halo de fond (reduce motion → statique) */}
        {!reduceMotion && phase !== 'idle' && (
          <div 
            className="absolute inset-0 rounded-full opacity-20 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${phaseConfig.glowColor}20, transparent 70%)`,
              transform: `scale(${phaseConfig.scale * 1.5})`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GlowRing;