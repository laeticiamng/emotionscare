// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw, X } from 'lucide-react';
import { useGritQuest } from '@/hooks/useGritQuest';

interface GritTipsProps {
  questId: string;
  userContext?: any;
  className?: string;
}

export const GritTips: React.FC<GritTipsProps> = ({
  questId,
  userContext = {},
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { tips, loadTips } = useGritQuest();

  // Load tips on mount
  useEffect(() => {
    loadTips(userContext);
  }, [questId, loadTips]);

  // Auto-show tips periodically during active session
  useEffect(() => {
    if (tips.length > 0) {
      const showInterval = setInterval(() => {
        setIsVisible(true);
        // Auto-hide after 8 seconds if user doesn't interact
        setTimeout(() => {
          setIsVisible(false);
        }, 8000);
      }, 30000); // Show every 30 seconds

      return () => clearInterval(showInterval);
    }
  }, [tips]);

  const showNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    setIsVisible(true);
  };

  const hideTips = () => {
    setIsVisible(false);
  };

  const refreshTips = () => {
    loadTips(userContext);
    setCurrentTipIndex(0);
    setIsVisible(true);
  };

  if (tips.length === 0) {
    return null;
  }

  const currentTip = tips[currentTipIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Floating tip trigger button */}
      {!isVisible && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-20 right-6 z-40"
        >
          <Button
            onClick={showNextTip}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            aria-label="Afficher un conseil de persévérance"
          >
            <Lightbulb className="h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {/* Tip card */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{
              type: "spring",
              duration: 0.4,
              bounce: 0.25
            }}
            className="fixed bottom-20 right-6 left-6 md:left-auto md:w-80 z-50"
          >
            <Card className="bg-primary text-primary-foreground shadow-2xl border-0 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>

              <CardContent className="relative p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Lightbulb className="h-5 w-5 text-primary-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-relaxed">
                      {currentTip}
                    </p>
                  </div>

                  <Button
                    onClick={hideTips}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-6 w-6 text-primary-foreground hover:bg-white/20"
                    aria-label="Fermer le conseil"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={showNextTip}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-primary-foreground hover:bg-white/20"
                      disabled={tips.length <= 1}
                    >
                      Suivant {tips.length > 1 && `(${currentTipIndex + 1}/${tips.length})`}
                    </Button>

                    <Button
                      onClick={refreshTips}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-primary-foreground hover:bg-white/20"
                      aria-label="Actualiser les conseils"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>

                  <span className="text-xs text-primary-foreground/80">
                    Micro-coaching
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GritTips;