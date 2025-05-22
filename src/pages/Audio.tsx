
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Volume2, Headphones, Mic, Music, Waveform } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

const AudioPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState([50]);

  useEffect(() => {
    // Simuler un chargement de page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <PageLoader isLoading={true} variant="premium" message="Chargement de l'interface audio" />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audio</h1>
        <p className="text-muted-foreground">
          Explorez nos fonctionnalités audio pour améliorer votre bien-être émotionnel
        </p>
      </div>
      
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          <TabsTrigger value="meditation">Méditation</TabsTrigger>
          <TabsTrigger value="ambient">Sons ambiants</TabsTrigger>
          <TabsTrigger value="recorder">Enregistreur</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte d'audio guidé */}
            <Card>
              <CardHeader>
                <CardTitle>Respiration guidée</CardTitle>
                <CardDescription>Technique 4-7-8 pour réduire l'anxiété</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <Waveform size={48} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">5:30</span>
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      min={0}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Écouter</Button>
              </CardFooter>
            </Card>
            
            {/* Carte de méditation */}
            <Card>
              <CardHeader>
                <CardTitle>Méditation pleine conscience</CardTitle>
                <CardDescription>Session pour débutants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <Waveform size={48} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">10:15</span>
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      min={0}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Écouter</Button>
              </CardFooter>
            </Card>
            
            {/* Carte de sons apaisants */}
            <Card>
              <CardHeader>
                <CardTitle>Sons de la nature</CardTitle>
                <CardDescription>Forêt tropicale et cascades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <Waveform size={48} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">30:00</span>
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      min={0}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Écouter</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meditation">
          <div className="bg-muted p-8 rounded-lg text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Headphones size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sessions de méditation</h3>
            <p className="mb-6 text-muted-foreground">
              Explorez nos sessions de méditation guidée pour améliorer votre concentration et réduire le stress.
            </p>
            <Button>Découvrir les méditations</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="ambient">
          <div className="bg-muted p-8 rounded-lg text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Music size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sons ambiants</h3>
            <p className="mb-6 text-muted-foreground">
              Créez votre propre mélange de sons ambiants pour favoriser la concentration ou la relaxation.
            </p>
            <Button>Mixer des sons</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="recorder">
          <div className="bg-muted p-8 rounded-lg text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enregistreur vocal</h3>
            <p className="mb-6 text-muted-foreground">
              Enregistrez vos pensées et réflexions pour suivre votre cheminement émotionnel.
            </p>
            <Button>Commencer l'enregistrement</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Recommandations pour vous</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Réduire l'anxiété', 'Améliorer le sommeil', 'Focus au travail', 'Relaxation profonde'].map((title) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                  <div className="bg-primary h-2 rounded-full w-2/3"></div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="ghost" size="sm" className="w-full">Découvrir</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPage;
