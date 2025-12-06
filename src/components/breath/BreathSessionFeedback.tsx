import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Lightbulb, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import { logger } from '@/lib/logger';

export interface SessionFeedback {
  session_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  felt_calm?: boolean;
  felt_focused?: boolean;
  felt_relaxed?: boolean;
  experience?: string;
  notes?: string;
}

interface BreathSessionFeedbackProps {
  open: boolean;
  sessionDurationSec: number;
  onClose: () => void;
  onSubmit?: (feedback: SessionFeedback) => void;
}

const FeedbackQuestion: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean | undefined;
  onChange: (val: boolean) => void;
}> = ({ icon, label, description, value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={cn(
      'relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all',
      value
        ? 'border-amber-400/50 bg-amber-400/10'
        : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600/50'
    )}
  >
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div className="flex-1">
      <p className="font-medium text-slate-100">{label}</p>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <div className={cn(
      'flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all',
      value
        ? 'border-amber-400 bg-amber-400'
        : 'border-slate-600'
    )}>
      {value && <div className="h-full w-full flex items-center justify-center text-slate-950 text-xs font-bold">✓</div>}
    </div>
  </button>
);

export const BreathSessionFeedback: React.FC<BreathSessionFeedbackProps> = ({
  open,
  sessionDurationSec,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [feltCalm, setFeltCalm] = useState<boolean | undefined>(undefined);
  const [feltFocused, setFeltFocused] = useState<boolean | undefined>(undefined);
  const [feltRelaxed, setFeltRelaxed] = useState<boolean | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === null) return;

    setSubmitting(true);

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.user?.id) {
        logger.warn('No authenticated session for feedback', {}, 'SESSION');
        onClose();
        return;
      }

      // Store feedback in database
      const { error } = await supabase
        .from('breath_session_feedback')
        .insert({
          user_id: authSession.user.id,
          rating,
          felt_calm: feltCalm,
          felt_focused: feltFocused,
          felt_relaxed: feltRelaxed,
          notes: notes || null,
        });

      if (error) throw error;

      logger.info('session:feedback:submitted', { rating }, 'SESSION');

      onSubmit?.({
        session_id: '',
        rating,
        felt_calm: feltCalm,
        felt_focused: feltFocused,
        felt_relaxed: feltRelaxed,
        notes: notes || undefined,
      });

      onClose();
    } catch (error) {
      logger.error('Failed to submit feedback', error as Error, 'SESSION');
      Sentry.captureException(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl" data-zero-number-check="true">
        <DialogHeader>
          <DialogTitle className="text-xl">Merci d'avoir pratiqué ! 🙏</DialogTitle>
          <DialogDescription>
            Partage ton ressenti pour nous aider à personaliser tes futures sessions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Duration Info */}
          <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 p-4">
            <p className="text-sm text-slate-400">Durée de ta séance</p>
            <p className="text-2xl font-semibold text-slate-100 mt-1">
              {Math.floor(sessionDurationSec / 60)}min {sessionDurationSec % 60}s
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-slate-100">Comment tu te sens ?</Label>
            <div className="flex gap-2 justify-center">
              {([1, 2, 3, 4, 5] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={cn(
                    'flex items-center justify-center h-12 w-12 rounded-lg border-2 transition-all font-semibold text-lg',
                    rating === value
                      ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                      : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600'
                  )}
                  title={['Mal', 'Pas bien', 'Neutre', 'Bien', 'Excellent'][value - 1]}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 px-2">
              <span>Mal</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Feelings */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-slate-100">Ce que tu as ressenti</Label>
            <div className="space-y-2">
              <FeedbackQuestion
                icon={<Heart className="h-5 w-5 text-amber-400/70" />}
                label="Plus calme"
                description="Tu t'es senti·e plus apaisé·e et serein·e"
                value={feltCalm}
                onChange={setFeltCalm}
              />
              <FeedbackQuestion
                icon={<Lightbulb className="h-5 w-5 text-cyan-400/70" />}
                label="Plus concentré·e"
                description="Tu as trouvé plus de clarté mentale"
                value={feltFocused}
                onChange={setFeltFocused}
              />
              <FeedbackQuestion
                icon={<AlertCircle className="h-5 w-5 text-emerald-400/70" />}
                label="Plus détendu·e"
                description="Les tensions physiques ont diminué"
                value={feltRelaxed}
                onChange={setFeltRelaxed}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-slate-100">
              Notes personnelles (optionnel)
            </Label>
            <Textarea
              id="notes"
              placeholder="Partage tes impressions, ce qui t'a marqué, ou toute autre observation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20 bg-slate-900/50 border-slate-800/50 text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            Plus tard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === null || submitting}
            className="bg-amber-600/80 hover:bg-amber-600 text-amber-50 disabled:opacity-50"
          >
            {submitting ? 'Envoi...' : 'Envoyer mon ressenti'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
