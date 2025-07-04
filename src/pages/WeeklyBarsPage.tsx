import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Calendar, Filter, Download, Eye } from 'lucide-react';

const WeeklyBarsPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('emotion');

  const weeks = [
    { id: 'current', label: 'Cette semaine', period: '2-8 Jan 2025' },
    { id: 'last', label: 'Semaine dernière', period: '26 Déc - 1 Jan' },
    { id: 'before', label: 'Il y a 2 semaines', period: '19-25 Déc 2024' },
    { id: 'month', label: 'Il y a 1 mois', period: '2-8 Déc 2024' }
  ];

  const metrics = [
    { id: 'emotion', label: 'Émotions', color: 'bg-blue-500', unit: 'score' },
    { id: 'stress', label: 'Stress', color: 'bg-red-500', unit: 'niveau' },
    { id: 'energy', label: 'Énergie', color: 'bg-green-500', unit: 'score' },
    { id: 'mood', label: 'Humeur', color: 'bg-purple-500', unit: 'score' },
    { id: 'focus', label: 'Concentration', color: 'bg-orange-500', unit: 'score' },
    { id: 'sleep', label: 'Sommeil', color: 'bg-indigo-500', unit: 'heures' }
  ];

  const weeklyData = {
    emotion: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      values: [75, 82, 68, 85, 90, 78, 88],
      average: 81,
      trend: '+5%'
    },
    stress: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      values: [45, 52, 38, 42, 35, 28, 25],
      average: 38,
      trend: '-12%'
    },
    energy: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      values: [70, 75, 65, 80, 85, 90, 88],
      average: 79,
      trend: '+8%'
    },
    mood: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      values: [72, 78, 70, 82, 87, 85, 90],
      average: 81,
      trend: '+6%'
    },
    focus: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      values: [65, 70, 75, 80, 85, 78, 82],
      average: 76,
      trend: '+10%'
    },
    sleep: {
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      values: [7.5, 8.2, 6.8, 7.8, 8.5, 9.2, 8.8],
      average: 8.1,
      trend: '+0.5h'
    }
  };

  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const currentData = weeklyData[selectedMetric as keyof typeof weeklyData];

  const maxValue = Math.max(...currentData.values);
  const minValue = Math.min(...currentData.values);

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Weekly Bars</h1>
            </div>
            <p className="text-muted-foreground">
              Visualisez vos métriques de bien-être sous forme de graphiques hebdomadaires
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[200px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {weeks.map((week) => (
                  <Button
                    key={week.id}
                    variant={selectedWeek === week.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeek(week.id)}
                    className="text-xs"
                  >
                    {week.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[200px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Métrique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {metrics.map((metric) => (
                  <Button
                    key={metric.id}
                    variant={selectedMetric === metric.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMetric(metric.id)}
                    className="text-xs"
                  >
                    {metric.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métriques principales */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentMetric?.color}`} />
                <div>
                  <p className="text-2xl font-bold">{currentData.average}</p>
                  <p className="text-sm text-muted-foreground">Moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-500">{currentData.trend}</p>
                  <p className="text-sm text-muted-foreground">Évolution</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-2xl font-bold">{maxValue}</p>
                <p className="text-sm text-muted-foreground">Maximum</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-2xl font-bold">{minValue}</p>
                <p className="text-sm text-muted-foreground">Minimum</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphique principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${currentMetric?.color}`} />
              {currentMetric?.label} - {weeks.find(w => w.id === selectedWeek)?.period}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Graphique en barres */}
              <div className="flex items-end justify-between h-64 p-4 bg-muted/30 rounded-lg">
                {currentData.days.map((day, index) => {
                  const value = currentData.values[index];
                  const height = (value / maxValue) * 100;
                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div className="relative group">
                        <div 
                          className={`w-8 md:w-12 ${currentMetric?.color} rounded-t transition-all hover:opacity-80`}
                          style={{ height: `${height * 2}px` }}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-md">
                            {value} {currentMetric?.unit}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Légende */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 {currentMetric?.unit}</span>
                <span>{maxValue} {currentMetric?.unit}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyses et insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de la semaine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tendance générale</span>
                  <Badge variant="outline" className="text-green-600">
                    En amélioration
                  </Badge>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Régularité</span>
                  <Badge variant="outline" className="text-blue-600">
                    Stable
                  </Badge>
                </div>
                <Progress value={68} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Objectif atteint</span>
                  <Badge variant="outline" className="text-purple-600">
                    85%
                  </Badge>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  💡 Point fort
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Excellente progression en fin de semaine. Continuez sur cette lancée !
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                  ⚠️ Attention
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Baisse notable en milieu de semaine. Planifiez des pauses supplémentaires.
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  🎯 Objectif
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Maintenez un score supérieur à 80 pour optimiser votre bien-être.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default WeeklyBarsPage;