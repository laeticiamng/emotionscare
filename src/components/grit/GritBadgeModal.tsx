import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GritCompletionResult {
  badge_id: string;
  xp_gain: number;
  message: string;
}

interface GritBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GritCompletionResult | null;
}

export const GritBadgeModal: React.FC<GritBadgeModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management and confetti effect
  useEffect(() => {
    if (isOpen && result) {
      // Focus on continue button for accessibility
      setTimeout(() => {
        continueButtonRef.current?.focus();
      }, 100);

      // Trigger confetti animation
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [isOpen, result]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!result) return null;

  const getBadgeIcon = (badgeId: string) => {
    if (badgeId.includes('no-quit')) return <Trophy className="h-12 w-12 text-yellow-500" />;
    if (badgeId.includes('comeback')) return <Zap className="h-12 w-12 text-blue-500" />;
    if (badgeId.includes('cold-start')) return <Star className="h-12 w-12 text-purple-500" />;
    return <Trophy className="h-12 w-12 text-primary" />;
  };

  const getBadgeName = (badgeId: string) => {
    if (badgeId.includes('no-quit')) return 'No-Quit Hero';
    if (badgeId.includes('comeback')) return 'Comeback King';
    if (badgeId.includes('cold-start')) return 'Cold Start Champion';
    return 'Persévérance';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              duration: 0.5, 
              bounce: 0.3 
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background opacity-80" />
              
              {/* Close button */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 h-8 w-8"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader className="relative text-center pt-8 pb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                  className="flex justify-center mb-4"
                >
                  {getBadgeIcon(result.badge_id)}
                </motion.div>

                <CardTitle className="text-2xl font-bold text-center mb-2">
                  Beau boulot !
                </CardTitle>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-sm px-3 py-1 font-semibold"
                  >
                    {getBadgeName(result.badge_id)}
                  </Badge>
                </motion.div>
              </CardHeader>

              <CardContent className="relative text-center space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {result.message}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg"
                >
                  <Star className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">
                    +{result.xp_gain} XP
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    ref={continueButtonRef}
                    onClick={onClose}
                    size="lg"
                    className="w-full h-12 font-semibold"
                    aria-label="Continuer vers le tableau de bord"
                  >
                    Continuer
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-muted-foreground"
                >
                  Votre badge a été ajouté à votre collection !
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GritBadgeModal;