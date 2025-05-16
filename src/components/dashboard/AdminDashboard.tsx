
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminTabContent from '@/components/dashboard/admin/AdminTabContent';

interface AdminDashboardProps {
  className?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`space-y-6 ${className}`}>
      <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="gamification">Gamification</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <AdminTabContent value="overview" title="Vue d'ensemble" description="Aperçu global de la plateforme">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2,841</p>
                <p className="text-xs text-muted-foreground">+15% depuis le mois dernier</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessions quotidiennes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12,483</p>
                <p className="text-xs text-muted-foreground">+7% depuis la semaine dernière</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scans émotionnels</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">8,674</p>
                <p className="text-xs text-muted-foreground">5,234 heures d'analyse</p>
              </CardContent>
            </Card>
          </div>
        </AdminTabContent>
        
        <AdminTabContent value="emotions" title="Analyse émotionnelle" description="Aperçu des données émotionnelles des utilisateurs">
          <p>Contenu du tab émotions</p>
        </AdminTabContent>
        
        <AdminTabContent value="users" title="Gestion des utilisateurs" description="Liste et gestion des utilisateurs de la plateforme">
          <p>Contenu du tab utilisateurs</p>
        </AdminTabContent>
        
        <AdminTabContent value="gamification" title="Gamification" description="Défis, badges et tableau de classement">
          <p>Contenu du tab gamification</p>
        </AdminTabContent>
        
        <AdminTabContent value="analytics" title="Analytics" description="Statistiques détaillées et rapports">
          <p>Contenu du tab analytics</p>
        </AdminTabContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
