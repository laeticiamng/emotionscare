import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CBreathworkPage = () => {
  usePageMetadata('Breathwork', 'Exercices de respiration guidés', '/b2c/breathwork', 'calm');

  const [isBreathing, setIsBreathing] = useState(false);

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Breathwork</h1>
        <p className="text-muted-foreground">Techniques de respiration pour le bien-être</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercice de Respiration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            {!isBreathing ? (
              <Button onClick={() => setIsBreathing(true)}>
                Commencer l'exercice
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-lg">Respirez profondément...</div>
                <Button onClick={() => setIsBreathing(false)}>
                  Arrêter
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CBreathworkPage;