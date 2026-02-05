/**
 * ClinicalQuestionnaireForm - Form for WHO-5, PHQ-9, etc.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import { ClinicalQuestionnaire, ClinicalQuestion } from './ClinicalQuestionnaireData';
import { MedicalDisclaimer } from './MedicalDisclaimer';
import { cn } from '@/lib/utils';

interface ClinicalQuestionnaireFormProps {
  questionnaire: ClinicalQuestionnaire;
  onSubmit: (answers: Record<string, number>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const ClinicalQuestionnaireForm: React.FC<ClinicalQuestionnaireFormProps> = ({
  questionnaire,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalQuestions = questionnaire.questions.length;
  const currentQuestion = questionnaire.questions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const currentAnswer = answers[currentQuestion.id];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: parseInt(value, 10),
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    await onSubmit(answers);
  };

  return (
    <div className="space-y-4">
      {/* Medical disclaimer at top */}
      <MedicalDisclaimer variant="banner" showEmergency={false} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{questionnaire.name}</CardTitle>
          <CardDescription>{questionnaire.instructions}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentIndex + 1} / {totalQuestions}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-base font-medium leading-relaxed">
                {currentQuestion.text}
              </p>

              <RadioGroup
                value={currentAnswer?.toString() || ''}
                onValueChange={handleAnswer}
                className="space-y-2"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer',
                      currentAnswer === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    )}
                    onClick={() => handleAnswer(option.value.toString())}
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`${currentQuestion.id}-${option.value}`}
                    />
                    <Label
                      htmlFor={`${currentQuestion.id}-${option.value}`}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      {option.label}
                    </Label>
                    <span className="text-xs text-muted-foreground font-mono">
                      {option.value}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={currentIndex === 0 ? onCancel : handlePrevious}
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {currentIndex === 0 ? 'Annuler' : 'Précédent'}
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calcul...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Voir mes résultats
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentAnswer === undefined}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalQuestionnaireForm;
