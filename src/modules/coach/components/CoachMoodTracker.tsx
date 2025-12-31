/**
 * CoachMoodTracker - Suivi de l'humeur avant/après session
 */

import { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Frown, Meh, Smile, Sparkles, Heart } from 'lucide-react';

interface MoodData {
  value: number;
  label: string;
  timestamp: string;
}

interface CoachMoodTrackerProps {
  type: 'before' | 'after';
  onSubmit: (mood: MoodData) => void;
  previousMood?: number;
  className?: string;
}

const moodIcons = [
  { icon: Frown, color: 'text-red-500', label: 'Très mal' },
  { icon: Frown, color: 'text-orange-500', label: 'Mal' },
  { icon: Meh, color: 'text-yellow-500', label: 'Moyen' },
  { icon: Smile, color: 'text-lime-500', label: 'Bien' },
  { icon: Sparkles, color: 'text-green-500', label: 'Très bien' },
];

export const CoachMoodTracker = memo(function CoachMoodTracker({
  type,
  onSubmit,
  previousMood,
  className
}: CoachMoodTrackerProps) {
  const [moodValue, setMoodValue] = useState<number>(3);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    const moodData: MoodData = {
      value: moodValue,
      label: moodIcons[moodValue - 1]?.label || 'Moyen',
      timestamp: new Date().toISOString()
    };
    onSubmit(moodData);
    setSubmitted(true);
  }, [moodValue, onSubmit]);

  // Calculate mood change
  const moodChange = previousMood !== undefined ? moodValue - previousMood : null;

  if (submitted) {
    return (
      <Card className={cn('border-dashed bg-muted/30', className)}>
        <CardContent className="flex items-center justify-center gap-3 py-4">
          <Heart className="h-5 w-5 text-pink-500" />
          <span className="text-sm text-muted-foreground">
            Merci pour ton partage !
            {moodChange !== null && moodChange > 0 && (
              <span className="ml-2 text-green-600 dark:text-green-400">
                (+{moodChange} points de mieux-être)
              </span>
            )}
          </span>
        </CardContent>
      </Card>
    );
  }

  const CurrentIcon = moodIcons[moodValue - 1]?.icon || Meh;
  const currentColor = moodIcons[moodValue - 1]?.color || 'text-yellow-500';
  const currentLabel = moodIcons[moodValue - 1]?.label || 'Moyen';

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <CurrentIcon className={cn('h-5 w-5 transition-colors', currentColor)} />
          {type === 'before' 
            ? 'Comment te sens-tu maintenant ?' 
            : 'Comment te sens-tu après notre échange ?'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          {moodIcons.map((mood, index) => {
            const Icon = mood.icon;
            const isActive = index + 1 === moodValue;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setMoodValue(index + 1)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
                  isActive 
                    ? 'bg-primary/10 scale-110' 
                    : 'opacity-50 hover:opacity-80'
                )}
                aria-label={mood.label}
              >
                <Icon className={cn('h-6 w-6', mood.color)} />
                <span className="text-[10px] text-muted-foreground">{index + 1}</span>
              </button>
            );
          })}
        </div>

        <Slider
          value={[moodValue]}
          onValueChange={([value]) => setMoodValue(value)}
          min={1}
          max={5}
          step={1}
          className="py-2"
          aria-label="Niveau de bien-être"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{currentLabel}</span>
          <Button size="sm" onClick={handleSubmit}>
            Valider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
