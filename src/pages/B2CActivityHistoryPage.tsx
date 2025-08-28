import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Activity, Clock, TrendingUp, Download, Filter } from 'lucide-react';
import { LoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CActivityHistoryPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingStates.Loading text="Chargement de l'historique..." />;
  if (loadingState === 'error') return <LoadingStates.Error message="Erreur de chargement" />;

  const activities = [
    { date: '2024-01-15', type: 'Scan', duration: '5 min', score: 'Excellent', icon: '🎯' },
    { date: '2024-01-15', type: 'Musique', duration: '15 min', score: 'Très bien', icon: '🎵' },
    { date: '2024-01-14', type: 'Coach IA', duration: '10 min', score: 'Bien', icon: '🤖' },
    { date: '2024-01-14', type: 'Bubble Beat', duration: '8 min', score: 'Excellent', icon: '🫧' },
    { date: '2024-01-13', type: 'Méditation', duration: '20 min', score: 'Très bien', icon: '🧘' },
    { date: '2024-01-13', type: 'Flash Glow', duration: '3 min', score: 'Excellent', icon: '⚡' },
    { date: '2024-01-12', type: 'Journal', duration: '12 min', score: 'Bien', icon: '📝' },
    { date: '2024-01-12', type: 'VR Session', duration: '25 min', score: 'Très bien', icon: '🥽' }
  ];

  const getScoreBadge = (score: string) => {
    const variants = {
      'Excellent': 'default',
      'Très bien': 'secondary', 
      'Bien': 'outline'
    } as const;
    return variants[score as keyof typeof variants] || 'outline';
  };

  const stats = {
    totalSessions: activities.length,
    totalTime: '98 min',
    avgScore: 'Très bien',
    streak: '5 jours'
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-green-500" />
        <div>
          <h1 className="text-3xl font-bold">Historique d'Activité</h1>
          <p className="text-muted-foreground">Suivez votre parcours de bien-être</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.totalTime}</div>
            <div className="text-sm text-muted-foreground">Temps total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.avgScore}</div>
            <div className="text-sm text-muted-foreground">Score moyen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">Série actuelle</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {['7j', '30j', '3m', 'Tout'].map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Liste des activités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{activity.icon}</div>
                  <div>
                    <div className="font-medium">{activity.type}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                      <Clock className="h-3 w-3 ml-2" />
                      {activity.duration}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getScoreBadge(activity.score)}>
                    {activity.score}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendances */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution du Bien-être</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Régularité des sessions</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="w-3/4 bg-green-500 h-2 rounded-full"></div>
                </div>
                <span className="text-sm text-green-500 font-medium">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Progression des scores</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="w-5/6 bg-blue-500 h-2 rounded-full"></div>
                </div>
                <span className="text-sm text-blue-500 font-medium">83%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Diversité des activités</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="w-4/5 bg-purple-500 h-2 rounded-full"></div>
                </div>
                <span className="text-sm text-purple-500 font-medium">80%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CActivityHistoryPage;