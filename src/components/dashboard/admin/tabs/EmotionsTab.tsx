
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Progress } from '@/components/ui';

// Simulons quelques données pour le tableau de bord émotionnel
const emotionData = {
  mostCommonEmotions: [
    { name: 'Concentration', percentage: 32, color: 'bg-blue-500' },
    { name: 'Satisfaction', percentage: 24, color: 'bg-green-500' },
    { name: 'Curiosité', percentage: 18, color: 'bg-purple-500' },
    { name: 'Stress', percentage: 14, color: 'bg-amber-500' },
    { name: 'Fatigue', percentage: 12, color: 'bg-red-500' }
  ],
  emotionalBalance: 67,
  weeklyTrend: [
    { day: 'Lun', value: 72 },
    { day: 'Mar', value: 65 },
    { day: 'Mer', value: 74 },
    { day: 'Jeu', value: 62 },
    { day: 'Ven', value: 80 },
  ],
  totalScans: 842,
  averageScore: 6.8
};

const EmotionsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Emotional Balance et Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Émotions communes */}
        <Card>
          <CardHeader>
            <CardTitle>Émotions les plus fréquentes</CardTitle>
            <CardDescription>
              Distribution des émotions signalées par tous les utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emotionData.mostCommonEmotions.map((emotion) => (
                <div key={emotion.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{emotion.name}</span>
                    <span className="text-sm text-muted-foreground">{emotion.percentage}%</span>
                  </div>
                  <Progress
                    value={emotion.percentage}
                    className={`h-2 ${emotion.color}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Équilibre émotionnel */}
        <Card>
          <CardHeader>
            <CardTitle>Équilibre émotionnel global</CardTitle>
            <CardDescription>
              Score moyen de bien-être ressenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              <div 
                className="relative w-48 h-48 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4"
                style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)" }}
              >
                <div 
                  className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold"
                  style={{ boxShadow: "0 4px 20px rgba(66, 153, 225, 0.5)" }}
                >
                  {emotionData.emotionalBalance}%
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Basé sur {emotionData.totalScans} scans émotionnels
                </p>
                <p className="text-sm font-medium mt-2">
                  Score moyen: {emotionData.averageScore}/10
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tendances hebdomadaires */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances hebdomadaires</CardTitle>
          <CardDescription>
            Évolution des scores émotionnels au cours de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-end justify-around">
          {emotionData.weeklyTrend.map((day) => (
            <div key={day.day} className="flex flex-col items-center">
              <div 
                className="w-12 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg"
                style={{ height: `${day.value * 2}px` }}
              ></div>
              <div className="mt-2 text-sm font-medium">{day.day}</div>
              <div className="text-xs text-muted-foreground">{day.value}%</div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Conseils sur les résultats */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Insights & Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              <span className="font-medium">🔍 Observation :</span> Les niveaux de stress sont plus élevés en milieu de semaine (mardi-mercredi).
            </p>
            <p className="text-sm">
              <span className="font-medium">💡 Recommandation :</span> Envisagez de programmer des activités de relaxation guidées ou des pauses bien-être 
              plus fréquentes pendant ces jours pour aider à maintenir l'équilibre émotionnel.
            </p>
            <p className="text-sm">
              <span className="font-medium">📈 Tendance positive :</span> La satisfaction augmente significativement en fin de semaine, ce qui suggère que les 
              projets se terminent bien et que les équipes ressentent un sentiment d'accomplissement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionsTab;
