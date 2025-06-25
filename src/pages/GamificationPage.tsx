
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Award } from 'lucide-react';

const GamificationPage: React.FC = () => {
  const achievements = [
    { title: "Premier pas", description: "Première connexion", unlocked: true },
    { title: "Régularité", description: "7 jours consécutifs", unlocked: true },
    { title: "Explorateur", description: "Toutes les fonctionnalités testées", unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Progression & Récompenses</h1>
          </div>
          <p className="text-muted-foreground">
            Suivez vos progrès et débloquez des récompenses
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Niveau actuel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">Niveau 3</span>
                <Badge variant="secondary">Utilisateur motivé</Badge>
              </div>
              <Progress value={65} className="w-full" />
              <p className="text-sm text-muted-foreground">
                350/500 points pour le niveau suivant
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Succès
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 border rounded-lg ${
                    achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-muted/50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? 'bg-green-500 text-white' : 'bg-muted'
                    }`}>
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="default">Débloqué</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
