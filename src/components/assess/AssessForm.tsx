import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import type { StartOutput } from '../../../../packages/contracts/assess';

interface AssessFormProps {
  session: StartOutput;
  onSubmit: (answers: Array<{id: string, value: number}>, meta?: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

interface FormAnswer {
  id: string;
  value: number | null;
}

export function AssessForm({
  session,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = ""
}: AssessFormProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [answers, setAnswers] = useState<FormAnswer[]>(
    session.items.map(item => ({ id: item.id, value: null }))
  );
  const [startTime] = useState(Date.now());

  const currentItem = session.items[currentItemIndex];
  const isLastItem = currentItemIndex === session.items.length - 1;
  const progress = ((currentItemIndex + 1) / session.items.length) * 100;
  const canProceed = answers[currentItemIndex]?.value !== null;

  const handleAnswerChange = useCallback((value: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentItemIndex] = { ...newAnswers[currentItemIndex], value };
      return newAnswers;
    });
  }, [currentItemIndex]);

  const handleNext = () => {
    if (currentItemIndex < session.items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Vérifier que toutes les réponses sont complètes
    const validAnswers = answers.filter(a => a.value !== null);
    if (validAnswers.length !== session.items.length) {
      return;
    }

    // Préparer les métadonnées
    const meta = {
      duration_ms: Date.now() - startTime,
      device_flags: {
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight
      }
    };

    // Transformer en format attendu
    const formattedAnswers = validAnswers.map(a => ({
      id: a.id,
      value: a.value as number
    }));

    onSubmit(formattedAnswers, meta);
  };

  const renderAnswerInput = () => {
    const currentAnswer = answers[currentItemIndex]?.value;

    // Si l'item a des choix prédéfinis (RadioGroup)
    if (currentItem.choices && currentItem.choices.length > 0) {
      return (
        <RadioGroup
          value={currentAnswer?.toString() || ""}
          onValueChange={(value) => handleAnswerChange(Number(value))}
          className="space-y-3"
        >
          {currentItem.choices.map((choice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={index.toString()} 
                id={`choice-${index}`}
                className="mt-0.5"
              />
              <Label 
                htmlFor={`choice-${index}`} 
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                {choice}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    // Sinon, slider pour échelle numérique
    return (
      <div className="space-y-4">
        <div className="px-2">
          <Slider
            value={currentAnswer !== null ? [currentAnswer] : []}
            onValueChange={([value]) => handleAnswerChange(value)}
            min={0}
            max={6}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>Pas du tout</span>
          <span>Moyennement</span>
          <span>Énormément</span>
        </div>
        
        {currentAnswer !== null && (
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {currentAnswer}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`assess-form max-w-2xl mx-auto ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">
            Question {currentItemIndex + 1} sur {session.items.length}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Fermer
          </Button>
        </div>
        
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <CardDescription className="text-base font-medium text-foreground mb-4">
            {currentItem.prompt}
          </CardDescription>
          
          {renderAnswerInput()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentItemIndex === 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          {isLastItem ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Terminer
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}