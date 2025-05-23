
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  mood: string;
  category: string;
}

const MusicTherapy: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playlist de base
  const [playlist] = useState<Track[]>([
    {
      id: '1',
      title: 'Sérénité Matinale',
      artist: 'Thérapie Sonore',
      duration: 180,
      url: '/audio/serenity-morning.mp3',
      mood: 'calme',
      category: 'méditation'
    },
    {
      id: '2',
      title: 'Énergie Positive',
      artist: 'Bien-être Musical',
      duration: 210,
      url: '/audio/positive-energy.mp3',
      mood: 'énergique',
      category: 'motivation'
    },
    {
      id: '3',
      title: 'Relaxation Profonde',
      artist: 'Sons de la Nature',
      duration: 300,
      url: '/audio/deep-relaxation.mp3',
      mood: 'détendu',
      category: 'relaxation'
    },
    {
      id: '4',
      title: 'Focus et Concentration',
      artist: 'Productivité Zen',
      duration: 240,
      url: '/audio/focus-concentration.mp3',
      mood: 'concentré',
      category: 'travail'
    }
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        playNext();
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
      return;
    }

    setCurrentTrack(track);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        toast.success(`Lecture: ${track.title}`);
      }).catch(() => {
        // Fallback: simuler la lecture pour la démo
        setIsPlaying(true);
        toast.success(`Lecture simulée: ${track.title}`);
        
        // Simuler la progression
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsPlaying(false);
              return 0;
            }
            return prev + 1;
          });
        }, track.duration * 10); // Progression accélérée pour la démo
      });
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const playNext = () => {
    if (!currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playTrack(playlist[prevIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const generateMusic = async () => {
    if (!generationPrompt.trim()) {
      toast.error('Veuillez décrire l\'ambiance musicale souhaitée');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulation de génération musicale
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedTrack: Track = {
        id: `generated-${Date.now()}`,
        title: `Musique générée: ${generationPrompt.slice(0, 20)}...`,
        artist: 'IA Compositeur',
        duration: 180,
        url: '/audio/generated-music.mp3',
        mood: 'personnalisé',
        category: 'génération-ia'
      };

      toast.success('Musique générée avec succès !');
      playTrack(generatedTrack);
      setGenerationPrompt('');
    } catch (error) {
      console.error('Music generation error:', error);
      toast.error('Erreur lors de la génération musicale');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'calme': return 'bg-blue-100 text-blue-800';
      case 'énergique': return 'bg-orange-100 text-orange-800';
      case 'détendu': return 'bg-green-100 text-green-800';
      case 'concentré': return 'bg-purple-100 text-purple-800';
      case 'personnalisé': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Génération de musique IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            Génération Musicale IA
          </CardTitle>
          <CardDescription>
            Créez de la musique personnalisée selon votre humeur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Décrivez l'ambiance souhaitée (ex: musique apaisante pour méditation, sons de la nature...)"
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
              disabled={isGenerating}
              className="flex-1"
            />
            <Button 
              onClick={generateMusic}
              disabled={isGenerating || !generationPrompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                'Générer'
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            L'IA va composer une musique unique adaptée à votre demande
          </p>
        </CardContent>
      </Card>

      {/* Lecteur actuel */}
      {currentTrack && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              En cours de lecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                <Badge className={getMoodColor(currentTrack.mood)}>
                  {currentTrack.mood}
                </Badge>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={playPrevious}>
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                size="icon" 
                onClick={() => isPlaying ? pauseTrack() : playTrack(currentTrack)}
                className="h-12 w-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button variant="outline" size="icon" onClick={playNext}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={([value]) => {
                  setVolume(value);
                  setIsMuted(value === 0);
                }}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">{isMuted ? 0 : volume}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playlist */}
      <Card>
        <CardHeader>
          <CardTitle>Playlist Thérapeutique</CardTitle>
          <CardDescription>
            Musiques sélectionnées pour le bien-être émotionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playlist.map((track) => (
              <div
                key={track.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted ${
                  currentTrack?.id === track.id ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => playTrack(track)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className={getMoodColor(track.mood)}>
                    {track.mood}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(track.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audio element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicTherapy;
