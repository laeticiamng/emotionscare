
import React, { useState } from 'react';
import Shell from '@/Shell';
import PageHeader from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Headphones, Speaker, Download, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AudioPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('meditation');
  const { toast } = useToast();

  const handlePlayAudio = (title: string) => {
    toast({
      title: "Lecture démarrée",
      description: `"${title}" commence à jouer`
    });
  };

  return (
    <Shell>
      <div className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Audiothérapie"
          description="Écoutez des méditations guidées, des sons relaxants et des podcasts thérapeutiques"
        />

        <Tabs defaultValue="meditation" onValueChange={setActiveCategory} className="mt-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="meditation" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              <span>Méditation</span>
            </TabsTrigger>
            <TabsTrigger value="ambient" className="flex items-center gap-2">
              <Speaker className="h-4 w-4" />
              <span>Sons d'ambiance</span>
            </TabsTrigger>
            <TabsTrigger value="podcast" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Podcasts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meditation" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Méditation pleine conscience", duration: "10 min", cover: "/assets/images/meditation-1.jpg" },
                { title: "Relaxation profonde", duration: "15 min", cover: "/assets/images/meditation-2.jpg" },
                { title: "Réduire l'anxiété", duration: "8 min", cover: "/assets/images/meditation-3.jpg" }
              ].map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <Headphones className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handlePlayAudio(item.title)}
                    >
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ambient" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Pluie apaisante", duration: "30 min", icon: "rain" },
                { title: "Forêt tropicale", duration: "45 min", icon: "forest" },
                { title: "Océan calme", duration: "60 min", icon: "ocean" }
              ].map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handlePlayAudio(item.title)}
                    >
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="podcast" className="space-y-6">
            <div className="grid gap-4">
              {[
                { title: "Comprendre l'anxiété", duration: "22 min", author: "Dr. Sophie Marceau" },
                { title: "Faire face au stress quotidien", duration: "18 min", author: "Dr. Michel Dubois" },
                { title: "Le pouvoir de l'autocompassion", duration: "25 min", author: "Marie Leclerc" }
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>Par {item.author} • {item.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button onClick={() => handlePlayAudio(item.title)}>
                      Écouter
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Télécharger
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default AudioPage;
