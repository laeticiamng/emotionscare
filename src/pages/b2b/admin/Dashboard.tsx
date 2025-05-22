
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Users, Building, Activity, Settings, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Console d'administration</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord administrateur
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
            Nos offres
          </Button>
          <Button size="sm" onClick={() => navigate('/b2b/admin/users')}>
            Gérer les utilisateurs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12 cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">183</div>
            <p className="text-xs text-muted-foreground">75% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">+3% depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+86 cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Rapports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted/20 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Graphique d'évolution du bien-être</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Émotion dominante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">Sérénité (24%)</div>
                    <p className="text-xs text-muted-foreground">Suivi de Satisfaction (18%)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tendance d'humeur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-green-600">En amélioration</div>
                    <p className="text-xs text-muted-foreground">+4% par rapport au mois dernier</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Alertes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">8 utilisateurs</div>
                    <p className="text-xs text-muted-foreground">Nécessitent une attention particulière</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 flex">
                <Button onClick={() => navigate('/b2b/admin/reports')}>
                  Voir le rapport complet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Utilisateurs récents</CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate('/b2b/admin/users')}>
                Voir tous
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Liste des utilisateurs récemment actifs</p>
                <Button className="mt-4" onClick={() => navigate('/b2b/admin/users')}>
                  Gérer les utilisateurs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Rapport mensuel</span>
                    <span className="text-xs text-muted-foreground">Mai 2025</span>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Analyse d'engagement</span>
                    <span className="text-xs text-muted-foreground">Dernier trimestre</span>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Tendances émotionnelles</span>
                    <span className="text-xs text-muted-foreground">Comparaison annuelle</span>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Rapport d'efficacité</span>
                    <span className="text-xs text-muted-foreground">Programme bien-être</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">Informations entreprise</h3>
                  <p className="text-sm text-muted-foreground">Modifier les détails de l'organisation</p>
                </div>
                <Button variant="outline">Gérer</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">Autorisations et rôles</h3>
                  <p className="text-sm text-muted-foreground">Configurer les droits d'accès</p>
                </div>
                <Button variant="outline">Gérer</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">Intégrations</h3>
                  <p className="text-sm text-muted-foreground">Connecter des outils externes</p>
                </div>
                <Button variant="outline">Gérer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboard;
