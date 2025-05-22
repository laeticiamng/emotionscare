
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, PieChart, Calendar, MessageSquare } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Équipe</h1>
        <Button>Inviter un membre</Button>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Membres
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" /> Performance
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Événements
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Discussions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="mt-6">
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
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des événements</CardTitle>
              <CardDescription>Réunions et événements à venir</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Aucun événement planifié pour le moment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussions">
          <Card>
            <CardHeader>
              <CardTitle>Discussions d'équipe</CardTitle>
              <CardDescription>Échanges et communications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                Les discussions d'équipe seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;
