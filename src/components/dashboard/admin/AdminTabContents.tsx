
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmotionPieChart from '../charts/EmotionPieChart';
import WeeklyActivityChart from '../charts/WeeklyActivityChart';
import BadgesWidget from '../widgets/BadgesWidget';
import LeaderboardWidget from '../widgets/LeaderboardWidget';
import { Badge, LeaderboardEntry } from '@/types';

export const TeamOverviewTab: React.FC = () => {
  // Sample data for the charts
  const emotions = [
    { name: 'Calme', value: 35, color: '#4299E1' },
    { name: 'Joie', value: 30, color: '#F6AD55' },
    { name: 'Concentration', value: 20, color: '#9F7AEA' },
    { name: 'Stress', value: 15, color: '#FC8181' },
  ];

  const weeklyActivity = [
    { day: 'Lun', journal: 10, music: 15, scan: 5, coach: 3 },
    { day: 'Mar', journal: 12, music: 14, scan: 6, coach: 4 },
    { day: 'Mer', journal: 8, music: 20, scan: 4, coach: 2 },
    { day: 'Jeu', journal: 15, music: 18, scan: 7, coach: 5 },
    { day: 'Ven', journal: 11, music: 16, scan: 5, coach: 3 },
    { day: 'Sam', journal: 5, music: 10, scan: 2, coach: 1 },
    { day: 'Dim', journal: 6, music: 12, scan: 3, coach: 2 },
  ];

  // Sample progress data
  const userProgress = {
    points: 1250,
    level: 5,
    streak: 7,
    nextLevel: {
      points: 1500,
      level: 6
    },
    progress: 0.75 // This is now a simple number representing percentage (0-1)
  };

  // Sample badges
  const badges: Badge[] = [
    { 
      id: '1', 
      name: 'Équipe active', 
      description: '100 entrées de journal', 
      icon: '📝', 
      category: 'journal', 
      level: 1,
      unlocked: true,
      progress: 100,
      completed: true
    },
  ];

  // Sample leaderboard
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Équipe Marketing', points: 1500, level: 6, position: 1, userId: 'team1' },
    { id: '2', name: 'Équipe Produit', points: 1350, level: 5, position: 2, userId: 'team2' },
    { id: '3', name: 'Équipe Tech', points: 1200, level: 5, position: 3, userId: 'team3' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Émotions collectives</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionPieChart data={emotions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyActivityChart data={weeklyActivity} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques d'usage</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Usage stats content */}
            <p>Statistiques détaillées d'utilisation par département.</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Badges d'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <BadgesWidget badges={badges} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Classement des équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardWidget leaderboard={leaderboard} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const TeamDetailTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Détail des équipes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenu détaillé des équipes à venir...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Options de configuration à venir...</p>
        </CardContent>
      </Card>
    </div>
  );
};
