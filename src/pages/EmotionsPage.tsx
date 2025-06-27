
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Sun, 
  Cloud,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';

const EmotionsPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const emotions = [
    { id: 'happy', name: 'Joyeux', icon: Smile, color: 'yellow', count: 12 },
    { id: 'calm', name: 'Calme', icon: Sun, color: 'blue', count: 8 },
    { id: 'sad', name: 'Triste', icon: Frown, color: 'gray', count: 3 },
    { id: 'anxious', name: 'Anxieux', icon: Cloud, color: 'red', count: 5 },
    { id: 'neutral', name: 'Neutre', icon: Meh, color: 'green', count: 7 }
  ];

  const weeklyData = [
    { day: 'Lun', mood: 7, energy: 6 },
    { day: 'Mar', mood: 8, energy: 7 },
    { day: 'Mer', mood: 6, energy: 5 },
    { day: 'Jeu', mood: 9, energy: 8 },
    { day: 'Ven', mood: 7, energy: 6 },
    { day: 'Sam', mood: 8, energy: 9 },
    { day: 'Dim', mood: 6, energy: 5 }
  ];

  const insights = [
    {
      title: 'Tendance positive',
      description: 'Votre humeur s\'améliore de 15% cette semaine',
      icon: TrendingUp,
      type: 'positive'
    },
    {
      title: 'Pic d\'énergie',
      description: 'Vous êtes plus énergique les week-ends',
      icon: Activity,
      type: 'info'
    },
    {
      title: 'Recommandation',
      description: 'Essayez la méditation les mercredis',
      icon: Heart,
      type: 'suggestion'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Suivi Émotionnel
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Analysez et comprenez vos patterns émotionnels
          </p>
        </div>

        {/* Période */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Période d'analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {['week', 'month', 'quarter'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === 'week' ? 'Semaine' : 
                   period === 'month' ? 'Mois' : 'Trimestre'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Graphique principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Distribution des émotions */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution des émotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {emotions.map((emotion) => {
                    const IconComponent = emotion.icon;
                    return (
                      <button
                        key={emotion.id}
                        onClick={() => setSelectedEmotion(emotion.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedEmotion === emotion.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`h-8 w-8 mx-auto mb-2 text-${emotion.color}-500`} />
                        <p className="text-sm font-medium">{emotion.name}</p>
                        <p className="text-xs text-gray-500">{emotion.count} fois</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Graphique hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Évolution hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 w-12">Humeur</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(day.mood / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs w-6">{day.mood}/10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-12">Énergie</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(day.energy / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs w-6">{day.energy}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights et statistiques */}
          <div className="space-y-6">
            {/* Résumé */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la semaine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">7.3</div>
                  <p className="text-sm text-gray-600">Humeur moyenne</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">15</div>
                    <p className="text-xs text-gray-600">Jours positifs</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">6.8</div>
                    <p className="text-xs text-gray-600">Énergie moy.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Insights personnalisés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, index) => {
                  const IconComponent = insight.icon;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        insight.type === 'positive' ? 'border-green-200 bg-green-50' :
                        insight.type === 'info' ? 'border-blue-200 bg-blue-50' :
                        'border-purple-200 bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className={`h-4 w-4 ${
                          insight.type === 'positive' ? 'text-green-600' :
                          insight.type === 'info' ? 'text-blue-600' :
                          'text-purple-600'
                        }`} />
                        <h3 className="font-medium text-sm">{insight.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  📊 Voir le rapport détaillé
                </Button>
                <Button className="w-full" variant="outline">
                  📱 Programmer un rappel
                </Button>
                <Button className="w-full" variant="outline">
                  🎯 Définir un objectif
                </Button>
                <Button className="w-full" variant="outline">
                  📧 Partager avec mon coach
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionsPage;
