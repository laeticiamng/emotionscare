
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart3, TrendingUp, Download, Calendar as CalendarIcon, Users, Activity, Heart } from 'lucide-react';
import { format } from 'date-fns';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const reportMetrics = [
    {
      title: 'Engagement Global',
      value: '84%',
      change: '+12%',
      trend: 'up',
      description: 'Pourcentage d\'utilisateurs actifs',
      icon: Activity
    },
    {
      title: 'Score Bien-être Moyen',
      value: '72/100',
      change: '+5 points',
      trend: 'up',
      description: 'Score moyen de bien-être des équipes',
      icon: Heart
    },
    {
      title: 'Sessions Complétées',
      value: '1,247',
      change: '+23%',
      trend: 'up',
      description: 'Total des sessions terminées',
      icon: TrendingUp
    },
    {
      title: 'Équipes Actives',
      value: '15/18',
      change: '+2',
      trend: 'up',
      description: 'Équipes avec activité récente',
      icon: Users
    }
  ];

  const topInsights = [
    {
      type: 'positive',
      title: 'Amélioration notable',
      description: 'L\'équipe Marketing a augmenté son score de bien-être de 15% ce mois-ci',
      team: 'Marketing',
      impact: 'high'
    },
    {
      type: 'alert',
      title: 'Attention requise',
      description: 'L\'équipe Support montre des signes de fatigue avec 3 membres inactifs',
      team: 'Support',
      impact: 'medium'
    },
    {
      type: 'recommendation',
      title: 'Opportunité',
      description: 'Les sessions VR sont particulièrement efficaces le vendredi après-midi',
      team: 'Toutes',
      impact: 'low'
    }
  ];

  const weeklyReports = [
    {
      week: 'Semaine du 15-21 Jan',
      status: 'completed',
      engagement: 89,
      keyInsights: 3,
      downloadUrl: '#'
    },
    {
      week: 'Semaine du 8-14 Jan',
      status: 'completed',
      engagement: 76,
      keyInsights: 2,
      downloadUrl: '#'
    },
    {
      week: 'Semaine du 1-7 Jan',
      status: 'completed',
      engagement: 82,
      keyInsights: 4,
      downloadUrl: '#'
    }
  ];

  const handleExportReport = (format: string) => {
    console.log(`Exporting report in ${format} format`);
    // Ici on implémenterait l'export réel
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800">Positif</Badge>;
      case 'alert':
        return <Badge className="bg-red-100 text-red-800">Alerte</Badge>;
      case 'recommendation':
        return <Badge className="bg-blue-100 text-blue-800">Recommandation</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3" />
              Rapports & Analytics
            </h1>
            <p className="text-muted-foreground">Analyse détaillée du bien-être organisationnel</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button>Générer rapport</Button>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center space-x-4 space-y-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Période:</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 jours</SelectItem>
                    <SelectItem value="30days">30 jours</SelectItem>
                    <SelectItem value="90days">3 mois</SelectItem>
                    <SelectItem value="12months">12 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Équipe:</label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les équipes</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="dev">Développement</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="direction">Direction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateRange ? format(dateRange, 'dd/MM/yyyy') : 'Sélectionner'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <metric.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="historical">Historique</TabsTrigger>
            <TabsTrigger value="custom">Personnalisé</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution de l'engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Graphique d'engagement temporel (à implémenter avec Recharts)
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Graphique en secteurs par équipe (à implémenter avec Recharts)
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights clés de la période</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{insight.title}</h3>
                        {getInsightBadge(insight.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-muted-foreground">Équipe: {insight.team}</span>
                        <span className="text-muted-foreground">Impact: {insight.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports hebdomadaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{report.week}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Engagement: {report.engagement}%</span>
                          <span>{report.keyInsights} insights clés</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Terminé</Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créateur de rapport personnalisé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Créez des rapports sur mesure en sélectionnant les métriques et visualisations qui vous intéressent.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Métriques à inclure</label>
                    <div className="space-y-2">
                      {['Engagement', 'Scores de bien-être', 'Sessions VR', 'Activité par équipe'].map((metric) => (
                        <label key={metric} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">{metric}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format de visualisation</label>
                    <Select defaultValue="charts">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charts">Graphiques interactifs</SelectItem>
                        <SelectItem value="tables">Tableaux détaillés</SelectItem>
                        <SelectItem value="mixed">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Générer rapport personnalisé</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
