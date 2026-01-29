/**
 * ImplicitCheckIn - Composant de check-in ludique
 * 
 * Intègre les questions d'évaluation de façon naturelle et conversationnelle
 * sans jamais donner l'impression d'une évaluation formelle.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useImplicitAssessment, type ImplicitAssessmentType, type ImplicitQuestion } from '@/hooks/useImplicitAssessment';

interface ImplicitCheckInProps {
  type?: ImplicitAssessmentType;
  onComplete?: (score: { level: number; message: string }) => void;
  className?: string;
  variant?: 'card' | 'inline' | 'floating';
}

export const ImplicitCheckIn: React.FC<ImplicitCheckInProps> = ({
  type = 'wellbeing',
  onComplete,
  className,
  variant = 'card',
}) => {
  const {
    isActive,
    currentQuestion,
    progress,
    startImplicitAssessment,
    answerQuestion,
    calculateSimpleScore,
    reset,
  } = useImplicitAssessment();

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ level: number; message: string } | null>(null);

  // Démarre automatiquement si pas actif
  React.useEffect(() => {
    if (!isActive) {
      startImplicitAssessment(type);
    }
  }, [isActive, type, startImplicitAssessment]);

  const handleAnswer = useCallback(async (questionId: string, value: number) => {
    const { nextQuestion, result } = await answerQuestion(questionId, value, {
      module: 'implicit-checkin',
    });
    
    if (!nextQuestion && result) {
      // Terminé - afficher un message positif (pas un score clinique)
      setResult(result);
      setShowResult(true);
      onComplete?.(result);
    }
  }, [answerQuestion, onComplete]);

  const handleDismiss = useCallback(() => {
    reset();
    setShowResult(false);
    setResult(null);
  }, [reset]);

  if (showResult && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn('w-full', className)}
      >
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-4xl mb-4"
          >
            {result.level <= 1 ? '✨' : result.level <= 2 ? '🌿' : '💙'}
          </motion.div>
          <p className="text-lg font-medium text-foreground mb-2">
            {result.message}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Merci d'avoir pris ce moment pour toi
          </p>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Continuer
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={cn('w-full', className)}
      >
        <Card className={cn(
          'p-6',
          variant === 'floating' && 'shadow-lg',
        )}>
          {/* Progress subtil */}
          <Progress value={progress * 100} className="h-1 mb-6 opacity-30" />
          
          {/* Contexte */}
          <p className="text-sm text-muted-foreground mb-2">
            {currentQuestion.context}
          </p>
          
          {/* Question */}
          <div className="flex items-center gap-3 mb-6">
            {currentQuestion.emoji && (
              <span className="text-2xl">{currentQuestion.emoji}</span>
            )}
            <h3 className="text-lg font-medium text-foreground">
              {currentQuestion.text}
            </h3>
          </div>
          
          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                className={cn(
                  'w-full p-3 rounded-lg text-left',
                  'flex items-center gap-3',
                  'bg-muted/50 hover:bg-muted transition-colors',
                  'border border-transparent hover:border-primary/20',
                )}
              >
                {option.emoji && (
                  <span className="text-xl">{option.emoji}</span>
                )}
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
          
          {/* Skip discret */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs"
              onClick={handleDismiss}
            >
              Pas maintenant
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImplicitCheckIn;
