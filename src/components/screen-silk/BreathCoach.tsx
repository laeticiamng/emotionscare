import React, { useEffect, useState } from 'react';
import { type BreathPhase, type SilkPattern, PATTERN_TIMINGS } from '@/store/screenSilk.store';

interface BreathCoachProps {
  phase: BreathPhase;
  pattern: SilkPattern;
  progress: number; // 0-1 for current phase
  className?: string;
}

// Phase messages in French
const PHASE_MESSAGES = {
  inhale: ['Inspire...', 'Inspire doucement...', 'Respire vers le haut...'],
  hold: ['Tiens...', 'Garde...', 'Maintiens...'],
  exhale: ['Expire...', 'Relâche...', 'Souffle doucement...'],
  pause: ['Pause...', 'Détends-toi...', 'Repos...'],
} as const;

// Phase icons
const PHASE_ICONS = {
  inhale: '↑', // Arrow up for inhale
  hold: '○', // Circle for hold
  exhale: '↓', // Arrow down for exhale
  pause: '◦', // Small circle for pause
} as const;

export const BreathCoach: React.FC<BreathCoachProps> = ({
  phase,
  pattern,
  progress,
  className = ''
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  // Update message when phase changes
  useEffect(() => {
    const messages = PHASE_MESSAGES[phase];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
    
    // Brief fade effect when phase changes
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => clearTimeout(timer);
  }, [phase]);

  // Get timing information for current pattern
  const timing = PATTERN_TIMINGS[pattern];
  const phaseDuration = timing[phase];
  
  // Calculate remaining time for current phase
  const remainingTime = Math.max(0, phaseDuration - (progress * phaseDuration));
  
  // Get visual intensity based on progress
  const getIntensity = () => {
    switch (phase) {
      case 'inhale':
        return progress; // 0 to 1
      case 'hold':
        return 1; // Full intensity during hold
      case 'exhale':
        return 1 - progress; // 1 to 0
      case 'pause':
        return 0.2; // Low intensity during pause
      default:
        return 0.5;
    }
  };

  const intensity = getIntensity();

  // Get phase-specific styling
  const getPhaseStyle = () => {
    const baseOpacity = 0.7 + (intensity * 0.3); // 0.7 to 1.0
    const baseScale = 0.95 + (intensity * 0.1); // 0.95 to 1.05

    return {
      opacity: baseOpacity,
      transform: `scale(${baseScale})`,
      color: `hsl(var(--primary) / ${baseOpacity})`,
    };
  };

  const phaseStyle = getPhaseStyle();

  return (
    <div className={`flex flex-col items-center space-y-4 text-center ${className}`}>
      {/* Phase Icon */}
      <div 
        className={`
          text-4xl font-light transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={phaseStyle}
        aria-hidden="true"
      >
        {PHASE_ICONS[phase]}
      </div>

      {/* Main Coaching Message */}
      <div 
        className={`
          text-2xl font-light tracking-wide transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        style={{ color: 'hsl(var(--foreground) / 0.9)' }}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentMessage}
      </div>

      {/* Pattern Information (subtle) */}
      <div className="text-sm text-muted-foreground font-medium">
        {pattern.replace('-', '–')}
      </div>

      {/* Progress Visualization (dots) */}
      <div className="flex items-center space-x-1">
        {[...Array(Math.max(phaseDuration, 4))].map((_, index) => {
          const dotProgress = (index + 1) / phaseDuration;
          const isActive = progress >= dotProgress;
          
          return (
            <div
              key={index}
              className={`
                w-1 h-1 rounded-full transition-all duration-200
                ${isActive ? 'bg-primary' : 'bg-border/30'}
              `}
              style={{
                opacity: isActive ? intensity : 0.3,
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Subtle Phase Instruction */}
      <div 
        className="text-xs text-muted-foreground/60 max-w-xs"
        aria-hidden="true"
      >
        {phase === 'inhale' && 'Laissez l\'air remplir vos poumons naturellement'}
        {phase === 'hold' && 'Gardez l\'air confortablement, sans tension'}
        {phase === 'exhale' && 'Relâchez l\'air lentement et complètement'}
        {phase === 'pause' && 'Moment de calme avant le prochain cycle'}
      </div>
    </div>
  );
};