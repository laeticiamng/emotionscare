/**
 * BattleArena - Zone de combat principale
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Pause, Play, Heart, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { StimulusCard } from './StimulusCard';
import { useBounceStore, StimulusSpec } from '@/store/bounce.store';

interface BattleArenaProps {
  onPause: () => void;
  onResume: () => void;
  onUseCalmBoost: () => void;
  onProcessStimulus: (id: string) => void;
  onEndBattle: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  onPause,
  onResume,
  onUseCalmBoost,
  onProcessStimulus,
  onEndBattle
}) => {
  const store = useBounceStore();
  const [activeStimuli, setActiveStimuli] = useState<StimulusSpec[]>([]);
  
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
  const duration = mode === 'intense' ? 240 : 180;
  const progressPercent = ((duration - timeLeft) / duration) * 100;

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDismissStimulus = (id: string) => {
    onProcessStimulus(id);
  };

  return (
    <div className="min-h-[500px] relative">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Mode {mode === 'intense' ? 'Intense' : 'Standard'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Calm Boost */}
          <Button
            variant="outline"
            size="sm"
            onClick={onUseCalmBoost}
            disabled={calmBoostCount >= 2 || isCalming || isPaused}
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
            Calm ({2 - calmBoostCount})
          </Button>
          
          {/* Pause/Resume */}
          <Button
            variant="outline"
            size="sm"
            onClick={isPaused ? onResume : onPause}
            disabled={isCalming}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          
          {/* Timer */}
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={`font-mono text-lg font-bold ${timeLeft < 30 ? 'text-destructive' : 'text-foreground'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progressPercent} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Début</span>
          <span>{Math.round(progressPercent)}%</span>
          <span>Fin</span>
        </div>
      </div>

      {/* Battle Zone */}
      <div className="relative min-h-[300px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border p-6">
        
        {/* Calming Overlay */}
        <AnimatePresence>
          {isCalming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-info/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Heart className="w-16 h-16 text-info mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Respirez...</h3>
                <p className="text-muted-foreground">Prenez 20 secondes pour vous recentrer</p>
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
            >
              <div className="text-center">
                <Pause className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Pause</h3>
                <Button onClick={onResume} className="gap-2">
                  <Play className="w-4 h-4" />
                  Reprendre
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stimuli Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {activeStimuli.map((stimulus) => (
              <motion.div
                key={stimulus.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                layout
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
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
