/**
 * BattleArena - Zone de combat principale avec score temps réel et calm boost timer
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Pause, Play, Heart, Clock, Zap, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StimulusCard } from './StimulusCard';
import { useBounceStore, StimulusSpec } from '@/store/bounce.store';

interface BattleArenaProps {
  onPause: () => void;
  onResume: () => void;
  onUseCalmBoost: () => void;
  onProcessStimulus: (id: string) => void;
  onEndBattle: () => void;
}

// XP multipliers per mode
const XP_MULTIPLIERS: Record<string, number> = {
  quick: 1,
  standard: 1.5,
  zen: 1.25,
  challenge: 2
};

export const BattleArena: React.FC<BattleArenaProps> = ({
  onPause,
  onResume,
  onUseCalmBoost,
  onProcessStimulus,
  onEndBattle
}) => {
  const store = useBounceStore();
  const [activeStimuli, setActiveStimuli] = useState<StimulusSpec[]>([]);
  const [calmTimer, setCalmTimer] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastProcessTime, setLastProcessTime] = useState<number | null>(null);
  
  const { 
    phase, 
    mode, 
    timeLeft, 
    stimuli, 
    processedStimuli,
    calmBoostCount 
  } = store;

  const isPaused = phase === 'paused';
  const isCalming = phase === 'calming';
  
  // Duration based on mode
  const durationMap: Record<string, number> = {
    quick: 90,
    standard: 180,
    zen: 240,
    challenge: 300
  };
  const duration = durationMap[mode] || 180;
  const progressPercent = ((duration - timeLeft) / duration) * 100;
  const xpMultiplier = XP_MULTIPLIERS[mode] || 1;

  // Calm boost countdown (20 seconds)
  useEffect(() => {
    if (isCalming) {
      setCalmTimer(20);
      const interval = setInterval(() => {
        setCalmTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCalmTimer(0);
    }
  }, [isCalming]);

  // Filter active (unprocessed) stimuli that have triggered
  useEffect(() => {
    const elapsed = duration - timeLeft;
    const triggered = stimuli.filter(s => 
      s.at <= elapsed && 
      !s.processed && 
      !processedStimuli.includes(s.id)
    );
    setActiveStimuli(triggered);
  }, [timeLeft, stimuli, processedStimuli, duration]);

  // Calculate score based on processed stimuli and combo
  const handleDismissStimulus = useCallback((id: string) => {
    const now = Date.now();
    
    // Combo system: if processed within 3 seconds of last, increase combo
    if (lastProcessTime && now - lastProcessTime < 3000) {
      setCombo(prev => Math.min(prev + 1, 5));
    } else {
      setCombo(1);
    }
    setLastProcessTime(now);
    
    // Calculate points: base 10 * combo * mode multiplier
    const points = Math.round(10 * (combo + 1) * xpMultiplier);
    setCurrentScore(prev => prev + points);
    
    onProcessStimulus(id);
  }, [lastProcessTime, combo, xpMultiplier, onProcessStimulus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[500px] relative" role="main" aria-label="Zone de bataille">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="font-semibold text-foreground">Mode {mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
          </div>
          {xpMultiplier > 1 && (
            <Badge variant="secondary" className="bg-warning/20 text-warning">
              x{xpMultiplier} XP
            </Badge>
          )}
        </div>
        
        {/* Real-time Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-lg border border-success/30">
            <Trophy className="w-4 h-4 text-success" aria-hidden="true" />
            <span className="font-bold text-success">{currentScore}</span>
            {combo > 1 && (
              <Badge className="bg-warning text-warning-foreground text-xs">
                x{combo} combo
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Calm Boost with remaining count */}
          <Button
            variant="outline"
            size="sm"
            onClick={onUseCalmBoost}
            disabled={calmBoostCount >= 2 || isCalming || isPaused}
            className="gap-2"
            aria-label={`Utiliser calm boost. ${2 - calmBoostCount} restants`}
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            Calm ({2 - calmBoostCount})
          </Button>
          
          {/* Pause/Resume */}
          <Button
            variant="outline"
            size="sm"
            onClick={isPaused ? onResume : onPause}
            disabled={isCalming}
            aria-label={isPaused ? 'Reprendre' : 'Mettre en pause'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          
          {/* Timer */}
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg" role="timer" aria-label={`Temps restant: ${formatTime(timeLeft)}`}>
            <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className={`font-mono text-lg font-bold ${timeLeft < 30 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progressPercent} className="h-2" aria-label={`Progression: ${Math.round(progressPercent)}%`} />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Début</span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {processedStimuli.length} géré{processedStimuli.length > 1 ? 's' : ''}
          </span>
          <span>Fin</span>
        </div>
      </div>

      {/* Battle Zone */}
      <div className="relative min-h-[300px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border p-6">
        
        {/* Calming Overlay with countdown */}
        <AnimatePresence>
          {isCalming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-info/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-20"
              role="dialog"
              aria-label="Mode calme activé"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Heart className="w-16 h-16 text-info mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Respirez...</h3>
                <p className="text-muted-foreground mb-4">Prenez un moment pour vous recentrer</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-16 h-16 rounded-full border-4 border-info flex items-center justify-center">
                    <span className="text-2xl font-bold text-info">{calmTimer}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">secondes</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paused Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-20"
              role="dialog"
              aria-label="Jeu en pause"
            >
              <div className="text-center">
                <Pause className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Pause</h3>
                <p className="text-muted-foreground mb-4">Score actuel: {currentScore} pts</p>
                <Button onClick={onResume} className="gap-2">
                  <Play className="w-4 h-4" />
                  Reprendre
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stimuli Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Stimuli actifs">
          <AnimatePresence mode="popLayout">
            {activeStimuli.map((stimulus) => (
              <motion.div
                key={stimulus.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                layout
                role="listitem"
              >
                <StimulusCard
                  stimulus={stimulus}
                  onDismiss={() => handleDismissStimulus(stimulus.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {activeStimuli.length === 0 && !isPaused && !isCalming && (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <p>En attente du prochain stimulus...</p>
                <p className="text-sm">Restez vigilant !</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-6">
        <Button
          variant="destructive"
          onClick={onEndBattle}
          disabled={isPaused || isCalming}
        >
          Terminer la bataille
        </Button>
      </div>
    </div>
  );
};
