/**
 * MoodSlider - Slider pour évaluer l'humeur avant/après session
 */

import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface MoodSliderProps {
  onSubmit: (value: number) => void;
  onSkip?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

const moodLabels = [
  { value: 0, emoji: '😰', label: 'Très tendu' },
  { value: 25, emoji: '😕', label: 'Un peu tendu' },
  { value: 50, emoji: '😐', label: 'Neutre' },
  { value: 75, emoji: '🙂', label: 'Détendu' },
  { value: 100, emoji: '😌', label: 'Très apaisé' },
];

export const MoodSlider = memo(({ 
  onSubmit, 
  onSkip, 
  title = 'Comment te sens-tu ?',
  description = 'Évalue ton niveau de tension actuel',
  className 
}: MoodSliderProps) => {
  const [value, setValue] = useState(50);

  const getCurrentMood = useCallback(() => {
    if (value <= 12) return moodLabels[0];
    if (value <= 37) return moodLabels[1];
    if (value <= 62) return moodLabels[2];
    if (value <= 87) return moodLabels[3];
    return moodLabels[4];
  }, [value]);

  const currentMood = getCurrentMood();

  const handleSubmit = useCallback(() => {
    onSubmit(value);
  }, [value, onSubmit]);

  return (
    <Card className={cn('border-primary/20 bg-card/60 backdrop-blur-xl', className)}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emoji actuel */}
        <motion.div
          key={currentMood.emoji}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-6xl">{currentMood.emoji}</span>
          <span className="text-lg font-medium text-foreground">{currentMood.label}</span>
        </motion.div>

        {/* Slider */}
        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={(v) => setValue(v[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
            aria-label="Niveau de bien-être"
          />
          
          {/* Labels du slider */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Tendu</span>
            <span>Apaisé</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirmer ({value}%)
          </Button>
          {onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Passer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

MoodSlider.displayName = 'MoodSlider';

export default MoodSlider;
