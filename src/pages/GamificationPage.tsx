import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Medal, Star, Crown, 
  TrendingUp, Users, Calendar, Award, Target,
  Zap, Heart, Brain, Activity, Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'wellness' | 'social' | 'achievement' | 'special';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  timeLeft: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'daily' | 'weekly' | 'monthly';
}

const GamificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'challenges' | 'leaderboard'>('overview');
  
  // Données utilisateur
  const userStats = {
    level: 28,
    xp: 15680,
    xpToNext: 2320,
    totalXp: 18000,
    streak: 7,
    completedChallenges: 42,
    earnedBadges: 15,
    totalBadges: 48,
    rank: 4,
    weeklyXp: 1250,
  };

  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Premier Pas',
      description: 'Complétez votre première session',
      icon: '🚀',
      rarity: 'bronze',
      earned: true,
      category: 'achievement',
    },
    {
      id: '2',
      name: 'Série Parfaite',
      description: 'Maintenez une série de 7 jours',
      icon: '🔥',
      rarity: 'silver',
      earned: true,
      category: 'achievement',
    },
    {
      id: '3',
      name: 'Maître Zen',
      description: 'Complétez 50 sessions de méditation',
      icon: '🧘‍♀️',
      rarity: 'gold',
      earned: false,
      progress: 32,
      maxProgress: 50,
      category: 'wellness',
    },
    {
      id: '4',
      name: 'Explorateur VR',
      description: 'Découvrez tous les environnements VR',
      icon: '🥽',
      rarity: 'gold',
      earned: false,
      progress: 8,
      maxProgress: 12,
      category: 'wellness',
    },
    {
      id: '5',
      name: 'Légende',
      description: 'Atteignez le niveau 50',
      icon: '👑',
      rarity: 'diamond',
      earned: false,
      progress: 28,
      maxProgress: 50,
      category: 'special',
    },
    {
      id: '6',
      name: 'Communauté',
      description: 'Aidez 10 autres utilisateurs',
      icon: '🤝',
      rarity: 'silver',
      earned: false,
      progress: 3,
      maxProgress: 10,
      category: 'social',
    },
  ]);

  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Méditation Quotidienne',
      description: 'Méditez 10 minutes par jour pendant 7 jours',
      reward: '500 XP + Badge Sérénité',
      progress: 5,
      maxProgress: 7,
      timeLeft: '2 jours',
      difficulty: 'easy',
      type: 'weekly',
    },
    {
      id: '2',
      title: 'Explorateur Émotionnel',
      description: 'Effectuez 5 scans émotionnels cette semaine',
      reward: '300 XP',
      progress: 3,
      maxProgress: 5,
      timeLeft: '4 jours',
      difficulty: 'medium',
      type: 'weekly',
    },
    {
      id: '3',
      title: 'Maître VR',
      description: 'Complétez 3 sessions VR différentes',
      reward: '750 XP + Badge VR Expert',
      progress: 1,
      maxProgress: 3,
      timeLeft: '6 jours',
      difficulty: 'hard',
      type: 'weekly',
    },
    {
      id: '4',
      title: 'Connexion Sociale',
      description: 'Partagez vos progrès avec la communauté',
      reward: '200 XP',
      progress: 0,
      maxProgress: 1,
      timeLeft: '23h',
      difficulty: 'easy',
      type: 'daily',
    },
  ]);

  const rarityColors = {
    bronze: 'bg-amber-100 text-amber-700 border-amber-300',
    silver: 'bg-gray-100 text-gray-700 border-gray-300',
    gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    diamond: 'bg-blue-100 text-blue-700 border-blue-300',
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const typeColors = {
    daily: 'bg-blue-100 text-blue-700',
    weekly: 'bg-purple-100 text-purple-700',
    monthly: 'bg-indigo-100 text-indigo-700',
  };

  const progressPercentage = (userStats.xp / userStats.totalXp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Gamification</h1>
              <p className="text-sm text-muted-foreground">Défis, récompenses et progression</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="font-semibold">Niveau {userStats.level}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Onglets */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'challenges', label: 'Défis', icon: Target },
            { id: 'leaderboard', label: 'Classements', icon: Trophy },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profil Utilisateur */}
              <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userStats.level}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Niveau {userStats.level}</h2>
                      <p className="text-muted-foreground">Rang #{userStats.rank} mondial</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{userStats.xp.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">XP Total</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progrès vers le niveau {userStats.level + 1}</span>
                    <span>{userStats.xpToNext} XP restants</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
                    <div className="text-sm text-muted-foreground">Jours consécutifs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{userStats.completedChallenges}</div>
                    <div className="text-sm text-muted-foreground">Défis complétés</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{userStats.earnedBadges}/{userStats.totalBadges}</div>
                    <div className="text-sm text-muted-foreground">Badges obtenus</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">+{userStats.weeklyXp}</div>
                    <div className="text-sm text-muted-foreground">XP cette semaine</div>
                  </div>
                </div>
              </Card>

              {/* Défis Actifs */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">🎯 Défis Actifs</h3>
                <div className="space-y-4">
                  {challenges.slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{challenge.title}</h4>
                          <Badge className={difficultyColors[challenge.difficulty]}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge className={typeColors[challenge.type]}>
                            {challenge.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                        <div className="flex items-center gap-4">
                          <Progress 
                            value={(challenge.progress / challenge.maxProgress) * 100} 
                            className="w-32 h-2"
                          />
                          <span className="text-sm">
                            {challenge.progress}/{challenge.maxProgress}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {challenge.timeLeft} restants
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-green-600">{challenge.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Badges Récents */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">🏆 Derniers Badges Obtenus</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.filter(badge => badge.earned).slice(-4).map((badge) => (
                    <div key={badge.id} className="text-center p-4 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h4 className="font-semibold text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      <Badge className={`${rarityColors[badge.rarity]} mt-2`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Collection de Badges</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {badges.filter(b => b.earned).length}/{badges.length} obtenus
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border transition-all ${
                        badge.earned
                          ? 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200 shadow-md'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                          {badge.icon}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        
                        <Badge className={rarityColors[badge.rarity]}>
                          {badge.rarity}
                        </Badge>

                        {!badge.earned && badge.progress !== undefined && (
                          <div className="mt-3">
                            <Progress 
                              value={(badge.progress / (badge.maxProgress || 1)) * 100} 
                              className="h-2 mb-1"
                            />
                            <p className="text-xs text-muted-foreground">
                              {badge.progress}/{badge.maxProgress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">🎯 Défis Disponibles</h2>
                
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <Badge className={difficultyColors[challenge.difficulty]}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge className={typeColors[challenge.type]}>
                              {challenge.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{challenge.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{challenge.reward}</p>
                          <p className="text-sm text-muted-foreground">{challenge.timeLeft} restants</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Progress 
                            value={(challenge.progress / challenge.maxProgress) * 100} 
                            className="flex-1 h-3"
                          />
                          <span className="text-sm font-medium">
                            {challenge.progress}/{challenge.maxProgress}
                          </span>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant={challenge.progress > 0 ? 'default' : 'outline'}
                          className="ml-4"
                        >
                          {challenge.progress === challenge.maxProgress ? 'Réclamer' : 'Participer'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">🏆 Classement Global</h2>
                <p className="text-muted-foreground mb-4">
                  Vous êtes classé #{userStats.rank} sur 10,000+ utilisateurs actifs
                </p>
                <Button onClick={() => navigate('/app/leaderboard')}>
                  Voir le classement détaillé
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamificationPage;