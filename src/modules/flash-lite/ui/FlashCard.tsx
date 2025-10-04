/**
 * Carte flash individuelle
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCw } from 'lucide-react';
import type { FlashCard as FlashCardType } from '../types';

interface FlashCardProps {
  card: FlashCardType;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  cardNumber: number;
  totalCards: number;
}

export const FlashCard = ({ card, onAnswer, cardNumber, totalCards }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSubmit = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === card.answer.toLowerCase().trim();
    setShowResult(true);
    setTimeout(() => {
      onAnswer(userAnswer, isCorrect);
      setIsFlipped(false);
      setUserAnswer('');
      setShowResult(false);
    }, 1500);
  };

  const handleQuickAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect ? card.answer : '', isCorrect);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-4 text-sm text-muted-foreground">
        Carte {cardNumber} / {totalCards}
      </div>

      <Card 
        className="relative h-[400px] cursor-pointer transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <CardContent className="h-full flex flex-col items-center justify-center p-8">
          {!isFlipped ? (
            <>
              <div className="text-2xl font-semibold text-center mb-8">
                {card.question}
              </div>

              <div className="w-full space-y-4">
                <Input
                  type="text"
                  placeholder="Votre réponse..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleSubmit()}
                  disabled={showResult}
                  className="text-center"
                />

                <div className="flex gap-2">
                  <Button 
                    onClick={handleFlip} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Retourner
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!userAnswer || showResult}
                    className="flex-1"
                  >
                    Valider
                  </Button>
                </div>

                {showResult && (
                  <div className={`text-center text-lg font-semibold ${
                    userAnswer.toLowerCase().trim() === card.answer.toLowerCase().trim()
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {userAnswer.toLowerCase().trim() === card.answer.toLowerCase().trim()
                      ? '✓ Correct !'
                      : '✗ Incorrect'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-xl text-muted-foreground mb-4">Réponse :</div>
              <div className="text-3xl font-bold text-center mb-8">
                {card.answer}
              </div>

              <div className="w-full space-y-2">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Évaluez votre réponse :
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleQuickAnswer(false)} 
                    variant="destructive"
                    className="flex-1"
                  >
                    ✗ Incorrect
                  </Button>
                  <Button 
                    onClick={() => handleQuickAnswer(true)} 
                    variant="default"
                    className="flex-1"
                  >
                    ✓ Correct
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {card.difficulty && (
        <div className="text-center mt-4">
          <span className={`text-xs px-2 py-1 rounded-full ${
            card.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {card.difficulty === 'easy' ? 'Facile' : 
             card.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
          </span>
        </div>
      )}
    </div>
  );
};
