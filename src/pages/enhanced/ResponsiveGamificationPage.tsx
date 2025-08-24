import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Gift,
  Medal,
  Flame,
  Crown,
  Award,
  Smartphone,
  Tablet,
  Monitor,
  ChevronRight,
  Plus,
  TrendingUp,
  Calendar,
  Users,
  Brain,
  Heart,
  Music,
  Camera,
  Sparkles,
  Timer,
  BarChart3,
  Settings,
  Share2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';

interface Achievement {
  id: number;
  name: string;
  icon: any;
  unlocked: boolean;
  date?: string;
  progress?: number;
  description: string;
  category: 'wellness' | 'social' | 'learning' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  endDate?: Date;
  deviceOptimized?: 'mobile' | 'tablet' | 'desktop' | 'all';
}

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isUser?: boolean;
  level: number;
  badges: string[];
  streak: number;
}

const ResponsiveGamificationPage: React.FC = () => {
  const device = useDeviceDetection();
  const { toast } = useToast();
  
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements' | 'leaderboard' | 'rewards'>('challenges');
  const [userStats, setUserStats] = useState({
    totalPoints: 1890,
    level: 12,
    currentStreak: 7,
    achievementsUnlocked: 8,
    weeklyRank: 2,
    monthlyProgress: 68
  });

  const achievements: Achievement[] = [
    { 
      id: 1, 
      name: 'Premier Scan', 
      icon: Brain, 
      unlocked: true, 
      date: '2024-01-15',
      description: 'Effectuez votre première analyse émotionnelle',
      category: 'wellness',
      rarity: 'common'
    },
    { 
      id: 2, 
      name: 'Série de 7 jours', 
      icon: Flame, 
      unlocked: true, 
      date: '2024-01-20',
      description: 'Maintenez une série de 7 jours consécutifs',
      category: 'streak',
      rarity: 'rare'
    },
    { 
      id: 3, 
      name: 'Maître de la Méditation', 
      icon: Crown, 
      unlocked: false, 
      progress: 75,
      description: 'Complétez 50 sessions de méditation VR',
      category: 'wellness',
      rarity: 'epic'
    },
    { 
      id: 4, 
      name: 'Explorateur VR', 
      icon: Camera, 
      unlocked: false, 
      progress: 40,
      description: 'Découvrez 10 environnements VR différents',
      category: 'learning',
      rarity: 'rare'
    },
    { 
      id: 5, 
      name: 'Mentor Communautaire', 
      icon: Users, 
      unlocked: false, 
      progress: 25,
      description: 'Aidez 25 membres de la communauté',
      category: 'social',
      rarity: 'legendary'
    },
    { 
      id: 6, 
      name: 'Mélomane Thérapeutique', 
      icon: Music, 
      unlocked: true, 
      date: '2024-01-18',
      description: 'Écoutez 100 heures de musicothérapie',
      category: 'wellness',
      rarity: 'epic'
    }
  ];

  const getChallenges = (): Challenge[] => {
    const baseChallenges = [
      {
        id: 'daily-checkin',
        title: device.type === 'mobile' ? 'Check-in' : 'Check-in Quotidien',
        description: device.type === 'mobile' ? 'Scanner quotidien' : 'Effectuez votre scan émotionnel quotidien',
        progress: 5,
        total: 7,
        reward: '50 points',
        difficulty: 'Facile' as const,
        category: 'daily' as const,
        deviceOptimized: 'all' as const
      },
      {
        id: 'meditation-week',
        title: device.type === 'mobile' ? 'Méditation' : 'Semaine Méditation',
        description: device.type === 'mobile' ? 'Méditez 5 fois' : 'Méditez 5 fois cette semaine',
        progress: 3,
        total: 5,
        reward: '200 points',
        difficulty: 'Moyen' as const,
        category: 'weekly' as const,
        deviceOptimized: 'all' as const
      },
      {
        id: 'vr-explorer',
        title: device.type === 'mobile' ? 'VR Explorer' : 'Explorateur VR',
        description: device.type === 'mobile' ? '3 expériences VR' : 'Essayez 3 expériences VR différentes',
        progress: 1,
        total: 3,
        reward: '150 points',
        difficulty: 'Moyen' as const,
        category: 'weekly' as const,
        deviceOptimized: 'desktop' as const
      },
      {
        id: 'mobile-wellness',
        title: 'Bien-être Mobile',
        description: 'Utilisez 3 fonctionnalités mobile cette semaine',
        progress: 2,
        total: 3,
        reward: '75 points',
        difficulty: 'Facile' as const,
        category: 'weekly' as const,
        deviceOptimized: 'mobile' as const
      },
      {
        id: 'tablet-master',
        title: 'Maître Tablette',
        description: 'Explorez toutes les fonctionnalités tactiles',
        progress: 1,
        total: 4,
        reward: '120 points',
        difficulty: 'Moyen' as const,
        category: 'weekly' as const,
        deviceOptimized: 'tablet' as const
      }
    ];

    // Filtrer selon l'appareil
    return baseChallenges.filter(challenge => 
      challenge.deviceOptimized === 'all' || challenge.deviceOptimized === device.type
    );
  };

  const leaderboard: LeaderboardUser[] = [
    { 
      rank: 1, 
      name: 'Emma Martin', 
      points: 2450, 
      avatar: '👩', 
      level: 15, 
      badges: ['🏆', '🔥', '🎯'], 
      streak: 14 
    },
    { 
      rank: 2, 
      name: 'Vous', 
      points: 1890, 
      avatar: '🙋‍♂️', 
      isUser: true, 
      level: 12, 
      badges: ['🔥', '🎵'], 
      streak: 7 
    },
    { 
      rank: 3, 
      name: 'Lucas Dubois', 
      points: 1650, 
      avatar: '👨', 
      level: 11, 
      badges: ['🧠', '📱'], 
      streak: 5 
    },
    { 
      rank: 4, 
      name: 'Sophie Chen', 
      points: 1420, 
      avatar: '👱‍♀️', 
      level: 10, 
      badges: ['🎯'], 
      streak: 3 
    },
    { 
      rank: 5, 
      name: 'Alex Rivera', 
      points: 1200, 
      avatar: '👨‍🦱', 
      level: 9, 
      badges: ['🎵', '🧠'], 
      streak: 2 
    }
  ];

  const rewards = [
    {
      id: 'custom-badge',
      name: 'Badge Personnalisé',
      description: 'Créez votre propre badge unique',
      cost: 500,
      category: 'customization',
      deviceSpecific: false
    },
    {
      id: 'premium-theme',
      name: 'Thème Premium',
      description: 'Débloquez des thèmes exclusifs',
      cost: 1000,
      category: 'customization',
      deviceSpecific: false
    },
    {
      id: 'vr-session-bonus',
      name: 'Session VR Bonus',
      description: 'Session VR exclusive de 60 minutes',
      cost: 750,
      category: 'experience',
      deviceSpecific: true,
      requiredDevice: 'desktop'
    },
    {
      id: 'mobile-widgets',
      name: 'Widgets Mobiles',
      description: 'Widgets personnalisés pour votre écran d\'accueil',
      cost: 300,
      category: 'customization',
      deviceSpecific: true,
      requiredDevice: 'mobile'
    },
    {
      id: 'tablet-gestures',
      name: 'Gestes Tablette Pro',
      description: 'Débloquez des gestes avancés pour tablette',
      cost: 400,
      category: 'feature',
      deviceSpecific: true,
      requiredDevice: 'tablet'
    }
  ].filter(reward => 
    !reward.deviceSpecific || reward.requiredDevice === device.type
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-200 bg-gray-50 text-gray-700';
      case 'rare': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'epic': return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'legendary': return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const handleChallengeSelect = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    if (device.capabilities.supportsVibration && device.type === 'mobile') {
      navigator.vibrate(50);
    }
    toast({
      title: "Défi sélectionné",
      description: "Bonne chance pour relever ce défi !"
    });
  };

  // Layout mobile optimisé
  const MobileLayout: React.FC = () => (
    <div className="space-y-4">
      {/* Header mobile gamification */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <h1 className="text-xl font-bold">Gamification</h1>
          </div>
          <Badge className="bg-yellow-500 text-white">
            Niveau {userStats.level}
          </Badge>
        </div>
        
        {/* Stats rapides mobile */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-white/50 rounded-lg">
            <div className="text-lg font-bold">{userStats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="text-center p-2 bg-white/50 rounded-lg">
            <div className="text-lg font-bold">{userStats.currentStreak}j</div>
            <p className="text-xs text-muted-foreground">Série</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation par onglets mobile */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
        {[
          { id: 'challenges', label: 'Défis', icon: Target },
          { id: 'achievements', label: 'Succès', icon: Award },
          { id: 'leaderboard', label: 'Top', icon: Crown },
          { id: 'rewards', label: 'Boutique', icon: Gift }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(id as any)}
            className="flex-1 flex-col gap-1 h-auto py-2"
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>

      {/* Contenu mobile */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'challenges' && (
            <div className="space-y-3">
              {getChallenges().map((challenge) => (
                <Card 
                  key={challenge.id}
                  className={`cursor-pointer transition-all ${
                    selectedChallenge === challenge.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleChallengeSelect(challenge.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{challenge.title}</h3>
                      <Badge variant={challenge.difficulty === 'Facile' ? 'secondary' : 'default'} className="text-xs">
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">
                        {challenge.progress}/{challenge.total}
                      </span>
                      <span className="text-xs text-yellow-600 font-medium">
                        🏆 {challenge.reward}
                      </span>
                    </div>
                    <Progress value={(challenge.progress / challenge.total) * 100} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={achievement.id} className={`border-2 ${getRarityColor(achievement.rarity)}`}>
                    <CardContent className="p-3 text-center">
                      <IconComponent className={`h-6 w-6 mx-auto mb-2 ${
                        achievement.unlocked ? 'text-primary' : 'text-gray-400'
                      }`} />
                      <h3 className="font-medium text-xs mb-1">{achievement.name}</h3>
                      {achievement.unlocked ? (
                        <Badge variant="default" className="text-xs">Débloqué</Badge>
                      ) : (
                        <div>
                          <Progress value={achievement.progress || 0} className="h-1 mb-1" />
                          <p className="text-xs text-muted-foreground">
                            {achievement.progress || 0}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((user) => (
                <Card key={user.rank} className={user.isUser ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1 ? 'bg-yellow-400 text-white' :
                        user.rank === 2 ? 'bg-gray-300 text-white' :
                        user.rank === 3 ? 'bg-orange-400 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {user.rank}
                      </div>
                      <span className="text-lg">{user.avatar}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.points} pts • Niv.{user.level}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-1">
                          {user.badges.slice(0, 2).map((badge, i) => (
                            <span key={i} className="text-xs">{badge}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{user.streak}j</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">{reward.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{reward.description}</p>
                        {reward.deviceSpecific && (
                          <Badge variant="outline" className="text-xs">
                            {device.type === 'mobile' ? <Smartphone className="h-3 w-3 mr-1" /> :
                             device.type === 'tablet' ? <Tablet className="h-3 w-3 mr-1" /> :
                             <Monitor className="h-3 w-3 mr-1" />}
                            Spécial {device.type}
                          </Badge>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold">{reward.cost}</div>
                        <Button 
                          size="sm" 
                          variant={userStats.totalPoints >= reward.cost ? "default" : "outline"}
                          disabled={userStats.totalPoints < reward.cost}
                          className="text-xs mt-1"
                        >
                          {userStats.totalPoints >= reward.cost ? 'Échanger' : 'Pas assez'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Layout tablette optimisé
  const TabletLayout: React.FC = () => (
    <div className="space-y-6">
      {/* Header tablette */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Gamification Tablette
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Expérience tactile optimisée pour progresser dans votre bien-être
        </p>
      </motion.div>

      {/* Stats tablette */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Points totaux', value: userStats.totalPoints, icon: Trophy, color: 'from-yellow-400 to-yellow-500' },
          { label: 'Niveau actuel', value: `Niveau ${userStats.level}`, icon: Star, color: 'from-blue-400 to-blue-500' },
          { label: 'Série actuelle', value: `${userStats.currentStreak} jours`, icon: Flame, color: 'from-green-400 to-green-500' },
          { label: 'Succès débloqués', value: userStats.achievementsUnlocked, icon: Medal, color: 'from-purple-400 to-purple-500' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={`bg-gradient-to-r ${stat.color} text-white cursor-pointer`}>
                <CardContent className="p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation onglets tablette */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-2 bg-muted/50 rounded-lg">
          {[
            { id: 'challenges', label: 'Défis Actifs', icon: Target },
            { id: 'achievements', label: 'Succès', icon: Award },
            { id: 'leaderboard', label: 'Classement', icon: Crown },
            { id: 'rewards', label: 'Boutique', icon: Gift }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              onClick={() => setActiveTab(id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenu principal tablette */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'challenges' && (
            <div className="grid md:grid-cols-2 gap-4">
              {getChallenges().map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all h-full ${
                      selectedChallenge === challenge.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                    }`}
                    onClick={() => handleChallengeSelect(challenge.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <Badge variant={challenge.difficulty === 'Facile' ? 'secondary' : 'default'}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{challenge.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">
                          {challenge.progress}/{challenge.total} complété
                        </span>
                        <span className="text-yellow-600 font-medium">
                          🏆 {challenge.reward}
                        </span>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className={`border-2 ${getRarityColor(achievement.rarity)} cursor-pointer`}>
                      <CardContent className="p-6 text-center">
                        <IconComponent className={`h-10 w-10 mx-auto mb-3 ${
                          achievement.unlocked ? 'text-primary' : 'text-gray-400'
                        }`} />
                        <h3 className="font-semibold mb-2">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        {achievement.unlocked ? (
                          <Badge variant="default">Débloqué le {achievement.date}</Badge>
                        ) : (
                          <div>
                            <Progress value={achievement.progress || 0} className="h-2 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {achievement.progress || 0}% complété
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="grid md:grid-cols-2 gap-4">
              {leaderboard.map((user) => (
                <motion.div
                  key={user.rank}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className={`${user.isUser ? 'ring-2 ring-primary bg-primary/5' : ''} cursor-pointer`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-400 text-white' :
                          user.rank === 2 ? 'bg-gray-300 text-white' :
                          user.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="flex-1">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.points} points • Niveau {user.level} • Série {user.streak}j
                          </p>
                          <div className="flex gap-1 mt-1">
                            {user.badges.map((badge, i) => (
                              <span key={i} className="text-sm">{badge}</span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="grid md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                          <p className="text-muted-foreground mb-3">{reward.description}</p>
                          {reward.deviceSpecific && (
                            <Badge variant="outline" className="mb-2">
                              {device.type === 'mobile' ? <Smartphone className="h-3 w-3 mr-1" /> :
                               device.type === 'tablet' ? <Tablet className="h-3 w-3 mr-1" /> :
                               <Monitor className="h-3 w-3 mr-1" />}
                              Optimisé {device.type}
                            </Badge>
                          )}
                        </div>
                        <div className="text-center ml-4">
                          <div className="text-2xl font-bold text-primary">{reward.cost}</div>
                          <p className="text-sm text-muted-foreground mb-2">points</p>
                          <Button 
                            variant={userStats.totalPoints >= reward.cost ? "default" : "outline"}
                            disabled={userStats.totalPoints < reward.cost}
                          >
                            {userStats.totalPoints >= reward.cost ? 'Échanger' : 'Insuffisant'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Layout desktop complet
  const DesktopLayout: React.FC = () => (
    <div className="space-y-8">
      {/* Header desktop */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Gamification Premium
          </h1>
          <p className="text-lg text-muted-foreground">
            Expérience desktop complète pour maximiser votre progression
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="px-3 py-1">
            <Monitor className="h-4 w-4 mr-1" />
            Mode Desktop
          </Badge>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-1" />
            Partager
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Stats desktop */}
      <div className="grid grid-cols-5 gap-6">
        {[
          { label: 'Points totaux', value: userStats.totalPoints, icon: Trophy, color: 'from-yellow-400 to-yellow-500', change: '+120' },
          { label: 'Niveau actuel', value: userStats.level, icon: Star, color: 'from-blue-400 to-blue-500', change: '+1' },
          { label: 'Série actuelle', value: `${userStats.currentStreak} jours`, icon: Flame, color: 'from-green-400 to-green-500', change: 'Record!' },
          { label: 'Succès débloqués', value: userStats.achievementsUnlocked, icon: Medal, color: 'from-purple-400 to-purple-500', change: '+2' },
          { label: 'Rang hebdomadaire', value: `#${userStats.weeklyRank}`, icon: Crown, color: 'from-pink-400 to-pink-500', change: '+1' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 text-yellow-600 group-hover:scale-110 transition-transform`} />
                    <Badge variant="secondary">{stat.change}</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Contenu principal desktop */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Section principale */}
        <div className="lg:col-span-3 space-y-8">
          {/* Navigation desktop */}
          <div className="flex justify-center">
            <div className="flex gap-2 p-2 bg-muted/50 rounded-lg">
              {[
                { id: 'challenges', label: 'Défis Actifs', icon: Target },
                { id: 'achievements', label: 'Succès & Trophées', icon: Award },
                { id: 'leaderboard', label: 'Classement Global', icon: Crown },
                { id: 'rewards', label: 'Boutique Premium', icon: Gift }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? "default" : "ghost"}
                  onClick={() => setActiveTab(id as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Contenu desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'challenges' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Défis Disponibles</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {getChallenges().map((challenge) => (
                      <motion.div
                        key={challenge.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all h-full ${
                            selectedChallenge === challenge.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                          }`}
                          onClick={() => handleChallengeSelect(challenge.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-xl">{challenge.title}</h3>
                              <Badge variant={challenge.difficulty === 'Facile' ? 'secondary' : 'default'}>
                                {challenge.difficulty}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-4">{challenge.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium">
                                Progression: {challenge.progress}/{challenge.total}
                              </span>
                              <span className="text-yellow-600 font-medium">
                                🏆 {challenge.reward}
                              </span>
                            </div>
                            <Progress value={(challenge.progress / challenge.total) * 100} className="h-3" />
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                {challenge.category === 'daily' ? 'Quotidien' : 
                                 challenge.category === 'weekly' ? 'Hebdomadaire' : 
                                 challenge.category === 'monthly' ? 'Mensuel' : 'Spécial'}
                              </span>
                              <Button size="sm">
                                Participer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Collection de Succès</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {achievements.map((achievement) => {
                      const IconComponent = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card className={`border-2 ${getRarityColor(achievement.rarity)} cursor-pointer h-full`}>
                            <CardContent className="p-6 text-center">
                              <div className="flex justify-between items-start mb-4">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {achievement.rarity}
                                </Badge>
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {achievement.category}
                                </Badge>
                              </div>
                              <IconComponent className={`h-12 w-12 mx-auto mb-4 ${
                                achievement.unlocked ? 'text-primary' : 'text-gray-400'
                              }`} />
                              <h3 className="font-semibold text-lg mb-2">{achievement.name}</h3>
                              <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                              {achievement.unlocked ? (
                                <div>
                                  <Badge variant="default" className="mb-2">✅ Débloqué</Badge>
                                  <p className="text-xs text-muted-foreground">
                                    Le {achievement.date}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <Progress value={achievement.progress || 0} className="h-2 mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    {achievement.progress || 0}% complété
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Classement Global</h2>
                  <div className="space-y-4">
                    {leaderboard.map((user) => (
                      <motion.div
                        key={user.rank}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className={`${user.isUser ? 'ring-2 ring-primary bg-primary/5' : ''} cursor-pointer`}>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                                user.rank === 1 ? 'bg-yellow-400 text-white' :
                                user.rank === 2 ? 'bg-gray-300 text-white' :
                                user.rank === 3 ? 'bg-orange-400 text-white' :
                                'bg-gray-200 text-gray-600'
                              }`}>
                                {user.rank}
                              </div>
                              <div className="text-3xl">{user.avatar}</div>
                              <div className="flex-1">
                                <p className="font-semibold text-lg">{user.name}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{user.points} points</span>
                                  <span>Niveau {user.level}</span>
                                  <span>Série {user.streak} jours</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex gap-1 mb-2">
                                  {user.badges.map((badge, i) => (
                                    <span key={i} className="text-lg">{badge}</span>
                                  ))}
                                </div>
                                <Badge variant="outline">Top {Math.ceil(user.rank / leaderboard.length * 100)}%</Badge>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Boutique Premium</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {rewards.map((reward) => (
                      <motion.div
                        key={reward.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-xl mb-2">{reward.name}</h3>
                                <p className="text-muted-foreground mb-4">{reward.description}</p>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="capitalize">
                                    {reward.category}
                                  </Badge>
                                  {reward.deviceSpecific && (
                                    <Badge variant="secondary">
                                      {device.type === 'mobile' ? <Smartphone className="h-3 w-3 mr-1" /> :
                                       device.type === 'tablet' ? <Tablet className="h-3 w-3 mr-1" /> :
                                       <Monitor className="h-3 w-3 mr-1" />}
                                      Optimisé {device.type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-center ml-6">
                                <div className="text-3xl font-bold text-primary mb-2">{reward.cost}</div>
                                <p className="text-sm text-muted-foreground mb-4">points requis</p>
                                <Button 
                                  size="lg"
                                  variant={userStats.totalPoints >= reward.cost ? "default" : "outline"}
                                  disabled={userStats.totalPoints < reward.cost}
                                  className="w-full"
                                >
                                  {userStats.totalPoints >= reward.cost ? 'Échanger maintenant' : 'Points insuffisants'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Panneau latéral desktop */}
        <div className="space-y-6">
          {/* Progression rapide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{userStats.monthlyProgress}%</div>
                  <p className="text-sm text-muted-foreground">Objectifs mensuels</p>
                </div>
                <Progress value={userStats.monthlyProgress} className="h-3" />
                <div className="text-center">
                  <Badge variant="default">En excellente voie !</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium">Défi suggéré</p>
                  <p className="text-xs text-muted-foreground">Complétez "Semaine Méditation" pour débloquer 200 points</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium">Proche du niveau supérieur</p>
                  <p className="text-xs text-muted-foreground">Plus que 110 points pour atteindre le niveau 13</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium">Opportunité limitée</p>
                  <p className="text-xs text-muted-foreground">Récompense spéciale disponible dans 2 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Créer un défi
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Inviter des amis
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-red-50/50 dark:from-yellow-950/20 dark:via-orange-950/10 dark:to-red-950/20">
      <ResponsiveWrapper
        mobileLayout={<MobileLayout />}
        tabletLayout={<TabletLayout />}
        desktopLayout={<DesktopLayout />}
        enableGestures={device.isTouchDevice}
        enableVibration={device.type === 'mobile'}
        className="container mx-auto"
      />
    </div>
  );
};

export default ResponsiveGamificationPage;