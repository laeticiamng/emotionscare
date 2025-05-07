
import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import { ChallengeItem } from '@/components/gamification/ChallengeItem';

const GamificationPage = () => {
  const challenges = [
    {
      id: "1",
      title: "Check-in quotidien",
      description: "Effectuez un scan émotionnel chaque jour pendant une semaine",
      progress: 5,
      total: 7,
      reward: "Badge Bronze"
    },
    {
      id: "2",
      title: "Partage d'expérience",
      description: "Partagez votre expérience dans Social Cocoon",
      progress: 2,
      total: 3,
      reward: "15 points"
    },
    {
      id: "3",
      title: "Session VR",
      description: "Complétez une session de relaxation en réalité virtuelle",
      progress: 0,
      total: 1,
      reward: "Badge Silver"
    }
  ];
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Gamification</h1>
          <p className="text-muted-foreground">Relevez des défis et gagnez des récompenses</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Défis actifs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map(challenge => (
                  <ChallengeItem key={challenge.id} challenge={challenge} />
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Mes badges</CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeGrid />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default GamificationPage;
