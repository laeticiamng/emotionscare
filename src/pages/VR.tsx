
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Glasses, Star, History } from 'lucide-react';

const VR: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Réalité Virtuelle</h1>
          <p className="text-muted-foreground">
            Immergez-vous dans des environnements apaisants pour réduire le stress et améliorer votre bien-être.
          </p>
        </div>
      </div>

      <Tabs defaultValue="featured">
        <TabsList>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" /> Sessions populaires
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Glasses className="h-4 w-4" /> Toutes les sessions
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <Card key={index}>
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                      <Glasses className="h-16 w-16 text-primary/50" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Badge>Populaire</Badge>
                  <CardTitle className="mt-2">Méditation en forêt</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Une expérience immersive au cœur d'une forêt apaisante. Idéal pour réduire le stress.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Commencer la session</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card key={index}>
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-muted flex items-center justify-center">
                      <Glasses className="h-16 w-16 text-accent/50" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardTitle>Session VR #{index}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Description de la session de réalité virtuelle et de ses bienfaits.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Voir les détails</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore participé à des sessions de réalité virtuelle.
              </p>
              <div className="flex justify-center mt-4">
                <Button>Explorer les sessions disponibles</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VR;
