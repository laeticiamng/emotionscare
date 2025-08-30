import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Star, Flame, Zap, Crown, Heart, 
  Target, Award, Shield, Sparkles, Gift,
  TrendingUp, Calendar, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GamificationSystemProps {
  userId?: string;
  currentXP?: number;
  currentLevel?: number;
  className?: string;
  compact?: boolean;
}

const GamificationSystem: React.FC<GamificationSystemProps> = ({
  userId,
  currentXP = 0,
  currentLevel = 1,
  className,
  compact = false
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(7);
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 320, target: 500 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calcul du niveau suivant
  const xpForNextLevel = currentLevel * 1000;
  const xpProgress = currentXP % 1000;
  const progressPercentage = (xpProgress / 1000) * 100;

  useEffect(() => {
    // Initialiser les achievements
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Première Session',
        description: 'Complétez votre première session EmotionsCare',
        icon: <Star className="w-5 h-5" />,
        progress: 1,
        maxProgress: 1,
        category: 'milestone',
        rarity: 'common',
        xpReward: 100,
        unlocked: true,
        unlockedAt: new Date()
      },
      {
        id: '2',
        title: 'Streak Master',
        description: 'Maintenez une série de 7 jours consécutifs',
        icon: <Flame className="w-5 h-5" />,
        progress: 7,
        maxProgress: 7,
        category: 'daily',
        rarity: 'rare',
        xpReward: 250,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 86400000)
      },
      {
        id: '3',
        title: 'Explorateur Musical',
        description: 'Découvrez 10 styles musicaux différents',
        icon: <Heart className="w-5 h-5" />,
        progress: 6,
        maxProgress: 10,
        category: 'weekly',
        rarity: 'epic',
        xpReward: 500,
        unlocked: false
      },
      {
        id: '4',
        title: 'Maître de la Sérénité',
        description: 'Atteignez un niveau de bien-être parfait 5 fois',
        icon: <Crown className="w-5 h-5" />,
        progress: 2,
        maxProgress: 5,
        category: 'special',
        rarity: 'legendary',
        xpReward: 1000,
        unlocked: false
      }
    ];

    setAchievements(mockAchievements);
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30';
      case 'rare': return 'text-blue-400 border-blue-400/30';
      case 'epic': return 'text-purple-400 border-purple-400/30';
      case 'legendary': return 'text-amber-400 border-amber-400/30';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/20';
      case 'rare': return 'shadow-blue-500/20';
      case 'epic': return 'shadow-purple-500/20';
      case 'legendary': return 'shadow-amber-500/20';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  if (compact) {
    return (
      <Card className={cn("bg-gradient-to-br from-background/95 to-accent/5", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Niveau {currentLevel}</p>
                <p className="text-sm text-muted-foreground">{currentXP} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{streak} jours</p>
              <p className="text-xs text-muted-foreground">Série actuelle</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{xpProgress}/{1000} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Niveau et XP */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 rounded-full bg-purple-500/20"
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(147, 51, 234, 0.4)", "0 0 0 10px rgba(147, 51, 234, 0)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8 text-purple-400" />
              </motion.div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-purple-400">Niveau {currentLevel}</p>
                <p className="text-sm text-muted-foreground">{currentXP.toLocaleString()} XP Total</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Prochain niveau</span>
                    <span>{xpProgress}/{1000} XP</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                {showLevelUp && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-purple-400 mt-1"
                  >
                    🎉 Niveau suivant débloqué !
                  </motion.p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Série quotidienne */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 rounded-full bg-orange-500/20"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-8 h-8 text-orange-400" />
              </motion.div>
              <div>
                <p className="text-2xl font-bold text-orange-400">{streak} jours</p>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
                <p className="text-xs text-orange-400 mt-1">
                  🔥 +{streak * 10} XP bonus quotidien
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectif hebdomadaire */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-500/20">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-emerald-400">
                  {weeklyGoal.current}/{weeklyGoal.target}
                </p>
                <p className="text-sm text-muted-foreground">XP cette semaine</p>
                <div className="mt-2">
                  <Progress 
                    value={(weeklyGoal.current / weeklyGoal.target) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Système d'achievements */}
      <Card className="bg-gradient-to-br from-background/95 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Accomplissements
            </CardTitle>
            
            {/* Filtres de catégorie */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tous', icon: <Sparkles className="w-4 h-4" /> },
                { key: 'daily', label: 'Quotidien', icon: <Calendar className="w-4 h-4" /> },
                { key: 'weekly', label: 'Hebdomadaire', icon: <TrendingUp className="w-4 h-4" /> },
                { key: 'milestone', label: 'Étapes', icon: <Target className="w-4 h-4" /> },
                { key: 'special', label: 'Spéciaux', icon: <Crown className="w-4 h-4" /> }
              ].map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className="text-xs"
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                    achievement.unlocked ? "bg-gradient-to-br from-background to-accent/10" : "bg-muted/50",
                    achievement.unlocked && getRarityGlow(achievement.rarity)
                  )}>
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Shield className={cn("w-5 h-5", getRarityColor(achievement.rarity))} />
                        </motion.div>
                      </div>
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full transition-colors",
                          achievement.unlocked 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted/50 text-muted-foreground"
                        )}>
                          {achievement.icon}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className={cn(
                              "font-semibold text-sm",
                              achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {achievement.description}
                            </p>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progression</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1.5"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getRarityColor(achievement.rarity))}
                            >
                              {achievement.rarity}
                            </Badge>
                            <span className="text-xs font-medium text-primary">
                              +{achievement.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Gift className="w-4 h-4 mr-2" />
          Réclamer Récompenses
        </Button>
        
        <Button
          variant="outline"
        >
          <Activity className="w-4 h-4 mr-2" />
          Voir Statistiques
        </Button>
      </div>
    </div>
  );
};

export default GamificationSystem;