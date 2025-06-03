
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar, TrendingUp, TrendingDown, Users, Heart, Brain, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTeamAnalytics } from '@/services/teamAnalyticsService';
import { retentionService } from '@/services/retentionService';

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const { data: teamAnalytics, isLoading: teamLoading } = useQuery({
    queryKey: ['team-analytics', selectedTeam],
    queryFn: () => fetchTeamAnalytics(selectedTeam),
    enabled: selectedTeam !== 'all',
  });

  const { data: retentionStats, isLoading: retentionLoading } = useQuery({
    queryKey: ['retention-stats'],
    queryFn: () => retentionService.fetchStats('all'),
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['reengagement-campaigns'],
    queryFn: () => retentionService.fetchCampaigns(),
  });

  // Mock data pour les graphiques
  const emotionalTrendData = [
    { name: 'Lun', score: 7.2, stress: 3.1, energie: 6.8 },
    { name: 'Mar', score: 7.5, stress: 2.9, energie: 7.1 },
    { name: 'Mer', score: 6.9, stress: 3.4, energie: 6.5 },
    { name: 'Jeu', score: 7.8, stress: 2.7, energie: 7.3 },
    { name: 'Ven', score: 8.1, stress: 2.5, energie: 7.8 },
    { name: 'Sam', score: 8.3, stress: 2.2, energie: 8.1 },
    { name: 'Dim', score: 7.9, stress: 2.6, energie: 7.6 },
  ];

  const departmentData = [
    { name: 'RH', value: 25, color: '#3B82F6' },
    { name: 'IT', value: 30, color: '#10B981' },
    { name: 'Marketing', value: 20, color: '#F59E0B' },
    { name: 'Ventes', value: 25, color: '#EF4444' },
  ];

  const engagementData = [
    { name: 'Semaine 1', actifs: 245, nouveaux: 32, perdus: 12 },
    { name: 'Semaine 2', actifs: 267, nouveaux: 28, perdus: 8 },
    { name: 'Semaine 3', actifs: 289, nouveaux: 35, perdus: 15 },
    { name: 'Semaine 4', actifs: 312, nouveaux: 41, perdus: 9 },
  ];

  const wellbeingMetrics = [
    { title: 'Score moyen bien-être', value: '7.4/10', change: '+0.3', trend: 'up', icon: Heart },
    { title: 'Niveau de stress', value: '2.8/10', change: '-0.5', trend: 'down', icon: Brain },
    { title: 'Engagement équipes', value: '86%', change: '+4%', trend: 'up', icon: Users },
    { title: 'Objectifs atteints', value: '92%', change: '+8%', trend: 'up', icon: Target },
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : TrendingUp;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics et Insights</h1>
          <p className="text-muted-foreground">
            Analyse avancée du bien-être émotionnel et de l'engagement
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
              <SelectItem value="1y">1 année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques de bien-être */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wellbeingMetrics.map((metric, index) => {
          const TrendIcon = getTrendIcon(metric.trend);
          const IconComponent = metric.icon;
          
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <div className={`flex items-center ${getTrendColor(metric.trend)}`}>
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm ml-1">{metric.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendances émotionnelles</TabsTrigger>
          <TabsTrigger value="teams">Analyse par équipe</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Rétention</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du bien-être (7 jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={emotionalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" name="Score bien-être" />
                    <Line type="monotone" dataKey="energie" stroke="#10B981" name="Niveau d'énergie" />
                    <Line type="monotone" dataKey="stress" stroke="#EF4444" name="Niveau de stress" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par département</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par équipe</CardTitle>
            </CardHeader>
            <CardContent>
              {teamAnalytics ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{teamAnalytics.teamName}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{teamAnalytics.memberCount}</p>
                      <p className="text-sm text-muted-foreground">Membres</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{teamAnalytics.averageScore.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">Score moyen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{(teamAnalytics.engagementRate * 100).toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Sélectionnez une équipe pour voir les analyses détaillées</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de l'engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actifs" fill="#3B82F6" name="Utilisateurs actifs" />
                  <Bar dataKey="nouveaux" fill="#10B981" name="Nouveaux utilisateurs" />
                  <Bar dataKey="perdus" fill="#EF4444" name="Utilisateurs perdus" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de rétention</CardTitle>
              </CardHeader>
              <CardContent>
                {retentionStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{retentionStats.daysActive}</p>
                        <p className="text-sm text-muted-foreground">Jours actifs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{retentionStats.streak}</p>
                        <p className="text-sm text-muted-foreground">Série en cours</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Badges obtenus</h4>
                      <div className="flex flex-wrap gap-2">
                        {retentionStats.badges.map((badge, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Chargement des statistiques...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campagnes de réengagement</CardTitle>
              </CardHeader>
              <CardContent>
                {campaigns && campaigns.length > 0 ? (
                  <div className="space-y-3">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{campaign.name}</h4>
                            <p className="text-sm text-muted-foreground">{campaign.target}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            campaign.status === 'running' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <span>Envoyés: {campaign.sent}</span>
                          <span>Ouverts: {campaign.opened}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune campagne active</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
