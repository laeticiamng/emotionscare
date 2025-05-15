
import React from 'react';
import { GridPosition } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { generateMoodData, generateAlerts } from '@/lib/mockDataGenerator';
import DraggableKpiCardsGrid from '../DraggableKpiCardsGrid';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  position: GridPosition; // Using the updated type
}

interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
}

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ kpiCards }) => {
  // Sample data for charts
  const moodData = generateMoodData(30);
  const alerts = generateAlerts();
  
  const widgetCards = [
    {
      title: "Tendance émotionnelle",
      description: "Évolution du score émotionnel global",
      position: { x: 0, y: 1, w: 2, h: 1 },
      content: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Score" />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Alertes récentes",
      description: "Dernières alertes émotionnelles",
      position: { x: 2, y: 1, w: 2, h: 1 },
      content: (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-2 rounded-md ${
              alert.type === 'danger' ? 'bg-red-100 text-red-800' :
              alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              alert.type === 'info' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              <div className="font-medium">{alert.message}</div>
              <div className="text-xs">{new Date(alert.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Utilisation par département",
      description: "Taux d'activité par département",
      position: { x: 0, y: 2, w: 2, h: 1 },
      content: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[
            {name: 'Marketing', value: 85},
            {name: 'RH', value: 92},
            {name: 'Dev', value: 78},
            {name: 'Finance', value: 62},
            {name: 'Support', value: 70}
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Utilisation %" />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Sessions VR",
      description: "Statistiques des sessions immersives",
      position: { x: 2, y: 2, w: 2, h: 1 },
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-2xl font-bold">156</div>
              <div className="text-xs text-muted-foreground">Total sessions</div>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-2xl font-bold">22.5%</div>
              <div className="text-xs text-muted-foreground">Hausse mensuelle</div>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-2xl font-bold">4.2/5</div>
              <div className="text-xs text-muted-foreground">Note moyenne</div>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-2xl font-bold">18m</div>
              <div className="text-xs text-muted-foreground">Durée moyenne</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <DraggableKpiCardsGrid cards={kpiCards} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {widgetCards.map((card, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
