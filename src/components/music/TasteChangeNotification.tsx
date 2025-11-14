/**
 * Notification de changement de goût musical
 * Affiche une notification push quand des changements sont détectés
 */

import React, { useEffect, useState } from 'react';
import { LazyMotionWrapper, m, AnimatePresence } from '@/utils/lazy-motion';
import { X, TrendingUp, Sparkles, ExternalLink } from '@/components/music/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface TasteChangeNotificationProps {
  suggestedGenres: string[];
  confidence: number;
  onDismiss: () => void;
  onViewAnalytics: () => void;
}

export const TasteChangeNotification: React.FC<TasteChangeNotificationProps> = ({
  suggestedGenres,
  confidence,
  onDismiss,
  onViewAnalytics,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    logger.info('Taste change notification shown', { 
      suggestedGenres: suggestedGenres.length,
      confidence 
    }, 'MUSIC');

    // Auto-dismiss après 15 secondes
    const timer = setTimeout(() => {
      handleDismiss();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleViewAnalytics = () => {
    onViewAnalytics();
    handleDismiss();
  };

  return (
    <LazyMotionWrapper>
      <AnimatePresence>
        {isVisible && (
          <m.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Évolution de vos goûts détectée
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1 -mr-1"
                      onClick={handleDismiss}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    Nous avons remarqué une évolution dans vos préférences musicales
                  </p>

                  {/* Suggested Genres */}
                  {suggestedGenres.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium mb-2 text-muted-foreground">
                        Nouveaux genres à découvrir :
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestedGenres.map((genre, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Confiance :</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <m.div
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <span className="font-medium">{Math.round(confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleViewAnalytics}
                      className="flex-1 h-8 text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1.5" />
                      Voir Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDismiss}
                      className="h-8 text-xs"
                    >
                      Plus tard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </m.div>
      )}
    </AnimatePresence>
    </LazyMotionWrapper>
  );
};
