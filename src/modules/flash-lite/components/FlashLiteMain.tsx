/**
 * Composant principal du module flash-lite
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Pause, Square, Trophy } from 'lucide-react';
import { useFlashLite } from '../useFlashLite';
import { ModeSelector } from '../ui/ModeSelector';
import { FlashCard } from '../ui/FlashCard';
import type { FlashLiteMode } from '../types';

export function FlashLiteMain() {
  const [selectedMode, setSelectedMode] = useState<FlashLiteMode>('quick');
  
  const {
    status,
    currentCard,
    currentCardIndex,
    totalCards,
    score,
    elapsedTime,
    startFlashLite,
    answerCard,
    pauseFlashLite,
    resumeFlashLite,
    completeFlashLite
  } = useFlashLite();

  const handleStart = () => {
    const cardsCount = selectedMode === 'quick' ? 10 : selectedMode === 'timed' ? 20 : 15;
    startFlashLite(selectedMode, undefined, cardsCount);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isIdle = status === 'idle';
  const isCompleted = status === 'completed';

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Flash Lite - Révisions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIdle && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Choisissez votre mode</h3>
                <ModeSelector
                  selected={selectedMode}
                  onSelect={setSelectedMode}
                />
              </div>

              <Button onClick={handleStart} size="lg" className="w-full">
                Démarrer la session
              </Button>
            </>
          )}

          {!isIdle && !isCompleted && currentCard && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Score: {score.correct}/{score.total}
                  </Badge>
                  <Badge variant="outline">
                    Précision: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                  </Badge>
                </div>
                <Badge variant="secondary">
                  ⏱️ {formatTime(elapsedTime)}
                </Badge>
              </div>

              <FlashCard
                card={currentCard}
                onAnswer={answerCard}
                cardNumber={currentCardIndex + 1}
                totalCards={totalCards}
              />

              <div className="flex items-center gap-2 mt-4">
                {status === 'active' && (
                  <>
                    <Button onClick={pauseFlashLite} variant="secondary" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={() => completeFlashLite()} variant="destructive" className="flex-1">
                      <Square className="h-4 w-4 mr-2" />
                      Terminer
                    </Button>
                  </>
                )}

                {status === 'paused' && (
                  <>
                    <Button onClick={resumeFlashLite} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Reprendre
                    </Button>
                    <Button onClick={() => completeFlashLite()} variant="destructive" className="flex-1">
                      <Square className="h-4 w-4 mr-2" />
                      Terminer
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {isCompleted && (
            <div className="text-center space-y-6 py-8">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
              <h2 className="text-2xl font-bold">Session terminée !</h2>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-2xl font-bold">{score.total}</div>
                  <div className="text-sm text-muted-foreground">Cartes</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-200">
                    {score.correct}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-200">Correctes</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Précision</div>
                </div>
              </div>

              <div className="text-muted-foreground">
                Temps total : {formatTime(elapsedTime)}
              </div>

              <Button onClick={() => window.location.reload()} size="lg">
                Nouvelle session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FlashLiteMain;
