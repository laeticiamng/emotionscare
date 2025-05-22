
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmotionChart from '@/components/emotion/EmotionChart';
import EmotionCalendar from '@/components/emotion/EmotionCalendar';
import EmotionSummary from '@/components/emotion/EmotionSummary';

const mockEmotionData = [
  { date: '2025-05-16', emotion: 'happy', intensity: 8, notes: 'Great day at work' },
  { date: '2025-05-17', emotion: 'sad', intensity: 5, notes: 'Missing friends' },
  { date: '2025-05-18', emotion: 'anxious', intensity: 7, notes: 'Upcoming presentation' },
  { date: '2025-05-19', emotion: 'calm', intensity: 6, notes: 'Meditation session' },
  { date: '2025-05-20', emotion: 'frustrated', intensity: 4, notes: 'Technical issues' },
  { date: '2025-05-21', emotion: 'happy', intensity: 7, notes: 'Good news received' },
  { date: '2025-05-22', emotion: 'calm', intensity: 8, notes: 'Productive day' },
];

const B2CEmotionProgressPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progression émotionnelle</h1>
        <p className="text-muted-foreground mt-2">
          Suivez l'évolution de vos émotions et de votre bien-être au fil du temps.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résumé du mois</CardTitle>
        </CardHeader>
        <CardContent>
          <EmotionSummary data={mockEmotionData} />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Graphique</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <EmotionChart data={mockEmotionData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <EmotionCalendar data={mockEmotionData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Tendances et observations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-1 rounded mr-2 text-xs">+</span>
              <span>Amélioration de l'humeur générale de 15% par rapport au mois précédent</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 p-1 rounded mr-2 text-xs">i</span>
              <span>Vos séances de méditation semblent être suivies de jours plus calmes</span>
            </li>
            <li className="flex items-start">
              <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 p-1 rounded mr-2 text-xs">!</span>
              <span>Les lundis sont généralement les jours où vous ressentez le plus d'anxiété</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Méditation guidée</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Pour réduire l'anxiété observée les lundis, essayez une séance de méditation matinale.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Activité physique</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  Une activité physique régulière semble améliorer considérablement votre humeur.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CEmotionProgressPage;
