/**
 * CopingDebrief - Questionnaire post-bataille
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users, Smile, Lightbulb, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface CopingAnswer {
  id: string;
  value: 0 | 1 | 2 | 3;
}

interface CopingDebriefProps {
  onSubmit: (answers: CopingAnswer[]) => void;
  isLoading?: boolean;
}

const COPING_QUESTIONS = [
  {
    id: 'distraction',
    icon: Brain,
    question: 'Avez-vous réussi à vous distraire des pensées négatives ?',
    description: 'Capacité à détourner votre attention des stimuli stressants'
  },
  {
    id: 'reframing',
    icon: Lightbulb,
    question: 'Avez-vous pu recadrer la situation de manière positive ?',
    description: 'Capacité à voir les défis comme des opportunités'
  },
  {
    id: 'support',
    icon: Users,
    question: 'Avez-vous ressenti le besoin de soutien social ?',
    description: 'Évaluation de votre besoin de connexion avec les autres'
  },
  {
    id: 'relaxation',
    icon: Heart,
    question: 'Avez-vous utilisé des techniques de relaxation ?',
    description: 'Respiration, détente musculaire, visualisation...'
  },
  {
    id: 'problem_solving',
    icon: Smile,
    question: 'Avez-vous adopté une approche de résolution de problème ?',
    description: 'Analyse rationnelle et action concrète face au stress'
  }
];

const RESPONSE_OPTIONS = [
  { value: 0, label: 'Pas du tout', color: 'text-destructive' },
  { value: 1, label: 'Un peu', color: 'text-warning' },
  { value: 2, label: 'Assez bien', color: 'text-info' },
  { value: 3, label: 'Très bien', color: 'text-success' }
];

export const CopingDebrief: React.FC<CopingDebriefProps> = ({ onSubmit, isLoading }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<CopingAnswer[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  const progress = ((currentQuestion) / COPING_QUESTIONS.length) * 100;
  const question = COPING_QUESTIONS[currentQuestion];
  const Icon = question.icon;

  const handleNext = () => {
    if (selectedValue === undefined) return;

    const newAnswer: CopingAnswer = {
      id: question.id,
      value: parseInt(selectedValue) as 0 | 1 | 2 | 3
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedValue(undefined);

    if (currentQuestion < COPING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onSubmit(updatedAnswers);
    }
  };

  const isLastQuestion = currentQuestion === COPING_QUESTIONS.length - 1;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} / {COPING_QUESTIONS.length}
          </span>
          <Progress value={progress} className="w-32 h-2" />
        </div>
        
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-4"
        >
          <div className="p-3 bg-primary/10 rounded-xl">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg mb-1">{question.question}</CardTitle>
            <CardDescription>{question.description}</CardDescription>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RadioGroup
            value={selectedValue}
            onValueChange={setSelectedValue}
            className="grid grid-cols-2 gap-3"
          >
            {RESPONSE_OPTIONS.map((option) => (
              <Label
                key={option.value}
                htmlFor={`option-${option.value}`}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer
                  transition-all hover:border-primary/50
                  ${selectedValue === String(option.value) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-card'}
                `}
              >
                <RadioGroupItem
                  value={String(option.value)}
                  id={`option-${option.value}`}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedValue === String(option.value)
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'}
                `}>
                  {selectedValue === String(option.value) && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className={`font-medium ${option.color}`}>
                  {option.label}
                </span>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleNext}
              disabled={selectedValue === undefined || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                'Analyse en cours...'
              ) : isLastQuestion ? (
                <>
                  Terminer
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
