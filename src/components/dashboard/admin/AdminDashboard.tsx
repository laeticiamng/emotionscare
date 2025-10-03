
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, Users, Calendar, TrendingUp, Layers } from 'lucide-react';
import StatsCard from '../StatsCard';

// Import the correct components or create them
const AdminTeamsTab = () => <div>Contenu de l'onglet Équipes</div>;
const AdminEventsTab = () => <div>Contenu de l'onglet Événements</div>;
const AdminAnalyticsTab = () => <div>Contenu de l'onglet Analytiques</div>;
const AdminResourcesTab = () => <div>Contenu de l'onglet Ressources</div>;

interface AdminTabContentProps {
  children: React.ReactNode;
  value: string;
  title: string;
}

const AdminTabContent = ({ children, value, title }: AdminTabContentProps) => (
  <TabsContent value={value} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Utilisateurs actifs"
        value="1,234"
        description="+12% ce mois"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard 
        title="Entrées journal"
        value="5,423"
        description="+8% cette semaine"
        icon={<Layers className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard 
        title="Sessions coach"
        value="892"
        description="+19% depuis le lancement"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard 
        title="Engagement moyen"
        value="24.5 min"
        description="+3.2% ce mois"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>

    <Card>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  </TabsContent>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Administration
          </h2>
          <p className="text-muted-foreground">
            Tableau de bord de gestion EmotionsCare
          </p>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
            <span className="inline sm:hidden">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Équipes</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Événements</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytiques</span>
            <span className="inline sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Ressources</span>
          </TabsTrigger>
        </TabsList>
        
        <AdminTabContent value="overview" title="Vue d'ensemble">
          <div className="grid gap-6">
            <h3 className="text-lg font-medium">Aperçu de l'activité</h3>
            <p className="text-muted-foreground">
              Bienvenue sur le tableau de bord administrateur d'EmotionsCare. Ici vous pouvez gérer les équipes, suivre l'analytique et organiser des événements pour votre organisation.
            </p>
          </div>
        </AdminTabContent>
        
        <AdminTabContent value="teams" title="Équipes">
          <AdminTeamsTab />
        </AdminTabContent>
        
        <AdminTabContent value="events" title="Événements">
          <AdminEventsTab />
        </AdminTabContent>
        
        <AdminTabContent value="analytics" title="Analytiques">
          <AdminAnalyticsTab />
        </AdminTabContent>
        
        <AdminTabContent value="resources" title="Ressources">
          <AdminResourcesTab />
        </AdminTabContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
