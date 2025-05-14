
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const B2BUserMusic: React.FC = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<'focus' | 'relaxation' | 'energy'>('focus');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  
  const playlists = {
    focus: [
      { id: '1', title: 'Concentration Profonde', artist: 'Ambient Works', duration: '4:30', url: '#' },
      { id: '2', title: 'Clarté Mentale', artist: 'Productivity Sounds', duration: '5:15', url: '#' },
      { id: '3', title: 'Flow State', artist: 'Deep Focus', duration: '6:20', url: '#' },
    ],
    relaxation: [
      { id: '4', title: 'Pause Méditative', artist: 'Calm Collective', duration: '3:45', url: '#' },
      { id: '5', title: 'Respiration Guidée', artist: 'Mindful Moments', duration: '4:10', url: '#' },
      { id: '6', title: 'Détente Profonde', artist: 'Relaxation Zone', duration: '7:30', url: '#' },
    ],
    energy: [
      { id: '7', title: 'Réveil Énergétique', artist: 'Morning Boost', duration: '2:50', url: '#' },
      { id: '8', title: 'Motivation Pro', artist: 'Productivity Pulse', duration: '3:20', url: '#' },
      { id: '9', title: 'Dynamisme Mental', artist: 'Energy Waves', duration: '4:15', url: '#' },
    ]
  };
  
  const currentTracks = playlists[currentPlaylist];
  const currentTrack = currentTracks[currentTrackIndex];
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const nextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % currentTracks.length);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === 0 ? currentTracks.length - 1 : prevIndex - 1
    );
  };
  
  useEffect(() => {
    // Reset track index when playlist changes
    setCurrentTrackIndex(0);
  }, [currentPlaylist]);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Musique Pro</h1>
      <p className="text-muted-foreground mb-8">
        Améliorez votre concentration et productivité avec des playlists générées par IA, adaptées à votre environnement professionnel.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="bg-muted/20 pb-2">
            <CardTitle className="text-xl">Lecteur Musical Adaptatif</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 mb-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">♪</span>
              </div>
              
              <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
              <p className="text-muted-foreground mb-6">{currentTrack.artist}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={prevTrack}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  className="h-12 w-12 rounded-full" 
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-1" />
                  )}
                </Button>
                
                <Button variant="outline" size="icon" onClick={nextTrack}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 w-full max-w-xs">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0])}
                  className="flex-1"
                />
                <span className="w-8 text-right">{volume}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-muted/20 pb-2">
            <CardTitle className="text-xl">Playlists Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="focus" onValueChange={(value) => setCurrentPlaylist(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="focus">Focus</TabsTrigger>
                <TabsTrigger value="relaxation">Détente</TabsTrigger>
                <TabsTrigger value="energy">Énergie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="focus" className="space-y-2">
                {playlists.focus.map((track, index) => (
                  <div 
                    key={track.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      currentPlaylist === 'focus' && currentTrackIndex === index
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setCurrentPlaylist('focus');
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{track.title}</span>
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{track.artist}</div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="relaxation" className="space-y-2">
                {playlists.relaxation.map((track, index) => (
                  <div 
                    key={track.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      currentPlaylist === 'relaxation' && currentTrackIndex === index
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setCurrentPlaylist('relaxation');
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{track.title}</span>
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{track.artist}</div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="energy" className="space-y-2">
                {playlists.energy.map((track, index) => (
                  <div 
                    key={track.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      currentPlaylist === 'energy' && currentTrackIndex === index
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setCurrentPlaylist('energy');
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{track.title}</span>
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{track.artist}</div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Musique IA Personnalisée</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Générez une musique unique adaptée à votre humeur et vos besoins professionnels du moment.
            </p>
            <Button className="w-full">Générer une musique personnalisée</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes Créations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Retrouvez vos musiques générées précédemment et vos playlists favorites.
            </p>
            <Button variant="outline" className="w-full">Voir ma bibliothèque</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserMusic;
