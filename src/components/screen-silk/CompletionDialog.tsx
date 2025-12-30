/**
 * Completion Dialog - Dialogue de fin de session
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ThumbsUp, Meh, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CompletionDialogProps {
  open: boolean;
  duration: number;
  blinkCount: number;
  onComplete: (label: 'gain' | 'léger' | 'incertain') => void;
  onCancel: () => void;
}

const LABELS = [
  {
    value: 'gain' as const,
    label: 'Gain',
    description: 'Je me sens reposé et rechargé',
    icon: ThumbsUp,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
  },
  {
    value: 'léger' as const,
    label: 'Léger',
    description: 'Effet modéré, mais positif',
    icon: Meh,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
  },
  {
    value: 'incertain' as const,
    label: 'Incertain',
    description: 'Je ne suis pas sûr de l\'effet',
    icon: ThumbsDown,
    color: 'text-slate-500 bg-slate-500/10 border-slate-500/30 hover:bg-slate-500/20'
  }
];

export const CompletionDialog = memo(function CompletionDialog({
  open,
  duration,
  blinkCount,
  onComplete,
  onCancel
}: CompletionDialogProps) {
  const [selectedLabel, setSelectedLabel] = useState<'gain' | 'léger' | 'incertain' | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} minutes`;
  };

  const handleComplete = () => {
    if (selectedLabel) {
      onComplete(selectedLabel);
      setSelectedLabel(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </motion.div>
          </div>
          <DialogTitle className="text-center">Session terminée</DialogTitle>
          <DialogDescription className="text-center">
            Vous avez complété {formatDuration(duration)} de pause visuelle avec {blinkCount} clignements guidés.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Comment vous sentez-vous ?
          </p>

          <div className="grid gap-3">
            {LABELS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedLabel === item.value;
              
              return (
                <motion.button
                  key={item.value}
                  onClick={() => setSelectedLabel(item.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                    item.color,
                    isSelected && 'ring-2 ring-offset-2 ring-primary'
                  )}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm opacity-70">{item.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleComplete} disabled={!selectedLabel}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default CompletionDialog;
