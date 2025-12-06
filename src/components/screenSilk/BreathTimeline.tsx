import React from 'react';
import { type BreathPhase } from '@/store/screenSilk.store';

interface BreathTimelineProps {
  phase: BreathPhase;
  progress: number; // 0-1 for current phase
  overallProgress: number; // 0-1 for entire session
  reduceMotion: boolean;
  className?: string;
}

export const BreathTimeline: React.FC<BreathTimelineProps> = ({
  phase,
  progress,
  overallProgress,
  reduceMotion,
  className = ''
}) => {
  // Calculate breathing ring scale and opacity
  const getBreathingRingStyle = () => {
    if (reduceMotion) {
      // Simplified animation for reduced motion
      return {
        scale: 1,
        opacity: 0.6,
      };
    }

    let scale = 1;
    let opacity = 0.4;

    switch (phase) {
      case 'inhale':
        scale = 1 + (progress * 0.3); // Expand during inhale
        opacity = 0.4 + (progress * 0.4); // Increase opacity
        break;
      case 'hold':
        scale = 1.3; // Stay expanded during hold
        opacity = 0.8; // High opacity during hold
        break;
      case 'exhale':
        scale = 1.3 - (progress * 0.3); // Contract during exhale
        opacity = 0.8 - (progress * 0.4); // Decrease opacity
        break;
      case 'pause':
        scale = 1; // Neutral size during pause
        opacity = 0.4; // Low opacity during pause
        break;
    }

    return { scale, opacity };
  };

  const breathingStyle = getBreathingRingStyle();

  // Get phase color
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'hsl(var(--primary))';
      case 'hold':
        return 'hsl(var(--secondary))';
      case 'exhale':
        return 'hsl(var(--accent))';
      case 'pause':
        return 'hsl(var(--muted-foreground))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  const phaseColor = getPhaseColor();

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* Main Breathing Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border/20" />
        
        {/* Progress Ring */}
        <svg 
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 192 192"
        >
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke={phaseColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - overallProgress)}`}
            className="transition-all duration-1000 ease-out"
            opacity="0.6"
          />
        </svg>

        {/* Breathing Ring - Inner pulsing circle */}
        <div 
          className={`
            w-24 h-24 rounded-full border-4 border-current
            transition-all duration-300 ease-out
            ${!reduceMotion ? 'animate-pulse' : ''}
          `}
          style={{
            transform: `scale(${breathingStyle.scale})`,
            opacity: breathingStyle.opacity,
            color: phaseColor,
            borderStyle: phase === 'hold' ? 'solid' : 'dashed',
          }}
        />

        {/* Center dot */}
        <div 
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: phaseColor,
            opacity: breathingStyle.opacity,
          }}
        />
      </div>

      {/* Phase Indicator Dots */}
      <div className="flex items-center space-x-3">
        {(['inhale', 'hold', 'exhale', 'pause'] as const).map((phaseName, index) => {
          const isActive = phase === phaseName;
          const isDone = ['inhale', 'hold', 'exhale', 'pause'].indexOf(phase) > index;
          
          return (
            <div
              key={phaseName}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-current scale-150' 
                  : isDone 
                    ? 'bg-current/60' 
                    : 'bg-border/40'
                }
              `}
              style={{
                color: phaseColor,
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Phase Progress Bar (subtle) */}
      <div className="w-32 h-1 bg-border/20 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: phaseColor,
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
};