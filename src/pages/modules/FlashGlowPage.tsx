
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Timer, Star } from 'lucide-react';

const FlashGlowPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const startFlashSession = () => {
    setIsActive(true);
    // Simulation d'une session flash de 60 secondes
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsActive(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flash Glow</h1>
          <p className="text-muted-foreground">Sessions de bien-être express de 60 secondes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Session Flash Active
              </CardTitle>
              <CardDescription>Boost émotionnel instantané</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="h-32 w-32 mx-auto rounded-full border-4 border-primary flex items-center justify-center">
                  <span className="text-2xl font-bold">{isActive ? '60s' : 'GO'}</span>
                </div>
                
                {isActive && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">
                      Respirez profondément et ressentez l'énergie positive...
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={startFlashSession} 
                  disabled={isActive}
                  className="w-full"
                >
                  <Timer className="h-4 w-4 mr-2" />
                  {isActive ? 'Session en cours...' : 'Démarrer Flash Glow'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Statistiques Flash
              </CardTitle>
              <CardDescription>Vos performances de bien-être express</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">47</p>
                  <p className="text-xs text-muted-foreground">Sessions ce mois</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Série actuelle</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">95%</p>
                  <p className="text-xs text-muted-foreground">Taux de réussite</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">+18%</p>
                  <p className="text-xs text-muted-foreground">Amélioration mood</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  🔥 Série de 7 jours ! Continuez pour débloquer le badge "Flash Master"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlashGlowPage;
