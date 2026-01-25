/**
 * Advanced Analytics Dashboard - Analytics musicales avancées
 * Graphiques, tendances, insights, exports
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Music,
  Heart,
  Users,
  Calendar,
  Download,
  Share2,
  Sparkles,
  Award,
  Headphones,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface GenreStat {
  name: string;
  percentage: number;
  hours: number;
  color: string;
}

interface ArtistStat {
  name: string;
  plays: number;
  hours: number;
  trend: 'up' | 'down' | 'stable';
}

interface WeeklyData {
  day: string;
  hours: number;
  tracks: number;
}

const STATS: StatCard[] = [
  { label: 'Heures d\'écoute', value: '127h', change: 12, icon: Clock, color: 'text-blue-500' },
  { label: 'Titres écoutés', value: 1847, change: 8, icon: Music, color: 'text-green-500' },
  { label: 'Artistes uniques', value: 234, change: -3, icon: Users, color: 'text-purple-500' },
  { label: 'Favoris ajoutés', value: 89, change: 24, icon: Heart, color: 'text-pink-500' },
];

const GENRE_STATS: GenreStat[] = [
  { name: 'Ambient', percentage: 35, hours: 44, color: 'bg-blue-500' },
  { name: 'Classical', percentage: 25, hours: 32, color: 'bg-purple-500' },
  { name: 'Electronic', percentage: 20, hours: 25, color: 'bg-cyan-500' },
  { name: 'Jazz', percentage: 12, hours: 15, color: 'bg-orange-500' },
  { name: 'World', percentage: 8, hours: 11, color: 'bg-green-500' },
];

const TOP_ARTISTS: ArtistStat[] = [
  { name: 'Brian Eno', plays: 156, hours: 12, trend: 'up' },
  { name: 'Max Richter', plays: 124, hours: 9, trend: 'stable' },
  { name: 'Ólafur Arnalds', plays: 98, hours: 7, trend: 'up' },
  { name: 'Nils Frahm', plays: 87, hours: 6, trend: 'down' },
  { name: 'Ludovico Einaudi', plays: 76, hours: 5, trend: 'up' },
];

const WEEKLY_DATA: WeeklyData[] = [
  { day: 'Lun', hours: 2.5, tracks: 32 },
  { day: 'Mar', hours: 3.2, tracks: 41 },
  { day: 'Mer', hours: 1.8, tracks: 23 },
  { day: 'Jeu', hours: 4.1, tracks: 52 },
  { day: 'Ven', hours: 5.5, tracks: 71 },
  { day: 'Sam', hours: 6.2, tracks: 79 },
  { day: 'Dim', hours: 3.8, tracks: 48 },
];

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analyses avancées
          </h1>
          <p className="text-muted-foreground">Vos statistiques d'écoute détaillées</p>
        </div>

        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)}
            >
              {p === 'week' ? '7 jours' : p === 'month' ? '30 jours' : '1 an'}
            </Button>
          ))}
          <Button size="sm" variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge
                    variant={stat.change >= 0 ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {stat.change >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(stat.change)}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activité hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {WEEKLY_DATA.map((day, index) => (
                <motion.div
                  key={day.day}
                  className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    className="w-full rounded-t bg-gradient-to-t from-primary to-primary/50"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.hours / maxHours) * 150}px` }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                  />
                  <span className="text-xs mt-2 text-muted-foreground">{day.day}</span>
                  <span className="text-[10px] text-muted-foreground">{day.hours}h</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Répartition par genre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {GENRE_STATS.map((genre, index) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{genre.name}</span>
                  <span className="text-muted-foreground">
                    {genre.hours}h ({genre.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${genre.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${genre.percentage}%` }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Artists */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Artistes les plus écoutés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TOP_ARTISTS.map((artist, index) => (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/20"
                >
                  <span className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{artist.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {artist.plays} écoutes • {artist.hours}h
                    </p>
                  </div>
                  <Badge
                    variant={
                      artist.trend === 'up'
                        ? 'default'
                        : artist.trend === 'down'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {artist.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {artist.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                    {artist.trend === 'stable' && '—'}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Pic d'activité</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vous êtes 40% plus actif le samedi entre 14h et 18h.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Objectif atteint</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vous avez dépassé votre objectif de 20h d'écoute ce mois !
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Découverte</span>
              </div>
              <p className="text-xs text-muted-foreground">
                15 nouveaux artistes découverts ce mois. Continuez !
              </p>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Share2 className="h-4 w-4" />
              Partager mes stats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
