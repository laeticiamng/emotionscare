
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Music, Video, FileText } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center space-y-2 mb-8">
        <Badge variant="outline" className="mb-2">Bienvenue</Badge>
        <h1 className="text-4xl font-bold tracking-tight">EmotionsCare</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Votre plateforme de bien-être émotionnel personnalisée
        </p>
      </div>
      
      <Tabs defaultValue="therapies" className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="therapies">Thérapies</TabsTrigger>
          <TabsTrigger value="wellbeing">Bien-être</TabsTrigger>
        </TabsList>
        
        <TabsContent value="therapies">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Scan Émotionnel
                </CardTitle>
                <CardDescription>Analysez votre état émotionnel actuel</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Identifiez vos émotions en temps réel grâce à notre technologie d'analyse émotionnelle et recevez des conseils personnalisés.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/scan">Commencer un scan</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-blue-500" />
                  Musicothérapie
                </CardTitle>
                <CardDescription>Des mélodies adaptées à vos émotions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Écoutez des compositions musicales spécialement conçues pour harmoniser votre état émotionnel et favoriser votre bien-être.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/music">Explorer</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-emerald-500" />
                  Réalité Augmentée
                </CardTitle>
                <CardDescription>Immersion thérapeutique</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Plongez dans des environnements immersifs qui s'adaptent à votre état émotionnel pour une expérience apaisante unique.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/ar">Découvrir</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="wellbeing">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Journal émotionnel
                </CardTitle>
                <CardDescription>Suivez l'évolution de vos émotions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Enregistrez quotidiennement vos émotions et visualisez votre progression émotionnelle au fil du temps.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/journal">Ouvrir le journal</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Ajoutez plus de cartes ici si nécessaire */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
