
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
}

const MusicGeneratorPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState<Track[] | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  const { toast } = useToast();

  const emotions = [
    { value: 'happy', label: 'Heureux', description: 'Musique joyeuse et énergique pour booster votre moral' },
    { value: 'sad', label: 'Triste', description: 'Des sons réconfortants pour vous accompagner dans vos moments difficiles' },
    { value: 'calm', label: 'Calme', description: 'Mélodies apaisantes pour la relaxation et la méditation' },
    { value: 'energetic', label: 'Énergique', description: 'Rythmes dynamiques pour vous motiver et stimuler' },
    { value: 'focused', label: 'Concentré', description: 'Musique de fond idéale pour le travail et l\'étude' },
    { value: 'romantic', label: 'Romantique', description: 'Ambiance douce et chaleureuse pour les moments intimes' }
  ];

  const handleGeneratePlaylist = async () => {
    if (!selectedEmotion) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une émotion",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🎵 Génération de playlist pour:', selectedEmotion);
      
      const result = await activateMusicForEmotion({
        emotion: selectedEmotion,
        intensity: 0.8
      });

      if (result && result.tracks) {
        const tracks: Track[] = result.tracks.map((track: any, index: number) => ({
          id: track.id || `track-${index}`,
          title: track.title || track.name || `${selectedEmotion} Track ${index + 1}`,
          artist: track.artist || 'AI Composer',
          duration: track.duration || 180,
          url: track.url || track.audioUrl || '#'
        }));

        setPlaylist(tracks);
        setCurrentTrack(tracks[0]);
        setCurrentTrackIndex(0);
        
        toast({
          title: "Playlist générée !",
          description: `${tracks.length} morceaux créés pour l'émotion "${selectedEmotion}"`
        });
      }
    } catch (error) {
      console.error('❌ Erreur génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la playlist",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = () => {
    if (currentTrack) {
      setIsPlaying(true);
      console.log('▶️ Lecture:', currentTrack.title);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log('⏸️ Pause');
  };

  const handlePrevious = () => {
    if (playlist && currentTrackIndex > 0) {
      const newIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(newIndex);
      setCurrentTrack(playlist[newIndex]);
      setCurrentTime(0);
      console.log('⏮️ Piste précédente:', playlist[newIndex].title);
    }
  };

  const handleNext = () => {
    if (playlist && currentTrackIndex < playlist.length - 1) {
      const newIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(newIndex);
      setCurrentTrack(playlist[newIndex]);
      setCurrentTime(0);
      console.log('⏭️ Piste suivante:', playlist[newIndex].title);
    }
  };

  const handleSeek = (values: number[]) => {
    setCurrentTime(values[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedEmotionData = emotions.find(e => e.value === selectedEmotion);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Générateur de Musique</h1>
        <p className="text-lg text-muted-foreground">
          Créez des playlists personnalisées selon votre état émotionnel
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Sélection d'émotion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Choisissez votre état émotionnel :
            </label>
            <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une émotion" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emotion) => (
                  <SelectItem key={emotion.value} value={emotion.value}>
                    {emotion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmotionData && (
            <p className="text-sm text-muted-foreground italic">
              {selectedEmotionData.description}
            </p>
          )}

          <Button 
            onClick={handleGeneratePlaylist}
            disabled={isGenerating || !selectedEmotion}
            className="w-full"
            size="lg"
          >
            <Play className="mr-2 h-4 w-4" />
            {isGenerating ? 'Génération en cours...' : 'Générer la playlist'}
          </Button>
        </CardContent>
      </Card>

      {playlist && (
        <Card>
          <CardHeader>
            <CardTitle>
              Playlist {selectedEmotionData?.label}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {playlist.length} morceaux • {selectedEmotion}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lecteur musical */}
            {currentTrack && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={currentTrack.duration}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Contrôles de lecture */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    disabled={currentTrackIndex === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  {isPlaying ? (
                    <Button
                      size="icon"
                      onClick={handlePause}
                      className="h-12 w-12 rounded-full"
                    >
                      <Pause className="h-6 w-6" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      onClick={handlePlay}
                      className="h-12 w-12 rounded-full"
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    disabled={currentTrackIndex === playlist.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Contrôle du volume */}
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">
                    {volume[0]}%
                  </span>
                </div>

                {/* Status */}
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">
                    {isPlaying ? '🎵 En lecture' : '⏸️ En pause'} • 
                    Piste {currentTrackIndex + 1} sur {playlist.length}
                  </span>
                </div>
              </div>
            )}

            {/* Liste des pistes */}
            <div className="space-y-2">
              <h4 className="font-medium">Pistes de la playlist :</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {playlist.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                      index === currentTrackIndex ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                    onClick={() => {
                      setCurrentTrack(track);
                      setCurrentTrackIndex(index);
                      setCurrentTime(0);
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicGeneratorPage;
