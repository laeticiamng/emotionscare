
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Layers, Settings } from 'lucide-react';
import { TeamOverviewTab, TeamDetailTab, SettingsTab } from './AdminTabContents';
import { DraggableCardProps } from './draggable/types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample KPI cards data
  const kpiCards: DraggableCardProps[] = [
    {
      id: 'users',
      title: 'Utilisateurs actifs',
      value: '1,204',
      icon: Users,
      delta: {
        value: 12,
        trend: 'up',
        label: 'vs mois dernier'
      },
      subtitle: '85% taux d\'engagement',
      status: 'success'
    },
    {
      id: 'sessions',
      title: 'Sessions journalières',
      value: '348',
      icon: Layers,
      delta: {
        value: 8,
        trend: 'up',
        label: 'vs semaine dernière'
      },
      subtitle: '24 min temps moyen',
      status: 'info'
    },
    {
      id: 'emotions',
      title: 'Bien-être collectif',
      value: '76%',
      icon: Settings,
      delta: {
        value: 5,
        trend: 'up',
        label: 'vs semaine dernière'
      },
      subtitle: 'Basé sur 950 analyses',
      status: 'success'
    },
    {
      id: 'retention',
      title: 'Rétention mensuelle',
      value: '92%',
      icon: Users,
      delta: {
        value: 2,
        trend: 'up',
        label: 'vs mois dernier'
      },
      subtitle: 'Objectif: 95%',
      status: 'warning'
    }
  ];
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Équipes</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <TeamOverviewTab kpiCards={kpiCards} />
            </TabsContent>
            
            <TabsContent value="teams">
              <TeamDetailTab />
            </TabsContent>
            
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
