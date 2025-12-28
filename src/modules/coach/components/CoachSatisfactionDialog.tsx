/**
 * CoachSatisfactionDialog - Dialog de feedback de satisfaction
 */

import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachSatisfactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (satisfaction: number, notes?: string) => Promise<void>;
}

export const CoachSatisfactionDialog = memo(function CoachSatisfactionDialog({
  open,
  onClose,
  onSubmit,
}: CoachSatisfactionDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(rating, notes.trim() || undefined);
      setRating(0);
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setRating(0);
    setNotes('');
    onClose();
  };

  const displayRating = hoveredRating || rating;

  const ratingLabels = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comment s'est passée cette session ?</DialogTitle>
          <DialogDescription>
            Ton retour nous aide à améliorer le coach IA. C'est optionnel et anonyme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Star rating */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {ratingLabels[displayRating]}
              </span>
            )}
          </div>

          {/* Optional notes */}
          <div className="space-y-2">
            <label htmlFor="satisfaction-notes" className="text-sm text-muted-foreground">
              Un commentaire ? (optionnel)
            </label>
            <Textarea
              id="satisfaction-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ce qui t'a plu, ce qu'on pourrait améliorer..."
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={handleSkip}>
            Passer
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
