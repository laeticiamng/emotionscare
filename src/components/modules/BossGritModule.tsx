// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, Target, Zap, TrendingUp, Award, 
  Calendar, Clock, CheckCircle, Plus, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  category: 'productivity' | 'mindset' | 'health' | 'leadership';
  points: number;
  duration: string;
  completed: boolean;
  progress: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'points' | 'challenge' | 'special';
  requirement: number;
  current: number;
  unlocked: boolean;
  badge: string;
}

const challenges: Challenge[] = [
  {
    id: 'daily-affirmations',
    title: 'Affirmations Quotidiennes',
    description: 'Récitez 5 affirmations positives chaque matin pendant 7 jours',
    difficulty: 'easy',
    category: 'mindset',
    points: 50,
    duration: '7 jours',
    completed: false,
    progress: 3,
    icon: Crown
  },
  {
    id: 'power-hour',
    title: 'Power Hour',
    description: 'Travaillez sans distraction pendant 1h sur votre projet le plus important',
    difficulty: 'medium',
    category: 'productivity',
    points: 100,
    duration: '1 session',
    completed: true,
    progress: 100,
    icon: Zap
  },
  {
    id: 'leadership-decision',
    title: 'Décision de Leader',
    description: 'Prenez une décision difficile que vous reportez depuis longtemps',
    difficulty: 'hard',
    category: 'leadership',
    points: 200,
    duration: '1 jour',
    completed: false,
    progress: 0,
    icon: Target
  },
  {
    id: 'epic-vision',
    title: 'Vision Épique',
    description: 'Créez un plan détaillé pour votre objectif à 5 ans',
    difficulty: 'epic',
    category: 'leadership',
    points: 500,
    duration: '1 semaine',
    completed: false,
    progress: 25,
    icon: TrendingUp
  }
];

const achievements: Achievement[] = [
  {
    id: 'first-win',
    title: 'Premier Succès',
    description: 'Complétez votre premier défi',
    type: 'challenge',
    requirement: 1,
    current: 1,
    unlocked: true,
    badge: '🏆'
  },
  {
    id: 'streak-master',
    title: 'Maître de la Constance',
    description: 'Maintenez une série de 7 jours',
    type: 'streak',
    requirement: 7,
    current: 3,
    unlocked: false,
    badge: '🔥'
  },
  {
    id: 'point-collector',
    title: 'Collecteur de Points',
    description: 'Accumulez 1000 points',
    type: 'points',
    requirement: 1000,
    current: 350,
    unlocked: false,
    badge: '💎'
  },
  {
    id: 'boss-level',
    title: 'Niveau Boss',
    description: 'Complétez un défi épique',
    type: 'special',
    requirement: 1,
    current: 0,
    unlocked: false,
    badge: '👑'
  }
];

const difficultyConfig = {
  easy: { color: 'bg-green-100 text-green-800', label: 'Facile' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Moyen' },
  hard: { color: 'bg-orange-100 text-orange-800', label: 'Difficile' },
  epic: { color: 'bg-purple-100 text-purple-800', label: 'Épique' }
};

const categoryConfig = {
  productivity: { color: 'bg-blue-100 text-blue-800', icon: Zap },
  mindset: { color: 'bg-pink-100 text-pink-800', icon: Crown },
  health: { color: 'bg-green-100 text-green-800', icon: Target },
  leadership: { color: 'bg-purple-100 text-purple-800', icon: TrendingUp }
};

export const BossGritModule: React.FC = () => {
  const [userStats, setUserStats] = useState({
    totalPoints: 350,
    currentStreak: 3,
    completedChallenges: 12,
    level: 'Apprenti Boss'
  });
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [showNewChallenge, setShowNewChallenge] = useState(false);

  // Calculer le niveau basé sur les points
  const calculateLevel = (points: number) => {
    if (points < 100) return 'Novice';
    if (points < 300) return 'Apprenti Boss';
    if (points < 600) return 'Boss en Formation';
    if (points < 1000) return 'Boss Confirmé';
    return 'Boss Légendaire';
  };

  const getProgressToNextLevel = (points: number) => {
    const thresholds = [100, 300, 600, 1000];
    const current = thresholds.find(t => points < t) || 1000;
    const previous = thresholds[thresholds.indexOf(current) - 1] || 0;
    return ((points - previous) / (current - previous)) * 100;
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    toast.success(`Défi "${challenge.title}" activé !`);
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      challenge.completed = true;
      challenge.progress = 100;
      setUserStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + challenge.points,
        completedChallenges: prev.completedChallenges + 1
      }));
      toast.success(`Défi complété ! +${challenge.points} points`);
    }
  };

  const createCustomChallenge = () => {
    if (!newChallengeTitle.trim()) return;
    
    const newChallenge: Challenge = {
      id: `custom-${Date.now()}`,
      title: newChallengeTitle,
      description: 'Défi personnalisé',
      difficulty: 'medium',
      category: 'productivity',
      points: 75,
      duration: '1 jour',
      completed: false,
      progress: 0,
      icon: Target
    };
    
    challenges.push(newChallenge);
    setNewChallengeTitle('');
    setShowNewChallenge(false);
    toast.success('Défi personnalisé créé !');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Crown className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Boss Grit</h1>
          <p className="text-muted-foreground">
            Développez votre mental de leader avec des défis progressifs
          </p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Niveau</p>
                <p className="text-xl font-bold">{calculateLevel(userStats.totalPoints)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Points</p>
                <p className="text-xl font-bold">{userStats.totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Série</p>
                <p className="text-xl font-bold">{userStats.currentStreak} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Complétés</p>
                <p className="text-xl font-bold">{userStats.completedChallenges}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progression vers le niveau suivant */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Progression vers le niveau suivant</h3>
            <span className="text-sm text-muted-foreground">
              {Math.round(getProgressToNextLevel(userStats.totalPoints))}%
            </span>
          </div>
          <Progress value={getProgressToNextLevel(userStats.totalPoints)} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Défis Actifs</TabsTrigger>
          <TabsTrigger value="achievements">Succès</TabsTrigger>
          <TabsTrigger value="leaderboard">Classement</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Défis Disponibles</h2>
            <Button 
              onClick={() => setShowNewChallenge(!showNewChallenge)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un défi
            </Button>
          </div>

          {/* Formulaire nouveau défi */}
          <AnimatePresence>
            {showNewChallenge && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Nouveau Défi Personnalisé</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      value={newChallengeTitle}
                      onChange={(e) => setNewChallengeTitle(e.target.value)}
                      placeholder="Titre de votre défi..."
                    />
                    <div className="flex gap-2">
                      <Button onClick={createCustomChallenge}>
                        Créer
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewChallenge(false)}>
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liste des défis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="h-full"
              >
                <Card className={`h-full flex flex-col ${challenge.completed ? 'ring-2 ring-green-200' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <challenge.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex gap-1 flex-col items-end">
                        <Badge className={difficultyConfig[challenge.difficulty].color}>
                          {difficultyConfig[challenge.difficulty].label}
                        </Badge>
                        <Badge variant="outline" className={categoryConfig[challenge.category].color}>
                          {challenge.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {challenge.description}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} />
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>{challenge.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{challenge.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {challenge.completed ? (
                        <Button className="w-full" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complété
                        </Button>
                      ) : challenge.progress > 0 ? (
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            onClick={() => completeChallenge(challenge.id)}
                          >
                            Terminer le défi
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => startChallenge(challenge)}
                          >
                            Continuer
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => startChallenge(challenge)}
                        >
                          Commencer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <h2 className="text-xl font-semibold">Succès & Récompenses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.unlocked ? 'ring-2 ring-yellow-200' : 'opacity-75'}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{achievement.badge}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{achievement.current} / {achievement.requirement}</span>
                        </div>
                        <Progress 
                          value={(achievement.current / achievement.requirement) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      {achievement.unlocked && (
                        <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                          Débloqué !
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Classement Global</h3>
            <p className="text-muted-foreground mb-4">
              Comparez-vous aux autres Boss en formation
            </p>
            <Badge variant="outline" className="bg-yellow-50">
              Fonctionnalité à venir
            </Badge>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};