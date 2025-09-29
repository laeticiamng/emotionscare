import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AssessmentInstrument, AssessmentResponse } from '@/hooks/useClinicalAssessment';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (responses: AssessmentResponse) => void;
  instrument: AssessmentInstrument;
  isLoading: boolean;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  instrument,
  isLoading
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse>({});

  const questions = instrument.questions.items;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canContinue = responses[currentQuestion.id] !== undefined;

  const handleResponse = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(responses);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderScaleOptions = (scale: string) => {
    switch (scale) {
      case '5_point_freq':
        return ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Toujours'].map((label, index) => (
          <button
            key={index}
            onClick={() => handleResponse(index + 1)}
            className={`p-3 rounded-lg border-2 transition-all text-sm ${
              responses[currentQuestion.id] === index + 1
                ? 'border-pink-500 bg-pink-50 text-pink-900'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            {label}
          </button>
        ));

      case '4_point_intensity':
        return ['Pas du tout', 'Un peu', 'Modérément', 'Beaucoup'].map((label, index) => (
          <button
            key={index}
            onClick={() => handleResponse(index + 1)}
            className={`p-3 rounded-lg border-2 transition-all text-sm ${
              responses[currentQuestion.id] === index + 1
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {label}
          </button>
        ));

      case '9_point_valence':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>😟 Négatif</span>
              <span>😐 Neutre</span>
              <span>😊 Positif</span>
            </div>
            <div className="grid grid-cols-9 gap-1">
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(index + 1)}
                  className={`h-8 rounded border-2 transition-all ${
                    responses[currentQuestion.id] === index + 1
                      ? 'border-pink-500 bg-pink-500'
                      : 'border-gray-300 hover:border-pink-400'
                  }`}
                  aria-label={`Niveau ${index + 1} sur 9`}
                />
              ))}
            </div>
          </div>
        );

      case '9_point_arousal':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>😴 Calme</span>
              <span>😐 Modéré</span>
              <span>⚡ Énergique</span>
            </div>
            <div className="grid grid-cols-9 gap-1">
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(index + 1)}
                  className={`h-8 rounded border-2 transition-all ${
                    responses[currentQuestion.id] === index + 1
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  aria-label={`Niveau ${index + 1} sur 9`}
                />
              ))}
            </div>
          </div>
        );

      default:
        return ['1', '2', '3', '4', '5'].map((label, index) => (
          <button
            key={index}
            onClick={() => handleResponse(index + 1)}
            className={`p-3 rounded-lg border-2 transition-all ${
              responses[currentQuestion.id] === index + 1
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            {label}
          </button>
        ));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {instrument.cadence === 'instant' ? 'Instantané' : 
               instrument.cadence === 'weekly' ? 'Hebdomadaire' : 
               'Selon besoin'}
            </Badge>
          </div>
          <DialogTitle className="text-lg">
            {instrument.name}
          </DialogTitle>
          <DialogDescription>
            Prenez le temps de répondre selon ce que vous ressentez
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Progress value={progress} className="h-2" />

          <div className="space-y-4">
            <h3 className="font-medium leading-relaxed">
              {currentQuestion.text}
            </h3>

            <div className="space-y-2">
              {renderScaleOptions(currentQuestion.scale)}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canContinue || isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              {isLastQuestion ? 'Terminer' : 'Suivant'}
              {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Vos réponses sont confidentielles et ne seront jamais affichées
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};