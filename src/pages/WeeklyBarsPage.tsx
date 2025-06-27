
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const WeeklyBarsPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');

  const weeklyData = [
    { day: 'Lun', productivity: 85, wellbeing: 78, goals: 92, energy: 70 },
    { day: 'Mar', productivity: 92, wellbeing: 85, goals: 88, energy: 82 },
    { day: 'Mer', productivity: 78, wellbeing: 90, goals: 75, energy: 88 },
    { day: 'Jeu', productivity: 88, wellbeing: 82, goals: 95, energy: 75 },
    { day: 'Ven', productivity: 95, wellbeing: 88, goals: 90, energy: 92 },
    { day: 'Sam', productivity: 70, wellbeing: 95, goals: 65, energy: 85 },
    { day: 'Dim', productivity: 60, wellbeing: 88, goals: 70, energy: 90 }
  ];

  const metrics = [
    { name: 'Productivité', key: 'productivity', color: 'bg-blue-500', icon: TrendingUp },
    { name: 'Bien-être', key: 'wellbeing', color: 'bg-green-500', icon: Award },
    { name: 'Objectifs', key: 'goals', color: 'bg-purple-500', icon: Target },
    { name: 'Énergie', key: 'energy', color: 'bg-orange-500', icon: BarChart3 }
  ];

  const weeklyStats = {
    totalScore: 85,
    bestDay: 'Vendredi',
    improvement: '+12%',
    streak: 5
  };

  const maxValue = 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Weekly Bars
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualisez votre progression hebdomadaire avec des graphiques intuitifs
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{weeklyStats.totalScore}%</div>
              <div className="text-sm text-gray-600">Score Moyen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-green-600">{weeklyStats.bestDay}</div>
              <div className="text-sm text-gray-600">Meilleur Jour</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{weeklyStats.improvement}</div>
              <div className="text-sm text-gray-600">Amélioration</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{weeklyStats.streak}</div>
              <div className="text-sm text-gray-600">Jours Consécutifs</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Graphique Hebdomadaire
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedWeek === 'previous' ? 'default' : 'outline'}
                      onClick={() => setSelectedWeek('previous')}
                    >
                      Semaine Précédente
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedWeek === 'current' ? 'default' : 'outline'}
                      onClick={() => setSelectedWeek('current')}
                    >
                      Cette Semaine
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weeklyData.map((day, dayIndex) => (
                    <motion.div 
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIndex * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium w-12">{day.day}</span>
                        <div className="flex-1 grid grid-cols-4 gap-1 mx-4">
                          {metrics.map((metric) => (
                            <div key={metric.key} className="space-y-1">
                              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(day[metric.key as keyof typeof day] / maxValue) * 100}%` }}
                                  transition={{ duration: 1, delay: dayIndex * 0.1 }}
                                  className={`h-full ${metric.color} rounded-full`}
                                />
                              </div>
                              <div className="text-xs text-center font-medium">
                                {day[metric.key as keyof typeof day]}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {metrics.map((metric) => (
                      <div key={metric.key} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${metric.color}`} />
                        <span className="text-sm">{metric.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Métriques Détaillées</h3>
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const avgValue = Math.round(
                  weeklyData.reduce((sum, day) => sum + day[metric.key as keyof typeof day], 0) / weeklyData.length
                );
                return (
                  <Card key={metric.key}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${metric.color} rounded-lg`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{metric.name}</div>
                            <div className="text-sm text-gray-600">Moyenne</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{avgValue}%</div>
                          <Badge variant={avgValue > 80 ? "default" : "secondary"}>
                            {avgValue > 80 ? "Excellent" : avgValue > 60 ? "Bon" : "À améliorer"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Exporter les Données
                </Button>
                <Button className="w-full" variant="outline">
                  Comparer aux Objectifs
                </Button>
                <Button className="w-full" variant="outline">
                  Partager le Rapport
                </Button>
                <Button className="w-full">
                  Définir Nouveaux Objectifs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBarsPage;
