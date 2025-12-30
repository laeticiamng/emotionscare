/**
 * Statistiques du buddy system
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MessageCircle, 
  Activity, 
  Clock, 
  Flame,
  Trophy,
  Heart,
  Sparkles
} from 'lucide-react';
import type { BuddyStats } from '../types';
import { motion } from 'framer-motion';

interface BuddyStatsCardProps {
  stats: BuddyStats | null;
}

export const BuddyStatsCard: React.FC<BuddyStatsCardProps> = ({ stats }) => {
  const statItems = [
    {
      icon: Users,
      label: 'Buddies',
      value: stats?.total_buddies || 0,
      color: 'text-blue-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: MessageCircle,
      label: 'Messages envoyés',
      value: stats?.total_messages_sent || 0,
      color: 'text-green-500',
      bgColor: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: Activity,
      label: 'Activités complétées',
      value: stats?.total_activities_completed || 0,
      color: 'text-purple-500',
      bgColor: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: Clock,
      label: 'Minutes de session',
      value: stats?.total_session_minutes || 0,
      color: 'text-amber-500',
      bgColor: 'from-amber-500/10 to-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${item.bgColor}`}>
              <CardContent className="p-4 text-center">
                <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Streak & XP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Série d'activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl font-bold">{stats?.current_streak_days || 0}</span>
              <span className="text-sm text-muted-foreground">jours consécutifs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-amber-500" />
              Record: {stats?.longest_streak_days || 0} jours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              XP Buddy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl font-bold">{stats?.xp_from_buddies || 0}</span>
              <span className="text-sm text-muted-foreground">points gagnés</span>
            </div>
            <Progress value={((stats?.xp_from_buddies || 0) % 1000) / 10} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {1000 - ((stats?.xp_from_buddies || 0) % 1000)} XP jusqu'au prochain niveau
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Rate */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Qualité des interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Messages reçus</span>
                  <span className="font-medium">{stats.total_messages_received}</span>
                </div>
                <Progress value={Math.min((stats.total_messages_received / 100) * 100, 100)} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sessions totales</span>
                  <span className="font-medium">{stats.total_sessions}</span>
                </div>
                <Progress value={Math.min((stats.total_sessions / 50) * 100, 100)} className="h-2" />
              </div>

              {stats.average_response_time_minutes && (
                <p className="text-sm text-muted-foreground">
                  Temps de réponse moyen: {stats.average_response_time_minutes} min
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuddyStatsCard;
