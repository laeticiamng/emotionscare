import React from 'react';
import { Phase, Pattern } from '@/store/breath.store';

interface BreathRingProps {
  phase: Phase | null;
  phaseProgress: number;
  reducedMotion: boolean;
  pattern: Pattern;
  running: boolean;
}

export const BreathRing: React.FC<BreathRingProps> = ({
  phase,
  phaseProgress,
  reducedMotion,
  pattern,
  running
}) => {
  const baseSize = 200;
  const strokeWidth = 4;
  const radius = (baseSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate ring size based on phase
  let currentScale = 1;
  if (running && phase) {
    switch (phase) {
      case 'inhale':
        currentScale = 1 + (0.3 * phaseProgress);
        break;
      case 'hold':
        currentScale = 1.3;
        break;
      case 'exhale':
        currentScale = 1.3 - (0.3 * phaseProgress);
        break;
    }
  }

  // Color based on phase
  const getPhaseColor = (currentPhase: Phase | null) => {
    switch (currentPhase) {
      case 'inhale':
        return 'hsl(var(--primary))';
      case 'hold':
        return 'hsl(var(--secondary))';
      case 'exhale':
        return 'hsl(var(--accent))';
      default:
        return 'hsl(var(--muted))';
    }
  };

  // Progress circle (outer)
  const progressOffset = circumference - (phaseProgress * circumference);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={baseSize}
        height={baseSize}
        className={`
          transition-transform duration-300 ease-in-out
          ${reducedMotion ? '' : 'transform-gpu'}
        `}
        style={{
          transform: reducedMotion ? 'scale(1)' : `scale(${currentScale})`,
        }}
      >
        {/* Background circle */}
        <circle
          cx={baseSize / 2}
          cy={baseSize / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        
        {/* Progress circle */}
        {running && phase && (
          <circle
            cx={baseSize / 2}
            cy={baseSize / 2}
            r={radius}
            stroke={getPhaseColor(phase)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            className={`
              transition-all duration-100 ease-linear
              ${reducedMotion ? 'opacity-80' : 'drop-shadow-lg'}
            `}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        )}
        
        {/* Inner glow effect */}
        {running && phase && !reducedMotion && (
          <circle
            cx={baseSize / 2}
            cy={baseSize / 2}
            r={radius * 0.7}
            fill={getPhaseColor(phase)}
            opacity={0.1 + (0.1 * phaseProgress)}
            className="transition-opacity duration-300"
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {running && phase && (
            <>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {phase === 'inhale' ? 'Inspire' : 
                 phase === 'hold' ? 'Retiens' : 'Expire'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {pattern}
              </div>
            </>
          )}
          {!running && (
            <div className="text-sm text-muted-foreground">
              Prêt à commencer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};