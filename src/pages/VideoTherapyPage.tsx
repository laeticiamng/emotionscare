
import React, { useState } from 'react';
import Shell from '@/Shell';
import PageHeader from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Video, Play, Clock, Bookmark, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const VideoTherapyPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('relaxation');
  const { toast } = useToast();

  const handlePlayVideo = (title: string) => {
    toast({
      title: "Vidéo démarrée",
      description: `"${title}" commence à jouer`
    });
  };

  const handleSaveToFavorites = (title: string) => {
    toast({
      title: "Ajouté aux favoris",
      description: `"${title}" a été ajouté à vos favoris`
    });
  };

  return (
    <Shell>
      <div className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Vidéothérapie"
          description="Découvrez des vidéos thérapeutiques pour améliorer votre bien-être mental"
        />

        <Tabs defaultValue="relaxation" onValueChange={setActiveCategory} className="mt-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="relaxation">
              Relaxation
            </TabsTrigger>
            <TabsTrigger value="meditation">
              Méditation guidée
            </TabsTrigger>
            <TabsTrigger value="educational">
              Éducation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="relaxation" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { 
                  title: "Relaxation en forêt", 
                  duration: "15 min", 
                  description: "Une immersion visuelle et sonore dans une forêt paisible",
                  thumbnail: "forest-thumbnail.jpg",
                  likes: 245
                },
                { 
                  title: "Plage tropicale au coucher du soleil", 
                  duration: "20 min", 
                  description: "Laissez-vous bercer par le son des vagues et la beauté d'un coucher de soleil",
                  thumbnail: "beach-thumbnail.jpg",
                  likes: 312
                },
                { 
                  title: "Contemplation montagnarde", 
                  duration: "18 min", 
                  description: "Admirez des paysages montagneux majestueux pour apaiser votre esprit",
                  thumbnail: "mountain-thumbnail.jpg",
                  likes: 178
                }
              ].map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48 bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute inset-0 m-auto rounded-full w-12 h-12"
                      onClick={() => handlePlayVideo(video.title)}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {video.duration}
                      </Badge>
                    </div>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" /> {video.likes}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSaveToFavorites(video.title)}
                    >
                      <Bookmark className="h-4 w-4 mr-1" /> Sauvegarder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meditation" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { 
                  title: "Méditation de pleine conscience", 
                  duration: "12 min", 
                  description: "Apprenez à être pleinement présent dans l'instant",
                  instructor: "Marina Leclerc"
                },
                { 
                  title: "Méditation pour réduire l'anxiété", 
                  duration: "18 min", 
                  description: "Techniques de respiration et visualisation pour apaiser l'anxiété",
                  instructor: "Dr. Paul Mercier"
                },
                { 
                  title: "Méditation pour un sommeil réparateur", 
                  duration: "25 min", 
                  description: "Préparez votre corps et votre esprit pour une nuit de sommeil profond",
                  instructor: "Juliette Bernard"
                }
              ].map((video, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>
                      Par {video.instructor} • {video.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handlePlayVideo(video.title)}
                    >
                      <Play className="h-4 w-4 mr-2" /> Regarder maintenant
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="educational" className="space-y-6">
            <div className="grid gap-6">
              {[
                { 
                  title: "Comprendre et gérer le stress", 
                  duration: "22 min", 
                  description: "Découvrez les mécanismes du stress et des stratégies efficaces pour le gérer",
                  instructor: "Dr. Sophie Moreau"
                },
                { 
                  title: "Les fondements de la thérapie cognitive", 
                  duration: "30 min", 
                  description: "Introduction aux principes de la thérapie cognitive comportementale",
                  instructor: "Prof. Michel Dumas"
                },
                { 
                  title: "Communication non violente", 
                  duration: "27 min", 
                  description: "Apprenez à communiquer avec empathie et authenticité",
                  instructor: "Claire Fontaine"
                }
              ].map((video, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>
                      Par {video.instructor} • {video.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{video.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      onClick={() => handlePlayVideo(video.title)}
                    >
                      <Play className="h-4 w-4 mr-2" /> Regarder
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleSaveToFavorites(video.title)}
                    >
                      <Bookmark className="h-4 w-4 mr-2" /> Sauvegarder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default VideoTherapyPage;
