
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Tag, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const VR: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expériences immersives</h1>
          <p className="text-muted-foreground">
            Voyagez à travers des environnements virtuels pour votre bien-être
          </p>
        </div>
        <Button>Démarrer une session</Button>
      </div>

      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-muted">
        <div className="absolute inset-0 flex items-center px-6 md:px-10">
          <div className="max-w-xl space-y-4">
            <Badge>Nouveau</Badge>
            <h2 className="text-2xl md:text-3xl font-bold">Forêt méditative</h2>
            <p className="text-sm md:text-base">
              Immergez-vous dans une forêt paisible avec des sons naturels pour une expérience de méditation profonde.
            </p>
            <Button>Commencer l'expérience</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="explore">
        <TabsList>
          <TabsTrigger value="explore">Explorer</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Plage tropicale",
                description: "Relaxez au son des vagues",
                duration: "15 min",
                tags: ["Relaxation", "Nature"]
              },
              {
                title: "Méditation guidée",
                description: "Une session de pleine conscience",
                duration: "20 min",
                tags: ["Méditation", "Guidé"]
              },
              {
                title: "Montagne sereine",
                description: "Admirez des paysages époustouflants",
                duration: "25 min",
                tags: ["Nature", "Calme"]
              },
              {
                title: "Cascade apaisante",
                description: "Écoutez le son de l'eau qui coule",
                duration: "15 min",
                tags: ["Eau", "Nature"]
              },
              {
                title: "Jardin zen",
                description: "Un espace de tranquillité",
                duration: "30 min",
                tags: ["Méditation", "Calme"]
              },
              {
                title: "Aurore boréale",
                description: "Contemplez les lumières du ciel",
                duration: "20 min",
                tags: ["Nuit", "Émerveillement"]
              }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-muted/50 to-muted"></div>
                <CardHeader className="pb-2">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.duration}
                    </div>
                    <Button size="sm">Démarrer</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">
              Aucune expérience favorite pour le moment
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des sessions</CardTitle>
              <CardDescription>Vos expériences immersives récentes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{i === 1 ? "Forêt méditative" : "Plage tropicale"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {i === 1 ? "Hier" : "Il y a 3 jours"}, {i === 1 ? "15:30" : "10:15"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="sr-only">J'ai aimé</span>
                      </Button>
                      <Button size="sm">Rejouer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VR;
