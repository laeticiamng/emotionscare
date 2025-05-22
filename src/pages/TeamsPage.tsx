
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { UserIcon, Users, Activity, Calendar, ChevronRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';

const TeamsPage = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();

  const isAdmin = userMode === 'b2b_admin';

  return (
    <Shell>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Équipes</h1>
            <p className="text-muted-foreground">Gérez votre équipe et suivez leur performance</p>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Button onClick={() => navigate('/b2b/admin/teams')}>
                Gérer les équipes
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Score émotionnel d'équipe</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+2.5% par rapport à la semaine dernière</p>
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Activité hebdomadaire</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23 sessions</div>
                  <p className="text-xs text-muted-foreground">+5 par rapport à la semaine précédente</p>
                  <div className="mt-4 grid grid-cols-7 gap-1">
                    {[30, 45, 25, 60, 75, 40, 20].map((height, i) => (
                      <div key={i} className="bg-muted-foreground/20 rounded-t-sm">
                        <div
                          className="bg-primary rounded-t-sm w-full"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Prochaine réunion</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Vendredi</div>
                  <p className="text-xs text-muted-foreground">14h00 - Bilan hebdomadaire</p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Voir le calendrier
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>Dernières actions de l'équipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${20 + i}`} />
                      <AvatarFallback>
                        {['SM', 'JD', 'AS'][i - 1]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {['Sophie Martin', 'Jean Dupont', 'Alice Simon'][i - 1]} 
                          <span className="text-muted-foreground font-normal ml-1">
                            {['a terminé une session de méditation', 
                              'a ajouté une entrée de journal',
                              'a partagé un article avec l\'équipe'][i - 1]}
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {['il y a 20 min', 'il y a 1h', 'il y a 3h'][i - 1]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  Voir toutes les activités
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 20}`} />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-medium">
                          {['Sophie Martin', 'Thomas Bernard', 'Claire Dubois', 'Marc Lambert', 'Julie Petit'][i - 1]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {['Responsable RH', 'Lead Developer', 'UX Designer', 'Marketing', 'Support Client'][i - 1]}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline">
                        {['Leadership', 'Technique', 'Créativité', 'Analyse', 'Communication'][i - 1]}
                      </Badge>
                      <Badge variant="outline">
                        {['Gestion', 'Développement', 'Design', 'Stratégie', 'Relationnel'][i - 1]}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="sm">Voir profil</Button>
                      <Button variant="ghost" size="sm">Message</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance de l'équipe</CardTitle>
                <CardDescription>Statistiques et mesures de performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Les données de performance seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Activités d'équipe</CardTitle>
                <CardDescription>Suivi des activités et participation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Les données d'activités seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default TeamsPage;
