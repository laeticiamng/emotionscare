/**
 * Game Controls - Contrôles du jeu Bubble Beat
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, RotateCcw, Heart, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type GameMode = 'calm' | 'energetic' | 'focus';
type GamePhase = 'idle' | 'playing' | 'paused' | 'completed';

interface GameControlsProps {
  phase: GamePhase;
  mode: GameMode;
  difficulty: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: number) => void;
}

const MODES = [
  {
    id: 'calm' as const,
    name: 'Détente',
    icon: Heart,
    color: 'from-blue-400 to-cyan-500',
    description: 'Relaxation profonde'
  },
  {
    id: 'energetic' as const,
    name: 'Énergie',
    icon: Zap,
    color: 'from-orange-400 to-red-500',
    description: 'Boost dynamique'
  },
  {
    id: 'focus' as const,
    name: 'Focus',
    icon: Target,
    color: 'from-purple-400 to-pink-500',
    description: 'Concentration intense'
  }
];

const DIFFICULTIES = [
  { level: 1, name: 'Facile' },
  { level: 2, name: 'Normal' },
  { level: 3, name: 'Difficile' },
  { level: 4, name: 'Expert' },
  { level: 5, name: 'Maître' }
];

export const GameControls = memo(function GameControls({
  phase,
  mode,
  difficulty,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onModeChange,
  onDifficultyChange
}: GameControlsProps) {
  const isDisabled = phase === 'playing' || phase === 'paused';

  return (
    <div className="space-y-4">
      {/* Sélection du mode */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Mode de jeu
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(m => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            
            return (
              <motion.button
                key={m.id}
                onClick={() => !isDisabled && onModeChange(m.id)}
                disabled={isDisabled}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                className={cn(
                  'p-3 rounded-xl border-2 text-center transition-all',
                  isSelected
                    ? `bg-gradient-to-br ${m.color} text-white border-transparent`
                    : 'bg-muted/30 border-border/50 hover:border-border',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{m.name}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sélection de la difficulté */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Difficulté
        </h3>
        <div className="flex gap-1">
          {DIFFICULTIES.map(d => (
            <Button
              key={d.level}
              variant={difficulty === d.level ? 'default' : 'outline'}
              size="sm"
              onClick={() => !isDisabled && onDifficultyChange(d.level)}
              disabled={isDisabled}
              className="flex-1"
            >
              {d.level}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {DIFFICULTIES.find(d => d.level === difficulty)?.name}
        </p>
      </div>

      {/* Boutons de contrôle */}
      <div className="flex gap-2 pt-2">
        {phase === 'idle' || phase === 'completed' ? (
          <Button 
            onClick={onStart} 
            className="flex-1 gap-2"
            size="lg"
          >
            <Play className="w-5 h-5" />
            Jouer
          </Button>
        ) : phase === 'playing' ? (
          <>
            <Button 
              onClick={onPause} 
              variant="secondary"
              className="flex-1 gap-2"
            >
              <Pause className="w-5 h-5" />
              Pause
            </Button>
            <Button 
              onClick={onStop} 
              variant="destructive"
              size="icon"
            >
              <Square className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={onResume} 
              className="flex-1 gap-2"
            >
              <Play className="w-5 h-5" />
              Reprendre
            </Button>
            <Button 
              onClick={onStop} 
              variant="destructive"
              size="icon"
            >
              <Square className="w-5 h-5" />
            </Button>
          </>
        )}

        {phase === 'completed' && (
          <Button 
            onClick={onReset} 
            variant="outline"
            size="icon"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
});

export default GameControls;
