/**
 * MusicStatsDrawer - Drawer avec statistiques d'écoute détaillées
 * Connecté aux vraies données via useMusicListeningStats
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart3,
  Clock,
  Music,
  Heart,
  TrendingUp,
  Calendar,
  Headphones,
  Award,
  RefreshCw,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useMusicListeningStats from '@/hooks/music/useMusicListeningStats';

interface MusicStatsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MusicStatsDrawer: React.FC<MusicStatsDrawerProps> = ({ open, onClose }) => {
  const { stats, isLoading, refreshStats } = useMusicListeningStats();

  const formatTime = (minutes: number) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Construire les cartes de stats à partir des vraies données
  const statCards = stats ? [
    {
      icon: Clock,
      label: 'Temps d\'écoute total',
      value: formatTime(stats.totalMinutes),
      color: 'text-blue-500',
    },
    {
      icon: Music,
      label: 'Pistes jouées',
      value: stats.totalTracks.toString(),
      color: 'text-purple-500',
    },
    {
      icon: Heart,
      label: 'Artistes uniques',
      value: stats.uniqueArtists.toString(),
      color: 'text-pink-500',
    },
    {
      icon: Flame,
      label: 'Streak actuel',
      value: `${stats.streak} jour${stats.streak !== 1 ? 's' : ''}`,
      color: 'text-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Évolution semaine',
      value: `${stats.weeklyChange > 0 ? '+' : ''}${stats.weeklyChange}%`,
      color: stats.weeklyChange >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      icon: Award,
      label: 'Top émotion',
      value: stats.topEmotion,
      color: 'text-amber-500',
    },
  ] : [];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Statistiques d'écoute
            <Button
              size="icon"
              variant="ghost"
              onClick={refreshStats}
              disabled={isLoading}
              className="h-7 w-7 ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </SheetTitle>
          <SheetDescription>
            Votre activité musicale en détail
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading && !stats ? (
            // Loading state
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ) : stats ? (
            <>
              {/* Daily Stats Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Écoute par jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-20 gap-1">
                    {stats.dailyStats.map((day, index) => {
                      const maxMinutes = Math.max(...stats.dailyStats.map(d => d.minutes), 1);
                      const height = (day.minutes / maxMinutes) * 100;
                      return (
                        <div key={day.day} className="flex flex-col items-center flex-1">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(height, 4)}%` }}
                            transition={{ delay: index * 0.05 }}
                            className="w-full bg-primary/80 rounded-t min-h-[4px]"
                            title={`${day.minutes}min, ${day.tracks} pistes`}
                          />
                          <span className="text-[10px] text-muted-foreground mt-1">{day.day}</span>
                        </div>
                      );
                    })}
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

              {/* Emotion Stats */}
              {stats.emotionStats.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Humeurs écoutées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.emotionStats.slice(0, 4).map((emotion, index) => (
                      <div key={emotion.emotion} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {emotion.emotion}
                          </span>
                          <span className="text-muted-foreground">{emotion.percentage}%</span>
                        </div>
                        <Progress value={emotion.percentage} className="h-1.5" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Top Artists */}
              {stats.topArtists.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Artistes les plus écoutés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.topArtists.slice(0, 5).map((artist, index) => (
                        <div key={artist.artist} className="flex items-center justify-between">
                          <span className="text-sm truncate flex-1">
                            <span className="text-muted-foreground mr-2">{index + 1}.</span>
                            {artist.artist}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {artist.count} pistes
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            // No data state
            <Card>
              <CardContent className="py-8 text-center">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Aucune donnée d'écoute disponible.<br />
                  Écoutez de la musique pour voir vos statistiques !
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicStatsDrawer;
