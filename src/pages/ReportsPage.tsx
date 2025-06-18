
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileBarChart, Download, Calendar, TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { id: 'week', label: 'Cette semaine' },
    { id: 'month', label: 'Ce mois' },
    { id: 'quarter', label: 'Ce trimestre' },
    { id: 'year', label: 'Cette année' }
  ];

  const reports = [
    {
      id: 1,
      title: 'Rapport Mensuel - Décembre 2024',
      description: 'Analyse complète du bien-être organisationnel',
      date: '2024-12-15',
      type: 'Complet',
      status: 'Généré',
      size: '2.3 MB'
    },
    {
      id: 2,
      title: 'Analyse Équipe Marketing - Novembre 2024',
      description: 'Focus sur l\'équipe marketing et ses performances',
      date: '2024-11-30',
      type: 'Équipe',
      status: 'Généré',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Rapport Trimestriel Q4 2024',
      description: 'Vue d\'ensemble du dernier trimestre',
      date: '2024-12-01',
      type: 'Trimestriel',
      status: 'En cours',
      size: '-'
    }
  ];

  const metrics = [
    {
      title: 'Score de Bien-être Global',
      value: 72,
      change: +5,
      trend: 'up',
      description: 'Amélioration de 5 points ce mois'
    },
    {
      title: 'Engagement des Employés',
      value: 78,
      change: +2,
      trend: 'up',
      description: 'Légère hausse de l\'engagement'
    },
    {
      title: 'Risques Identifiés',
      value: 3,
      change: -2,
      trend: 'down',
      description: '2 risques de moins que le mois dernier'
    },
    {
      title: 'Taux de Participation',
      value: 84,
      change: +8,
      trend: 'up',
      description: 'Forte augmentation de la participation'
    }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Amélioration Notable',
      content: 'Le score de bien-être global a augmenté de 5 points ce mois, principalement grâce aux initiatives de l\'équipe RH.',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      type: 'warning',
      title: 'Point d\'Attention',
      content: 'L\'équipe ventes montre des signes de stress élevé. Une intervention est recommandée.',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    {
      type: 'info',
      title: 'Tendance Positive',
      content: 'La participation aux programmes de bien-être a augmenté de 8% ce mois.',
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rapports & Analytics</h1>
          <p className="text-muted-foreground">
            Analyses détaillées du bien-être organisationnel
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FileBarChart className="h-4 w-4" />
          Générer rapport
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        {periods.map((period) => (
          <Button
            key={period.id}
            variant={selectedPeriod === period.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period.id)}
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.title}</span>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {metric.change > 0 ? '+' : ''}{metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}{metric.title.includes('Score') || metric.title.includes('Taux') ? '/100' : ''}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Rapports Disponibles</CardTitle>
              <CardDescription>
                Téléchargez vos rapports générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileBarChart className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.date).toLocaleDateString('fr-FR')}
                          </span>
                          <Badge variant="outline">{report.type}</Badge>
                          {report.size !== '-' && <span>{report.size}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'Généré' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      {report.status === 'Généré' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée</CardTitle>
              <CardDescription>
                Métriques de performance par département
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { dept: 'Marketing', score: 78, members: 12, trend: 'up' },
                  { dept: 'Développement', score: 65, members: 8, trend: 'stable' },
                  { dept: 'RH', score: 85, members: 5, trend: 'up' },
                  { dept: 'Ventes', score: 52, members: 15, trend: 'down' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.dept}</span>
                        <Badge variant="outline">{item.members} membres</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.score}/100</span>
                        {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileBarChart className="h-4 w-4 mr-2" />
                Rapport personnalisé
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exporter données
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Programmer rapport
              </Button>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Clés</CardTitle>
              <CardDescription>
                Points d'attention du mois
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  {insight.icon}
                  <div>
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground">{insight.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Report Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Rapports Programmés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Rapport hebdomadaire</div>
                <div className="text-muted-foreground">Tous les lundis à 9h</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Analyse mensuelle</div>
                <div className="text-muted-foreground">Le 1er de chaque mois</div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Gérer les programmations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
