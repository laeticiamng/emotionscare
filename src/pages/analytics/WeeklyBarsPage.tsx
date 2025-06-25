
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Target, Award, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const WeeklyBarsPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('emotions');
  const [viewMode, setViewMode] = useState('bars');

  // Données simulées pour les graphiques
  const emotionData = [
    { day: 'Lun', joie: 65, calme: 80, energie: 45, stress: 30, focus: 70 },
    { day: 'Mar', joie: 70, calme: 75, energie: 60, stress: 25, focus: 75 },
    { day: 'Mer', joie: 80, calme: 70, energie: 85, stress: 40, focus: 80 },
    { day: 'Jeu', joie: 75, calme: 85, energie: 70, stress: 20, focus: 85 },
    { day: 'Ven', joie: 90, calme: 80, energie: 90, stress: 15, focus: 90 },
    { day: 'Sam', joie: 95, calme: 90, energie: 75, stress: 10, focus: 60 },
    { day: 'Dim', joie: 85, calme: 95, energie: 50, stress: 5, focus: 70 }
  ];

  const activityData = [
    { day: 'Lun', meditation: 20, exercise: 45, journal: 15, music: 60 },
    { day: 'Mar', meditation: 25, exercise: 30, journal: 20, music: 45 },
    { day: 'Mer', meditation: 30, exercise: 60, journal: 25, music: 75 },
    { day: 'Jeu', meditation: 15, exercise: 40, journal: 30, music: 50 },
    { day: 'Ven', meditation: 35, exercise: 55, journal: 10, music: 90 },
    { day: 'Sam', meditation: 40, exercise: 75, journal: 35, music: 120 },
    { day: 'Dim', meditation: 45, exercise: 30, journal: 40, music: 80 }
  ];

  const performanceData = [
    { day: 'Lun', productivity: 75, creativity: 60, wellbeing: 70, social: 40 },
    { day: 'Mar', productivity: 80, creativity: 70, wellbeing: 75, social: 55 },
    { day: 'Mer', productivity: 85, creativity: 85, wellbeing: 80, social: 70 },
    { day: 'Jeu', productivity: 90, creativity: 80, wellbeing: 85, social: 75 },
    { day: 'Ven', productivity: 85, creativity: 90, wellbeing: 90, social: 85 },
    { day: 'Sam', productivity: 60, creativity: 95, wellbeing: 95, social: 90 },
    { day: 'Dim', productivity: 70, creativity: 85, wellbeing: 90, social: 80 }
  ];

  const currentData = useMemo(() => {
    switch (selectedMetric) {
      case 'emotions': return emotionData;
      case 'activities': return activityData;
      case 'performance': return performanceData;
      default: return emotionData;
    }
  }, [selectedMetric]);

  const metrics = {
    emotions: {
      title: 'Émotions',
      colors: { joie: '#fbbf24', calme: '#3b82f6', energie: '#ef4444', stress: '#8b5cf6', focus: '#10b981' },
      keys: ['joie', 'calme', 'energie', 'stress', 'focus']
    },
    activities: {
      title: 'Activités',
      colors: { meditation: '#8b5cf6', exercise: '#ef4444', journal: '#10b981', music: '#f59e0b' },
      keys: ['meditation', 'exercise', 'journal', 'music']
    },
    performance: {
      title: 'Performance',
      colors: { productivity: '#3b82f6', creativity: '#f59e0b', wellbeing: '#10b981', social: '#ec4899' },
      keys: ['productivity', 'creativity', 'wellbeing', 'social']
    }
  };

  const currentMetricConfig = metrics[selectedMetric];

  // Calcul des insights
  const insights = useMemo(() => {
    const avgScores = currentMetricConfig.keys.reduce((acc, key) => {
      acc[key] = Math.round(currentData.reduce((sum, day) => sum + day[key], 0) / currentData.length);
      return acc;
    }, {});

    const bestDay = currentData.reduce((best, day) => {
      const dayTotal = currentMetricConfig.keys.reduce((sum, key) => sum + day[key], 0);
      const bestTotal = currentMetricConfig.keys.reduce((sum, key) => sum + best[key], 0);
      return dayTotal > bestTotal ? day : best;
    });

    const improvement = currentMetricConfig.keys.map(key => {
      const weekStart = currentData[0][key];
      const weekEnd = currentData[currentData.length - 1][key];
      return { key, change: weekEnd - weekStart, percentage: Math.round(((weekEnd - weekStart) / weekStart) * 100) };
    }).filter(item => item.change > 0);

    return { avgScores, bestDay, improvement };
  }, [currentData, currentMetricConfig]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Weekly Bars
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Analyse visuelle de ta semaine avec des graphiques intelligents
          </p>
        </motion.div>

        {/* Contrôles */}
        <Card className="bg-black/50 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Cette semaine</SelectItem>
                    <SelectItem value="last">Semaine dernière</SelectItem>
                    <SelectItem value="2weeks">Il y a 2 semaines</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emotions">🎭 Émotions</SelectItem>
                    <SelectItem value="activities">🏃 Activités</SelectItem>
                    <SelectItem value="performance">📈 Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'bars' ? 'default' : 'outline'}
                  onClick={() => setViewMode('bars')}
                  size="sm"
                  data-testid="view-bars"
                >
                  📊 Barres
                </Button>
                <Button
                  variant={viewMode === 'lines' ? 'default' : 'outline'}
                  onClick={() => setViewMode('lines')}
                  size="sm"
                  data-testid="view-lines"
                >
                  📈 Lignes
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique principal */}
          <div className="lg:col-span-2">
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  {currentMetricConfig.title} - Vue hebdomadaire
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Évolution quotidienne de tes métriques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'bars' ? (
                      <BarChart data={currentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #6b7280',
                            borderRadius: '8px'
                          }}
                        />
                        {currentMetricConfig.keys.map((key) => (
                          <Bar 
                            key={key} 
                            dataKey={key} 
                            fill={currentMetricConfig.colors[key]}
                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                          />
                        ))}
                      </BarChart>
                    ) : (
                      <LineChart data={currentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #6b7280',
                            borderRadius: '8px'
                          }}
                        />
                        {currentMetricConfig.keys.map((key) => (
                          <Line 
                            key={key} 
                            type="monotone" 
                            dataKey={key} 
                            stroke={currentMetricConfig.colors[key]}
                            strokeWidth={2}
                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                          />
                        ))}
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau insights */}
          <div className="space-y-6">
            {/* Moyennes */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">📊 Moyennes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(insights.avgScores).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-purple-200 capitalize">{key}:</span>
                      <Badge 
                        style={{ backgroundColor: currentMetricConfig.colors[key] }}
                        className="text-white font-bold"
                      >
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meilleur jour */}
            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Meilleur jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {insights.bestDay.day}
                  </div>
                  <div className="space-y-1">
                    {currentMetricConfig.keys.map((key) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-300 capitalize">{key}:</span>
                        <span className="text-white font-bold">
                          {insights.bestDay[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Améliorations */}
            <Card className="bg-black/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Progressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights.improvement.length > 0 ? (
                  <div className="space-y-3">
                    {insights.improvement.map((item) => (
                      <div key={item.key} className="flex justify-between items-center">
                        <span className="text-purple-200 capitalize">{item.key}:</span>
                        <div className="text-right">
                          <div className="text-green-400 font-bold">
                            +{item.change}
                          </div>
                          <div className="text-xs text-green-300">
                            (+{item.percentage}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">
                    Aucune progression détectée cette semaine
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-black/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">⚡ Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Définir objectifs
                </Button>
                <Button className="w-full" variant="outline">
                  📱 Partager résultats
                </Button>
                <Button className="w-full" variant="outline">
                  🔔 Rappels quotidiens
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Légende des couleurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400">🎨 Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                {currentMetricConfig.keys.map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: currentMetricConfig.colors[key] }}
                    />
                    <span className="text-white capitalize text-sm">{key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WeeklyBarsPage;
