// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DraggableKpiCardsGrid from '../DraggableKpiCardsGrid';
import TeamEmotionCard from '../cards/TeamEmotionCard';
import ActivityChart from '../charts/ActivityChart';
import EmotionTrendChart from '../charts/EmotionTrendChart';
import TeamLeaderboardCard from '../cards/TeamLeaderboardCard';
import { BarChart, Users, TrendingUp, Calendar } from 'lucide-react';
import { DraggableCardProps } from '@/types/widgets';

const GlobalOverviewTab: React.FC = () => {
  // KPI cards data
  const kpiCardsData: DraggableCardProps[] = [
    {
      id: 'users',
      title: 'Utilisateurs actifs',
      value: '1,243',
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      delta: {
        value: 12.5,
        trend: 'up',
        label: 'vs mois dernier'
      }
    },
    {
      id: 'sessions',
      title: 'Sessions journalières',
      value: '325',
      icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
      delta: {
        value: 8.2,
        trend: 'up',
        label: 'vs semaine dernière'
      }
    },
    {
      id: 'engagement',
      title: "Taux d'engagement",
      value: '68%',
      icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
      delta: {
        value: 3.1,
        trend: 'up',
        label: 'vs trimestre précédent'
      }
    },
    {
      id: 'activity',
      title: 'Activités complétées',
      value: '8,547',
      icon: <BarChart className="h-5 w-5 text-muted-foreground" />,
      delta: {
        value: 5.6,
        trend: 'up',
        label: 'vs mois dernier'
      }
    }
  ];
  
  // Mock data for activities
  const activityData = [
    { date: '01/05', journal: 125, music: 85, scan: 45, coach: 30, vr: 60 },
    { date: '02/05', journal: 118, music: 90, scan: 49, coach: 32, vr: 65 },
    { date: '03/05', journal: 130, music: 95, scan: 52, coach: 28, vr: 70 },
    { date: '04/05', journal: 135, music: 88, scan: 55, coach: 35, vr: 68 },
    { date: '05/05', journal: 142, music: 92, scan: 58, coach: 37, vr: 72 },
    { date: '06/05', journal: 140, music: 98, scan: 60, coach: 40, vr: 75 },
    { date: '07/05', journal: 145, music: 105, scan: 62, coach: 42, vr: 78 }
  ];
  
  // Mock data for emotion trends
  const emotionTrendData = [
    { date: '01/05', calm: 45, happy: 30, anxious: 15, sad: 10 },
    { date: '02/05', calm: 42, happy: 32, anxious: 18, sad: 8 },
    { date: '03/05', calm: 48, happy: 35, anxious: 12, sad: 5 },
    { date: '04/05', calm: 50, happy: 38, anxious: 8, sad: 4 },
    { date: '05/05', calm: 55, happy: 35, anxious: 7, sad: 3 },
    { date: '06/05', calm: 52, happy: 40, anxious: 5, sad: 3 },
    { date: '07/05', calm: 58, happy: 35, anxious: 4, sad: 3 }
  ];
  
  // Team emotions data
  const teamEmotionsData = [
    { emotion: 'calm', percentage: 45, color: '#0ea5e9' },
    { emotion: 'happy', percentage: 30, color: '#22c55e' },
    { emotion: 'anxious', percentage: 15, color: '#f97316' },
    { emotion: 'sad', percentage: 10, color: '#6366f1' }
  ];
  
  // Team members data
  const teamMembersData = [
    { 
      id: '1', 
      name: 'Sophie Martin', 
      role: 'Product Manager', 
      points: 950, 
      progress: 78, 
      avatar: '/avatars/avatar-1.png' 
    },
    { 
      id: '2', 
      name: 'Thomas Dubois', 
      role: 'UX Designer', 
      points: 875, 
      progress: 72 
    },
    { 
      id: '3', 
      name: 'Julie Laurent', 
      role: 'Developer', 
      points: 820, 
      progress: 65 
    },
    { 
      id: '4', 
      name: 'Antoine Bernard', 
      role: 'Marketing', 
      points: 780, 
      progress: 60 
    }
  ];
  
  return (
    <div className="space-y-6">
      <DraggableKpiCardsGrid kpiCards={kpiCardsData} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activité globale</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart data={activityData} height={300} />
          </CardContent>
        </Card>
        
        <TeamEmotionCard 
          emotions={teamEmotionsData}
          period="7 derniers jours" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tendances émotionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionTrendChart 
              data={emotionTrendData} 
              height={300} 
              stackedView
            />
          </CardContent>
        </Card>
        
        <TeamLeaderboardCard 
          members={teamMembersData} 
        />
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
