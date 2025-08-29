import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, Gamepad2, Star, Zap, Crown, Flame, Medal, 
         Clock, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  points: number;
  progress: number;
  maxProgress: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  reward: string;
  icon: string;
  category: 'fitness' | 'mental' | 'social' | 'creative' | 'mindfulness';
}

interface PlayerStats {
  level: number;
  xp: number;
  totalPoints: number;
  streak: number;
  rank: string;
  achievements: string[];
}

const B2CAmbitionArcadePage: React.FC = () => {
  const navigate = useNavigate();
  usePageMetadata('Ambition Arcade', 'Jeux motivationnels pour booster vos objectifs', '/b2c/ambition-arcade', 'energized');

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 15,
    xp: 2340,
    totalPoints: 8750,
    streak: 7,
    rank: 'Guerrier Motivé',
    achievements: ['Premier Pas', 'Persévérant', 'Déterminé', 'Champion du Jour']
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Marathon Mental',
      description: 'Méditez pendant 30 minutes consécutives',
      type: 'daily',
      difficulty: 'medium',
      points: 150,
      progress: 15,
      maxProgress: 30,
      status: 'in_progress',
      reward: 'Badge Zen Master',
      icon: '🧘‍♀️',
      category: 'mindfulness'
    },
    {
      id: '2',
      title: 'Créateur Inspiré',
      description: 'Créez 3 contenus créatifs aujourd\'hui',
      type: 'daily',
      difficulty: 'easy',
      points: 100,
      progress: 1,
      maxProgress: 3,
      status: 'in_progress',
      reward: '50 XP bonus',
      icon: '🎨',
      category: 'creative'
    },
    {
      id: '3',
      title: 'Titan Social',
      description: 'Aidez 5 personnes cette semaine',
      type: 'weekly',
      difficulty: 'hard',
      points: 300,
      progress: 2,
      maxProgress: 5,
      status: 'in_progress',
      reward: 'Titre Elite Helper',
      icon: '🤝',
      category: 'social'
    },
    {
      id: '4',
      title: 'Beast Mode Fitness',
      description: 'Complétez 50 push-ups sans pause',
      type: 'achievement',
      difficulty: 'extreme',
      points: 500,
      progress: 0,
      maxProgress: 50,
      status: 'available',
      reward: 'Couronne Fitness King',
      icon: '💪',
      category: 'fitness'
    }
  ]);

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [gameMode, setGameMode] = useState<'arcade' | 'challenge' | 'leaderboard'>('arcade');

  const xpToNextLevel = 2500;
  const xpProgress = (playerStats.xp / xpToNextLevel) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'fitness': return '💪';
      case 'mental': return '🧠';
      case 'social': return '🤝';
      case 'creative': return '🎨';
      case 'mindfulness': return '🧘‍♀️';
      default: return '⭐';
    }
  };

  const startChallenge = (challenge: Challenge) => {
    if (challenge.status === 'available') {
      setChallenges(prev => prev.map(c => 
        c.id === challenge.id 
          ? { ...c, status: 'in_progress' as const } 
          : c
      ));
      setActiveChallenge(challenge);
    }
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'completed' as const, progress: c.maxProgress } 
        : c
    ));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + challenge.points,
        totalPoints: prev.totalPoints + challenge.points,
        streak: prev.streak + 1
      }));
    }
  };

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/app/home')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au Dashboard
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎮 Ambition Arcade
          </h1>
          <p className="text-muted-foreground">Transformez vos objectifs en aventure épique</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <span className="font-semibold">{playerStats.rank}</span>
        </div>
      </div>

      {/* Stats du joueur */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{playerStats.level}</span>
              </div>
              <p className="text-sm text-muted-foreground">Niveau</p>
              <div className="mt-2">
                <Progress value={xpProgress} className="h-2" />
                <p className="text-xs mt-1">{playerStats.xp}/{xpToNextLevel} XP</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                <span className="text-2xl font-bold">{playerStats.totalPoints.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Points Total</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{playerStats.streak}</span>
              </div>
              <p className="text-sm text-muted-foreground">Série Actuelle</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Medal className="h-6 w-6 text-purple-500 mr-2" />
                <span className="text-2xl font-bold">{playerStats.achievements.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold">#{Math.floor(Math.random() * 50) + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">Rang Global</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={gameMode} onValueChange={(value) => setGameMode(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="arcade" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Défis Actifs
          </TabsTrigger>
          <TabsTrigger value="challenge" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Challenges Spéciaux
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Classements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="arcade" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 ${
                  challenge.status === 'completed' ? 'bg-green-50 border-green-200' : ''
                }`}>
                  {challenge.status === 'completed' && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500">
                        <Trophy className="h-3 w-3 mr-1" />
                        Complété!
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{challenge.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
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
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{challenge.points} pts</span>
                        </div>
                        <Badge variant="outline">
                          {getCategoryIcon(challenge.category)} {challenge.category}
                        </Badge>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => challenge.status === 'in_progress' 
                          ? completeChallenge(challenge.id)
                          : startChallenge(challenge)
                        }
                        disabled={challenge.status === 'locked' || challenge.status === 'completed'}
                        variant={challenge.status === 'in_progress' ? 'default' : 'outline'}
                      >
                        {challenge.status === 'locked' && 'Verrouillé'}
                        {challenge.status === 'available' && 'Commencer'}
                        {challenge.status === 'in_progress' && 'Terminer'}
                        {challenge.status === 'completed' && 'Complété'}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      🎁 Récompense: {challenge.reward}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenge" className="space-y-6">
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Challenges Spéciaux</h3>
            <p className="text-muted-foreground mb-6">
              Des défis uniques avec des récompenses exclusives
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">👑</div>
                  <h4 className="font-bold mb-2">Défi Royal</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completez 10 défis cette semaine
                  </p>
                  <Badge className="bg-purple-500">1000 XP</Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🔥</div>
                  <h4 className="font-bold mb-2">Série Ardente</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Maintenez une série de 30 jours
                  </p>
                  <Badge className="bg-orange-500">Titre Légendaire</Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h4 className="font-bold mb-2">Maître Parfait</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Obtenez 100% dans 5 catégories
                  </p>
                  <Badge className="bg-green-500">Médaille Parfaite</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Classement Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'Vous', points: 8750, avatar: '👑' },
                  { rank: 2, name: 'Alex M.', points: 8200, avatar: '🥈' },
                  { rank: 3, name: 'Sarah L.', points: 7890, avatar: '🥉' },
                  { rank: 4, name: 'Mike R.', points: 7650, avatar: '🏅' },
                  { rank: 5, name: 'Emma K.', points: 7320, avatar: '⭐' }
                ].map((player) => (
                  <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === 'Vous' ? 'bg-purple-50 border border-purple-200' : 'bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.avatar}</span>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-muted-foreground">#{player.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{player.points.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CAmbitionArcadePage;