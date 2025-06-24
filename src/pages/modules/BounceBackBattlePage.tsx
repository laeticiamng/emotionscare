
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Heart, Zap } from 'lucide-react';

const BounceBackBattlePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bounce Back Battle</h1>
          <p className="text-muted-foreground">Développez votre résilience face aux défis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Niveau de Résilience
              </CardTitle>
              <CardDescription>Votre capacité actuelle à rebondir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Résilience Émotionnelle</span>
                  <span className="text-sm">85%</span>
                </div>
                <Progress value={85} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Adaptabilité</span>
                  <span className="text-sm">72%</span>
                </div>
                <Progress value={72} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Récupération Rapide</span>
                  <span className="text-sm">68%</span>
                </div>
                <Progress value={68} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Défi de Résilience
              </CardTitle>
              <CardDescription>Entraînement mental quotidien</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="font-medium mb-2">Défi du Jour</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Transformez un échec récent en opportunité d'apprentissage
                </p>
                <Button size="sm" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Relever le défi
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">15</p>
                <p className="text-sm text-muted-foreground">Défis relevés ce mois</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BounceBackBattlePage;
