/**
 * CoachSatisfactionDialog - Dialog de feedback de satisfaction enrichi
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, ThumbsUp, ThumbsDown, Sparkles, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachSatisfactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (satisfaction: number, notes?: string, feedback?: SatisfactionFeedback) => Promise<void>;
}

interface SatisfactionFeedback {
  helpfulness: 'very_helpful' | 'somewhat_helpful' | 'not_helpful' | null;
  wouldRecommend: boolean | null;
  improvementAreas: string[];
}

const IMPROVEMENT_OPTIONS = [
  { id: 'response_speed', label: 'Rapidité des réponses', icon: Zap },
  { id: 'empathy', label: 'Empathie et compréhension', icon: Heart },
  { id: 'techniques', label: 'Techniques proposées', icon: Sparkles },
  { id: 'resources', label: 'Ressources suggérées', icon: ThumbsUp },
];

export const CoachSatisfactionDialog = memo(function CoachSatisfactionDialog({
  open,
  onClose,
  onSubmit,
}: CoachSatisfactionDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [helpfulness, setHelpfulness] = useState<'very_helpful' | 'somewhat_helpful' | 'not_helpful' | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [improvementAreas, setImprovementAreas] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      const feedback: SatisfactionFeedback = {
        helpfulness,
        wouldRecommend,
        improvementAreas,
      };
      await onSubmit(rating, notes.trim() || undefined, feedback);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setNotes('');
    setHelpfulness(null);
    setWouldRecommend(null);
    setImprovementAreas([]);
  };

  const handleSkip = () => {
    resetForm();
    onClose();
  };

  const toggleImprovement = (id: string) => {
    setImprovementAreas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const displayRating = hoveredRating || rating;
  const ratingLabels = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleSkip()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comment s'est passée cette session ?</DialogTitle>
          <DialogDescription>
            Ton retour nous aide à améliorer le coach IA. C'est optionnel et anonyme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
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

          {/* Helpfulness question */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Le coach t'a-t-il aidé ?</Label>
            <RadioGroup
              value={helpfulness ?? ''}
              onValueChange={(v) => setHelpfulness(v as typeof helpfulness)}
              className="flex flex-wrap gap-2"
            >
              <label className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition',
                helpfulness === 'very_helpful' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
              )}>
                <RadioGroupItem value="very_helpful" className="sr-only" />
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">Très utile</span>
              </label>
              <label className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition',
                helpfulness === 'somewhat_helpful' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
              )}>
                <RadioGroupItem value="somewhat_helpful" className="sr-only" />
                <span className="text-sm">Un peu</span>
              </label>
              <label className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition',
                helpfulness === 'not_helpful' ? 'bg-destructive/10 border-destructive' : 'hover:bg-muted'
              )}>
                <RadioGroupItem value="not_helpful" className="sr-only" />
                <ThumbsDown className="h-4 w-4" />
                <span className="text-sm">Pas vraiment</span>
              </label>
            </RadioGroup>
          </div>

          {/* Would recommend */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recommanderais-tu ce coach ?</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={wouldRecommend === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldRecommend(true)}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Oui
              </Button>
              <Button
                type="button"
                variant={wouldRecommend === false ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setWouldRecommend(false)}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                Non
              </Button>
            </div>
          </div>

          {/* Improvement areas */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quoi améliorer ? (optionnel)</Label>
            <div className="flex flex-wrap gap-2">
              {IMPROVEMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleImprovement(option.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition border',
                    improvementAreas.includes(option.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted hover:bg-muted/80 border-transparent'
                  )}
                >
                  <option.icon className="h-3 w-3" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div className="space-y-2">
            <Label htmlFor="satisfaction-notes" className="text-sm text-muted-foreground">
              Un commentaire ? (optionnel)
            </Label>
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
