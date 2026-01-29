/**
 * MicroFeedback - Composant de micro-feedback rapide
 * Permet aux utilisateurs de donner un retour en 1 clic
 * @version 1.0.0
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Heart, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

type FeedbackType = 'helpful' | 'not_helpful' | 'love' | 'inspiring';

interface MicroFeedbackProps {
  context: string; // ex: "breath-session-123", "journal-entry-456"
  variant?: 'inline' | 'floating';
  className?: string;
  onFeedback?: (type: FeedbackType) => void;
}

interface FeedbackOption {
  type: FeedbackType;
  icon: typeof ThumbsUp;
  label: string;
  color: string;
}

const feedbackOptions: FeedbackOption[] = [
  { type: 'helpful', icon: ThumbsUp, label: 'Utile', color: 'text-success hover:bg-success/10' },
  { type: 'not_helpful', icon: ThumbsDown, label: 'Pas utile', color: 'text-destructive hover:bg-destructive/10' },
  { type: 'love', icon: Heart, label: 'J\'adore', color: 'text-primary hover:bg-primary/10' },
  { type: 'inspiring', icon: Sparkles, label: 'Inspirant', color: 'text-warning hover:bg-warning/10' },
];

const MicroFeedback: React.FC<MicroFeedbackProps> = ({
  context,
  variant = 'inline',
  className,
  onFeedback
}) => {
  const [submitted, setSubmitted] = useState<FeedbackType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFeedback = async (type: FeedbackType) => {
    if (submitted) return;
    
    setIsAnimating(true);
    setSubmitted(type);
    
    logger.info('micro-feedback.submitted', { context, type }, 'FEEDBACK');
    
    // Callback externe
    onFeedback?.(type);
    
    // Animation terminée
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Check className="h-4 w-4 text-success" />
        </motion.div>
        <span>Merci pour votre retour !</span>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        variant === 'floating' && 'fixed bottom-20 right-4 bg-card/95 backdrop-blur-sm p-2 rounded-lg border shadow-lg',
        className
      )}
    >
      <span className="text-xs text-muted-foreground mr-2">Ce contenu vous a-t-il aidé ?</span>
      <AnimatePresence>
        {feedbackOptions.slice(0, 2).map((option) => {
          const IconComponent = option.icon;
          return (
            <motion.div key={option.type} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(option.type)}
                disabled={isAnimating}
                className={cn('h-8 w-8 p-0', option.color)}
                aria-label={option.label}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default memo(MicroFeedback);
