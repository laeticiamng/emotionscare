
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Thermometer, TrendingUp, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeatmapCell {
  date: string;
  value: number;
  emotion: string;
  intensity: number;
  events: string[];
}

const HeatmapVibesPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('emotions');
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  // Génération des données de heatmap
  const heatmapData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const emotions = ['joie', 'calme', 'energie', 'stress', 'focus', 'amour'];
    
    const data: HeatmapCell[][] = [];
    
    for (let week = 0; week < 25; week++) {
      const weekData: HeatmapCell[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(2024, 0, week * 7 + day + 1);
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        const value = Math.floor(Math.random() * 100);
        const intensity = Math.floor(Math.random() * 5) + 1;
        
        weekData.push({
          date: date.toISOString().split('T')[0],
          value,
          emotion,
          intensity,
          events: [`Séance ${emotion}`, `Score: ${value}`]
        });
      }
      data.push(weekData);
    }
    
    return data;
  }, [selectedPeriod]);

  // Configuration des couleurs par intensité
  const getHeatmapColor = (value: number, emotion: string) => {
    const intensity = Math.floor((value / 100) * 5);
    const colors = {
      joie: ['#fef3c7', '#fde047', '#facc15', '#eab308', '#ca8a04'],
      calme: ['#dbeafe', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
      energie: ['#fecaca', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
      stress: ['#e5e7eb', '#9ca3af', '#6b7280', '#4b5563', '#374151'],
      focus: ['#d1fae5', '#6ee7b7', '#34d399', '#10b981', '#059669'],
      amour: ['#fce7f3', '#f9a8d4', '#ec4899', '#db2777', '#be185d']
    };
    
    return colors[emotion] ? colors[emotion][intensity] : '#e5e7eb';
  };

  // Statistiques calculées
  const stats = useMemo(() => {
    const flatData = heatmapData.flat();
    const totalDays = flatData.length;
    const activeDays = flatData.filter(cell => cell.value > 0).length;
    const avgIntensity = flatData.reduce((sum, cell) => sum + cell.intensity, 0) / totalDays;
    const maxStreak = 12; // Simulé
    const currentStreak = 7; // Simulé
    
    const emotionCounts = flatData.reduce((acc, cell) => {
      acc[cell.emotion] = (acc[cell.emotion] || 0) + 1;
      return acc;
    }, {});
    
    const topEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    );

    return {
      totalDays,
      activeDays,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      maxStreak,
      currentStreak,
      topEmotion: topEmotion[0],
      completionRate: Math.round((activeDays / totalDays) * 100)
    };
  }, [heatmapData]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🌡️ Heatmap Vibes
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Visualise l'intensité de tes émotions au fil du temps
          </p>
        </motion.div>

        {/* Contrôles */}
        <Card className="bg-black/50 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="3months">3 mois</SelectItem>
                    <SelectItem value="6months">6 mois</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <Thermometer className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emotions">🎭 Émotions</SelectItem>
                    <SelectItem value="activities">🏃 Activités</SelectItem>
                    <SelectItem value="productivity">📈 Productivité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Plein écran
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Heatmap principale */}
          <div className="xl:col-span-3">
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Carte de Chaleur Émotionnelle
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Chaque carré représente un jour, la couleur son intensité émotionnelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Labels des mois */}
                  <div className="flex justify-between text-sm text-gray-400 px-4">
                    {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'].map(month => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>

                  {/* Grille heatmap */}
                  <div className="grid grid-cols-25 gap-1" data-testid="heatmap-grid">
                    {heatmapData.map((week, weekIndex) => 
                      week.map((cell, dayIndex) => (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          className="w-4 h-4 rounded-sm cursor-pointer relative"
                          style={{ backgroundColor: getHeatmapColor(cell.value, cell.emotion) }}
                          whileHover={{ scale: 1.2 }}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => setSelectedCell(cell)}
                          data-testid={`heatmap-cell-${weekIndex}-${dayIndex}`}
                        />
                      ))
                    )}
                  </div>

                  {/* Labels des jours */}
                  <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mt-2">
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                      <span key={day} className="text-center">{day}</span>
                    ))}
                  </div>

                  {/* Légende d'intensité */}
                  <div className="flex items-center gap-4 mt-6">
                    <span className="text-sm text-gray-400">Moins</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map(level => (
                        <div 
                          key={level}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: getHeatmapColor(level * 25, 'joie') }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">Plus</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tooltip sur hover */}
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bg-black/90 text-white p-3 rounded-lg shadow-lg z-50 pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="text-sm">
                  <div className="font-bold">{new Date(hoveredCell.date).toLocaleDateString()}</div>
                  <div>Émotion: {hoveredCell.emotion}</div>
                  <div>Intensité: {hoveredCell.value}/100</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Panneau de statistiques et détails */}
          <div className="space-y-6">
            {/* Statistiques générales */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">📊 Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.activeDays}</div>
                    <div className="text-xs text-purple-200">Jours actifs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
                    <div className="text-xs text-purple-200">Taux de complétion</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                    <div className="text-xs text-purple-200">Série actuelle</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.maxStreak}</div>
                    <div className="text-xs text-purple-200">Meilleure série</div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-300">Intensité moyenne:</span>
                    <Badge variant="secondary">{stats.avgIntensity}/5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Émotion dominante:</span>
                    <Badge className="capitalize">{stats.topEmotion}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails cellule sélectionnée */}
            {selectedCell && (
              <Card className="bg-black/50 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Détails du jour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400">Date</div>
                      <div className="text-white font-bold">
                        {new Date(selectedCell.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Émotion principale</div>
                      <div className="text-white font-bold capitalize">{selectedCell.emotion}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Score d'intensité</div>
                      <div className="text-white font-bold">{selectedCell.value}/100</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Événements</div>
                      <div className="space-y-1">
                        {selectedCell.events.map((event, index) => (
                          <div key={index} className="text-sm text-purple-200">• {event}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tendances */}
            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cette semaine vs dernière:</span>
                    <Badge variant="secondary" className="text-green-400">+12%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Jour le plus actif:</span>
                    <Badge variant="outline">Vendredi</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Période favorite:</span>
                    <Badge variant="outline">Après-midi</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Prochaine étape:</span>
                    <Badge className="bg-purple-500">+3 jours série</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-black/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">⚡ Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" size="sm">
                  📅 Voir calendrier détaillé
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  📈 Générer rapport
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  🎯 Définir objectifs
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  🔔 Rappels quotidiens
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVibesPage;
