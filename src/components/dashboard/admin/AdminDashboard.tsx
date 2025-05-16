
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Activity 
} from 'lucide-react';
import DraggableKpiCardsGrid from './draggable/DraggableKpiCardsGrid';
import { AdminTabContents } from './AdminTabContents';
import { Button } from '@/components/ui/button';
import { DraggableCardProps } from '@/types/widgets';

const AdminDashboard: React.FC = () => {
  // KPI Card data
  const kpiCards: DraggableCardProps[] = [
    {
      id: 'activeUsers',
      title: 'Utilisateurs actifs',
      value: '1,234',
      icon: <Users className="h-4 w-4" />,
      delta: {
        value: 12,
        trend: 'up',
        label: 'vs last week'
      },
      subtitle: 'Utilisateurs uniques',
      status: 'success'
    },
    {
      id: 'totalSessions',
      title: 'Sessions totales',
      value: '5,678',
      icon: <Calendar className="h-4 w-4" />,
      delta: {
        value: 8,
        trend: 'up'
      }
    },
    {
      id: 'avgDuration',
      title: 'Durée moyenne',
      value: '12:34',
      icon: <Clock className="h-4 w-4" />,
      delta: {
        value: 3,
        trend: 'down'
      },
      status: 'warning'
    },
    {
      id: 'completionRate',
      title: 'Taux de complétion',
      value: '87%',
      icon: <BarChart3 className="h-4 w-4" />,
      delta: {
        value: 5,
        trend: 'up'
      }
    },
    {
      id: 'weeklyTrend',
      title: 'Tendance hebdo',
      value: '+23%',
      icon: <TrendingUp className="h-4 w-4" />,
      delta: {
        value: 15,
        trend: 'up'
      },
      status: 'success'
    },
    {
      id: 'emotionalBalance',
      title: 'Score émotionnel',
      value: '72/100',
      icon: <Heart className="h-4 w-4" />,
      delta: {
        value: 4,
        trend: 'up'
      }
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <div className="flex gap-2">
          <Button variant="outline">Télécharger rapport</Button>
          <Button>Nouvelle notification</Button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <section className="mb-8">
        <DraggableKpiCardsGrid cards={kpiCards} />
      </section>

      {/* Tabs Section */}
      <Tabs defaultValue="global" className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="global">Vue globale</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
        </TabsList>
        
        <AdminTabContents />
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
