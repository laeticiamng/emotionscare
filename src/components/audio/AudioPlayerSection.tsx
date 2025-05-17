
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AudioTrack } from '@/types/audio';
import { useAudio } from '@/contexts/audio/AudioContext';
import { useToast } from '@/hooks/use-toast';

const AudioPlayerSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('relaxation');
  const { toast } = useToast();
  
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    togglePlay, 
    volume, 
    setVolume, 
    isMuted, 
    toggleMute, 
    progress, 
    duration, 
    seekTo,
    formatTime,
    loading
  } = useAudio();
  
  // Exemples de pistes audio pour chaque catégorie
  const audioTracks = {
    relaxation: [
      {
        id: 'relax-1',
        title: 'Sons relaxants de la nature',
        artist: 'Nature Sounds',
        duration: 296,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500',
        description: 'Écoutez les sons apaisants de la forêt tropicale pour réduire votre stress.'
      },
      {
        id: 'relax-2',
        title: 'Pluie douce',
        artist: 'Ambient Works',
        duration: 320,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=500',
        description: 'Le son apaisant de la pluie qui tombe doucement.'
      }
    ],
    meditation: [
      {
        id: 'meditation-1',
        title: 'Méditation pleine conscience',
        artist: 'Mindfulness Masters',
        duration: 630,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=500',
        description: 'Une séance guidée pour se recentrer sur le moment présent.'
      }
    ],
    sleep: [
      {
        id: 'sleep-1',
        title: 'Berceuse pour sommeil profond',
        artist: 'Deep Sleep',
        duration: 545,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=500',
        description: 'Sons blancs et berceuses pour un sommeil réparateur.'
      }
    ]
  };
  
  const handleSeek = (values: number[]) => {
    seekTo(values[0]);
  };
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };
  
  // Notification de lecture démarrée
  useEffect(() => {
    if (isPlaying && currentTrack) {
      toast({
        title: "Lecture démarrée",
        description: `En cours: ${currentTrack.title} - ${currentTrack.artist}`
      });
    }
  }, [isPlaying, currentTrack, toast]);
  
  return (
    <div className="space-y-6">
      {/* Lecteur principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          <TabsTrigger value="meditation">Méditation</TabsTrigger>
          <TabsTrigger value="sleep">Sommeil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="relaxation" className="space-y-4">
          <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500" 
              alt="Relaxation audio"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">
                {currentTrack?.title || "Sons relaxants de la nature"}
              </h3>
              <p className="text-muted-foreground">
                {currentTrack?.description || "No description available"}
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <Button 
                size="icon" 
                variant="outline"
                disabled={!currentTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                size="icon" 
                variant="default" 
                onClick={togglePlay}
                disabled={loading}
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>
              
              <Button 
                size="icon" 
                variant="outline"
                disabled={!currentTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider 
                value={[progress]} 
                max={duration || 100} 
                step={1} 
                onValueChange={handleSeek}
                disabled={!currentTrack}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
                className="h-8 w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <Slider 
                value={[isMuted ? 0 : volume * 100]} 
                max={100} 
                step={1} 
                className="flex-1 max-w-xs" 
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="meditation">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Méditation pleine conscience</h4>
                    <p className="text-xs text-muted-foreground">Mindfulness Masters · 10:30</p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex items-center gap-2"
                    onClick={() => playTrack(audioTracks.meditation[0])}
                  >
                    <Play className="h-4 w-4" />
                    Écouter
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid place-items-center h-40">
              <p className="text-muted-foreground">Plus de séances de méditation guidée à venir.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sleep">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Berceuse pour sommeil profond</h4>
                    <p className="text-xs text-muted-foreground">Deep Sleep · 9:05</p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex items-center gap-2"
                    onClick={() => playTrack(audioTracks.sleep[0])}
                  >
                    <Play className="h-4 w-4" />
                    Écouter
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid place-items-center h-40">
              <p className="text-muted-foreground">Histoires pour le sommeil et sons blancs à venir.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Liste des podcasts */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Sessions recommandées</h3>
          <ul className="space-y-2">
            {audioTracks.relaxation.map(track => (
              <li key={track.id} className="flex justify-between items-center p-2 hover:bg-accent rounded-md">
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(track.duration)}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => playTrack(track)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioPlayerSection;
