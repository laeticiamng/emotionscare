// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Crown,
  Gift,
  Sparkles,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LevelConfig {
  level: number;
  minXP: number;
  maxXP: number;
  title: string;
  description: string;
  rewards: {
    type: 'badge' | 'unlock' | 'multiplier';
    name: string;
    description: string;
    icon: string;
  }[];
  color: string;
  background: string;
}

interface UserLevel {
  currentXP: number;
  level: number;
  totalXP: number;
  nextLevelXP: number;
  progressToNext: number;
  rank: string;
}

const levelConfigs: LevelConfig[] = [
  {
    level: 1,
    minXP: 0,
    maxXP: 100,
    title: "Novice Émotionnel",
    description: "Début de votre voyage vers le bien-être",
    rewards: [
      { type: 'unlock', name: 'Scanner Émotionnel', description: 'Accès aux scans quotidiens', icon: '🎯' }
    ],
    color: 'text-green-600',
    background: 'from-green-50 to-green-100'
  },
  {
    level: 5,
    minXP: 500,
    maxXP: 1000,
    title: "Explorateur",
    description: "Vous découvrez vos émotions",
    rewards: [
      { type: 'badge', name: 'Premier Explorateur', description: 'Badge de progression', icon: '🗺️' },
      { type: 'unlock', name: 'Journal Émotionnel', description: 'Déblocage du journal', icon: '📝' }
    ],
    color: 'text-blue-600',
    background: 'from-blue-50 to-blue-100'
  },
  {
    level: 10,
    minXP: 2500,
    maxXP: 5000,
    title: "Guide Émotionnel",
    description: "Vous maîtrisez vos émotions",
    rewards: [
      { type: 'badge', name: 'Maître des Émotions', description: 'Badge d\'expertise', icon: '🧘' },
      { type: 'multiplier', name: 'Bonus XP x1.2', description: '+20% XP sur tous les défis', icon: '⚡' }
    ],
    color: 'text-purple-600',
    background: 'from-purple-50 to-purple-100'
  },
  {
    level: 20,
    minXP: 10000,
    maxXP: 20000,
    title: "Sage du Bien-être",
    description: "Expert en équilibre émotionnel",
    rewards: [
      { type: 'badge', name: 'Sage Légendaire', description: 'Badge légendaire', icon: '🏆' },
      { type: 'unlock', name: 'Coaching Avancé', description: 'Accès au coaching premium', icon: '👑' },
      { type: 'multiplier', name: 'Bonus XP x1.5', description: '+50% XP sur tous les défis', icon: '✨' }
    ],
    color: 'text-yellow-600',
    background: 'from-yellow-50 to-yellow-100'
  },
  {
    level: 50,
    minXP: 100000,
    maxXP: 200000,
    title: "Maître Suprême",
    description: "Sommet de la maîtrise émotionnelle",
    rewards: [
      { type: 'badge', name: 'Transcendance', description: 'Badge ultime', icon: '🌟' },
      { type: 'unlock', name: 'Mentor Communautaire', description: 'Possibilité de guider les autres', icon: '🤝' },
      { type: 'multiplier', name: 'Bonus XP x2.0', description: 'Double XP sur tous les défis', icon: '🚀' }
    ],
    color: 'text-gradient-to-r from-yellow-600 to-orange-600',
    background: 'from-yellow-50 via-orange-50 to-red-50'
  }
];

interface AdvancedLevelSystemProps {
  userLevel: UserLevel;
  onLevelUp?: (newLevel: number, rewards: any[]) => void;
}

export const AdvancedLevelSystem: React.FC<AdvancedLevelSystemProps> = ({
  userLevel,
  onLevelUp
}) => {
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(userLevel.level);
  const [levelUpRewards, setLevelUpRewards] = useState<any[]>([]);

  useEffect(() => {
    if (userLevel.level > previousLevel) {
      const newLevelConfig = levelConfigs.find(config => config.level === userLevel.level);
      if (newLevelConfig) {
        setLevelUpRewards(newLevelConfig.rewards);
        setShowLevelUpAnimation(true);
        
        // Animation de confettis
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#00CED1']
        });

        onLevelUp?.(userLevel.level, newLevelConfig.rewards);
        
        setTimeout(() => {
          setShowLevelUpAnimation(false);
        }, 5000);
      }
      setPreviousLevel(userLevel.level);
    }
  }, [userLevel.level, previousLevel, onLevelUp]);

  const getCurrentLevelConfig = () => {
    return levelConfigs.find(config => config.level <= userLevel.level)
      || levelConfigs[0];
  };

  const getNextLevelConfig = () => {
    return levelConfigs.find(config => config.level > userLevel.level);
  };

  const currentConfig = getCurrentLevelConfig();
  const nextConfig = getNextLevelConfig();

  const calculateDetailedProgress = () => {
    const currentLevelXP = currentConfig.minXP;
    const nextLevelXP = nextConfig?.minXP || currentConfig.maxXP;
    const progressXP = userLevel.currentXP - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    
    return {
      current: Math.max(0, progressXP),
      needed: neededXP,
      percentage: Math.min(100, (progressXP / neededXP) * 100)
    };
  };

  const progress = calculateDetailedProgress();

  return (
    <div className="space-y-6">
      {/* Animation Level Up */}
      <AnimatePresence>
        {showLevelUpAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-background rounded-lg p-8 max-w-md mx-4 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">Niveau Supérieur!</h2>
              <p className="text-xl text-primary mb-4">Niveau {userLevel.level}</p>
              <p className="text-muted-foreground mb-6">{currentConfig.title}</p>
              
              <div className="space-y-2 mb-6">
                {levelUpRewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-3 bg-muted rounded-lg p-3"
                  >
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold">{reward.name}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button onClick={() => setShowLevelUpAnimation(false)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Continuer
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Niveau Actuel */}
      <Card className={`relative overflow-hidden bg-gradient-to-br ${currentConfig.background}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform translate-x-full animate-shimmer" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Trophy className={`h-8 w-8 ${currentConfig.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentConfig.title}</CardTitle>
                <p className="text-muted-foreground">{currentConfig.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{userLevel.level}</p>
              <Badge variant="outline">Niveau</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progression vers le niveau suivant */}
          {nextConfig && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Progression vers {nextConfig.title}</span>
                <span className="text-sm text-muted-foreground">
                  {progress.current}/{progress.needed} XP
                </span>
              </div>
              
              <div className="relative">
                <Progress value={progress.percentage} className="h-3" />
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Niveau {userLevel.level}</span>
                <span>Niveau {nextConfig.level}</span>
              </div>
            </div>
          )}

          {/* XP Total */}
          <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">XP Total</span>
            </div>
            <span className="text-xl font-bold">{userLevel.totalXP.toLocaleString()}</span>
          </div>

          {/* Rang */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Rang Global</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {userLevel.rank}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Récompenses du niveau actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Récompenses de Niveau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentConfig.rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-background to-muted/20"
              >
                <span className="text-2xl">{reward.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
                <Badge variant={reward.type === 'badge' ? 'default' : 'secondary'}>
                  {reward.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aperçu du prochain niveau */}
      {nextConfig && (
        <Card className="border-dashed border-2 opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prochain Niveau: {nextConfig.title}
              <ChevronRight className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{nextConfig.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextConfig.rewards.map((reward, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg opacity-60"
                >
                  <span className="text-2xl grayscale">{reward.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{reward.name}</p>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <Badge variant="outline">
                    Niveau {nextConfig.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedLevelSystem;