
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Challenge, Badge } from '@/types/gamification';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Définir les données de test
const testChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Marathon du scanner émotionnel',
    description: 'Effectuez un scan émotionnel tous les jours pendant 7 jours consécutifs',
    points: 150,
    progress: 70,
    completed: false,
    category: 'régularité',
    difficulty: 'medium',
    tags: ['scan', 'streak', 'hebdomadaire']
  },
  {
    id: '2',
    title: 'Maître journaliste',
    description: 'Écrivez 10 entrées de journal avec analyse d\'émotions',
    points: 200,
    progress: 100,
    completed: true,
    category: 'journal',
    difficulty: 'hard',
    completedAt: new Date().toISOString(),
    tags: ['writing', 'reflection']
  }
];

const testBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Première analyse émotionnelle complétée',
    achieved: true,
    achievedAt: new Date().toISOString(),
    tier: 'bronze',
    imageUrl: '/badges/first-step.svg'
  },
  {
    id: '2',
    name: 'Introspection',
    description: 'Compléter 10 entrées de journal',
    achieved: false,
    progress: 7,
    total: 10,
    tier: 'silver',
    imageUrl: '/badges/journal-master.svg'
  }
];

const GamificationTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [challenges] = useState<Challenge[]>(testChallenges);
  const [badges] = useState<Badge[]>(testBadges);
  
  const completedChallenges = challenges.filter(challenge => challenge.completed);
  const unlockedBadges = badges.filter(badge => badge.achieved);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gamification</h2>
          <p className="text-muted-foreground">
            Gérez les défis, badges et récompenses pour les utilisateurs
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Créer un défi
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Défis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{challenges.length}</div>
            <p className="text-sm text-muted-foreground">
              {completedChallenges.length} complétés par des utilisateurs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{badges.length}</div>
            <p className="text-sm text-muted-foreground">
              {unlockedBadges.length} débloqués par des utilisateurs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">257</div>
            <p className="text-sm text-muted-foreground">
              +14% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Classement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {challenges.map(challenge => (
                <div key={challenge.id} className="border-b py-4 last:border-0">
                  <div className="flex justify-between mb-1">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{challenge.points} pts</span>
                      <p className="text-xs text-muted-foreground">
                        {challenge.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      {challenge.tags?.map(tag => (
                        <span key={tag} className="text-xs bg-secondary/30 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {challenge.completed ? 
                      <span className="text-xs text-green-500">Complété</span> : 
                      <span className="text-xs">{challenge.progress}% complété</span>
                    }
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <div key={badge.id} className={`border rounded-lg p-4 ${badge.achieved ? 'border-primary' : 'border-muted'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                        {/* Placeholder pour image de badge */}
                        <span className="text-lg font-bold">{badge.tier?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {badge.tier?.charAt(0).toUpperCase() + badge.tier?.slice(1)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{badge.description}</p>
                    {badge.achieved ? (
                      <p className="text-xs text-green-500 mt-2">Obtenu</p>
                    ) : badge.progress !== undefined ? (
                      <p className="text-xs text-muted-foreground mt-2">
                        Progression : {badge.progress}/{badge.total}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">Non débloqué</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Tableau des scores des utilisateurs
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationTab;
