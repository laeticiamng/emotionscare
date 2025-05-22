
import React, { useState, useEffect } from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface SongType {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  mood: string;
}

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SongType | null>(null);
  const [audio] = useState(new Audio());
  const { toast } = useToast();

  // Sample music data - in a real app, this would come from an API
  const sampleTracks: SongType[] = [
    {
      id: '1',
      title: 'Méditation matinale',
      artist: 'SoundHealing',
      duration: 254,
      coverUrl: 'https://placehold.co/400x400/1a1a2e/white?text=Méditation',
      audioUrl: 'https://example.com/sample-audio.mp3',
      mood: 'calm'
    },
    {
      id: '2',
      title: 'Focus profond',
      artist: 'MindWaves',
      duration: 318,
      coverUrl: 'https://placehold.co/400x400/1a1a2e/white?text=Focus',
      audioUrl: 'https://example.com/sample-audio-2.mp3',
      mood: 'focus'
    },
    {
      id: '3',
      title: 'Relaxation pour dormir',
      artist: 'DreamScape',
      duration: 422,
      coverUrl: 'https://placehold.co/400x400/1a1a2e/white?text=Relaxation',
      audioUrl: 'https://example.com/sample-audio-3.mp3',
      mood: 'sleep'
    },
    {
      id: '4',
      title: 'Énergie positive',
      artist: 'PositiveBeats',
      duration: 198,
      coverUrl: 'https://placehold.co/400x400/1a1a2e/white?text=Énergie',
      audioUrl: 'https://example.com/sample-audio-4.mp3',
      mood: 'energize'
    }
  ];

  // Timer for updating track progress
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime(audio.currentTime);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, audio]);

  // Set up audio event listeners
  useEffect(() => {
    const setupAudio = () => {
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        toast({
          title: "Lecture terminée",
          description: "La piste est terminée"
        });
      });

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('error', () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'audio",
          variant: "destructive"
        });
        setIsPlaying(false);
      });
    };

    setupAudio();

    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, [audio, toast]);

  // Handle play/pause
  const togglePlay = () => {
    if (!currentTrack) {
      // If no track is selected, select the first one
      playTrack(sampleTracks[0]);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        toast({
          title: "Erreur de lecture",
          description: "Impossible de démarrer la lecture. Veuillez réessayer.",
          variant: "destructive"
        });
        console.error("Audio playback failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Handle track selection and play
  const playTrack = (track: SongType) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // Change track
    setCurrentTrack(track);
    setCurrentTime(0);

    // In a real app, we'd set audio.src to track.audioUrl
    // Since we don't have real audio files, we'll just simulate
    audio.src = track.audioUrl;
    audio.load();
    
    // Auto play when selecting a new track
    audio.play().catch(error => {
      console.error("Audio playback failed:", error);
      toast({
        title: "Erreur de lecture",
        description: "Impossible de charger la piste audio",
        variant: "destructive"
      });
    });
    
    setIsPlaying(true);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audio.volume = newVolume / 100;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audio.volume = volume / 100;
    } else {
      setIsMuted(true);
      audio.volume = 0;
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get tracks based on mood filter
  const getMoodTracks = (mood: string) => {
    return sampleTracks.filter(track => track.mood === mood);
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Musique thérapeutique</h1>
          <p className="text-muted-foreground mb-6">
            Explorez des playlists adaptées à vos émotions et favorisant votre bien-être
          </p>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="calm">Méditation</TabsTrigger>
              <TabsTrigger value="focus">Concentration</TabsTrigger>
              <TabsTrigger value="sleep">Sommeil</TabsTrigger>
              <TabsTrigger value="energize">Énergie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTracks.map((track) => (
                  <Card key={track.id} className={`cursor-pointer hover:bg-accent/10 transition-colors ${currentTrack?.id === track.id ? 'border-primary' : ''}`} onClick={() => playTrack(track)}>
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="w-full h-full object-cover"
                      />
                      {currentTrack?.id === track.id && isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Pause className="text-white" size={20} />
                          </div>
                        </div>
                      )}
                      {(currentTrack?.id !== track.id || !isPlaying) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Play className="text-white" size={20} />
                          </div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="calm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMoodTracks('calm').map((track) => (
                  <Card key={track.id} className={`cursor-pointer hover:bg-accent/10 transition-colors ${currentTrack?.id === track.id ? 'border-primary' : ''}`} onClick={() => playTrack(track)}>
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="w-full h-full object-cover"
                      />
                      {currentTrack?.id === track.id && isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Pause className="text-white" size={20} />
                          </div>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Similar TabsContent for other moods (focus, sleep, energize) */}
            <TabsContent value="focus">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMoodTracks('focus').map((track) => (
                  <Card key={track.id} className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => playTrack(track)}>
                    {/* Similar content as above */}
                    <div className="aspect-square relative">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sleep">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMoodTracks('sleep').map((track) => (
                  <Card key={track.id} className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => playTrack(track)}>
                    {/* Similar content as above */}
                    <div className="aspect-square relative">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="energize">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMoodTracks('energize').map((track) => (
                  <Card key={track.id} className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => playTrack(track)}>
                    {/* Similar content as above */}
                    <div className="aspect-square relative">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <CardDescription>{track.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Player Controls */}
          {currentTrack && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex flex-col md:flex-row items-center gap-4 z-10"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title} 
                  className="h-14 w-14 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{currentTrack.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>
              
              <div className="flex flex-col flex-grow max-w-xl">
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" size="icon" disabled>
                    <SkipBack size={20} />
                  </Button>
                  <Button 
                    onClick={togglePlay}
                    variant="outline" 
                    size="icon"
                    className="rounded-full h-12 w-12"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  <Button variant="ghost" size="icon" disabled>
                    <SkipForward size={20} />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 w-full mt-2">
                  <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
                  <div className="flex-grow">
                    <Slider 
                      min={0} 
                      max={duration || 100} 
                      step={1} 
                      value={[currentTime]}
                      onValueChange={(value) => {
                        setCurrentTime(value[0]);
                        audio.currentTime = value[0];
                      }}
                      disabled={!currentTrack}
                    />
                  </div>
                  <span className="text-xs w-10">{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 w-full md:w-40">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  className="flex-grow"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Shell>
  );
};

export default MusicPage;
