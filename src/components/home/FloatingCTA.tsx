/**
 * FloatingCTA - CTA flottant qui apparaît au scroll
 * Avec tracking analytics intégré
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FloatingCTAProps {
  className?: string;
  showAfterScroll?: number; // en pixels
  hideOnMobile?: boolean;
  onView?: () => void;
  onClick?: () => void;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({
  className,
  showAfterScroll = 500,
  hideOnMobile = false,
  onView,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  // Tracker la vue quand le CTA devient visible
  useEffect(() => {
    if (isVisible && !hasTrackedView && !isDismissed) {
      onView?.();
      setHasTrackedView(true);
    }
  }, [isVisible, hasTrackedView, isDismissed, onView]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            hideOnMobile && 'hidden md:block',
            className
          )}
        >
          <div className="relative">
            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-muted border border-border hover:bg-muted/80 transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="h-3 w-3" />
            </button>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="shadow-2xl hover:shadow-primary/25 transition-all group px-6 py-6"
              onClick={handleClick}
            >
              <Link to="/b2c">
                <Heart className="h-5 w-5 mr-2 group-hover:animate-heartbeat" aria-hidden="true" />
                Essai gratuit 30 jours
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </Button>

            {/* Pulse animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-lg bg-primary -z-10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
