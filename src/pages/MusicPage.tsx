
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Music,
  Headphones,
  Waves,
  Sparkles
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { toast } from 'sonner';

const MusicPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  
  const music = useMusic();

  const emotions = [
    { name: 'Calme', value: 'calm', color: 'bg-blue-500', description: 'Musique apaisante pour la relaxation' },
    { name: 'Énergique', value: 'energetic', color: 'bg-orange-500', description: 'Boost d\'énergie et motivation' },
    { name: 'Focus', value: 'focus', color: 'bg-purple-500', description: 'Concentration et productivité' },
    { name: 'Joyeux', value: 'happy', color: 'bg-yellow-500', description: 'Bonne humeur et positivité' },
    { name: 'Méditatif', value: 'meditative', color: 'bg-green-500', description: 'Méditation et pleine conscience' },
    { name: 'Créatif', value: 'creative', color: 'bg-pink-500', description: 'Inspiration et créativité' }
  ];

  const currentTrack = {
    title: 'Sérénité Océanique',
    artist: 'EmotionsCare AI',
    album: 'Thérapie Naturelle',
    cover: '/images/meditation-cover.jpg'
  };

  const playlists = [
    {
      id: 1,
      name: 'Relaxation Profonde',
      tracks: 12,
      duration: '48 min',
      emotion: 'calm',
      cover: '/images/relaxation-playlist.jpg'
    },
    {
      id: 2,
      name: 'Énergie Matinale',
      tracks: 8,
      duration: '32 min',
      emotion: 'energetic',
      cover: '/images/energy-playlist.jpg'
    },
    {
      id: 3,
      name: 'Focus Intense',
      tracks: 15,
      duration: '65 min',
      emotion: 'focus',
      cover: '/images/focus-playlist.jpg'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (music.isPlaying && currentTime < duration) {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [music.isPlaying, currentTime, duration]);

  const handleEmotionSelect = async (emotion: string) => {
    setSelectedEmotion(emotion);
    toast.success(`Playlist ${emotion} chargée`);
    
    try {
      await music.loadPlaylistForEmotion(emotion);
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    music.setVolume(value[0] / 100);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    music.setVolume(isMuted ? volume / 100 : 0);
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Music className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Thérapie Musicale</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez une expérience musicale personnalisée qui s'adapte à vos émotions et besoins du moment
          </p>
        </div>

        <Tabs defaultValue="player" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="player" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Lecteur
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Émotions
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Playlists
            </TabsTrigger>
          </TabsList>

          {/* Lecteur Musical */}
          <TabsContent value="player" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Cover Art */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-80 h-80 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Waves className="h-24 w-24 text-white/80" />
                      </div>
                      {music.isPlaying && (
                        <div className="absolute -inset-4 bg-purple-500/20 rounded-2xl animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-6">
                    <div className="text-center lg:text-left">
                      <h2 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h2>
                      <p className="text-xl text-gray-300 mb-1">{currentTrack.artist}</p>
                      <p className="text-gray-400">{currentTrack.album}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 text-white hover:bg-white/20"
                        onClick={() => setIsShuffled(!isShuffled)}
                      >
                        <Shuffle className={`h-6 w-6 ${isShuffled ? 'text-purple-400' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-white hover:bg-white/20"
                        onClick={music.prevTrack}
                      >
                        <SkipBack className="h-7 w-7" />
                      </Button>
                      
                      <Button
                        variant="default"
                        size="icon"
                        className="h-16 w-16 bg-purple-500 hover:bg-purple-600 rounded-full"
                        onClick={music.toggle}
                      >
                        {music.isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-white hover:bg-white/20"
                        onClick={music.nextTrack}
                      >
                        <SkipForward className="h-7 w-7" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 text-white hover:bg-white/20"
                        onClick={() => {
                          const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
                          const currentIndex = modes.indexOf(repeatMode);
                          setRepeatMode(modes[(currentIndex + 1) % modes.length]);
                        }}
                      >
                        <Repeat className={`h-6 w-6 ${repeatMode !== 'none' ? 'text-purple-400' : ''}`} />
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-white text-sm w-8">{isMuted ? 0 : volume}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sélection d'Émotions */}
          <TabsContent value="emotions" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  Choisissez votre émotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emotions.map((emotion) => (
                    <Card
                      key={emotion.value}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedEmotion === emotion.value 
                          ? 'bg-purple-500/30 border-purple-400' 
                          : 'bg-white/5 hover:bg-white/10 border-white/20'
                      }`}
                      onClick={() => handleEmotionSelect(emotion.value)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 ${emotion.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                          <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">{emotion.name}</h3>
                        <p className="text-gray-300 text-sm">{emotion.description}</p>
                        {selectedEmotion === emotion.value && (
                          <Badge className="mt-3 bg-purple-500">Actif</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlists */}
          <TabsContent value="playlists" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                      <Music className="h-12 w-12 text-white/80" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{playlist.name}</h3>
                    <div className="flex justify-between text-gray-300 text-sm mb-4">
                      <span>{playlist.tracks} morceaux</span>
                      <span>{playlist.duration}</span>
                    </div>
                    <Button 
                      className="w-full bg-purple-500 hover:bg-purple-600"
                      onClick={() => {
                        toast.success(`Lecture de ${playlist.name}`);
                        music.play();
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicPage;
