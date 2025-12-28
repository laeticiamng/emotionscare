/**
 * Bouton d'entrée du module SEUIL
 * "Ça commence" - accessible depuis Emotion Square et le Parc émotionnel
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Waves } from 'lucide-react';
import { SEUIL_BUTTON_TEXT } from '../constants';

interface SeuilTriggerButtonProps {
  onClick: () => void;
  variant?: 'default' | 'compact' | 'park';
  className?: string;
}

export const SeuilTriggerButton: React.FC<SeuilTriggerButtonProps> = memo(({
  onClick,
  variant = 'default',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={`gap-2 border-dashed hover:border-solid transition-all ${className}`}
      >
        <Waves className="w-4 h-4" />
        {SEUIL_BUTTON_TEXT}
      </Button>
    );
  }

  if (variant === 'park') {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative group p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-rose-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all ${className}`}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500/30 to-rose-500/30 flex items-center justify-center"
          >
            <Waves className="w-6 h-6 text-amber-500" />
          </motion.div>
          
          <h3 className="font-semibold text-foreground mb-1">Zone Seuil</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Le moment fragile avant la bascule
          </p>
          
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
            {SEUIL_BUTTON_TEXT}
          </span>
        </div>
      </motion.button>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Button
        onClick={onClick}
        variant="outline"
        size="lg"
        className="w-full gap-3 py-6 text-lg border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all group"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Waves className="w-6 h-6 text-amber-500 group-hover:text-amber-400" />
        </motion.div>
        <span className="text-foreground">{SEUIL_BUTTON_TEXT}</span>
      </Button>
    </motion.div>
  );
});

SeuilTriggerButton.displayName = 'SeuilTriggerButton';

export default SeuilTriggerButton;
