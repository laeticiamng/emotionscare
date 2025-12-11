import React, { useMemo, useState, useEffect } from 'react';
import { Phase, Pattern } from '@/store/breath.store';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Star, Clock, TrendingUp } from 'lucide-react';

interface BreathRingProps {
  phase: Phase | null;
  phaseProgress: number;
  reducedMotion: boolean;
  pattern: Pattern;
  running: boolean;
  cycleCount?: number;
  totalCycles?: number;
  showStats?: boolean;
  sessionDuration?: number;
  onMilestone?: (milestone: string) => void;
}

interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  bestStreak: number;
  achievements: string[];
}

const MILESTONES = [
  { cycles: 5, name: 'Débutant', icon: '🌱' },
  { cycles: 10, name: 'Initié', icon: '🌿' },
  { cycles: 20, name: 'Pratiquant', icon: '🌳' },
  { cycles: 50, name: 'Expert', icon: '🏆' },
  { cycles: 100, name: 'Maître', icon: '👑' },
];

const STORAGE_KEY = 'breath-ring-stats';

export const BreathRing: React.FC<BreathRingProps> = ({
  phase,
  phaseProgress,
  reducedMotion,
  pattern,
  running,
  cycleCount = 0,
  totalCycles,
  showStats = true,
  sessionDuration = 0,
  onMilestone,
}) => {
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    bestStreak: 0,
    achievements: [],
  });
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [pulseEffect, setPulseEffect] = useState(false);

  const baseSize = 200;
  const strokeWidth = 4;
  const radius = (baseSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, []);

  // Check for milestones
  useEffect(() => {
    if (running && cycleCount > 0) {
      const milestone = MILESTONES.find(m => m.cycles === cycleCount);
      if (milestone && !stats.achievements.includes(milestone.name)) {
        setShowAchievement(milestone.name);
        setPulseEffect(true);
        
        // Update stats
        const updated = {
          ...stats,
          achievements: [...stats.achievements, milestone.name],
        };
        setStats(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        onMilestone?.(milestone.name);
        
        setTimeout(() => {
          setShowAchievement(null);
          setPulseEffect(false);
        }, 3000);
      }
    }
  }, [cycleCount, running]);

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

  // Color based on phase with gradients
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

  const getPhaseGradient = (currentPhase: Phase | null) => {
    switch (currentPhase) {
      case 'inhale':
        return ['hsl(var(--primary))', 'hsl(var(--primary) / 0.6)'];
      case 'hold':
        return ['hsl(var(--secondary))', 'hsl(var(--secondary) / 0.6)'];
      case 'exhale':
        return ['hsl(var(--accent))', 'hsl(var(--accent) / 0.6)'];
      default:
        return ['hsl(var(--muted))', 'hsl(var(--muted) / 0.6)'];
    }
  };

  // Phase labels
  const phaseLabels = {
    inhale: 'Inspire',
    hold: 'Retiens',
    exhale: 'Expire',
  };

  // Phase emoji
  const phaseEmoji = {
    inhale: '🌬️',
    hold: '⏸️',
    exhale: '💨',
  };

  // Progress circle offset
  const progressOffset = circumference - (phaseProgress * circumference);

  // Generate particles for visual effect
  const particles = useMemo(() => {
    if (reducedMotion || !running) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) * (Math.PI / 180),
      delay: i * 0.1,
      size: 2 + Math.random() * 2,
    }));
  }, [reducedMotion, running]);

  // Generate outer ring particles
  const outerParticles = useMemo(() => {
    if (reducedMotion || !running) return [];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      angle: (i * 60) * (Math.PI / 180),
    }));
  }, [reducedMotion, running]);

  // Cycle progress for outer ring
  const cycleProgress = totalCycles ? (cycleCount / totalCycles) * 100 : 0;

  // Current milestone progress
  const nextMilestone = MILESTONES.find(m => m.cycles > (stats.totalSessions * 10 + cycleCount));
  const currentMilestoneProgress = nextMilestone 
    ? ((stats.totalSessions * 10 + cycleCount) / nextMilestone.cycles) * 100 
    : 100;

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Achievement popup */}
      {showAchievement && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-2 text-sm">
            <Trophy className="h-4 w-4 mr-2" />
            Nouveau: {showAchievement}!
          </Badge>
        </div>
      )}

      {/* Stats badges (top) */}
      {showStats && running && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {sessionDuration > 0 && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(sessionDuration)}
            </Badge>
          )}
          {stats.currentStreak > 0 && (
            <Badge variant="outline" className="text-xs bg-orange-500/10 border-orange-500/30 text-orange-600">
              <Flame className="h-3 w-3 mr-1" />
              {stats.currentStreak}j
            </Badge>
          )}
        </div>
      )}

      {/* Outer achievement progress ring */}
      {showStats && nextMilestone && (
        <svg
          width={baseSize + 60}
          height={baseSize + 60}
          className="absolute"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <defs>
            <linearGradient id="achievementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
          </defs>
          <circle
            cx={(baseSize + 60) / 2}
            cy={(baseSize + 60) / 2}
            r={radius + 26}
            stroke="hsl(var(--border))"
            strokeWidth={3}
            fill="none"
            opacity={0.2}
            strokeDasharray="4 4"
          />
          <circle
            cx={(baseSize + 60) / 2}
            cy={(baseSize + 60) / 2}
            r={radius + 26}
            stroke="url(#achievementGradient)"
            strokeWidth={3}
            fill="none"
            strokeDasharray={2 * Math.PI * (radius + 26)}
            strokeDashoffset={2 * Math.PI * (radius + 26) * (1 - currentMilestoneProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
      )}

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
          
          {/* Outer particles */}
          {outerParticles.map((particle) => {
            const x = (baseSize + 40) / 2 + Math.cos(particle.angle) * (radius + 16);
            const y = (baseSize + 40) / 2 + Math.sin(particle.angle) * (radius + 16);
            return (
              <circle
                key={particle.id}
                cx={x}
                cy={y}
                r={2}
                fill="hsl(var(--primary))"
                opacity={0.4}
              />
            );
          })}
        </svg>
      )}

      {/* Main breathing ring */}
      <svg
        width={baseSize}
        height={baseSize}
        className={cn(
          'transition-transform ease-in-out',
          !reducedMotion && 'transform-gpu',
          pulseEffect && 'animate-pulse'
        )}
        style={{
          transform: reducedMotion ? 'scale(1)' : `scale(${currentScale})`,
          transitionDuration: phase === 'hold' ? '0ms' : '300ms',
        }}
      >
        <defs>
          <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getPhaseGradient(phase)[0]} />
            <stop offset="100%" stopColor={getPhaseGradient(phase)[1]} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

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
            stroke="url(#breathGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            className={cn(
              'transition-all duration-100 ease-linear',
              !reducedMotion && 'filter'
            )}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              filter: reducedMotion ? 'none' : 'url(#glow)',
            }}
          />
        )}
        
        {/* Inner glow effect */}
        {running && phase && !reducedMotion && (
          <>
            <circle
              cx={baseSize / 2}
              cy={baseSize / 2}
              r={radius * 0.7}
              fill={getPhaseColor(phase)}
              opacity={0.1 + (0.15 * phaseProgress)}
              className="transition-opacity duration-300"
            />
            <circle
              cx={baseSize / 2}
              cy={baseSize / 2}
              r={radius * 0.4}
              fill={getPhaseColor(phase)}
              opacity={0.05 + (0.1 * phaseProgress)}
              className="transition-opacity duration-300"
            />
          </>
        )}

        {/* Particles */}
        {particles.map((particle) => {
          const particleRadius = radius * (0.75 + 0.1 * Math.sin(phaseProgress * Math.PI));
          const x = baseSize / 2 + Math.cos(particle.angle + phaseProgress * Math.PI * 2) * particleRadius;
          const y = baseSize / 2 + Math.sin(particle.angle + phaseProgress * Math.PI * 2) * particleRadius;
          
          return (
            <circle
              key={particle.id}
              cx={x}
              cy={y}
              r={particle.size}
              fill={getPhaseColor(phase)}
              opacity={0.3 + (0.3 * Math.sin(phaseProgress * Math.PI + particle.delay))}
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
              {/* Phase emoji */}
              <div className="text-2xl mb-1">
                {phaseEmoji[phase]}
              </div>
              
              {/* Phase label */}
              <div className={cn(
                'text-lg font-semibold uppercase tracking-wide transition-all duration-300',
                phase === 'inhale' && 'text-primary',
                phase === 'hold' && 'text-secondary-foreground',
                phase === 'exhale' && 'text-accent-foreground'
              )}>
                {phaseLabels[phase]}
              </div>
              
              {/* Pattern */}
              <div className="text-xs text-muted-foreground mt-1">
                {pattern}
              </div>
              
              {/* Cycle count */}
              {showStats && (
                <div className="text-xs text-muted-foreground mt-2 opacity-70">
                  {cycleCount > 0 && (
                    <span className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3" />
                      Cycle {cycleCount}
                      {totalCycles && ` / ${totalCycles}`}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
          
          {!running && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Prêt à commencer
              </div>
              <div className="text-xs text-muted-foreground/60">
                {pattern}
              </div>
              
              {/* Stats when not running */}
              {showStats && stats.totalSessions > 0 && (
                <div className="mt-3 space-y-1">
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stats.totalSessions} sessions
                  </Badge>
                </div>
              )}
              
              {/* Next milestone */}
              {nextMilestone && (
                <div className="text-xs text-muted-foreground/60 mt-2">
                  Prochain: {nextMilestone.icon} {nextMilestone.name}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Achievement badges (bottom) */}
      {showStats && stats.achievements.length > 0 && !running && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {stats.achievements.slice(-3).map((achievement, i) => {
            const milestone = MILESTONES.find(m => m.name === achievement);
            return (
              <Badge key={i} variant="secondary" className="text-xs">
                {milestone?.icon}
              </Badge>
            );
          })}
          {stats.achievements.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{stats.achievements.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default BreathRing;
