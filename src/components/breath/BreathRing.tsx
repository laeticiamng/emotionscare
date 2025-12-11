import React, { useMemo } from 'react';
import { Phase, Pattern } from '@/store/breath.store';
import { cn } from '@/lib/utils';

interface BreathRingProps {
  phase: Phase | null;
  phaseProgress: number;
  reducedMotion: boolean;
  pattern: Pattern;
  running: boolean;
  cycleCount?: number;
  totalCycles?: number;
  showStats?: boolean;
}

export const BreathRing: React.FC<BreathRingProps> = ({
  phase,
  phaseProgress,
  reducedMotion,
  pattern,
  running,
  cycleCount = 0,
  totalCycles,
  showStats = true,
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

  // Phase labels
  const phaseLabels = {
    inhale: 'Inspire',
    hold: 'Retiens',
    exhale: 'Expire',
  };

  // Progress circle offset
  const progressOffset = circumference - (phaseProgress * circumference);

  // Generate particles for visual effect
  const particles = useMemo(() => {
    if (reducedMotion || !running) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i * 45) * (Math.PI / 180),
      delay: i * 0.1,
    }));
  }, [reducedMotion, running]);

  // Cycle progress for outer ring
  const cycleProgress = totalCycles ? (cycleCount / totalCycles) * 100 : 0;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer cycle progress ring */}
      {showStats && totalCycles && (
        <svg
          width={baseSize + 40}
          height={baseSize + 40}
          className="absolute"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={(baseSize + 40) / 2}
            cy={(baseSize + 40) / 2}
            r={radius + 16}
            stroke="hsl(var(--border))"
            strokeWidth={2}
            fill="none"
            opacity={0.3}
          />
          <circle
            cx={(baseSize + 40) / 2}
            cy={(baseSize + 40) / 2}
            r={radius + 16}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="none"
            strokeDasharray={2 * Math.PI * (radius + 16)}
            strokeDashoffset={2 * Math.PI * (radius + 16) * (1 - cycleProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
            opacity={0.6}
          />
        </svg>
      )}

      {/* Main breathing ring */}
      <svg
        width={baseSize}
        height={baseSize}
        className={cn(
          'transition-transform duration-300 ease-in-out',
          !reducedMotion && 'transform-gpu'
        )}
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
            className={cn(
              'transition-all duration-100 ease-linear',
              reducedMotion ? 'opacity-80' : 'drop-shadow-lg'
            )}
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

        {/* Particles */}
        {particles.map((particle) => {
          const particleRadius = radius * 0.85;
          const x = baseSize / 2 + Math.cos(particle.angle + phaseProgress * Math.PI * 2) * particleRadius;
          const y = baseSize / 2 + Math.sin(particle.angle + phaseProgress * Math.PI * 2) * particleRadius;
          
          return (
            <circle
              key={particle.id}
              cx={x}
              cy={y}
              r={3}
              fill={getPhaseColor(phase)}
              opacity={0.3 + (0.2 * Math.sin(phaseProgress * Math.PI))}
              className="transition-all duration-200"
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {running && phase && (
            <>
              <div className={cn(
                'text-lg font-semibold uppercase tracking-wide transition-all duration-300',
                phase === 'inhale' && 'text-primary',
                phase === 'hold' && 'text-secondary-foreground',
                phase === 'exhale' && 'text-accent-foreground'
              )}>
                {phaseLabels[phase]}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {pattern}
              </div>
              {showStats && (
                <div className="text-xs text-muted-foreground mt-2 opacity-70">
                  {cycleCount > 0 && (
                    <span>
                      Cycle {cycleCount}
                      {totalCycles && ` / ${totalCycles}`}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
          {!running && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Prêt à commencer
              </div>
              <div className="text-xs text-muted-foreground/60">
                {pattern}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathRing;
