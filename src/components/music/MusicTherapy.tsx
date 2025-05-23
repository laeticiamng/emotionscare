
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Loader2, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  category: string;
  mood: string;
  duration: number;
  url: string;
  description: string;
}

const MusicTherapy: React.FC = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState([0.7]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMood, setSelectedMood] = useState('relaxation');

  // Predefined tracks (à remplacer par de vraies générations IA)
  const predefinedTracks: Track[] = [
    {
      id: '1',
      title: 'Sérénité Matinale',
      category: 'Relaxation',
      mood: 'relaxation',
      duration: 300,
      url: '/audio/relaxation-1.mp3',
      description: 'Douce mélodie pour commencer la journée en paix'
    },
    {
      id: '2',
      title: 'Focus Profond',
      category: 'Concentration',
      mood: 'focus',
      duration: 480,
      url: '/audio/focus-1.mp3',
      description: 'Ambiance sonore pour améliorer la concentration'
    },
    {
      id: '3',
      title: 'Énergie Positive',
      category: 'Motivation',
      mood: 'energetic',
      duration: 240,
      url: '/audio/energetic-1.mp3',
      description: 'Musique dynamisante pour booster votre moral'
    },
    {
      id: '4',
      title: 'Sommeil Réparateur',
      category: 'Sommeil',
      mood: 'sleep',
      duration: 600,
      url: '/audio/sleep-1.mp3',
      description: 'Sons apaisants pour faciliter l\'endormissement'
    }
  ];

  const [playlist, setPlaylist] = useState<Track[]>(predefinedTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const moods = [
    { value: 'relaxation', label: 'Relaxation', color: 'bg-blue-100 text-blue-800' },
    { value: 'focus', label: 'Concentration', color: 'bg-purple-100 text-purple-800' },
    { value: 'energetic', label: 'Énergisant', color: 'bg-orange-100 text-orange-800' },
    { value: 'sleep', label: 'Sommeil', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'meditation', label: 'Méditation', color: 'bg-green-100 text-green-800' },
    { value: 'anxiety', label: 'Anti-stress', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  const generateMusic = async () => {
    setIsGenerating(true);
    try {
      // Simuler la génération de musique avec IA
      // À remplacer par un vrai appel à l'API MusicGen
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTrack: Track = {
        id: Date.now().toString(),
        title: `Musique Générée - ${selectedMood}`,
        category: 'IA Générée',
        mood: selectedMood,
        duration: 300,
        url: `/audio/generated-${selectedMood}-${Date.now()}.mp3`,
        description: 'Musique personnalisée générée par IA selon votre humeur'
      };

      setPlaylist(prev => [newTrack, ...prev]);
      setCurrentTrack(newTrack);
      setCurrentTrackIndex(0);

      toast({
        title: "Musique générée !",
        description: "Votre musique personnalisée est prête",
        variant: "default"
      });
    } catch (error) {
      console.error('Music generation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la musique",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack && playlist.length > 0) {
      setCurrentTrack(playlist[0]);
      setCurrentTrackIndex(0);
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    }
  };

  const playNext = () => {
    if (currentTrackIndex < playlist.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      playTrack(playlist[nextIndex], nextIndex);
    }
  };

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      playTrack(playlist[prevIndex], prevIndex);
    }
  };

  const shufflePlaylist = () => {
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    toast({
      title: "Playlist mélangée",
      description: "L'ordre des morceaux a été aléatoirement modifié",
      variant: "default"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Music Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Générateur de Musique Thérapeutique IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Générez une musique personnalisée adaptée à votre état émotionnel actuel
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(mood.value)}
                  className="h-auto p-2 text-xs"
                >
                  {mood.label}
                </Button>
              ))}
            </div>

            <Button 
              onClick={generateMusic} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                'Générer ma musique personnalisée'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Music Player */}
      <Card>
        <CardHeader>
          <CardTitle>Lecteur Musical</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentTrack && (
            <div className="text-center space-y-2">
              <h3 className="font-medium">{currentTrack.title}</h3>
              <div className="flex items-center justify-center gap-2">
                <Badge className={moods.find(m => m.value === currentTrack.mood)?.color}>
                  {currentTrack.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentTrack.description}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {currentTrack && (
            <div className="space-y-2">
              <Slider
                value={[progress]}
                max={duration || 100}
                step={1}
                onValueChange={seekTo}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={playPrevious}
              disabled={currentTrackIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              size="icon"
              onClick={togglePlayPause}
              className="h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={playNext}
              disabled={currentTrackIndex === playlist.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={shufflePlaylist}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              max={1}
              step={0.1}
              onValueChange={setVolume}
              className="flex-1"
            />
          </div>

          <audio ref={audioRef} />
        </CardContent>
      </Card>

      {/* Playlist */}
      <Card>
        <CardHeader>
          <CardTitle>Ma Playlist Thérapeutique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentTrack?.id === track.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => playTrack(track, index)}
              >
                <div className="flex-1">
                  <div className="font-medium">{track.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {track.category} • {formatTime(track.duration)}
                  </div>
                </div>
                <Badge 
                  className={moods.find(m => m.value === track.mood)?.color}
                  variant="outline"
                >
                  {moods.find(m => m.value === track.mood)?.label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
