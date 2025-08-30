import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Filter, Download, 
  TrendingUp, Brain, Heart, Zap, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface HeatmapData {
  date: string;
  value: number;
  emotion: string;
  intensity: number;
  activities: string[];
}

interface EmotionStat {
  emotion: string;
  percentage: number;
  change: number;
  color: string;
  icon: string;
}

const HeatmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('emotion');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Générer des données de heatmap pour les 30 derniers jours
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    const emotions = ['happy', 'calm', 'anxious', 'excited', 'tired', 'focused', 'stressed'];
    const activities = ['meditation', 'vr', 'journal', 'music', 'scan'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.random() * 10,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.random() * 5 + 1,
        activities: activities.filter(() => Math.random() > 0.7),
      });
    }
    return data;
  };

  const [heatmapData] = useState<HeatmapData[]>(generateHeatmapData());
  
  const [emotionStats] = useState<EmotionStat[]>([
    { emotion: 'Heureux', percentage: 32, change: 5, color: 'bg-yellow-200', icon: '😊' },
    { emotion: 'Calme', percentage: 28, change: 2, color: 'bg-blue-200', icon: '😌' },
    { emotion: 'Énergique', percentage: 18, change: -3, color: 'bg-orange-200', icon: '⚡' },
    { emotion: 'Anxieux', percentage: 12, change: -2, color: 'bg-red-200', icon: '😰' },
    { emotion: 'Fatigué', percentage: 10, change: -2, color: 'bg-gray-200', icon: '😴' },
  ]);

  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 1) return 'bg-green-100';
    if (intensity <= 2) return 'bg-green-200';
    if (intensity <= 3) return 'bg-yellow-200';
    if (intensity <= 4) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getEmotionColor = (emotion: string): string => {
    const colors: { [key: string]: string } = {
      happy: 'bg-yellow-300',
      calm: 'bg-blue-300',
      anxious: 'bg-red-300',
      excited: 'bg-orange-300',
      tired: 'bg-gray-300',
      focused: 'bg-purple-300',
      stressed: 'bg-red-400',
    };
    return colors[emotion] || 'bg-gray-200';
  };

  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };

  const getWeekNumber = (dateStr: string): number => {
    const date = new Date(dateStr);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  // Organiser les données par semaines
  const organizeDataByWeeks = () => {
    const weeks: { [key: number]: HeatmapData[] } = {};
    heatmapData.forEach(data => {
      const week = getWeekNumber(data.date);
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(data);
    });
    return Object.values(weeks);
  };

  const weeklyData = organizeDataByWeeks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Carte Émotionnelle</h1>
              <p className="text-sm text-muted-foreground">Visualisation de vos états émotionnels</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Contrôles */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emotion">Par émotion</SelectItem>
              <SelectItem value="intensity">Par intensité</SelectItem>
              <SelectItem value="activity">Par activité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Heatmap Principal */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Statistiques Rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Bien-être moyen</p>
              </Card>
              <Card className="p-4 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Jours positifs</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-sm text-muted-foreground">Amélioration</p>
              </Card>
              <Card className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
              </Card>
            </div>

            {/* Heatmap Grid */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Activité Émotionnelle - 30 derniers jours</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>Faible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                    <span>Moyen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-300 rounded"></div>
                    <span>Élevé</span>
                  </div>
                </div>
              </div>

              {/* Jours de la semaine */}
              <div className="mb-4">
                <div className="grid grid-cols-8 gap-1 text-xs text-muted-foreground">
                  <div></div>
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mer</div>
                  <div>Jeu</div>
                  <div>Ven</div>
                  <div>Sam</div>
                  <div>Dim</div>
                </div>
              </div>

              {/* Grille heatmap */}
              <div className="space-y-1">
                {weeklyData.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-8 gap-1">
                    <div className="text-xs text-muted-foreground pr-2">
                      Sem {weekIndex + 1}
                    </div>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const data = week[dayIndex];
                      if (!data) return <div key={dayIndex} className="w-4 h-4"></div>;
                      
                      const color = selectedView === 'emotion' 
                        ? getEmotionColor(data.emotion)
                        : getIntensityColor(data.intensity);
                      
                      return (
                        <motion.div
                          key={data.date}
                          className={`w-4 h-4 rounded-sm cursor-pointer ${color} hover:ring-2 hover:ring-purple-300 transition-all`}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => setSelectedDate(data.date)}
                          title={`${data.date}: ${data.emotion} (${data.intensity.toFixed(1)})`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Détail du jour sélectionné */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-purple-50 rounded-lg border"
                >
                  {(() => {
                    const dayData = heatmapData.find(d => d.date === selectedDate);
                    if (!dayData) return null;
                    
                    return (
                      <div>
                        <h3 className="font-semibold mb-2">
                          {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Émotion:</span>
                            <p className="font-semibold capitalize">{dayData.emotion}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Intensité:</span>
                            <p className="font-semibold">{dayData.intensity.toFixed(1)}/5</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Activités:</span>
                            <p className="font-semibold">{dayData.activities.length}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score:</span>
                            <p className="font-semibold">{dayData.value.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </Card>

            {/* Patterns Temporels */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Patterns Temporels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    Meilleures heures
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">8h - 10h</span>
                      <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">14h - 16h</span>
                      <Badge className="bg-blue-100 text-blue-700">Bon</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-500" />
                    Heures difficiles
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm">11h - 12h</span>
                      <Badge className="bg-orange-100 text-orange-700">Attention</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">18h - 19h</span>
                      <Badge className="bg-red-100 text-red-700">Difficile</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Statistiques */}
          <div className="space-y-6">
            
            {/* Distribution des Émotions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Distribution des Émotions</h3>
              <div className="space-y-3">
                {emotionStats.map((stat) => (
                  <div key={stat.emotion}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <span>{stat.icon}</span>
                        {stat.emotion}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">{stat.percentage}%</span>
                        <span className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stat.color}`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommandations */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold mb-3 text-purple-900">💡 Recommandations</h3>
              <div className="space-y-2 text-sm text-purple-700">
                <p>• Vos matinées sont vos moments les plus productifs</p>
                <p>• Planifiez une pause méditation vers 11h</p>
                <p>• Évitez les tâches stressantes après 18h</p>
                <p>• Votre bien-être s'améliore de 12% ce mois-ci !</p>
              </div>
            </Card>

            {/* Objectifs de la Semaine */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">🎯 Objectifs</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Jours positifs</span>
                  <span className="font-semibold">6/7</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Sessions bien-être</span>
                  <span className="font-semibold">12/15</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Stabilité émotionnelle</span>
                  <span className="font-semibold">85%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;