import { useState } from 'react';
import { useAssess } from '@/hooks/useAssess';
import { AssessCard } from './AssessCard';
import { AssessForm } from './AssessForm';
import { VerbalBadge } from './VerbalBadge';
import type { Instrument } from './types';
import { logger } from '@/lib/logger';

interface AssessmentWrapperProps {
  instrument: Instrument;
  title: string;
  description: string;
  context?: string;
  estimatedTime?: number;
  disabled?: boolean;
  lastBadge?: string;
  onComplete?: (badges: string[]) => void;
  className?: string;
}

export function AssessmentWrapper({
  instrument,
  title,
  description,
  context = 'adhoc',
  estimatedTime = 2,
  disabled = false,
  lastBadge,
  onComplete,
  className = ""
}: AssessmentWrapperProps) {
  const [view, setView] = useState<'card' | 'form' | 'result'>('card');
  const [resultBadges, setResultBadges] = useState<string[]>([]);

  const assess = useAssess({
    onSubmitSuccess: (result) => {
      const hints = result.orchestration.hints;
      setResultBadges(hints);
      setView('result');
      onComplete?.(hints);
    },
    onError: (error) => {
      logger.error('Assessment error', error as Error, 'UI');
      // Rester sur le formulaire en cas d'erreur
      // Les toasts sont gérés par le hook
    }
  });

  const handleStart = () => {
    assess.start(instrument, context);
    setView('form');
  };

  const handleSubmit = (answers: Array<{id: string, value: number}>, meta?: Record<string, unknown>) => {
    if (assess.currentSession) {
      assess.submit(assess.currentSession.session_id, answers, meta);
    }
  };

  const handleCancel = () => {
    setView('card');
    assess.reset();
  };

  const handleRestart = () => {
    setView('card');
    setResultBadges([]);
    assess.reset();
  };

  if (view === 'result') {
    return (
      <div className={`assessment-result space-y-4 ${className}`}>
        <VerbalBadge 
          hints={resultBadges}
          context={context}
          variant="card"
          className="max-w-2xl mx-auto"
        />
        
        <div className="text-center">
          <button
            onClick={handleRestart}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Refaire plus tard
          </button>
        </div>
      </div>
    );
  }

  if (view === 'form' && assess.currentSession) {
    return (
      <AssessForm
        session={assess.currentSession}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={assess.isSubmitting}
        className={className}
      />
    );
  }

  return (
    <AssessCard
      instrument={instrument}
      title={title}
      description={description}
      estimatedTime={estimatedTime}
      context={context}
      onStart={handleStart}
      isLoading={assess.isStarting}
      disabled={disabled}
      lastBadge={lastBadge}
      className={className}
    />
  );
}