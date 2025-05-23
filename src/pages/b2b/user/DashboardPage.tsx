
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Users, Calendar, BarChart2, MessageSquare } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Simuler des données d'équipe
  const teamMembers = [
    { id: 1, name: 'Sophie Martin', role: 'Responsable RH', score: 82 },
    { id: 2, name: 'Thomas Bernard', role: 'Développeur', score: 75 },
    { id: 3, name: 'Julie Dubois', role: 'Designer', score: 88 },
    { id: 4, name: 'Marc Leroy', role: 'Chef de Projet', score: 70 },
  ];
  
  // Simuler des données des séances
  const sessions = [
    { id: 1, title: 'Méditation collective', date: '2023-06-15', participants: 8 },
    { id: 2, title: 'Gestion du stress', date: '2023-06-20', participants: 12 },
    { id: 3, title: 'Relaxation guidée', date: '2023-06-25', participants: 6 },
  ];
  
  const renderSkeletons = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Collaborateur</h1>
          <p className="text-muted-foreground">Bienvenue, {user?.name || 'Utilisateur'}</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          {user?.company?.name || 'Votre entreprise'}
        </Badge>
      </div>
      
      {isLoading ? renderSkeletons() : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Score bien-être équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">78/100</div>
                  <span className="ml-2 text-green-500 text-sm">+3%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Moyenne de l'équipe en hausse</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Prochaine séance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">Gestion du stress</p>
                <p className="text-sm text-muted-foreground">Demain à 14:00 | 12 participants</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Messages non lus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p className="text-lg font-medium">3 nouveaux messages</p>
                  <Button size="sm" variant="ghost">Voir</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="team" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="team">Équipe</TabsTrigger>
              <TabsTrigger value="sessions">Séances</TabsTrigger>
              <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            </TabsList>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Membres de l'équipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={member.score > 80 ? "success" : "default"} className="bg-green-100 text-green-800 hover:bg-green-100">
                            Score: {member.score}
                          </Badge>
                          <Button size="sm" variant="outline">Voir détails</Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <Button variant="outline">Voir tous les membres</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Séances programmées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions.length > 0 ? (
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString('fr-FR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">
                              {session.participants} participants
                            </Badge>
                            <Button size="sm" variant="outline">S'inscrire</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Aucune séance programmée"
                      description="Il n'y a actuellement aucune séance programmée pour votre équipe."
                      action={{
                        label: "Planifier une séance",
                        onClick: () => alert("Fonctionnalité à implémenter")
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Analytiques d'équipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <p>Graphique d'évolution du bien-être de l'équipe</p>
                      <Button className="mt-4" variant="outline">Voir tous les rapports</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default B2BUserDashboard;
