
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Zap, Target, Gift, Crown, Award, Timer, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'milestone' | 'special';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  timeLeft: string;
  progress: number;
  maxProgress: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const GamificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [userLevel, setUserLevel] = useState(5);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [nextLevelPoints] = useState(1500);

  const achievements: Achievement[] = [
    {
      id: 'first-scan',
      title: 'Premier Scan',
      description: 'Effectuer votre premier scan émotionnel',
      icon: Trophy,
      points: 50,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      category: 'milestone'
    },
    {
      id: 'music-lover',
      title: 'Mélomane',
      description: 'Écouter 60 minutes de musicothérapie',
      icon: Star,
      points: 100,
      unlocked: true,
      progress: 60,
      maxProgress: 60,
      category: 'milestone'
    },
    {
      id: 'journal-keeper',
      title: 'Gardien du Journal',
      description: 'Écrire 10 entrées dans votre journal',
      icon: Award,
      points: 150,
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      category: 'milestone'
    },
    {
      id: 'vr-explorer',
      title: 'Explorateur VR',
      description: 'Compléter 5 sessions de réalité virtuelle',
      icon: Crown,
      points: 200,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      category: 'milestone'
    },
    {
      id: 'weekly-warrior',
      title: 'Guerrier Hebdomadaire',
      description: 'Utiliser EmotionsCare 7 jours consécutifs',
      icon: Zap,
      points: 300,
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      category: 'weekly'
    }
  ];

  const challenges: Challenge[] = [
    {
      id: 'daily-meditation',
      title: 'Méditation Quotidienne',
      description: 'Effectuer une session de méditation VR',
      reward: 25,
      timeLeft: '14h 32m',
      progress: 0,
      maxProgress: 1,
      difficulty: 'easy'
    },
    {
      id: 'emotion-tracker',
      title: 'Suivi Émotionnel',
      description: 'Scanner vos émotions 3 fois aujourd\'hui',
      reward: 50,
      timeLeft: '14h 32m',
      progress: 1,
      maxProgress: 3,
      difficulty: 'medium'
    },
    {
      id: 'music-marathon',
      title: 'Marathon Musical',
      description: 'Écouter 2 heures de musicothérapie cette semaine',
      reward: 100,
      timeLeft: '3j 14h',
      progress: 45,
      maxProgress: 120,
      difficulty: 'hard'
    }
  ];

  const levelProgress = ((totalPoints % 250) / 250) * 100;

  const handleClaimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.progress >= challenge.maxProgress) {
      toast.success(`Récompense réclamée ! +${challenge.reward} points`);
      setTotalPoints(prev => prev + challenge.reward);
    } else {
      toast.info('Défi non terminé');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Gamification
              </h1>
              <p className="text-gray-600">Gagnez des points et débloquez des récompenses</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{userLevel}</div>
              <div className="text-sm text-gray-600">Niveau</div>
              <Progress value={levelProgress} className="mt-2" />
              <div className="text-xs text-gray-500 mt-1">
                {totalPoints % 250}/250 XP
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{totalPoints}</div>
              <div className="text-sm text-gray-600">Points Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{currentStreak}</div>
              <div className="text-sm text-gray-600">Jours Consécutifs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-gray-600">Succès Débloqués</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Succès
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Défis
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Récompenses
            </TabsTrigger>
          </TabsList>

          {/* Achievements */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`achievement-${achievement.id}`}
                >
                  <Card className={`h-full ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'opacity-75'}`}>
                    <CardHeader className="text-center">
                      <div className={`mx-auto p-3 rounded-full ${achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-400'} text-white w-fit`}>
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Progression</span>
                          <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                            {achievement.points} pts
                          </Badge>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500 text-center">
                          {achievement.progress}/{achievement.maxProgress}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges">
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`challenge-${challenge.id}`}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{challenge.title}</h3>
                            <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              <Timer className="h-3 w-3 mr-1" />
                              {challenge.timeLeft}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{challenge.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progression</span>
                              <span>{challenge.progress}/{challenge.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(challenge.progress / challenge.maxProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                        <div className="ml-6 text-center">
                          <div className="text-2xl font-bold text-yellow-600 mb-2">
                            +{challenge.reward}
                          </div>
                          <Button
                            size="sm"
                            disabled={challenge.progress < challenge.maxProgress}
                            onClick={() => handleClaimReward(challenge.id)}
                          >
                            {challenge.progress >= challenge.maxProgress ? 'Réclamer' : 'En cours'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Rewards */}
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'theme-unlock', title: 'Thème Premium', cost: 500, description: 'Débloquer des thèmes exclusifs', available: true },
                { id: 'vr-content', title: 'Contenu VR Bonus', cost: 750, description: 'Environnements VR supplémentaires', available: true },
                { id: 'music-library', title: 'Bibliothèque Étendue', cost: 1000, description: 'Accès à plus de musiques', available: false },
                { id: 'ai-coach-pro', title: 'Coach IA Pro', cost: 1250, description: 'Fonctionnalités avancées du coach', available: false },
                { id: 'analytics-plus', title: 'Analytics Plus', cost: 1500, description: 'Analyses détaillées de progression', available: false },
                { id: 'exclusive-badge', title: 'Badge Exclusif', cost: 2000, description: 'Badge de statut premium', available: false }
              ].map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`reward-${reward.id}`}
                >
                  <Card className={`h-full ${reward.available ? '' : 'opacity-60'}`}>
                    <CardHeader className="text-center">
                      <div className={`mx-auto p-3 rounded-full ${reward.available ? 'bg-purple-500' : 'bg-gray-400'} text-white w-fit`}>
                        <Gift className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-4">
                        {reward.cost} pts
                      </div>
                      <Button
                        className="w-full"
                        disabled={!reward.available || totalPoints < reward.cost}
                      >
                        {reward.available ? 'Échanger' : 'Bientôt disponible'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationPage;
