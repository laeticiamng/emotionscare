
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GamificationStats } from '@/types';

interface AdminTabContentsProps {
  activeTab: string;
}

const AdminTabContents: React.FC<AdminTabContentsProps> = ({ activeTab }) => {
  // Mock data for admin dashboard
  const mockTeamData = {
    totalMembers: 42,
    activeUsers: 38,
    newUsersThisMonth: 5,
    averageEngagement: '72%',
  };
  
  const mockEmotionData = {
    teamMood: 'Plutôt calme',
    stressLevel: 'Modéré',
    weeklyTrend: 'En amélioration',
    topEmotions: ['Calme (35%)', 'Concentré (28%)', 'Stressé (15%)'],
  };
  
  // Mock gamification stats that properly implements the GamificationStats interface
  const mockGamificationStats: GamificationStats = {
    points: 2150,
    level: 4,
    badges: [],
    streak: 12,
    completedChallenges: 24,
    totalChallenges: 30,
    activeUsersPercent: 85,
    totalBadges: 18,
    badgeLevels: [
      { level: "Débutant", count: 5 },
      { level: "Intermédiaire", count: 8 },
      { level: "Expert", count: 5 }
    ],
    progress: { current: 75, target: 100 },
    completionRate: 80,
    achievements: [
      { id: "1", name: "Première équipe", completed: true }
    ],
    leaderboard: [
      { userId: "u1", username: "Équipe Marketing", points: 3200 },
      { userId: "u2", username: "Équipe Tech", points: 2950 },
      { userId: "u3", username: "Équipe Finance", points: 2600 }
    ],
    lastActivityDate: new Date().toISOString()
  };

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu de l'équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Membres</dt>
                    <dd className="font-medium">{mockTeamData.totalMembers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Utilisateurs actifs</dt>
                    <dd className="font-medium">{mockTeamData.activeUsers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Nouveaux ce mois</dt>
                    <dd className="font-medium">{mockTeamData.newUsersThisMonth}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Engagement moyen</dt>
                    <dd className="font-medium">{mockTeamData.averageEngagement}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Météo émotionnelle d'équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Humeur globale</dt>
                    <dd className="font-medium">{mockEmotionData.teamMood}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Niveau de stress</dt>
                    <dd className="font-medium">{mockEmotionData.stressLevel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tendance hebdomadaire</dt>
                    <dd className="font-medium text-green-600">{mockEmotionData.weeklyTrend}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-2">Principales émotions</dt>
                    <dd className="font-medium">
                      <ul className="space-y-1">
                        {mockEmotionData.topEmotions.map((emotion, i) => (
                          <li key={i}>{emotion}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'emotions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rapport émotionnel détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenu du rapport émotionnel détaillé</p>
              {/* Detailed emotional report content would go here */}
            </CardContent>
          </Card>
        );
        
      case 'engagement':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Utilisateurs actifs</dt>
                  <dd className="font-medium">{mockGamificationStats.activeUsersPercent}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Défis complétés</dt>
                  <dd className="font-medium">
                    {mockGamificationStats.completedChallenges}/{mockGamificationStats.totalChallenges}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Badges distribués</dt>
                  <dd className="font-medium">{mockGamificationStats.totalBadges}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-2">Badges par niveau</dt>
                  <dd>
                    <ul className="space-y-1">
                      {mockGamificationStats.badgeLevels?.map((level, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{level.level}</span>
                          <span className="font-medium">{level.count}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Sélectionnez un onglet pour voir le contenu
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return renderContent();
};

export default AdminTabContents;
