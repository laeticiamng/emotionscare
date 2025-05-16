
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,245</div>
                <p className="text-sm text-muted-foreground">+12% ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Équipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28</div>
                <p className="text-sm text-muted-foreground">2 nouvelles équipes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3,512</div>
                <p className="text-sm text-muted-foreground">+5% cette semaine</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Interface de gestion des utilisateurs à implémenter ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Interface de gestion des équipes à implémenter ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'application</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Paramètres globaux de l'application à implémenter ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
