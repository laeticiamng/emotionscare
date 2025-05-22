
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BarChart, PlusCircle, ExternalLink } from 'lucide-react';

const Session: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et accédez à vos sessions de thérapie et de bien-être
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Créer une session
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passées</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6">
            {[1, 2].map((id) => (
              <Card key={id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Session {id === 1 ? "de méditation" : "de relaxation"}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {id === 1 ? "Demain" : "Dans 3 jours"}, {id === 1 ? "15:00" : "10:30"}
                      </CardDescription>
                    </div>
                    <Badge variant={id === 1 ? "default" : "outline"}>
                      {id === 1 ? "Confirmée" : "En attente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{id === 1 ? "45 minutes" : "30 minutes"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {id === 1 
                      ? "Session guidée pour réduire le stress et améliorer votre concentration." 
                      : "Techniques de respiration et exercices pour favoriser la détente profonde."}
                  </p>
                  <div className="flex gap-3 mt-2">
                    <Button variant="outline" size="sm">Modifier</Button>
                    <Button variant="default" size="sm">Rejoindre</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* État vide pour remplir la liste */}
            <Card className="border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Programmer une nouvelle session</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choisissez un créneau qui vous convient pour votre prochaine séance
                </p>
                <Button>Voir les disponibilités</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessions passées</CardTitle>
              <CardDescription>
                Historique de vos sessions précédentes
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">
                Vous n'avez pas encore assisté à des sessions.
              </p>
              <Button variant="outline" className="mt-4">
                Voir des exemples de sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de progression</CardTitle>
              <CardDescription>
                Visualisez l'impact des sessions sur votre bien-être
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex justify-center items-center h-60 bg-muted/20 rounded-md border">
                <div className="text-center">
                  <BarChart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Les analyses seront disponibles après votre première session
                  </p>
                  <Button variant="link" className="mt-2">
                    En savoir plus <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Session;
