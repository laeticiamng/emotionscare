
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Monitor, Eye, Clock, Shield } from 'lucide-react';

const ScreenSilkBreakPage: React.FC = () => {
  const [breakActive, setBreakActive] = useState(false);
  const [breakProgress, setBreakProgress] = useState(0);

  const startBreak = () => {
    setBreakActive(true);
    setBreakProgress(0);
    
    const interval = setInterval(() => {
      setBreakProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBreakActive(false);
          return 100;
        }
        return prev + 1;
      });
    }, 200);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Screen Silk Break</h1>
          <p className="text-muted-foreground">Pauses intelligentes pour protéger vos yeux et votre bien-être</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Pause Active
              </CardTitle>
              <CardDescription>Session de repos pour vos yeux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {breakActive ? (
                <div className="text-center space-y-4">
                  <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <Eye className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Pause en cours...</p>
                    <Progress value={breakProgress} />
                    <p className="text-sm text-muted-foreground">
                      Regardez au loin et clignez des yeux
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="h-32 w-32 mx-auto rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  <Button onClick={startBreak} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Démarrer une pause (20 sec)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Statistiques d'Écran
              </CardTitle>
              <CardDescription>Votre usage et vos pauses aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">6h 23m</p>
                  <p className="text-xs text-muted-foreground">Temps d'écran</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">Pauses prises</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">43%</p>
                  <p className="text-xs text-muted-foreground">Pauses recommandées</p>
                </div>
                
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <p className="text-xs text-muted-foreground">Score santé oculaire</p>
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prochaine pause recommandée</span>
                  <span className="text-primary">Dans 18 min</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  💡 Règle 20-20-20 : Toutes les 20 min, regardez à 20 pieds pendant 20 sec
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScreenSilkBreakPage;
