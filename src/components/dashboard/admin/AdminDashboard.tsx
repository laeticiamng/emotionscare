
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPosition } from '@/types';
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import EmotionalAnalysisTab from './tabs/EmotionalAnalysisTab';
import UsageStatisticsTab from './tabs/UsageStatisticsTab';
import TeamManagementTab from './tabs/TeamManagementTab';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  position: GridPosition; // Fixed type
}

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Example KPI data
  const kpiCards: KpiCardProps[] = [
    {
      title: "Utilisateurs Actifs",
      value: "324",
      delta: 22.4, // Positive delta
      position: { x: 0, y: 0, w: 1, h: 1 }
    },
    {
      title: "Score émotionnel moyen",
      value: "76/100",
      delta: -3.2, // Negative delta
      position: { x: 1, y: 0, w: 1, h: 1 }
    },
    {
      title: "Sessions VR",
      value: "156",
      delta: 18.9,
      position: { x: 2, y: 0, w: 1, h: 1 }
    },
    {
      title: "Alertes",
      value: "3",
      delta: 0, // Neutral delta
      position: { x: 3, y: 0, w: 1, h: 1 }
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord administrateur</h1>
      
      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotional">Analyse émotionnelle</TabsTrigger>
          <TabsTrigger value="usage">Statistiques d'utilisation</TabsTrigger>
          <TabsTrigger value="teams">Gestion des équipes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <GlobalOverviewTab kpiCards={kpiCards} />
        </TabsContent>
        
        <TabsContent value="emotional">
          <EmotionalAnalysisTab />
        </TabsContent>
        
        <TabsContent value="usage">
          <UsageStatisticsTab />
        </TabsContent>
        
        <TabsContent value="teams">
          <TeamManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
