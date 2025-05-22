
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const B2CMusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("recommendations");

  const playlists = [
    {
      title: 'Relaxation profonde',
      description: 'Mélodies apaisantes pour réduire l\'anxiété',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format'
    },
    {
      title: 'Concentration',
      description: 'Musique instrumentale pour améliorer la concentration',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format'
    },
    {
      title: 'Méditation guidée',
      description: 'Sessions de méditation avec narration',
      image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=200&auto=format'
    },
    {
      title: 'Énergisant',
      description: 'Rythmes dynamiques pour retrouver de l\'énergie',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=200&auto=format'
    },
    {
      title: 'Sommeil profond',
      description: 'Sons ambiants pour favoriser l\'endormissement',
      image: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?q=80&w=200&auto=format'
    },
    {
      title: 'Pensée positive',
      description: 'Mélodies inspirantes pour une humeur positive',
      image: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?q=80&w=200&auto=format'
    }
  ];

  const moodPlaylists = [
    {
      mood: 'Joyeux',
      playlists: [
        { title: 'Happy Vibes', tracks: 12 },
        { title: 'Energy Boost', tracks: 10 },
        { title: 'Positive Day', tracks: 8 }
      ]
    },
    {
      mood: 'Calme',
      playlists: [
        { title: 'Peaceful Mind', tracks: 15 },
        { title: 'Soft Piano', tracks: 9 },
        { title: 'Ambient Dreams', tracks: 12 }
      ]
    },
    {
      mood: 'Focus',
      playlists: [
        { title: 'Deep Work', tracks: 8 },
        { title: 'Study Session', tracks: 14 },
        { title: 'Productivity Zone', tracks: 10 }
      ]
    }
  ];

  const recentlyPlayed = [
    { title: 'Méditation matinale', artist: 'Emma Calm', duration: '15:30' },
    { title: 'Focus Flow', artist: 'Productivity Beats', duration: '42:18' },
    { title: 'Sleep Well', artist: 'Dream Sounds', duration: '58:24' }
  ];

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Thérapie Musicale</h1>
        <p className="text-muted-foreground mt-2">
          Écoutez des playlists adaptées à vos émotions et à votre état d'esprit.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="moods">Par humeur</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={playlist.image} 
                    alt={playlist.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{playlist.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {playlist.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full flex gap-2 items-center">
                    <Play className="h-4 w-4" />
                    Écouter
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="moods" className="mt-4 space-y-6">
          {moodPlaylists.map((moodGroup, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold mb-4">Mood: {moodGroup.mood}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {moodGroup.playlists.map((playlist, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="text-lg">{playlist.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{playlist.tracks} morceaux</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Play className="mr-2 h-4 w-4" /> Écouter
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Récemment écoutés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyPlayed.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{item.duration}</span>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="fixed bottom-0 left-0 right-0 mx-4 mb-4 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format" 
                  alt="Relaxation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">Relaxation profonde</p>
                <p className="text-xs text-muted-foreground">Musique pour le bien-être</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 w-1/4">
              <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider defaultValue={[70]} max={100} step={1} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CMusicPage;
