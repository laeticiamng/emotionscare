import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertTriangle,
  Calendar,
  Lightbulb,
  Activity
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Prediction {
  id: string;
  type: 'mood' | 'stress' | 'energy' | 'motivation';
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
}

interface TrendData {
  date: string;
  mood: number;
  stress: number;
  energy: number;
  predicted: number;
}

const PredictiveAnalytics: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'stress' | 'energy'>('mood');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generatePredictions();
    generateTrendData();
  }, []);

  const generatePredictions = () => {
    const mockPredictions: Prediction[] = [
      {
        id: '1',
        type: 'mood',
        value: 75,
        trend: 'up',
        confidence: 89,
        timeframe: '7 prochains jours',
        factors: ['Météo favorable', 'Weekend approchant', 'Projet terminé'],
        recommendations: [
          'Planifiez des activités en extérieur',
          'Maintenez votre routine de sommeil',
          'Profitez de cette période positive'
        ]
      },
      {
        id: '2',
        type: 'stress',
        value: 65,
        trend: 'down',
        confidence: 92,
        timeframe: '3 prochains jours',
        factors: ['Charge de travail élevée', 'Manque de sommeil', 'Réunions importantes'],
        recommendations: [
          'Pratiquez la respiration profonde',
          'Priorisez vos tâches importantes',
          'Prenez des pauses régulières'
        ]
      },
      {
        id: '3',
        type: 'energy',
        value: 80,
        trend: 'stable',
        confidence: 76,
        timeframe: '5 prochains jours',
        factors: ['Routine sportive', 'Alimentation équilibrée', 'Sommeil régulier'],
        recommendations: [
          'Continuez vos bonnes habitudes',
          'Ajoutez une activité énergisante le matin',
          'Hydratez-vous davantage'
        ]
      }
    ];

    setPredictions(mockPredictions);
    setIsLoading(false);
  };

  const generateTrendData = () => {
    const data: TrendData[] = [];
    const baseDate = new Date();
    
    // Données historiques (30 derniers jours)
    for (let i = -30; i <= 0; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        mood: Math.round(60 + Math.random() * 30 + Math.sin(i / 7) * 10),
        stress: Math.round(40 + Math.random() * 40 + Math.cos(i / 5) * 15),
        energy: Math.round(50 + Math.random() * 35 + Math.sin(i / 3) * 12),
        predicted: 0
      });
    }
    
    // Prédictions futures (7 prochains jours)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      const lastValue = data[data.length - 1][selectedMetric];
      const trend = Math.random() > 0.5 ? 1 : -1;
      const predicted = Math.max(0, Math.min(100, lastValue + (Math.random() * 10 * trend)));
      
      data.push({
        date: date.toISOString().split('T')[0],
        mood: 0,
        stress: 0,
        energy: 0,
        predicted: Math.round(predicted)
      });
    }
    
    setTrendData(data);
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'mood': return 'text-blue-600';
      case 'stress': return 'text-red-600';
      case 'energy': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'mood': return <Activity className="h-4 w-4" />;
      case 'stress': return <AlertTriangle className="h-4 w-4" />;
      case 'energy': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Analyses Prédictives IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mood">Humeur</TabsTrigger>
              <TabsTrigger value="stress">Stress</TabsTrigger>
              <TabsTrigger value="energy">Énergie</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedMetric} className="mt-6">
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                      formatter={(value, name) => [
                        `${value}%`, 
                        name === 'predicted' ? 'Prédiction' : 'Historique'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#ff7300"
                      fill="#ff7300"
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Données historiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded border-dashed border-2"></div>
                  <span>Prédictions IA</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMetricIcon(prediction.type)}
                  <h3 className="font-semibold capitalize">{prediction.type}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(prediction.trend)}
                  <Badge variant="outline">
                    {prediction.confidence}% confiance
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Prédiction</span>
                  <span className={`text-2xl font-bold ${getMetricColor(prediction.type)}`}>
                    {prediction.value}%
                  </span>
                </div>
                <Progress value={prediction.value} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {prediction.timeframe}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Facteurs identifiés
                </h4>
                <div className="space-y-1">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  Recommandations
                </h4>
                <div className="space-y-1">
                  {prediction.recommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions Recommandées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Opportunités détectées</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Période favorable pour fixer de nouveaux objectifs</li>
                <li>• Moment idéal pour des activités sociales</li>
                <li>• Énergie stable pour projets personnels</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Points d'attention</h4>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>• Risque de stress en milieu de semaine</li>
                <li>• Prévoir des temps de récupération</li>
                <li>• Surveiller les signaux de fatigue</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button className="w-full md:w-auto">
              Programmer des rappels personnalisés
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
