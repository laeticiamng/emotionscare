/**
 * BreathingFeedback - Feedback post-session
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ThumbsUp, Minus, ThumbsDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreathingProtocol } from './BreathingProtocols';

type FeedbackType = 'better' | 'same' | 'worse';

interface BreathingFeedbackProps {
  protocol: BreathingProtocol;
  durationSeconds: number;
  onSubmit: (feedback: FeedbackType) => Promise<void>;
  onSkip: () => void;
  isSubmitting?: boolean;
}

const feedbackOptions: { value: FeedbackType; label: string; emoji: string; icon: React.ElementType }[] = [
  { value: 'better', label: 'Mieux', emoji: '😌', icon: ThumbsUp },
  { value: 'same', label: 'Pareil', emoji: '😐', icon: Minus },
  { value: 'worse', label: 'Moins bien', emoji: '😔', icon: ThumbsDown },
];

export const BreathingFeedback: React.FC<BreathingFeedbackProps> = ({
  protocol,
  durationSeconds,
  onSubmit,
  onSkip,
  isSubmitting = false,
}) => {
  const [selected, setSelected] = useState<FeedbackType | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} secondes`;
    if (secs === 0) return `${mins} minute${mins > 1 ? 's' : ''}`;
    return `${mins}min ${secs}s`;
  };

  const handleSubmit = async () => {
    if (selected) {
      await onSubmit(selected);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardHeader className="text-center pb-2">
          <div className="text-4xl mb-2">{protocol.icon}</div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Session terminée !
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {protocol.name} • {formatDuration(durationSeconds)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-4">
              Comment te sens-tu après ?
            </h3>

            {/* Options de feedback */}
            <div className="flex justify-center gap-3">
              {feedbackOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selected === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => setSelected(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary',
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    )}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!selected || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
            <Button variant="ghost" onClick={onSkip} className="w-full">
              Passer
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BreathingFeedback;
