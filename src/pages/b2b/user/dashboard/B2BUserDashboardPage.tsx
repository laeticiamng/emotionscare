
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Activity, Calendar, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
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
          <h1 className="text-3xl font-bold">Tableau de bord Collaborateur</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || 'Collaborateur'}! Voici votre activité récente.
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/b2b/user/scan')}
          >
            <Activity className="mr-2 h-4 w-4" />
            Nouvelle analyse
          </Button>
          <Button size="sm" onClick={() => navigate('/b2b/user/social')}>
            <Users className="mr-2 h-4 w-4" />
            Espace Social
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Score de bien-être', value: '78%', icon: Activity, color: 'bg-blue-100', textColor: 'text-blue-700' },
          { title: 'Sessions cette semaine', value: '4', icon: Calendar, color: 'bg-purple-100', textColor: 'text-purple-700' },
          { title: 'Collègues actifs', value: '12', icon: Users, color: 'bg-green-100', textColor: 'text-green-700' }
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
      
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytique</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Journal</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Équipe</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Émotions hebdomadaires</CardTitle>
                <CardDescription>Analyse des 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-60 bg-muted/40 rounded-md flex items-center justify-center">
                    <LineChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique des émotions</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>Distribution des émotions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-60 bg-muted/40 rounded-md flex items-center justify-center">
                    <PieChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Graphique en secteurs</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'entrées</CardTitle>
              <CardDescription>Vos notes récentes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { title: "Réunion d'équipe", content: "La réunion s'est bien déroulée, j'ai ressenti un sentiment d'accomplissement." },
                    { title: "Gestion du stress", content: "J'ai pratiqué la méditation pendant 10 minutes avant la présentation." },
                  ].map((entry, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">{entry.title}</h4>
                      <p className="text-muted-foreground text-sm">{entry.content}</p>
                    </div>
                  ))}
                  
                  <Button className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Ajouter une nouvelle entrée
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Membres de l'équipe</CardTitle>
              <CardDescription>Collègues actifs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { name: "Sophie Martin", role: "Responsable RH", avatar: "SM" },
                    { name: "Thomas Dubois", role: "Développeur", avatar: "TD" },
                    { name: "Julie Petit", role: "Designer", avatar: "JP" },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-accent rounded-md">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-4">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Contacter
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboardPage;
