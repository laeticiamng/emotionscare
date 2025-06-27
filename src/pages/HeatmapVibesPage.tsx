
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Calendar, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const HeatmapVibesPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('mood');

  // Générer des données de heatmap pour un mois
  const generateHeatmapData = () => {
    const data = [];
    const daysInMonth = 30;
    const startDay = 1; // Lundi
    
    for (let week = 0; week < 5; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dayNumber = week * 7 + day - startDay + 1;
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
          const intensity = Math.random();
          const mood = Math.floor(Math.random() * 5) + 1;
          const energy = Math.floor(Math.random() * 5) + 1;
          const productivity = Math.floor(Math.random() * 5) + 1;
          
          weekData.push({
            day: dayNumber,
            intensity,
            mood,
            energy,
            productivity,
            hasData: true
          });
        } else {
          weekData.push({ hasData: false });
        }
      }
      data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const metrics = [
    { key: 'mood', name: 'Humeur', color: 'from-blue-200 to-blue-600' },
    { key: 'energy', name: 'Énergie', color: 'from-yellow-200 to-yellow-600' },
    { key: 'productivity', name: 'Productivité', color: 'from-green-200 to-green-600' }
  ];

  const getIntensityColor = (intensity: number, metric: string) => {
    const colors = {
      mood: ['bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600'],
      energy: ['bg-yellow-100', 'bg-yellow-200', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600'],
      productivity: ['bg-green-100', 'bg-green-200', 'bg-green-400', 'bg-green-500', 'bg-green-600']
    };
    
    const level = Math.floor(intensity * 5);
    return colors[metric as keyof typeof colors][Math.min(level, 4)];
  };

  const monthlyStats = {
    avgMood: 3.8,
    bestStreak: 7,
    totalActive: 28,
    improvement: '+15%'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Thermometer className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Heatmap Vibes
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualisez vos patterns émotionnels et énergétiques avec des cartes de chaleur interactives
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{monthlyStats.avgMood}/5</div>
              <div className="text-sm text-gray-600">Humeur Moyenne</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{monthlyStats.bestStreak}</div>
              <div className="text-sm text-gray-600">Meilleure Série</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{monthlyStats.totalActive}</div>
              <div className="text-sm text-gray-600">Jours Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{monthlyStats.improvement}</div>
              <div className="text-sm text-gray-600">Amélioration</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Heatmap */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    Carte de Chaleur - {metrics.find(m => m.key === selectedMetric)?.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {metrics.map((metric) => (
                      <Button
                        key={metric.key}
                        size="sm"
                        variant={selectedMetric === metric.key ? 'default' : 'outline'}
                        onClick={() => setSelectedMetric(metric.key)}
                      >
                        {metric.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Day labels */}
                  <div className="grid grid-cols-8 gap-1 text-sm text-gray-600">
                    <div></div>
                    {dayNames.map((day) => (
                      <div key={day} className="text-center font-medium">{day}</div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  {heatmapData.map((week, weekIndex) => (
                    <motion.div 
                      key={weekIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: weekIndex * 0.1 }}
                      className="grid grid-cols-8 gap-1"
                    >
                      <div className="text-sm text-gray-600 flex items-center">
                        S{weekIndex + 1}
                      </div>
                      {week.map((dayData, dayIndex) => (
                        <motion.div
                          key={dayIndex}
                          whileHover={{ scale: 1.1 }}
                          className="relative"
                        >
                          {dayData.hasData ? (
                            <div
                              className={`
                                w-8 h-8 rounded cursor-pointer transition-all duration-200
                                ${getIntensityColor(dayData[selectedMetric as keyof typeof dayData] / 5, selectedMetric)}
                                hover:ring-2 hover:ring-purple-400
                              `}
                              title={`Jour ${dayData.day}: ${dayData[selectedMetric as keyof typeof dayData]}/5`}
                            >
                              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-white">
                                {dayData.day}
                              </div>
                            </div>
                          ) : (
                            <div className="w-8 h-8"></div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </div>

                {/* Intensity Scale */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Intensité:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Faible</span>
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-4 h-4 rounded ${getIntensityColor(level / 4, selectedMetric)}`}
                        />
                      ))}
                      <span className="text-xs text-gray-500">Élevée</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Période</label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant={selectedMonth === 'current' ? 'default' : 'outline'}
                      onClick={() => setSelectedMonth('current')}
                    >
                      Ce Mois
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedMonth === 'previous' ? 'default' : 'outline'}
                      onClick={() => setSelectedMonth('previous')}
                    >
                      Mois Précédent
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Pattern Détecté</div>
                    <div className="text-xs text-blue-600">Vos lundis sont généralement plus difficiles</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Amélioration</div>
                    <div className="text-xs text-green-600">+15% d'énergie vs mois dernier</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-purple-800">Recommandation</div>
                    <div className="text-xs text-purple-600">Planifiez des activités relaxantes le dimanche</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Stats Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meilleur jour</span>
                  <Badge>Vendredi</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jour le plus difficile</span>
                  <Badge variant="secondary">Lundi</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consistance</span>
                  <Badge variant="outline">87%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVibesPage;
