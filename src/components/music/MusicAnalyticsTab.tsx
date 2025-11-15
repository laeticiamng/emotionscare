/**
 * Music Analytics Tab - Analysez vos statistiques musicales
 * Inclut: calendrier des humeurs, graphiques, insights, tendances
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Calendar,
  Music,
  Eye,
  Award,
  BarChart3,
  PieChart,
  Download,
} from 'lucide-react';

interface ListeningSession {
  date: Date;
  duration: number;
  mood: string;
  genre?: string;
  trackCount: number;
}

interface MusicAnalyticsTabProps {
  listeningHistory?: ListeningSession[];
  totalListeningHours?: number;
  favoriteGenres?: { name: string; count: number }[];
  weeklyStats?: { day: string; duration: number; mood: string }[];
  children?: React.ReactNode;
}

const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    calm: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    happy: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    energetic: 'bg-orange-500/20 text-orange-700 border-orange-500/30',
    sad: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
    focused: 'bg-green-500/20 text-green-700 border-green-500/30',
    relaxed: 'bg-cyan-500/20 text-cyan-700 border-cyan-500/30',
  };
  return moodColors[mood] || 'bg-gray-500/20 text-gray-700 border-gray-500/30';
};

export const MusicAnalyticsTab: React.FC<MusicAnalyticsTabProps> = ({
  listeningHistory = [],
  totalListeningHours = 0,
  favoriteGenres = [],
  weeklyStats = [],
  children,
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Calculate statistics
  const stats = useMemo(() => {
    const filtered = listeningHistory;

    const totalSessions = filtered.length;
    const totalDuration = filtered.reduce((acc, s) => acc + s.duration, 0);
    const totalTracks = filtered.reduce((acc, s) => acc + s.trackCount, 0);

    const moodDistribution = filtered.reduce(
      (acc, session) => {
        acc[session.mood] = (acc[session.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalSessions,
      totalDuration: Math.round(totalDuration / 60),
      totalTracks,
      moodDistribution,
    };
  }, [listeningHistory, timeRange]);

  // Create mood calendar for current month
  const moodCalendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days: (ListeningSession | null)[] = Array(firstDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const session = listeningHistory.find(
        (s) =>
          s.date.getDate() === i &&
          s.date.getMonth() === month &&
          s.date.getFullYear() === year
      );
      days.push(session || null);
    }

    return { days, month, year };
  }, [listeningHistory]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sessions</span>
                <Music className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
              <p className="text-xs text-muted-foreground">sessions d'écoute</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Durée totale</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalDuration}</p>
              <p className="text-xs text-muted-foreground">heures d'écoute</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Titres écoutés</span>
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalTracks}</p>
              <p className="text-xs text-muted-foreground">musiques</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Moyenne/jour</span>
                <Eye className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold">
                {Math.round(stats.totalDuration / Math.max(1, stats.totalSessions) * 10) / 10}
              </p>
              <p className="text-xs text-muted-foreground">heures</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mood Distribution */}
      {Object.keys(stats.moodDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribution des humeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.moodDistribution).map(([mood, count]) => (
                <Badge
                  key={mood}
                  className={`px-4 py-2 text-sm cursor-default ${getMoodColor(mood)}`}
                >
                  {mood} <span className="ml-2 font-bold">({count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier des humeurs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {monthNames[moodCalendar.month]} {moodCalendar.year}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {moodCalendar.days.map((session, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-xs font-semibold ${
                    session
                      ? `border-${session.mood}-500/50 bg-${session.mood}-500/20 text-${session.mood}-700`
                      : 'border-muted bg-muted/30 text-muted-foreground'
                  }`}
                >
                  {session ? (
                    <div className="text-center">
                      <div>{session.date.getDate()}</div>
                      <div className="text-xs text-muted-foreground">
                        {session.mood.slice(0, 3)}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Genres */}
      {favoriteGenres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Genres préférés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoriteGenres.slice(0, 5).map((genre, idx) => (
                <div key={genre.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{genre.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {genre.count} écoutes
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(genre.count / favoriteGenres[0].count) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Children (existing analytics components) */}
      {children}

      {/* Export Button */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => {
          const data = {
            stats,
            listeningHistory,
            exportDate: new Date().toISOString(),
          };
          const element = document.createElement('a');
          element.setAttribute(
            'href',
            'data:application/json;charset=utf-8,' +
              encodeURIComponent(JSON.stringify(data, null, 2))
          );
          element.setAttribute('download', `music-analytics-${Date.now()}.json`);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }}
      >
        <Download className="h-4 w-4" />
        Exporter les données d'analyse
      </Button>
    </div>
  );
};

export default MusicAnalyticsTab;
