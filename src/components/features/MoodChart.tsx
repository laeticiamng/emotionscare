import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';

interface MoodData {
  day: string;
  mood: number;
  energy: number;
  stress: number;
}

interface MoodChartProps {
  data?: MoodData[];
  period?: 'week' | 'month';
}

const MoodChart: React.FC<MoodChartProps> = ({ 
  data = [
    { day: 'Lun', mood: 7, energy: 8, stress: 3 },
    { day: 'Mar', mood: 6, energy: 6, stress: 5 },
    { day: 'Mer', mood: 8, energy: 9, stress: 2 },
    { day: 'Jeu', mood: 5, energy: 4, stress: 7 },
    { day: 'Ven', mood: 9, energy: 8, stress: 2 },
    { day: 'Sam', mood: 8, energy: 7, stress: 3 },
    { day: 'Dim', mood: 7, energy: 6, stress: 4 }
  ],
  period = 'week'
}) => {
  const maxValue = 10;
  const averageMood = Math.round(data.reduce((sum, item) => sum + item.mood, 0) / data.length * 10) / 10;
  const trend = data[data.length - 1].mood - data[0].mood;

  const getBarColor = (value: number, type: 'mood' | 'energy' | 'stress') => {
    if (type === 'stress') {
      if (value >= 7) return 'bg-red-500';
      if (value >= 4) return 'bg-yellow-500';
      return 'bg-green-500';
    } else {
      if (value >= 8) return 'bg-green-500';
      if (value >= 6) return 'bg-yellow-500';
      if (value >= 4) return 'bg-orange-500';
      return 'bg-red-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Évolution Émotionnelle
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {period === 'week' ? '7 jours' : '30 jours'}
            </Badge>
            {trend !== 0 && (
              <Badge variant={trend > 0 ? "default" : "secondary"}>
                <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {trend > 0 ? '+' : ''}{trend}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{averageMood}</div>
            <div className="text-xs text-muted-foreground">Humeur moyenne</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(data.reduce((sum, item) => sum + item.energy, 0) / data.length * 10) / 10}
            </div>
            <div className="text-xs text-muted-foreground">Énergie moyenne</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-600">
              {Math.round(data.reduce((sum, item) => sum + item.stress, 0) / data.length * 10) / 10}
            </div>
            <div className="text-xs text-muted-foreground">Stress moyen</div>
          </div>
        </div>

        {/* Graphique en barres */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Excellente humeur</span>
            <span className="text-muted-foreground">10</span>
          </div>
          
          <div className="space-y-3">
            {data.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 text-xs font-medium text-muted-foreground">
                  {item.day}
                </div>
                
                <div className="flex-1 space-y-1">
                  {/* Barre d'humeur */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.mood / maxValue) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                        className={`h-full ${getBarColor(item.mood, 'mood')} rounded-full`}
                      />
                    </div>
                    <div className="w-6 text-xs text-right">{item.mood}</div>
                  </div>
                  
                  {/* Mini barres énergie et stress */}
                  <div className="flex gap-1">
                    <div className="flex-1 bg-muted rounded-full h-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.energy / maxValue) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                        className={`h-full ${getBarColor(item.energy, 'energy')} rounded-full opacity-60`}
                      />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.stress / maxValue) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                        className={`h-full ${getBarColor(item.stress, 'stress')} rounded-full opacity-60`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Humeur difficile</span>
            <span className="text-muted-foreground">1</span>
          </div>
        </div>

        {/* Légende */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Humeur</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-green-500 rounded-full opacity-60"></div>
            <span>Énergie</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-red-500 rounded-full opacity-60"></div>
            <span>Stress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;