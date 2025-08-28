import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Crown, Flame, Target } from 'lucide-react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { useGritStore } from '@/store/grit.store';
import { ChallengeCard, ActiveSession, ProgressStats, AchievementsList } from '@/components/boss-level-grit';
import { GritChallenge, GritStats } from '@/types/boss-level-grit';

const BossLevelGritPage = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<GritChallenge | null>(null);
  const gritStore = useGritStore();
  
  // Mock data pour la démo
  const [gritStats] = useState<GritStats>({
    totalXp: 2850,
    currentLevel: {
      id: '5',
      name: 'Guerrier Déterminé',
      description: 'Un combattant expérimenté',
      minXp: 2500,
      maxXp: 3500,
      color: '#f59e0b',
      icon: '⚔️',
      benefits: ['Double XP weekend', 'Défis exclusifs', 'Mentoring'],
      unlockedFeatures: ['Défis master', 'Stats avancées']
    },
    nextLevel: {
      id: '6',
      name: 'Maître de la Résilience',
      description: 'Un expert en persévérance',
      minXp: 3500,
      maxXp: 5000,
      color: '#8b5cf6',
      icon: '🏆',
      benefits: ['Triple XP events', 'Coaching personnalisé'],
      unlockedFeatures: ['Défis legend', 'Leaderboard VIP']
    },
    completedChallenges: 47,
    currentStreak: 12,
    longestStreak: 28,
    averageScore: 87,
    totalSessionTime: 1840, // minutes
    categoriesProgress: {
      mental: 75,
      physical: 60,
      emotional: 85,
      spiritual: 45
    },
    achievements: [
      {
        id: '1',
        title: 'Premier Pas',
        description: 'Complétez votre premier défi',
        icon: 'trophy',
        type: 'completion',
        requirement: 1,
        progress: 1,
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
        reward: { xp: 100 }
      }
    ]
  });

  const [challenges] = useState<GritChallenge[]>([
    {
      id: '1',
      title: 'Défi Matinal',
      description: 'Commencez la journée avec 10 minutes de méditation',
      difficulty: 'novice',
      category: 'mental',
      duration: 10,
      xpReward: 50,
      completionRate: 0,
      status: 'available',
      tags: ['méditation', 'matin', 'routine'],
      createdAt: new Date()
    }
  ]);

  const startChallenge = (challenge: GritChallenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('session');
  };

  const completeChallenge = (score: number, insights?: string[]) => {
    setSelectedChallenge(null);
    setActiveTab('challenges');
  };

  const backToChallenges = () => {
    setSelectedChallenge(null);
    setActiveTab('challenges');
  };

  return (
    <UnifiedShell>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header avec stats globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Boss Level Grit
            </h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{gritStats.totalXp}</div>
                <div className="text-sm text-muted-foreground">XP Total</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4 text-accent" />
                  <div className="text-2xl font-bold text-accent">{gritStats.currentStreak}</div>
                </div>
                <div className="text-sm text-muted-foreground">Série Actuelle</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-muted/20 to-muted/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{gritStats.completedChallenges}</div>
                <div className="text-sm text-muted-foreground">Défis Complétés</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{gritStats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Score Moyen</div>
              </CardContent>
            </Card>
          </div>

          {/* Progression vers le niveau suivant */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{gritStats.currentLevel.name}</span>
                  <Badge variant="secondary">{gritStats.currentLevel.icon}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {gritStats.totalXp} / {gritStats.nextLevel.minXp} XP
                </div>
              </div>
              <Progress 
                value={(gritStats.totalXp - gritStats.currentLevel.minXp) / (gritStats.nextLevel.minXp - gritStats.currentLevel.minXp) * 100} 
                className="h-3"
              />
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {gritStats.nextLevel.minXp - gritStats.totalXp} XP pour atteindre {gritStats.nextLevel.name}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="session">Session Active</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onStart={startChallenge}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-6">
            <ActiveSession
              challenge={selectedChallenge}
              onComplete={completeChallenge}
              onBack={backToChallenges}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressStats stats={gritStats} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsList achievements={gritStats.achievements} />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedShell>
  );
};

export default BossLevelGritPage;