import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CBounceBackBattlePage = () => {
  usePageMetadata('Bounce Back Battle', 'Découvrez votre capacité de résilience émotionnelle', '/b2c/bounce-back-battle', 'engaged');

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Bounce Back Battle</h1>
        <p className="text-muted-foreground">Testez votre résilience émotionnelle dans ce défi adaptatif</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Défi de Résilience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameState === 'ready' && (
            <div className="text-center space-y-4">
              <p>Prêt à affronter le défi de résilience ?</p>
              <Button onClick={() => setGameState('playing')}>
                Commencer le Défi
              </Button>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div className="text-center space-y-4">
              <p>Défi en cours...</p>
              <Button onClick={() => setGameState('completed')}>
                Terminer
              </Button>
            </div>
          )}
          
          {gameState === 'completed' && (
            <div className="text-center space-y-4">
              <p>Félicitations ! Vous avez terminé le défi.</p>
              <Button onClick={() => setGameState('ready')}>
                Recommencer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CBounceBackBattlePage;