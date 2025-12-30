/**
 * Contrôles de session AR avec démarrage/arrêt et feedback
 */

import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { ARFilter } from '../hooks/useARFilters';

interface ARSessionControlsProps {
  currentFilter: ARFilter | null;
  isSessionActive: boolean;
  isCameraActive: boolean;
  sessionDuration: number;
  onStartSession: () => void;
  onEndSession: (moodImpact?: string) => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ARSessionControls = memo<ARSessionControlsProps>(({
  currentFilter,
  isSessionActive,
  isCameraActive,
  sessionDuration,
  onStartSession,
  onEndSession,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleEndSession = () => {
    setShowFeedback(true);
  };

  const handleFeedback = (impact: string) => {
    setShowFeedback(false);
    onEndSession(impact);
  };

  const canStart = currentFilter && isCameraActive && !isSessionActive;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contrôles de session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-medium">
                {isSessionActive ? (
                  <span className="text-green-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Session active
                  </span>
                ) : (
                  <span className="text-muted-foreground">En attente</span>
                )}
              </p>
            </div>
            {isSessionActive && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Durée</p>
                <p className="font-mono text-lg font-bold text-primary">
                  {formatDuration(sessionDuration)}
                </p>
              </div>
            )}
          </div>

          {/* Current Filter Info */}
          {currentFilter && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Filtre actif</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentFilter.emoji}</span>
                <span className="font-medium">{currentFilter.name}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <AnimatePresence mode="wait">
            {isSessionActive ? (
              <motion.div
                key="stop"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button
                  onClick={handleEndSession}
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                >
                  <Square className="w-5 h-5" />
                  Terminer la session
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button
                  onClick={onStartSession}
                  disabled={!canStart}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Play className="w-5 h-5" />
                  Démarrer une session
                </Button>
                {!canStart && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {!isCameraActive 
                      ? 'Activez la caméra pour commencer'
                      : !currentFilter 
                        ? 'Sélectionnez un filtre pour commencer'
                        : ''}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment vous sentez-vous ?</DialogTitle>
            <DialogDescription>
              Votre feedback nous aide à améliorer l'expérience AR.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => handleFeedback('negative')}
              className="flex-col gap-2 h-auto py-6 hover:bg-red-50 hover:border-red-200"
            >
              <ThumbsDown className="w-8 h-8 text-red-500" />
              <span>Négatif</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleFeedback('neutral')}
              className="flex-col gap-2 h-auto py-6 hover:bg-gray-50"
            >
              <Minus className="w-8 h-8 text-gray-500" />
              <span>Neutre</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleFeedback('positive')}
              className="flex-col gap-2 h-auto py-6 hover:bg-green-50 hover:border-green-200"
            >
              <ThumbsUp className="w-8 h-8 text-green-500" />
              <span>Positif</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ARSessionControls.displayName = 'ARSessionControls';

export default ARSessionControls;