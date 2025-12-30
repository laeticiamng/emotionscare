/**
 * Score Display - Affichage en temps réel du score et des métriques
 */

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Target, Clock, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  bubblesPopped: number;
  elapsedTime: number;
  heartRate?: number;
  coherence?: number;
  combo?: number;
  isPlaying: boolean;
}

export const ScoreDisplay = memo(function ScoreDisplay({
  score,
  bubblesPopped,
  elapsedTime,
  heartRate = 72,
  coherence = 75,
  combo = 0,
  isPlaying
}: ScoreDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const metrics = [
    {
      icon: Target,
      label: 'Score',
      value: score.toLocaleString(),
      color: 'text-primary',
      highlight: true
    },
    {
      icon: Zap,
      label: 'Bulles',
      value: bubblesPopped,
      color: 'text-amber-500'
    },
    {
      icon: Clock,
      label: 'Temps',
      value: formatTime(elapsedTime),
      color: 'text-cyan-500'
    },
    {
      icon: Heart,
      label: 'BPM',
      value: Math.round(heartRate),
      color: 'text-rose-500',
      animate: isPlaying
    }
  ];

  return (
    <div className="space-y-3">
      {/* Score principal */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <motion.div 
                key={score}
                initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                className="text-4xl font-bold"
              >
                {score.toLocaleString()}
              </motion.div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>

            {/* Combo indicator */}
            <AnimatePresence>
              {combo > 1 && (
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 10 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-2xl font-bold text-amber-500">
                    x{combo}
                  </div>
                  <div className="text-xs text-amber-500/70">COMBO</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Métriques secondaires */}
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'p-2 rounded-lg bg-muted/30 text-center',
                metric.highlight && 'bg-primary/10'
              )}
            >
              <motion.div
                animate={metric.animate ? { 
                  scale: [1, 1.1, 1] 
                } : {}}
                transition={{ 
                  duration: 60 / heartRate, 
                  repeat: metric.animate ? Infinity : 0 
                }}
              >
                <Icon className={cn('w-4 h-4 mx-auto mb-1', metric.color)} />
              </motion.div>
              <div className="text-lg font-bold">{metric.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase">
                {metric.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Barre de cohérence */}
      {isPlaying && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Cohérence cardiaque</span>
            <span className="font-medium">{coherence}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${coherence}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default ScoreDisplay;
