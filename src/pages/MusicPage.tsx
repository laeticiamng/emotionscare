
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, SkipForward, SkipBack, Music, Headphones, Heart } from 'lucide-react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const musicCategories = [
    { id: 'relaxation', name: 'Relaxation' },
    { id: 'focus', name: 'Concentration' },
    { id: 'sleep', name: 'Sommeil' },
    { id: 'mood', name: 'Humeur' }
  ];
  
  const playlists = [
    { id: 1, title: 'Méditation calme', category: 'relaxation', tracks: 12, duration: '58 min' },
    { id: 2, title: 'Concentration profonde', category: 'focus', tracks: 8, duration: '45 min' },
    { id: 3, title: 'Sons pour dormir', category: 'sleep', tracks: 10, duration: '90 min' },
    { id: 4, title: 'Énergie positive', category: 'mood', tracks: 15, duration: '62 min' },
    { id: 5, title: 'Relaxation nature', category: 'relaxation', tracks: 7, duration: '42 min' },
    { id: 6, title: 'Boost de productivité', category: 'focus', tracks: 9, duration: '51 min' }
  ];

  return (
    <UnifiedLayout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Musicothérapie</h1>
        
        <Tabs defaultValue="relaxation" className="mb-8">
          <TabsList className="mb-4">
            {musicCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {musicCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists
                  .filter(playlist => playlist.category === category.id)
                  .map(playlist => (
                    <Card key={playlist.id} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <Music className="h-5 w-5 text-primary" />
                          {playlist.title}
                        </CardTitle>
                        <CardDescription>{playlist.tracks} pistes · {playlist.duration}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="w-9 h-9 p-0">
                              <SkipBack className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="w-9 h-9 p-0"
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="outline" className="w-9 h-9 p-0">
                              <SkipForward className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button size="sm" variant="ghost" className="w-9 h-9 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recommandations personnalisées</CardTitle>
            <CardDescription>Basées sur votre état émotionnel actuel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Playlist {i}</CardTitle>
                    <CardDescription>Pour améliorer votre humeur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">Écouter</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Sons binauraux
            </CardTitle>
            <CardDescription>Sons thérapeutiques pour différents besoins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Anti-stress', 'Sommeil profond', 'Concentration', 'Méditation'].map(type => (
                <Button key={type} variant="outline" className="h-auto py-6 flex flex-col gap-2">
                  <span>{type}</span>
                  <span className="text-xs text-muted-foreground">20 min</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
};

export default MusicPage;
