/**
 * TrackFeedback - Composant de feedback utilisateur pour les tracks générées
 * Permet de noter et donner son avis sur la musique
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface TrackFeedbackProps {
  trackId: string;
  sessionId?: string;
  onFeedbackSubmit?: (rating: number) => void;
  compact?: boolean;
}

export const TrackFeedback: React.FC<TrackFeedbackProps> = ({
  trackId,
  sessionId,
  onFeedbackSubmit,
  compact = false,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [emotionMatch, setEmotionMatch] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('music_track_feedback').insert({
        user_id: user.id,
        track_id: trackId,
        session_id: sessionId || null,
        rating,
        feedback_type: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
        emotion_match: emotionMatch,
        notes: notes.trim() || null,
        context: {
          submitted_at: new Date().toISOString(),
          source: 'suno_generator',
        },
      });

      if (error) throw error;

      setHasSubmitted(true);
      onFeedbackSubmit?.(rating);
      
      toast({
        title: 'Merci pour votre avis !',
        description: 'Votre feedback nous aide à améliorer les recommandations',
      });
    } catch (error) {
      logger.error('Failed to submit feedback', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le feedback',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <ThumbsUp className="h-4 w-4 text-green-500" />
        <span>Merci pour votre avis !</span>
      </div>
    );
  }

  // Handler pour compact mode avec rating correct
  const handleCompactSubmit = async (starRating: number) => {
    if (!user || isSubmitting) return;

    setRating(starRating);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('music_track_feedback').insert({
        user_id: user.id,
        track_id: trackId,
        session_id: sessionId || null,
        rating: starRating,
        feedback_type: starRating >= 4 ? 'positive' : starRating <= 2 ? 'negative' : 'neutral',
        emotion_match: null,
        notes: null,
        context: {
          submitted_at: new Date().toISOString(),
          source: 'compact_rating',
        },
      });

      if (error) throw error;

      setHasSubmitted(true);
      onFeedbackSubmit?.(starRating);
      
      toast({
        title: 'Merci !',
        description: `Note: ${starRating}/5`,
      });
    } catch (error) {
      logger.error('Failed to submit compact feedback', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le feedback',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleCompactSubmit(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 hover:scale-110 transition-transform"
            disabled={isSubmitting}
            aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                'h-4 w-4 transition-colors',
                (hoveredRating || rating) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        ))}
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-1" />}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-lg bg-muted/30 border">
      <div className="space-y-2">
        <p className="text-sm font-medium">Comment trouvez-vous cette musique ?</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 hover:scale-110 transition-transform"
              aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  (hoveredRating || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {rating > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-medium">Correspond-elle à votre humeur ?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={emotionMatch === true ? 'default' : 'outline'}
                onClick={() => setEmotionMatch(true)}
                className="gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                Oui
              </Button>
              <Button
                size="sm"
                variant={emotionMatch === false ? 'default' : 'outline'}
                onClick={() => setEmotionMatch(false)}
                className="gap-1"
              >
                <ThumbsDown className="h-4 w-4" />
                Non
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Commentaires (optionnel)</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ce que vous avez aimé ou pas..."
              rows={2}
              className="text-sm"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Envoyer mon avis
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default TrackFeedback;
