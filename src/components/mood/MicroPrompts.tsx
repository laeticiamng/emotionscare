import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrsAnswer } from '@/store/mood.store';

interface MicroPromptsProps {
  onAnswer: (answer: BrsAnswer) => void;
  currentPromptId?: string | null;
  className?: string;
}

const prompts = [
  {
    id: 'resilience-1',
    question: 'Quand les choses se compliquent, tu rebondis vite ?',
    answers: [
      { value: 3, label: 'Toujours' },
      { value: 2, label: 'Souvent' },
      { value: 1, label: 'Parfois' },
      { value: 0, label: 'Rarement' }
    ]
  },
  {
    id: 'adaptability-1', 
    question: 'Face à l\'imprévu, tu t\'adaptes facilement ?',
    answers: [
      { value: 3, label: 'Très facilement' },
      { value: 2, label: 'Plutôt bien' },
      { value: 1, label: 'Avec effort' },
      { value: 0, label: 'Difficilement' }
    ]
  },
  {
    id: 'persistence-1',
    question: 'Quand c\'est dur, tu continues malgré tout ?',
    answers: [
      { value: 3, label: 'Toujours' },
      { value: 2, label: 'La plupart du temps' },
      { value: 1, label: 'Ça dépend' },
      { value: 0, label: 'J\'abandonne vite' }
    ]
  }
];

export const MicroPrompts: React.FC<MicroPromptsProps> = ({
  onAnswer,
  currentPromptId = null,
  className = ''
}) => {
  const currentPrompt = currentPromptId ? 
    prompts.find(p => p.id === currentPromptId) : 
    prompts[Math.floor(Math.random() * prompts.length)];

  if (!currentPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={className}
      >
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4 space-y-4">
            <div className="text-sm font-medium text-center">
              {currentPrompt.question}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {currentPrompt.answers.map((answer) => (
                <Button
                  key={answer.value}
                  onClick={() => onAnswer({ 
                    id: currentPrompt.id, 
                    value: answer.value as 0 | 1 | 2 | 3 
                  })}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 text-xs"
                >
                  {answer.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default MicroPrompts;