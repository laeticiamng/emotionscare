import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter, Eye } from 'lucide-react';

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const periods = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '3m', label: '3 mois' },
    { value: '1y', label: '1 an' }
  ];

  const teamMetrics = [
    { name: 'Équipe Tech', wellbeing: 78, participation: 85, trend: 'up' },
    { name: 'Équipe Marketing', wellbeing: 82, participation: 92, trend: 'up' },
    { name: 'Équipe RH', wellbeing: 75, participation: 88, trend: 'stable' },
    { name: 'Équipe Ventes', wellbeing: 73, participation: 79, trend: 'down' }
  ];

  const insights = [
    {
      type: 'success',
      title: 'Amélioration notable',
      description: 'Le bien-être global a augmenté de 12% ce mois-ci',
      icon: '📈'
    },
    {
      type: 'warning',
      title: 'Attention requise',
      description: 'L\'équipe Ventes montre des signes de stress accru',
      icon: '⚠️'
    },
    {
      type: 'info',
      title: 'Tendance positive',
      description: 'L\'utilisation de la méditation VR a doublé',
      icon: '🧘'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Skip Links pour l'accessibilité */}
      <div className="sr-only focus:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Aller au contenu principal
        </a>
        <a 
          href="#metrics" 
          className="absolute top-4 left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Métriques
        </a>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <BarChart3 className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics RH
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tableau de bord intelligent pour analyser le bien-être et l'engagement de vos équipes
          </p>
        </header>

        <main id="main-content">
          {/* Contrôles */}
          <section className="mb-8" aria-labelledby="controls-title">
            <h2 id="controls-title" className="sr-only">Contrôles de filtrage</h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Période :</span>
                <div role="radiogroup" aria-labelledby="period-selection" className="flex gap-1">
                  <span id="period-selection" className="sr-only">Sélection de la période d'analyse</span>
                  {periods.map((period) => (
                    <Button
                      key={period.value}
                      variant={selectedPeriod === period.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.value)}
                      role="radio"
                      aria-checked={selectedPeriod === period.value}
                      aria-label={`Analyser sur ${period.label}`}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" aria-label="Exporter les données">
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Exporter
                </Button>
              </div>
            </div>
          </section>

          {/* Métriques principales */}
          <section id="metrics" className="mb-8" aria-labelledby="main-metrics-title">
            <h2 id="main-metrics-title" className="text-2xl font-bold mb-6">
              Vue d'ensemble
            </h2>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">77%</div>
                  <div className="text-sm text-muted-foreground">Bien-être moyen</div>
                  <div className="flex items-center justify-center mt-2 text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span className="text-xs">+5% vs mois dernier</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">86%</div>
                  <div className="text-sm text-muted-foreground">Taux de participation</div>
                  <div className="flex items-center justify-center mt-2 text-blue-600">
                    <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span className="text-xs">+8% vs mois dernier</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1,248</div>
                  <div className="text-sm text-muted-foreground">Sessions cette semaine</div>
                  <div className="flex items-center justify-center mt-2 text-purple-600">
                    <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span className="text-xs">+23% vs semaine dernière</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">4.6</div>
                  <div className="text-sm text-muted-foreground">Satisfaction moyenne</div>
                  <div className="flex items-center justify-center mt-2 text-orange-600">
                    <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span className="text-xs">+0.3 vs mois dernier</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Métriques par équipe */}
          <section className="mb-8" aria-labelledby="team-metrics-title">
            <h2 id="team-metrics-title" className="text-2xl font-bold mb-6">
              Analyse par équipe
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {teamMetrics.map((team, index) => (
                <Card key={team.name} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>{team.name}</span>
                      <Badge 
                        variant={team.trend === 'up' ? 'default' : team.trend === 'down' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {team.trend === 'up' ? '↗️' : team.trend === 'down' ? '↘️' : '➡️'} 
                        {team.trend === 'up' ? 'En hausse' : team.trend === 'down' ? 'En baisse' : 'Stable'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bien-être</span>
                        <span className="font-medium">{team.wellbeing}%</span>
                      </div>
                      <Progress 
                        value={team.wellbeing} 
                        className="h-2" 
                        aria-label={`Bien-être de l'équipe ${team.name}: ${team.wellbeing}%`}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Participation</span>
                        <span className="font-medium">{team.participation}%</span>
                      </div>
                      <Progress 
                        value={team.participation} 
                        className="h-2" 
                        aria-label={`Participation de l'équipe ${team.name}: ${team.participation}%`}
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      aria-label={`Voir les détails de l'équipe ${team.name}`}
                    >
                      <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                      Voir les détails
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Insights IA */}
          <section aria-labelledby="insights-title">
            <h2 id="insights-title" className="text-2xl font-bold mb-6">
              Insights IA
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <Card 
                  key={index} 
                  className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm ${
                    insight.type === 'success' ? 'border-l-4 border-l-green-500' :
                    insight.type === 'warning' ? 'border-l-4 border-l-orange-500' :
                    'border-l-4 border-l-blue-500'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{insight.icon}</span>
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;