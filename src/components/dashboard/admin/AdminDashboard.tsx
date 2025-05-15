
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPosition, KpiCardProps } from '@/types/dashboard';
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import EmotionalAnalysisTab from './tabs/EmotionalAnalysisTab';
import UsageStatisticsTab from './tabs/UsageStatisticsTab';
import TeamManagementTab from './tabs/TeamManagementTab';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Example KPI data
  const kpiCards: KpiCardProps[] = [
    {
      title: "Utilisateurs Actifs",
      value: "324",
      delta: {
        value: 22.4,
        trend: 'up',
        label: 'depuis le dernier mois'
      },
      status: 'positive'
    },
    {
      title: "Score émotionnel moyen",
      value: "76/100",
      delta: {
        value: 3.2,
        trend: 'down',
        label: 'depuis le dernier mois'
      },
      status: 'negative'
    },
    {
      title: "Sessions VR",
      value: "156",
      delta: {
        value: 18.9,
        trend: 'up',
        label: 'depuis le dernier mois'
      },
      status: 'positive'
    },
    {
      title: "Alertes",
      value: "3",
      delta: {
        value: 0,
        trend: 'neutral',
        label: 'stable'
      },
      status: 'neutral'
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
