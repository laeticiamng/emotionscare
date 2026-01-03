/**
 * MusicStatsDrawer - Drawer avec statistiques d'écoute détaillées
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Clock,
  Music,
  Heart,
  TrendingUp,
  Calendar,
  Headphones,
  Award,
} from 'lucide-react';
import { useMusicListeningStats, type MusicListeningStats } from '@/hooks/music/useMusicSettings';

interface MusicStatsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MusicStatsDrawer: React.FC<MusicStatsDrawerProps> = ({ open, onClose }) => {
  const { stats, isLoading } = useMusicListeningStats();

  // Mock stats si pas de données
  const displayStats = stats || {
    totalListeningTime: 4520, // minutes
    tracksPlayed: 156,
    favoriteGenre: 'Ambient Thérapeutique',
    currentStreak: 7,
    longestStreak: 14,
    topMoods: ['Calme', 'Focus', 'Énergique'],
    weeklyGoalProgress: 72,
    averageSessionDuration: 28, // minutes
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const statCards = [
    {
      icon: Clock,
      label: 'Temps d\'écoute total',
      value: formatTime(displayStats.totalListeningTime),
      color: 'text-blue-500',
    },
    {
      icon: Music,
      label: 'Pistes jouées',
      value: displayStats.tracksPlayed.toString(),
      color: 'text-purple-500',
    },
    {
      icon: Heart,
      label: 'Genre favori',
      value: displayStats.favoriteGenre,
      color: 'text-pink-500',
    },
    {
      icon: TrendingUp,
      label: 'Streak actuel',
      value: `${displayStats.currentStreak} jours`,
      color: 'text-green-500',
    },
    {
      icon: Award,
      label: 'Meilleur streak',
      value: `${displayStats.longestStreak} jours`,
      color: 'text-amber-500',
    },
    {
      icon: Headphones,
      label: 'Session moyenne',
      value: formatTime(displayStats.averageSessionDuration),
      color: 'text-cyan-500',
    },
  ];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Statistiques d'écoute
          </SheetTitle>
          <SheetDescription>
            Votre activité musicale en détail
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Weekly Goal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Objectif hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{displayStats.weeklyGoalProgress}%</span>
                </div>
                <Progress value={displayStats.weeklyGoalProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Continuez comme ça ! Plus que {100 - displayStats.weeklyGoalProgress}% pour atteindre votre objectif.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-4 pb-3">
                    <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
                    <p className="text-lg font-bold truncate">{stat.value}</p>
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Top Moods */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Humeurs préférées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayStats.topMoods.map((mood: string, index: number) => (
                  <Badge
                    key={mood}
                    variant={index === 0 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {index === 0 && '🥇 '}
                    {index === 1 && '🥈 '}
                    {index === 2 && '🥉 '}
                    {mood}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Listening Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Historique récent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Aujourd\'hui', 'Hier', 'Il y a 2 jours'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{day}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-primary/20 rounded-full" style={{ width: `${60 - index * 15}px` }}>
                        <div
                          className="h-2 bg-primary rounded-full transition-all"
                          style={{ width: `${80 - index * 20}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{45 - index * 12}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicStatsDrawer;
