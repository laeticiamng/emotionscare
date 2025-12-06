// @ts-nocheck
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, X, Lightbulb, MapPin } from 'lucide-react';
import { TourStep } from '@/hooks/useGuidedTour';

interface TourStepOverlayProps {
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  highlightedAttractionId: string;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  attractionPosition?: { x: number; y: number };
}

export const TourStepOverlay: React.FC<TourStepOverlayProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  highlightedAttractionId,
  onNext,
  onPrevious,
  onSkip,
  attractionPosition
}) => {
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Scroll to highlighted attraction
  useEffect(() => {
    const element = document.getElementById(`attraction-${highlightedAttractionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedAttractionId]);

  return (
    <>
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onSkip}
      />

      {/* Animated path line */}
      {attractionPosition && (
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed z-40 pointer-events-none"
        >
          <svg className="w-full h-full absolute inset-0">
            <motion.path
              d={`M ${window.innerWidth / 2} 100 Q ${attractionPosition.x} ${attractionPosition.y / 2} ${attractionPosition.x} ${attractionPosition.y}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="10 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
        </motion.div>
      )}

      {/* Step card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card className="p-6 shadow-2xl border-2 border-primary/50 bg-background/95 backdrop-blur">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Étape {currentStepIndex + 1} sur {totalSteps}
              </span>
            </div>
            <button
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress */}
          <Progress value={progress} className="mb-4 h-2" />

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-3">{step.message}</p>
              
              <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Pourquoi ? </span>
                  {step.reason}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentStepIndex === 0}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              <Button
                onClick={onNext}
                className="flex-1"
              >
                {currentStepIndex === totalSteps - 1 ? 'Terminer' : 'Suivant'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 20px rgba(var(--primary-rgb), 0.3)',
                '0 0 40px rgba(var(--primary-rgb), 0.5)',
                '0 0 20px rgba(var(--primary-rgb), 0.3)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </Card>
      </motion.div>
    </>
  );
};
