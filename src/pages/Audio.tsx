
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, PauseCircle, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Audio: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audiothérapie</h1>
          <p className="text-muted-foreground">
            Découvrez des sons et musiques conçus pour améliorer votre bien-être
          </p>
        </div>
        <Button variant="outline" size="sm">
          Découvrir la bibliothèque
        </Button>
      </div>

      <Tabs defaultValue="recommended">
        <TabsList>
          <TabsTrigger value="recommended">Recommandés</TabsTrigger>
          <TabsTrigger value="meditation">Méditation</TabsTrigger>
          <TabsTrigger value="sleep">Sommeil</TabsTrigger>
          <TabsTrigger value="focus">Concentration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended" className="space-y-6 mt-6">
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="aspect-square rounded-md overflow-hidden bg-primary/10 flex items-center justify-center w-full max-w-[200px]">
                <Volume2 className="h-20 w-20 text-primary opacity-70" />
              </div>
              
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold">Méditation du jour</h3>
                  <p className="text-muted-foreground">10 minutes • Guidée par Sophie</p>
                </div>
                
                <p className="text-muted-foreground">
                  Une méditation apaisante pour commencer votre journée avec clarté et intention.
                </p>
                
                <div className="flex items-center gap-4">
                  <Button size="sm" className="gap-2">
                    <PlayCircle className="h-4 w-4" /> Jouer
                  </Button>
                  <Button variant="outline" size="sm">
                    Ajouter à la playlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Suggestions basées sur vos préférences</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Réduire l\'anxiété', 'Améliorer le sommeil', 'Focus au travail', 'Relaxation profonde'].map((title) => (
              <Card key={title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>15-20 min</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="icon">
                      <PlayCircle className="h-6 w-6" />
                    </Button>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="meditation" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Collections de méditation</CardTitle>
              <CardDescription>Explorez nos séries guidées pour tous les niveaux</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Contenu de méditation disponible prochainement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sleep" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Améliorer votre sommeil</CardTitle>
              <CardDescription>Sons et méditations pour un sommeil réparateur</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Contenu sommeil disponible prochainement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="focus" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Concentration et productivité</CardTitle>
              <CardDescription>Améliorez votre concentration avec ces sons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Contenu de concentration disponible prochainement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Audio;
