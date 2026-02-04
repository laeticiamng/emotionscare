/**
 * GroundingSessionPlayer - Lecteur de session d'ancrage guidé
 * Interface interactive pour les exercices de grounding 5-4-3-2-1
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Hand, 
  Ear, 
  Wind, 
  Coffee,
  Play,
  Pause,
  SkipForward,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useGroundingSession, GroundingTechnique, GroundingStep } from '../index';
import { cn } from '@/lib/utils';

interface GroundingSessionPlayerProps {
  techniqueId?: string;
  onComplete?: (anxietyReduction: number) => void;
  onCancel?: () => void;
  className?: string;
}

const SENSE_ICONS: Record<string, React.ReactNode> = {
  sight: <Eye className="h-6 w-6" />,
  touch: <Hand className="h-6 w-6" />,
  sound: <Ear className="h-6 w-6" />,
  smell: <Wind className="h-6 w-6" />,
  taste: <Coffee className="h-6 w-6" />,
};

const SENSE_COLORS: Record<string, string> = {
  sight: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  touch: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  sound: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  smell: 'bg-green-500/20 text-green-500 border-green-500/30',
  taste: 'bg-pink-500/20 text-pink-500 border-pink-500/30',
};

export const GroundingSessionPlayer = memo<GroundingSessionPlayerProps>(({
  techniqueId = '5-4-3-2-1',
  onComplete,
  onCancel,
  className,
}) => {
  const {
    currentTechnique,
    currentStep,
    currentStepData,
    isActive,
    progress,
    startSession,
    nextStep,
    completeSession,
    cancelSession,
    techniques,
  } = useGroundingSession();

  const [anxietyBefore, setAnxietyBefore] = useState<number>(5);
  const [anxietyAfter, setAnxietyAfter] = useState<number>(5);
  const [phase, setPhase] = useState<'intro' | 'session' | 'rating' | 'complete'>('intro');
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && currentStepData?.duration_seconds) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev >= (currentStepData.duration_seconds || 30)) {
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, isPaused, currentStepData]);

  const handleStart = useCallback(() => {
    startSession(techniqueId, anxietyBefore);
    setPhase('session');
    setTimer(0);
    setUserResponses([]);
  }, [startSession, techniqueId, anxietyBefore]);

  const handleAddResponse = useCallback(() => {
    if (!currentInput.trim()) return;
    
    const newResponses = [...userResponses, currentInput.trim()];
    setUserResponses(newResponses);
    setCurrentInput('');

    // Si on a assez de réponses pour l'étape courante
    if (currentStepData?.count && newResponses.length >= currentStepData.count) {
      if (currentTechnique && currentStep < currentTechnique.steps.length - 1) {
        nextStep();
        setUserResponses([]);
        setTimer(0);
      } else {
        setPhase('rating');
      }
    }
  }, [currentInput, userResponses, currentStepData, currentTechnique, currentStep, nextStep]);

  const handleSkipStep = useCallback(() => {
    if (currentTechnique && currentStep < currentTechnique.steps.length - 1) {
      nextStep();
      setUserResponses([]);
      setTimer(0);
    } else {
      setPhase('rating');
    }
  }, [currentTechnique, currentStep, nextStep]);

  const handleComplete = useCallback(async () => {
    await completeSession(anxietyAfter);
    setPhase('complete');
    
    const reduction = anxietyBefore - anxietyAfter;
    onComplete?.(reduction);
  }, [completeSession, anxietyAfter, anxietyBefore, onComplete]);

  const handleCancel = useCallback(() => {
    cancelSession();
    setPhase('intro');
    onCancel?.();
  }, [cancelSession, onCancel]);

  const technique = techniques.find(t => t.id === techniqueId);
  if (!technique && phase === 'intro') {
    return (
      <Card className={cn("max-w-xl mx-auto", className)}>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Technique non trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("max-w-xl mx-auto overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {/* Phase Introduction */}
        {phase === 'intro' && technique && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{technique.name}</CardTitle>
              <p className="text-muted-foreground">{technique.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Niveau d'anxiété avant */}
              <div className="space-y-3">
                <label className="text-sm font-medium block text-center">
                  Votre niveau d'anxiété actuel (1-10)
                </label>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      onClick={() => setAnxietyBefore(n)}
                      className={cn(
                        "w-8 h-8 rounded-full text-sm font-medium transition-all",
                        anxietyBefore === n
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted hover:bg-muted/80"
                      )}
                      aria-label={`Niveau ${n}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bénéfices */}
              <div className="flex flex-wrap gap-2 justify-center">
                {technique.benefits.map((benefit, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>

              {/* Bouton démarrer */}
              <Button 
                onClick={handleStart} 
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Commencer ({technique.duration_minutes} min)
              </Button>
            </CardContent>
          </motion.div>
        )}

        {/* Phase Session */}
        {phase === 'session' && currentTechnique && currentStepData && (
          <motion.div
            key="session"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Étape {currentStep + 1}/{currentTechnique.steps.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                    aria-label={isPaused ? 'Reprendre' : 'Pause'}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    aria-label="Annuler"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Icône du sens */}
              {currentStepData.sense && (
                <div className={cn(
                  "w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2",
                  SENSE_COLORS[currentStepData.sense] || 'bg-primary/20'
                )}>
                  {SENSE_ICONS[currentStepData.sense]}
                </div>
              )}

              {/* Instruction */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">
                  {currentStepData.instruction}
                </h3>
                {currentStepData.count && (
                  <p className="text-muted-foreground">
                    {userResponses.length}/{currentStepData.count} éléments
                  </p>
                )}
              </div>

              {/* Réponses de l'utilisateur */}
              {currentStepData.count && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] justify-center">
                    {userResponses.map((resp, i) => (
                      <Badge key={i} variant="outline" className="text-sm py-1">
                        {resp}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddResponse()}
                      placeholder="Tapez et appuyez Entrée..."
                      className="flex-1 px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isPaused}
                      aria-label="Votre réponse"
                    />
                    <Button onClick={handleAddResponse} disabled={!currentInput.trim() || isPaused}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              )}

              {/* Timer pour les étapes avec durée */}
              {currentStepData.duration_seconds && !currentStepData.count && (
                <div className="text-center">
                  <div className="text-3xl font-mono">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </div>
                  <Progress 
                    value={(timer / currentStepData.duration_seconds) * 100} 
                    className="h-1 mt-2 max-w-[200px] mx-auto" 
                  />
                </div>
              )}

              {/* Bouton suivant */}
              <Button 
                onClick={handleSkipStep} 
                variant="outline" 
                className="w-full"
              >
                <SkipForward className="mr-2 h-4 w-4" />
                {currentStep < currentTechnique.steps.length - 1 ? 'Étape suivante' : 'Terminer'}
              </Button>
            </CardContent>
          </motion.div>
        )}

        {/* Phase Rating */}
        {phase === 'rating' && (
          <motion.div
            key="rating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <CardHeader className="text-center">
              <CardTitle>Exercice terminé ! 🎉</CardTitle>
              <p className="text-muted-foreground">Comment vous sentez-vous maintenant ?</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium block text-center">
                  Votre niveau d'anxiété maintenant (1-10)
                </label>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      onClick={() => setAnxietyAfter(n)}
                      className={cn(
                        "w-8 h-8 rounded-full text-sm font-medium transition-all",
                        anxietyAfter === n
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-muted hover:bg-muted/80"
                      )}
                      aria-label={`Niveau ${n}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {anxietyBefore > anxietyAfter && (
                <p className="text-center text-green-500 font-medium">
                  Réduction de {anxietyBefore - anxietyAfter} points 📉
                </p>
              )}

              <Button onClick={handleComplete} className="w-full" size="lg">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Enregistrer et terminer
              </Button>
            </CardContent>
          </motion.div>
        )}

        {/* Phase Complete */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Session enregistrée</h3>
              <p className="text-muted-foreground">
                Bravo pour cette séance d'ancrage ! Vous pouvez répéter cet exercice à tout moment.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setPhase('intro')}
              >
                Nouvelle session
              </Button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
});

GroundingSessionPlayer.displayName = 'GroundingSessionPlayer';

export default GroundingSessionPlayer;
