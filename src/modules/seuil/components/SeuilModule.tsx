/**
 * Module principal SEUIL
 * Expérience complète de régulation émotionnelle proactive
 * Avec intégration des mini-sessions guidées
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Waves } from 'lucide-react';
import { SeuilScale } from './SeuilScale';
import { SeuilMessage } from './SeuilMessage';
import { SeuilActions } from './SeuilActions';
import { SeuilExitMessage } from './SeuilExitMessage';
import { SeuilMiniSession } from './SeuilMiniSession';
import { useCreateSeuilEvent, useCompleteSeuilSession } from '../hooks';
import { getZoneFromLevel } from '../constants';
import type { SeuilActionType } from '../types';

interface SeuilModuleProps {
  onClose: () => void;
  initialLevel?: number;
}

type SeuilStep = 'scale' | 'message' | 'action' | 'mini-session' | 'exit';

export const SeuilModule: React.FC<SeuilModuleProps> = ({
  onClose,
  initialLevel = 50,
}) => {
  const [step, setStep] = useState<SeuilStep>('scale');
  const [level, setLevel] = useState(initialLevel);
  const [eventId, setEventId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [miniSessionType, setMiniSessionType] = useState<'3min' | '5min_guided' | null>(null);

  const createEvent = useCreateSeuilEvent();
  const completeSession = useCompleteSeuilSession();

  const currentZone = getZoneFromLevel(level);

  const handleConfirmLevel = useCallback(async () => {
    try {
      const event = await createEvent.mutateAsync({
        thresholdLevel: level,
        zone: currentZone.zone,
      });
      setEventId(event.id);
      setStep('message');
      
      // Auto-advance after 3 seconds for the message
      setTimeout(() => {
        setStep('action');
      }, 3000);
    } catch (error) {
      console.error('Error creating seuil event:', error);
    }
  }, [createEvent, level, currentZone.zone]);

  const handleSelectAction = useCallback(async (actionType: SeuilActionType) => {
    const actionLabels: Record<SeuilActionType, string> = {
      '3min': '3 minutes effectuées',
      '5min_guided': '5 minutes guidées complétées',
      'change_activity': 'Activité changée',
      'postpone': 'Report planifié',
      'stop_today': 'Arrêt pour aujourd\'hui',
      'close_day': 'Journée clôturée',
    };

    // Si c'est une mini-session, on la lance
    if (actionType === '3min' || actionType === '5min_guided') {
      setMiniSessionType(actionType);
      setStep('mini-session');
      return;
    }

    setSelectedAction(actionLabels[actionType]);

    if (eventId) {
      await completeSession.mutateAsync({
        eventId,
        actionType,
      });
    }

    setStep('exit');
  }, [eventId, completeSession]);

  const handleMiniSessionComplete = useCallback(async () => {
    const actionLabels: Record<'3min' | '5min_guided', string> = {
      '3min': '3 minutes effectuées',
      '5min_guided': '5 minutes guidées complétées',
    };

    if (miniSessionType) {
      setSelectedAction(actionLabels[miniSessionType]);

      if (eventId) {
        await completeSession.mutateAsync({
          eventId,
          actionType: miniSessionType,
        });
      }
    }

    setMiniSessionType(null);
    setStep('exit');
  }, [eventId, miniSessionType, completeSession]);

  const handleMiniSessionCancel = useCallback(() => {
    setMiniSessionType(null);
    setStep('action');
  }, []);

  const handleSkipToExit = useCallback(async () => {
    if (eventId) {
      await completeSession.mutateAsync({
        eventId,
        notes: 'Session terminée sans action',
      });
    }
    setStep('exit');
  }, [eventId, completeSession]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg"
      >
        <Card className={`border-2 overflow-hidden bg-gradient-to-br ${currentZone.ambiance.gradient}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background/50">
            <div className="flex items-center gap-2">
              <Waves className={`w-5 h-5 ${currentZone.ambiance.iconColor}`} />
              <span className="font-semibold">Seuil</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 'scale' && (
                <motion.div
                  key="scale"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      Où en es-tu ?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Fais glisser pour indiquer ton ressenti actuel
                    </p>
                  </div>

                  <SeuilScale
                    value={level}
                    onChange={setLevel}
                  />

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmLevel}
                    disabled={createEvent.isPending}
                  >
                    Confirmer
                  </Button>
                </motion.div>
              )}

              {step === 'message' && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SeuilMessage level={level} />
                </motion.div>
              )}

              {step === 'action' && (
                <motion.div
                  key="action"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <SeuilMessage level={level} />
                  
                  <SeuilActions
                    level={level}
                    onSelectAction={handleSelectAction}
                    isLoading={completeSession.isPending}
                  />

                  {currentZone.actions.length === 0 && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleSkipToExit}
                    >
                      J'ai compris, merci
                    </Button>
                  )}
                </motion.div>
              )}

              {step === 'mini-session' && miniSessionType && (
                <SeuilMiniSession
                  actionType={miniSessionType}
                  onComplete={handleMiniSessionComplete}
                  onCancel={handleMiniSessionCancel}
                />
              )}

              {step === 'exit' && (
                <motion.div
                  key="exit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <SeuilExitMessage
                    onClose={onClose}
                    actionTaken={selectedAction || undefined}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SeuilModule;
