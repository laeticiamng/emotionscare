// @ts-nocheck
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Target, Award, Clock, Flame, Heart, Brain } from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';

interface ActivityData {
  date: string;
  meditation: number;
  breathing: number;
  music: number;
  journal: number;
  scan: number;
  total: number;
}

const SAMPLE_ACTIVITY_DATA: ActivityData[] = [
  { date: 'Lun', meditation: 15, breathing: 10, music: 20, journal: 8, scan: 3, total: 56 },
  { date: 'Mar', meditation: 20, breathing: 15, music: 25, journal: 12, scan: 5, total: 77 },
  { date: 'Mer', meditation: 12, breathing: 8, music: 15, journal: 6, scan: 2, total: 43 },
  { date: 'Jeu', meditation: 25, breathing: 20, music: 30, journal: 15, scan: 4, total: 94 },
  { date: 'Ven', meditation: 18, breathing: 12, music: 22, journal: 10, scan: 3, total: 65 },
  { date: 'Sam', meditation: 30, breathing: 25, music: 35, journal: 20, scan: 6, total: 116 },
  { date: 'Dim', meditation: 22, breathing: 18, music: 28, journal: 14, scan: 4, total: 86 }
];

const B2CActivitePage: React.FC = () => {
  const [activityData] = useState<ActivityData[]>(SAMPLE_ACTIVITY_DATA);

  const totalMinutes = activityData.reduce((sum, day) => sum + day.total, 0);
  const streak = 5;

  const getActivityTypeColor = (type: string) => {
    const colors = {
      meditation: '#8B5CF6',
      breathing: '#06B6D4',
      music: '#F59E0B',
      journal: '#EF4444',
      scan: '#10B981'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart className="h-8 w-8 text-info" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-info to-accent bg-clip-text text-transparent">
                Suivi d'Activité
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
              Visualisez votre progression dans votre parcours de bien-être émotionnel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6 border border-border/10 text-center">
              <Clock className="h-8 w-8 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">{totalMinutes}</div>
              <div className="text-sm text-muted-foreground">Minutes totales</div>
            </div>
            
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6 border border-border/10 text-center">
              <Heart className="h-8 w-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">7.8</div>
              <div className="text-sm text-muted-foreground">Humeur moyenne</div>
            </div>
            
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6 border border-border/10 text-center">
              <Flame className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">{streak}</div>
              <div className="text-sm text-muted-foreground">Jours consécutifs</div>
            </div>
            
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6 border border-border/10 text-center">
              <Award className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">3/4</div>
              <div className="text-sm text-muted-foreground">Accomplissements</div>
            </div>
          </div>

          <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6 border border-border/10">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-info" />
              Activités par type (minutes)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="meditation" fill={getActivityTypeColor('meditation')} name="Méditation" />
                <Bar dataKey="breathing" fill={getActivityTypeColor('breathing')} name="Respiration" />
                <Bar dataKey="music" fill={getActivityTypeColor('music')} name="Musique" />
                <Bar dataKey="journal" fill={getActivityTypeColor('journal')} name="Journal" />
                <Bar dataKey="scan" fill={getActivityTypeColor('scan')} name="Scan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CActivitePage;