import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Medal, Star, Crown, 
  TrendingUp, Users, Calendar, Award, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeaderboardEntry {
  id: string;
  rank: number;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  score: number;
  change: number; // +/-
  badges: string[];
  streak: number;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
}

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  
  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      rank: 1,
      user: { name: 'Sarah M.', avatar: '👩‍💼', level: 42 },
      score: 2847,
      change: 2,
      badges: ['🔥', '🎯', '⭐'],
      streak: 15,
      category: 'overall',
    },
    {
      id: '2',
      rank: 2,
      user: { name: 'Alex R.', avatar: '👨‍💻', level: 38 },
      score: 2756,
      change: -1,
      badges: ['🚀', '💪', '🧘'],
      streak: 12,
      category: 'overall',
    },
    {
      id: '3',
      rank: 3,
      user: { name: 'Maya K.', avatar: '👩‍🎨', level: 35 },
      score: 2643,
      change: 1,
      badges: ['🎨', '💖', '🌟'],
      streak: 8,
      category: 'overall',
    },
    {
      id: '4',
      rank: 4,
      user: { name: 'Vous', avatar: '😊', level: 28 },
      score: 2156,
      change: 3,
      badges: ['🎵', '📚', '🌱'],
      streak: 7,
      category: 'overall',
    },
    {
      id: '5',
      rank: 5,
      user: { name: 'Lucas D.', avatar: '👨‍🚀', level: 31 },
      score: 2089,
      change: -2,
      badges: ['🔬', '🎮', '⚡'],
      streak: 5,
      category: 'overall',
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Série Parfaite',
      description: 'Complétez 7 jours consécutifs d\'activités',
      icon: '🔥',
      rarity: 'common',
      progress: 7,
      maxProgress: 7,
      unlocked: true,
    },
    {
      id: '2',
      title: 'Maître de la Méditation',
      description: 'Terminez 50 sessions de méditation',
      icon: '🧘‍♀️',
      rarity: 'rare',
      progress: 35,
      maxProgress: 50,
      unlocked: false,
    },
    {
      id: '3',
      title: 'Explorateur VR',
      description: 'Découvrez tous les environnements VR',
      icon: '🥽',
      rarity: 'epic',
      progress: 8,
      maxProgress: 12,
      unlocked: false,
    },
    {
      id: '4',
      title: 'Légende Émotionnelle',
      description: 'Atteignez le niveau 50 en analyse émotionnelle',
      icon: '👑',
      rarity: 'legendary',
      progress: 28,
      maxProgress: 50,
      unlocked: false,
    },
  ]);

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-300',
    rare: 'bg-blue-100 text-blue-700 border-blue-300',
    epic: 'bg-purple-100 text-purple-700 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</div>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  const currentUser = leaderboard.find(entry => entry.user.name === 'Vous');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Classements</h1>
              <p className="text-sm text-muted-foreground">Compétition amicale et récompenses</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Target className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Général</SelectItem>
              <SelectItem value="wellness">Bien-être</SelectItem>
              <SelectItem value="meditation">Méditation</SelectItem>
              <SelectItem value="vr">Réalité Virtuelle</SelectItem>
              <SelectItem value="journal">Journal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Classement Principal */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Votre Position */}
            {currentUser && (
              <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold">
                    #{currentUser.rank}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Votre position</span>
                      {getChangeIcon(currentUser.change)}
                      <span className={`text-sm ${currentUser.change > 0 ? 'text-green-600' : currentUser.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {currentUser.change > 0 ? '+' : ''}{currentUser.change}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{currentUser.score} points</span>
                      <span>Niveau {currentUser.user.level}</span>
                      <span>{currentUser.streak} jours consécutifs</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {currentUser.badges.map((badge, i) => (
                      <span key={i} className="text-lg">{badge}</span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Podium */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">🏆 Podium de la Semaine</h2>
              <div className="flex items-end justify-center gap-4 mb-6">
                
                {/* 2ème place */}
                <div className="text-center">
                  <div className="w-16 h-20 bg-gray-200 rounded-t-lg flex items-end justify-center pb-2 mb-2">
                    <span className="text-2xl">{leaderboard[1]?.user.avatar}</span>
                  </div>
                  <Medal className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="font-semibold text-sm">{leaderboard[1]?.user.name}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[1]?.score} pts</p>
                </div>

                {/* 1ère place */}
                <div className="text-center">
                  <div className="w-20 h-24 bg-yellow-200 rounded-t-lg flex items-end justify-center pb-2 mb-2">
                    <span className="text-3xl">{leaderboard[0]?.user.avatar}</span>
                  </div>
                  <Crown className="w-10 h-10 text-yellow-500 mx-auto mb-1" />
                  <p className="font-semibold">{leaderboard[0]?.user.name}</p>
                  <p className="text-sm text-muted-foreground">{leaderboard[0]?.score} pts</p>
                </div>

                {/* 3ème place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-t-lg flex items-end justify-center pb-2 mb-2">
                    <span className="text-2xl">{leaderboard[2]?.user.avatar}</span>
                  </div>
                  <Award className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                  <p className="font-semibold text-sm">{leaderboard[2]?.user.name}</p>
                  <p className="text-xs text-muted-foreground">{leaderboard[2]?.score} pts</p>
                </div>
              </div>
            </Card>

            {/* Classement Complet */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Classement Complet</h2>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${
                      entry.user.name === 'Vous' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{entry.user.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{entry.user.name}</span>
                          {entry.user.name === 'Vous' && <Badge variant="outline">Vous</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Niveau {entry.user.level} • {entry.streak} jours
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {entry.badges.map((badge, i) => (
                          <span key={i} className="text-sm">{badge}</span>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{entry.score}</p>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(entry.change)}
                          <span className={`text-xs ${
                            entry.change > 0 ? 'text-green-600' : 
                            entry.change < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {entry.change > 0 ? '+' : ''}{entry.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Achievements */}
          <div className="space-y-6">
            
            {/* Statistiques Rapides */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Vos Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Position actuelle</span>
                  <span className="font-semibold">#{currentUser?.rank || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Points totaux</span>
                  <span className="font-semibold">{currentUser?.score || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Série actuelle</span>
                  <span className="font-semibold">{currentUser?.streak || 0} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Badges obtenus</span>
                  <span className="font-semibold">{currentUser?.badges.length || 0}</span>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Accomplissements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border ${
                    achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{achievement.title}</span>
                          <Badge className={rarityColors[achievement.rarity]}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress 
                              value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground">
                              {achievement.progress}/{achievement.maxProgress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Défis de la Semaine */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold mb-3 text-purple-900">🎯 Défis de la Semaine</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Méditer 5 jours</span>
                  <Badge className="bg-green-100 text-green-700">3/5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Scan émotionnel quotidien</span>
                  <Badge className="bg-yellow-100 text-yellow-700">6/7</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Session VR</span>
                  <Badge className="bg-purple-100 text-purple-700">1/2</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;