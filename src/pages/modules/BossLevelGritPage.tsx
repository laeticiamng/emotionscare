
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Zap, Award } from 'lucide-react';

const BossLevelGritPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Boss Level Grit</h1>
          <p className="text-muted-foreground">Développez votre persévérance et votre résilience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Défi du jour
              </CardTitle>
              <CardDescription>Persévérez face aux obstacles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>75%</span>
                </div>
                <Progress value={75} />
              </div>
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Continuer le défi
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Réalisations Grit
              </CardTitle>
              <CardDescription>Vos victoires sur l'adversité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <span className="font-medium">Persévérance 7 jours</span>
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Obstacle surmonté</span>
                  <span className="text-muted-foreground">En cours...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
