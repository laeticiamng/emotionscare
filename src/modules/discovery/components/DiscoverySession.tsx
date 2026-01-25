/**
 * Session de découverte active
 * @module discovery
 */

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle, 
  Star,
  Clock,
  MessageSquare,
  Sparkles,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DiscoveryItem, DiscoverySession as SessionType } from '../types';

interface DiscoverySessionProps {
  session: SessionType | null;
  item: DiscoveryItem | undefined;
  onComplete: (rating?: number, notes?: string, moodAfter?: number) => void;
  onCancel: () => void;
}

export const DiscoverySessionPanel = memo(function DiscoverySessionPanel({
  session,
  item,
  onComplete,
  onCancel,
}: DiscoverySessionProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState('');
  const [moodAfter, setMoodAfter] = useState(7);

  // Timer
  useEffect(() => {
    if (!session || isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isPaused]);

  // Reset on new session
  useEffect(() => {
    if (session) {
      setElapsedSeconds(0);
      setIsPaused(false);
      setShowComplete(false);
      setRating(4);
      setNotes('');
      setMoodAfter(7);
    }
  }, [session?.id]);

  if (!session || !item) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min((elapsedSeconds / (item.estimatedMinutes * 60)) * 100, 100);

  const handleComplete = () => {
    onComplete(rating, notes || undefined, moodAfter);
    setShowComplete(false);
  };

  return (
    <>
      {/* Session Active Banner */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
      >
        <Card className="overflow-hidden border-primary/30 shadow-xl shadow-primary/10">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                    'bg-gradient-to-br',
                    item.color
                  )}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(elapsedSeconds)}</span>
                    <span>/</span>
                    <span>{item.estimatedMinutes}:00</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="flex-1 gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Reprendre
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={() => setShowComplete(true)}
                className="flex-1 gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Terminer
              </Button>
            </div>

            {/* XP Preview */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/50 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">Vous gagnerez</span>
              <span className="font-semibold text-amber-600">{item.xpReward} XP</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Complete Dialog */}
      <Dialog open={showComplete} onOpenChange={setShowComplete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Terminer la découverte
            </DialogTitle>
            <DialogDescription>
              Félicitations ! Comment s'est passée cette session ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Item Summary */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div 
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center text-xl',
                  'bg-gradient-to-br',
                  item.color
                )}
              >
                {item.icon}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{item.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(elapsedSeconds)}</span>
                  <Sparkles className="w-3 h-3 text-amber-500 ml-2" />
                  <span className="text-amber-600 font-medium">+{item.xpReward} XP</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Comment évaluez-vous cette découverte ?
              </label>
              <div className="flex items-center justify-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                      star <= rating 
                        ? 'bg-amber-500 text-white scale-110' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    )}
                  >
                    <Star className={cn('w-5 h-5', star <= rating && 'fill-current')} />
                  </button>
                ))}
              </div>
            </div>

            {/* Mood After */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Comment vous sentez-vous maintenant ? ({moodAfter}/10)
              </label>
              <Slider
                value={[moodAfter]}
                min={1}
                max={10}
                step={1}
                onValueChange={([value]) => setMoodAfter(value)}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>😔</span>
                <span>😊</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Notes (optionnel)
              </label>
              <Textarea
                placeholder="Partagez vos réflexions, insights ou apprentissages..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowComplete(false)}
              className="flex-1"
            >
              Continuer
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Terminer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default DiscoverySessionPanel;
