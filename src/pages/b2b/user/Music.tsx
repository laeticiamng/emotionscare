
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart } from 'lucide-react';

const B2BUserMusic: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Musicothérapie</h1>
          <p className="text-muted-foreground">
            Des playlists adaptées à vos émotions et à vos besoins
          </p>
        </div>
        <Button>Créer une playlist</Button>
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="aspect-square rounded-md overflow-hidden bg-primary/10 w-full max-w-[200px]">
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
          </div>
          
          <div className="flex-grow space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">Playlist recommandée</h3>
              <p className="text-muted-foreground">Basée sur votre humeur actuelle</p>
            </div>
            
            <p className="text-muted-foreground">
              Cette playlist a été spécialement conçue pour vous aider à vous détendre et à vous recentrer.
            </p>
            
            <div className="flex items-center gap-4">
              <Button size="sm" className="gap-2">
                <Play className="h-4 w-4" /> Lecture
              </Button>
              <Button variant="outline" size="sm">
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes les playlists</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="recommended">Recommandations</TabsTrigger>
          <TabsTrigger value="work">Spécial Travail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Relaxation profonde",
                description: "Sons apaisants pour la méditation",
                tracks: 8
              },
              {
                title: "Concentration",
                description: "Musique pour améliorer votre productivité",
                tracks: 12
              },
              {
                title: "Énergie positive",
                description: "Rythmes dynamiques pour vous motiver",
                tracks: 10
              },
              {
                title: "Sommeil réparateur",
                description: "Sons doux pour vous aider à dormir",
                tracks: 6
              },
              {
                title: "Anti-stress",
                description: "Mélodies apaisantes pour réduire l'anxiété",
                tracks: 9
              }
            ].map((playlist, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{playlist.title}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{playlist.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {playlist.tracks} pistes • 45 min
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              Aucune playlist favorite pour le moment
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="recommended">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              Les recommandations seront disponibles après plus d'utilisation
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="work" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Playlists spécial environnement professionnel</CardTitle>
              <CardDescription>Optimisées pour améliorer votre concentration et productivité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Focus profond</div>
                    <div className="text-sm text-muted-foreground">Pour les tâches requérant une concentration intense</div>
                  </div>
                  <Button size="sm" variant="outline">Écouter</Button>
                </div>
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Ambiance bureau</div>
                    <div className="text-sm text-muted-foreground">Sons ambiants pour rester dans la zone</div>
                  </div>
                  <Button size="sm" variant="outline">Écouter</Button>
                </div>
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Pause déjeuner</div>
                    <div className="text-sm text-muted-foreground">Mélodies relaxantes pour votre pause</div>
                  </div>
                  <Button size="sm" variant="outline">Écouter</Button>
                </div>
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Fin de journée</div>
                    <div className="text-sm text-muted-foreground">Transition vers la détente après le travail</div>
                  </div>
                  <Button size="sm" variant="outline">Écouter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserMusic;
