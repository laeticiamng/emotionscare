/**
 * Composant de Réalisations Émotionnelles
 *
 * Système de gamification enrichi pour les parcours émotionnels
 *
 * @module EmotionalAchievements
 * @version 1.0.0
 * @created 2025-11-14
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Heart,
  Zap,
  Award,
  Crown,
  Sparkles,
  Check,
  Lock,
  Calendar,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// ═══════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'scan' | 'streak' | 'journey' | 'mastery' | 'social' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: React.ComponentType<any>;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
  requirement: number;
  current: number;
  hidden?: boolean; // Achievement secret
}

export interface EmotionalStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  totalCheckIns: number;
}

export interface EmotionalStats {
  totalScans: number;
  totalJournalEntries: number;
  emotionsDiscovered: string[];
  favoriteEmotion: string;
  averageMoodScore: number;
  daysActive: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface EmotionalAchievementsProps {
  userId?: string;
  stats?: EmotionalStats;
  streak?: EmotionalStreak;
  onAchievementUnlocked?: (achievement: Achievement) => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════
// ACHIEVEMENTS DEFINITIONS
// ═══════════════════════════════════════════════════════════

const ACHIEVEMENTS_DATABASE: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress' | 'current'>[] = [
  // Catégorie: Scan Émotionnel
  {
    id: 'first_scan',
    title: 'Premier Pas',
    description: 'Réaliser votre premier scan émotionnel',
    category: 'scan',
    tier: 'bronze',
    icon: Heart,
    xpReward: 100,
    requirement: 1,
  },
  {
    id: 'scan_explorer',
    title: 'Explorateur d\'Émotions',
    description: 'Réaliser 10 scans émotionnels',
    category: 'scan',
    tier: 'silver',
    icon: Target,
    xpReward: 500,
    requirement: 10,
  },
  {
    id: 'scan_master',
    title: 'Maître du Scan',
    description: 'Réaliser 100 scans émotionnels',
    category: 'scan',
    tier: 'gold',
    icon: Crown,
    xpReward: 2000,
    requirement: 100,
  },
  {
    id: 'scan_legend',
    title: 'Légende Émotionnelle',
    description: 'Réaliser 500 scans émotionnels',
    category: 'scan',
    tier: 'diamond',
    icon: Sparkles,
    xpReward: 10000,
    requirement: 500,
  },

  // Catégorie: Streaks
  {
    id: 'streak_week',
    title: 'Constance Hebdomadaire',
    description: 'Maintenir une série de 7 jours consécutifs',
    category: 'streak',
    tier: 'bronze',
    icon: Calendar,
    xpReward: 300,
    requirement: 7,
  },
  {
    id: 'streak_month',
    title: 'Engagement Mensuel',
    description: 'Maintenir une série de 30 jours consécutifs',
    category: 'streak',
    tier: 'gold',
    icon: Flame,
    xpReward: 1500,
    requirement: 30,
  },
  {
    id: 'streak_legend',
    title: 'Légende de la Constance',
    description: 'Maintenir une série de 100 jours consécutifs',
    category: 'streak',
    tier: 'diamond',
    icon: Trophy,
    xpReward: 5000,
    requirement: 100,
  },

  // Catégorie: Parcours
  {
    id: 'emotion_diversity',
    title: 'Arc-en-ciel Émotionnel',
    description: 'Découvrir 20 émotions différentes',
    category: 'journey',
    tier: 'silver',
    icon: Sparkles,
    xpReward: 800,
    requirement: 20,
  },
  {
    id: 'positive_vibes',
    title: 'Ondes Positives',
    description: 'Enregistrer 50 moments d\'émotions positives',
    category: 'journey',
    tier: 'gold',
    icon: Star,
    xpReward: 1200,
    requirement: 50,
  },
  {
    id: 'emotional_balance',
    title: 'Équilibre Émotionnel',
    description: 'Maintenir un score d\'équilibre moyen > 70 pendant 30 jours',
    category: 'journey',
    tier: 'platinum',
    icon: TrendingUp,
    xpReward: 3000,
    requirement: 30,
  },

  // Catégorie: Maîtrise
  {
    id: 'all_scan_types',
    title: 'Multi-Modaliste',
    description: 'Utiliser tous les types de scan (texte, voix, caméra, emoji)',
    category: 'mastery',
    tier: 'gold',
    icon: Award,
    xpReward: 2500,
    requirement: 4,
  },
  {
    id: 'level_10',
    title: 'Initié Émotionnel',
    description: 'Atteindre le niveau 10',
    category: 'mastery',
    tier: 'silver',
    icon: Zap,
    xpReward: 1000,
    requirement: 10,
  },
  {
    id: 'level_50',
    title: 'Sage Émotionnel',
    description: 'Atteindre le niveau 50',
    category: 'mastery',
    tier: 'platinum',
    icon: Crown,
    xpReward: 5000,
    requirement: 50,
  },

  // Catégorie: Spécial (hidden)
  {
    id: 'midnight_scan',
    title: 'Hibou de Minuit',
    description: 'Réaliser un scan entre minuit et 4h du matin',
    category: 'special',
    tier: 'gold',
    icon: Sparkles,
    xpReward: 500,
    requirement: 1,
    hidden: true,
  },
  {
    id: 'perfect_week',
    title: 'Semaine Parfaite',
    description: 'Maintenir un score > 80 pendant 7 jours consécutifs',
    category: 'special',
    tier: 'platinum',
    icon: Trophy,
    xpReward: 2000,
    requirement: 7,
    hidden: true,
  },
];

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

export const EmotionalAchievements: React.FC<EmotionalAchievementsProps> = ({
  userId,
  stats,
  streak,
  onAchievementUnlocked,
  className,
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');
  const [showUnlocked, setShowUnlocked] = useState(true);

  // Calculer les achievements avec progression
  const achievements = useMemo((): Achievement[] => {
    if (!stats || !streak) {
      return ACHIEVEMENTS_DATABASE.map(a => ({
        ...a,
        unlocked: false,
        progress: 0,
        current: 0,
      }));
    }

    return ACHIEVEMENTS_DATABASE.map(achievement => {
      let current = 0;
      let unlocked = false;

      // Calculer la progression selon la catégorie
      switch (achievement.id) {
        case 'first_scan':
        case 'scan_explorer':
        case 'scan_master':
        case 'scan_legend':
          current = stats.totalScans;
          break;

        case 'streak_week':
        case 'streak_month':
        case 'streak_legend':
          current = streak.currentStreak;
          break;

        case 'emotion_diversity':
          current = stats.emotionsDiscovered.length;
          break;

        case 'positive_vibes':
          // Simulé - nécessiterait une vraie métrique
          current = Math.floor(stats.totalScans * 0.6);
          break;

        case 'emotional_balance':
          current = stats.averageMoodScore >= 70 ? stats.daysActive : 0;
          break;

        case 'all_scan_types':
          // Simulé - nécessiterait tracking des types de scan utilisés
          current = Math.min(4, Math.floor(stats.totalScans / 10));
          break;

        case 'level_10':
        case 'level_50':
          current = stats.level;
          break;

        case 'midnight_scan':
          // Simulé - nécessiterait vérification des timestamps
          current = 0;
          break;

        case 'perfect_week':
          // Simulé
          current = stats.averageMoodScore >= 80 ? 7 : 0;
          break;
      }

      unlocked = current >= achievement.requirement;
      const progress = Math.min(100, (current / achievement.requirement) * 100);

      return {
        ...achievement,
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined,
        progress,
        current,
      };
    });
  }, [stats, streak]);

  // Filtrer les achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievements;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (!showUnlocked) {
      filtered = filtered.filter(a => !a.unlocked);
    }

    // Ne pas montrer les achievements cachés non débloqués
    filtered = filtered.filter(a => !a.hidden || a.unlocked);

    return filtered;
  }, [achievements, selectedCategory, showUnlocked]);

  // Statistiques globales
  const achievementStats = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.filter(a => !a.hidden).length;
    const totalXpEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100),
      totalXpEarned,
    };
  }, [achievements]);

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  const tierColors = {
    bronze: 'text-orange-600 bg-orange-100',
    silver: 'text-gray-600 bg-gray-100',
    gold: 'text-yellow-600 bg-yellow-100',
    platinum: 'text-blue-600 bg-blue-100',
    diamond: 'text-purple-600 bg-purple-100',
  };

  const categoryIcons = {
    scan: Heart,
    streak: Flame,
    journey: TrendingUp,
    mastery: Crown,
    social: Star,
    special: Sparkles,
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Réalisations Émotionnelles
            </CardTitle>
            <CardDescription>
              {achievementStats.unlocked} / {achievementStats.total} débloqués ({achievementStats.percentage}%)
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">{achievementStats.totalXpEarned} XP</div>
            <div className="text-xs text-muted-foreground">Gagnés</div>
          </div>
        </div>

        <Progress value={achievementStats.percentage} className="mt-4" />
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="scan">Scan</TabsTrigger>
            <TabsTrigger value="streak">Séries</TabsTrigger>
            <TabsTrigger value="journey">Parcours</TabsTrigger>
            <TabsTrigger value="mastery">Maîtrise</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="special">Spécial</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {filteredAchievements.length} réalisation(s)
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnlocked(!showUnlocked)}
            >
              {showUnlocked ? 'Masquer' : 'Afficher'} débloqués
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredAchievements.map((achievement) => {
                const Icon = achievement.icon;

                return (
                  <motion.div
                    key={achievement.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={cn(
                        'relative overflow-hidden transition-all hover:shadow-lg',
                        achievement.unlocked ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-white' : 'opacity-75'
                      )}
                    >
                      {achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500 text-white">
                            <Check className="h-3 w-3 mr-1" />
                            Débloqué
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'p-3 rounded-lg',
                            achievement.unlocked ? tierColors[achievement.tier] : 'bg-gray-100 text-gray-400'
                          )}>
                            {achievement.unlocked ? (
                              <Icon className="h-6 w-6" />
                            ) : (
                              <Lock className="h-6 w-6" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <Badge variant="outline" className={cn('text-xs', tierColors[achievement.tier])}>
                                {achievement.tier}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">
                              {achievement.current} / {achievement.requirement}
                            </span>
                          </div>

                          <Progress value={achievement.progress} className="h-2" />

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Récompense</span>
                            <span className="font-semibold text-yellow-600">+{achievement.xpReward} XP</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionalAchievements;
