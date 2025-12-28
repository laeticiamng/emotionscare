/**
 * Message de sortie SEUIL
 * Affiche un message bienveillant à la fin de l'interaction
 */
import React, { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart } from 'lucide-react';
import { EXIT_MESSAGE } from '../constants';

interface SeuilExitMessageProps {
  onClose: () => void;
  actionTaken?: string;
}

export const SeuilExitMessage: React.FC<SeuilExitMessageProps> = memo(({
  onClose,
  actionTaken,
}) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-8 space-y-6"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"
      >
        <Heart className="w-10 h-10 text-emerald-500" />
      </motion.div>

      {/* Exit message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <p className="text-lg whitespace-pre-line leading-relaxed">
          {EXIT_MESSAGE}
        </p>
        
        {actionTaken && (
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            {actionTaken}
          </p>
        )}
      </motion.div>

      {/* Close button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          Fermer
        </Button>
      </motion.div>
    </motion.div>
  );
});

SeuilExitMessage.displayName = 'SeuilExitMessage';

export default SeuilExitMessage;
