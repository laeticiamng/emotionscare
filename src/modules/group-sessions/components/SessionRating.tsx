/**
 * Composant de notation d'une session
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SessionRatingProps {
  sessionId: string;
  sessionTitle: string;
  onSubmit: (rating: number, feedback?: string) => Promise<void>;
  onSkip?: () => void;
}

export const SessionRating: React.FC<SessionRatingProps> = ({
  sessionTitle,
  onSubmit,
  onSkip,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      await onSubmit(rating, feedback || undefined);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <CardContent className="py-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 mx-auto text-green-500 mb-3" />
          </motion.div>
          <h3 className="font-semibold text-lg">Merci pour votre avis !</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Votre retour aide à améliorer les sessions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Comment était cette session ?</CardTitle>
        <p className="text-sm text-muted-foreground">{sessionTitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-all duration-150',
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/40'
                )}
              />
            </motion.button>
          ))}
        </div>

        {/* Rating label */}
        {rating > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm font-medium"
          >
            {rating === 1 && '😕 Décevant'}
            {rating === 2 && '😐 Peut mieux faire'}
            {rating === 3 && '🙂 Correct'}
            {rating === 4 && '😊 Très bien'}
            {rating === 5 && '🤩 Excellent !'}
          </motion.p>
        )}

        {/* Feedback */}
        {rating > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Textarea
              placeholder="Un commentaire ? (optionnel)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onSkip && (
            <Button variant="ghost" onClick={onSkip} className="flex-1">
              Plus tard
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 gap-2"
          >
            <Send className="h-4 w-4" />
            Envoyer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionRating;
