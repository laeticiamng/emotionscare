import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Crown,
  Flame
} from 'lucide-react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import ChallengeCard from '@/components/boss-level-grit/ChallengeCard';
import ActiveSession from '@/components/boss-level-grit/ActiveSession';
import ProgressStats from '@/components/boss-level-grit/ProgressStats';
import AchievementsList from '@/components/boss-level-grit/AchievementsList';
import { GritChallenge, GritStats } from '@/types/boss-level-grit';

const BossLevelGritPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<GritChallenge | null>(null);

  // Mock data - en production, ces données viendraient d'une API
  const [gritStats] = useState<GritStats>({
    totalXp: 2450,
    currentLevel: {
      id: 'warrior',
      name: 'Guerrier Mental',
      description: 'Vous maîtrisez les bases de la résilience',
      minXp: 2000,
      maxXp: 5000,
      color: 'hsl(var(--primary))',
      icon: '⚔️',
      benefits: ['Défis avancés débloqués', 'Sessions personnalisées', 'Coach IA spécialisé'],
      unlockedFeatures: ['Challenges Master', 'Mindset Builder', 'Progress Analytics']
    },
    nextLevel: {
      id: 'master',
      name: 'Maître de la Résilience',
      description: 'Expert en gestion du stress et dépassement de soi',
      minXp: 5000,
      maxXp: 10000,
      color: 'hsl(var(--accent))',
      icon: '🏆',
      benefits: ['Défis légendaires', 'Coaching personnalisé', 'Communauté VIP'],
      unlockedFeatures: ['Legend Challenges', 'Personal Coach', 'VIP Community']
    },
    completedChallenges: 23,
    currentStreak: 7,
    longestStreak: 14,
    averageScore: 87,
    totalSessionTime: 1240,
    categoriesProgress: {
      mental: 85,
      physical: 60,
      emotional: 75,
      spiritual: 45
    },
    achievements: [
      {
        id: 'first-complete',
        title: 'Premier Défi',
        description: 'Complétez votre premier défi',
        icon: '🎯',
        type: 'completion',
        requirement: 1,
        progress: 1,
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
        reward: { xp: 100 }
      },
      {
        id: 'streak-master',
        title: 'Maître de la Constance',
        description: 'Maintenez une série de 10 jours',
        icon: '🔥',
        type: 'streak',
        requirement: 10,
        progress: 7,
        unlocked: false,
        reward: { xp: 500, features: ['Advanced Analytics'] }
      },
      {
        id: 'mental-fortress',
        title: 'Forteresse Mentale',
        description: 'Complétez 5 défis mentaux',
        icon: '🧠',
        type: 'category',
        requirement: 5,
        progress: 3,
        unlocked: false,
        reward: { xp: 300 }
      },
      {
        id: 'perfect-score',
        title: 'Perfection',
        description: 'Obtenez un score de 100%',
        icon: '⭐',
        type: 'score',
        requirement: 100,
        progress: 87,
        unlocked: false,
        reward: { xp: 400, features: ['Perfect Mode'] }
      }
    ]
  });

  const [challenges] = useState<GritChallenge[]>([
    {
      id: 'mental-fortress',
      title: 'Forteresse Mentale',
      description: 'Développez votre résistance au stress avec des techniques avancées de visualisation et de pleine conscience',
      difficulty: 'warrior',
      category: 'mental',
      duration: 15,
      xpReward: 200,
      completionRate: 78,
      status: 'available',
      tags: ['Visualisation', 'Stress', 'Focus', 'Méditation'],
      createdAt: new Date()
    },
    {
      id: 'emotional-mastery',
      title: 'Maîtrise Émotionnelle',
      description: 'Apprenez à gérer vos émotions intenses et à les transformer en force motrice',
      difficulty: 'master',
      category: 'emotional',
      duration: 20,
      xpReward: 350,
      completionRate: 65,
      status: 'available',
      streakRequired: 5,
      tags: ['Émotions', 'Régulation', 'Transformation', 'Intelligence émotionnelle'],
      createdAt: new Date()
    },
    {
      id: 'physical-endurance',
      title: 'Endurance Physique',
      description: 'Repoussez vos limites physiques avec des exercices progressifs et adaptés',
      difficulty: 'novice',
      category: 'physical',
      duration: 10,
      xpReward: 150,
      completionRate: 89,
      status: 'completed',
      tags: ['Endurance', 'Corps', 'Limites', 'Progression'],
      createdAt: new Date(),
      completedAt: new Date('2024-01-10')
    },
    {
      id: 'spiritual-awakening',
      title: 'Éveil Spirituel',
      description: 'Connectez-vous à votre essence profonde et trouvez votre purpose dans l\'adversité',
      difficulty: 'legend',
      category: 'spiritual',
      duration: 30,
      xpReward: 500,
      completionRate: 42,
      status: 'locked',
      streakRequired: 15,
      prerequisites: ['mental-fortress', 'emotional-mastery'],
      tags: ['Spiritualité', 'Purpose', 'Connexion', 'Transcendance'],
      createdAt: new Date()
    },
    {
      id: 'pressure-diamond',
      title: 'Diamant sous Pression',
      description: 'Transformez la pression en performance exceptionnelle grâce à des techniques de résilience avancées',
      difficulty: 'master',
      category: 'mental',
      duration: 25,
      xpReward: 400,
      completionRate: 58,
      status: 'available',
      streakRequired: 10,
      tags: ['Pression', 'Performance', 'Résilience', 'Excellence'],
      createdAt: new Date()
    },
    {
      id: 'heart-warrior',
      title: 'Guerrier du Cœur',
      description: 'Développez votre courage émotionnel et votre capacité à faire face aux défis relationnels',
      difficulty: 'warrior',
      category: 'emotional',
      duration: 18,
      xpReward: 250,
      completionRate: 72,
      status: 'available',
      tags: ['Courage', 'Relations', 'Vulnérabilité', 'Authenticité'],
      createdAt: new Date()
    }
  ]);

  const startChallenge = (challenge: GritChallenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('session');
  };

  const completeChallenge = (score: number, insights: string[]) => {
    if (selectedChallenge) {
      console.log('Défi complété:', {
        challenge: selectedChallenge.id,
        score,
        insights
      });
      
      // Mise à jour du statut du défi
      setSelectedChallenge(null);
      setActiveTab('challenges');
      
      // Ici on mettrait à jour les stats et sauvegarderait en base
    }
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

          {/* Onglet Défis */}
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

          {/* Onglet Session Active */}
          <TabsContent value="session" className="space-y-6">
            <ActiveSession
              challenge={selectedChallenge}
              onComplete={completeChallenge}
              onBack={backToChallenges}
            />
          </TabsContent>

          {/* Onglet Progression */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressStats stats={gritStats} />
          </TabsContent>

          {/* Onglet Succès */}
          <TabsContent value="achievements" className="space-y-6">
            <AchievementsList achievements={gritStats.achievements} />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedShell>
  );
};

export default BossLevelGritPage;