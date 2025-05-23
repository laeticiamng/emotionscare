
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, Users, Activity, FileText, User, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isLoading, setIsLoading] = useState(true);
  
  // Vérification que l'utilisateur est bien un administrateur
  useEffect(() => {
    if (userMode !== 'b2b_admin' && user?.role !== 'b2b_admin') {
      navigate('/b2b/selection');
    }
  }, [userMode, user, navigate]);
  
  // Simulation du chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Console d'administration</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || 'Administrateur'}! Voici le tableau de bord de l'organisation.
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/b2b/admin/analytics')}
          >
            <Activity className="mr-2 h-4 w-4" />
            Analytiques complètes
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate('/b2b/admin/users')}
          >
            <Users className="mr-2 h-4 w-4" />
            Gestion des utilisateurs
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Utilisateurs actifs', value: '48', icon: Users, color: 'bg-blue-100', textColor: 'text-blue-700' },
          { title: 'Score moyen', value: '72%', icon: Activity, color: 'bg-green-100', textColor: 'text-green-700' },
          { title: 'Sessions cette semaine', value: '184', icon: LineChart, color: 'bg-purple-100', textColor: 'text-purple-700' },
          { title: 'Alertes', value: '3', icon: Shield, color: 'bg-red-100', textColor: 'text-red-700' }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configuration</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances de bien-être</CardTitle>
                <CardDescription>Moyenne sur les 30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-80 bg-muted/40 rounded-md flex items-center justify-center">
                    <LineChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique de tendances</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>Dernières 24 heures</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4 h-80 overflow-auto pr-2">
                    {[
                      { user: "Marie Durand", action: "A complété une analyse émotionnelle", time: "Il y a 10 minutes" },
                      { user: "Pierre Lambert", action: "A rejoint l'espace social", time: "Il y a 45 minutes" },
                      { user: "Sophie Martin", action: "A partagé un message de soutien", time: "Il y a 2 heures" },
                      { user: "Jean-Michel Bernard", action: "A atteint un score de bien-être de 85%", time: "Il y a 3 heures" },
                      { user: "Camille Petit", action: "A effectué 5 analyses cette semaine", time: "Il y a 4 heures" },
                      { user: "Thomas Legrand", action: "S'est connecté après 2 semaines", time: "Il y a 5 heures" },
                    ].map((activity, index) => (
                      <div key={index} className="flex justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Liste des utilisateurs</CardTitle>
                  <CardDescription>Gestion des membres de l'organisation</CardDescription>
                </div>
                <Button>
                  Ajouter un utilisateur
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Département</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {[
                        { name: "Marie Durand", email: "m.durand@entreprise.com", department: "Marketing", score: "82%" },
                        { name: "Pierre Lambert", email: "p.lambert@entreprise.com", department: "Ventes", score: "75%" },
                        { name: "Sophie Martin", email: "s.martin@entreprise.com", department: "RH", score: "91%" },
                        { name: "Jean-Michel Bernard", email: "jm.bernard@entreprise.com", department: "R&D", score: "68%" },
                        { name: "Camille Petit", email: "c.petit@entreprise.com", department: "Support", score: "79%" },
                      ].map((user, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{user.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{user.score}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button variant="ghost" size="sm">
                              Voir
                            </Button>
                            <Button variant="ghost" size="sm">
                              Éditer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'organisation</CardTitle>
              <CardDescription>Configurez les paramètres de votre organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Informations générales</h3>
                  <p className="text-sm text-muted-foreground">
                    Ces informations sont utilisées pour personnaliser l'expérience de vos collaborateurs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom de l'organisation</label>
                      <input type="text" className="w-full p-2 border rounded-md" defaultValue="EmotionsCare Entreprise" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email de contact</label>
                      <input type="email" className="w-full p-2 border rounded-md" defaultValue="contact@emotionscare.fr" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-medium">Paramètres avancés</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuration avancée pour l'administration de la plateforme.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Espace social interne</p>
                        <p className="text-sm text-muted-foreground">Activer l'espace d'échange entre collaborateurs</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                        <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analyses anonymes</p>
                        <p className="text-sm text-muted-foreground">Les utilisateurs peuvent effectuer des analyses anonymes</p>
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                        <div className="h-5 w-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alertes de bien-être</p>
                        <p className="text-sm text-muted-foreground">Notifier les administrateurs en cas de score critique</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                        <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Annuler</Button>
                  <Button>Enregistrer les modifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboardPage;
