
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Heart, Timer, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import { useNavigate } from 'react-router-dom';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(1);

  const tracks = [
    {
      id: 1,
      title: 'Méditation Matinale',
      artist: 'Sons de la Nature',
      duration: 180, // 3:00
      url: '/sounds/nature-calm.mp3',
      category: 'Relaxation',
      mood: 'Calme'
    },
    {
      id: 2,
      title: 'Focus Profond',
      artist: 'Ambiance Zen',
      duration: 240, // 4:00
      url: '/sounds/focus-ambient.mp3',
      category: 'Concentration',
      mood: 'Focus'
    },
    {
      id: 3,
      title: 'Relaxation Océan',
      artist: 'Vagues Apaisantes',
      duration: 300, // 5:00
      url: '/sounds/ambient-calm.mp3',
      category: 'Détente',
      mood: 'Sérénité'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Erreur lors de la lecture:', err);
      });
    }
  };

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
  };

  const handleNext = () => {
    const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(false);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <PageLayout
      header={{
        title: 'Musicothérapie',
        subtitle: 'Thérapie par la musique adaptative',
        description: 'Découvrez notre collection de musiques thérapeutiques personnalisées selon votre état émotionnel et vos objectifs de bien-être.',
        icon: Music2,
        gradient: 'from-purple-500/20 to-pink-500/5',
        badge: 'Thérapie Sonore',
        stats: [
          {
            label: 'Pistes disponibles',
            value: '247',
            icon: Music2,
            color: 'text-purple-500'
          },
          {
            label: 'Temps d\'écoute',
            value: '12h',
            icon: Timer,
            color: 'text-blue-500'
          },
          {
            label: 'Satisfaction',
            value: '96%',
            icon: Heart,
            color: 'text-pink-500'
          },
          {
            label: 'Progression',
            value: '+18%',
            icon: TrendingUp,
            color: 'text-green-500'
          }
        ],
        actions: [
          {
            label: isPlaying ? 'Pause' : 'Lecture',
            onClick: handlePlayPause,
            variant: 'default',
            icon: isPlaying ? Pause : Play
          },
          {
            label: 'Ma Playlist',
            onClick: () => navigate('/music/playlist'),
            variant: 'outline',
            icon: Heart
          }
        ]
      }}
      tips={{
        title: 'Optimisez votre expérience musicale',
        items: [
          {
            title: 'Casque recommandé',
            content: 'Utilisez un casque de qualité pour une immersion complète',
            icon: Volume2
          },
          {
            title: 'Régularité',
            content: 'Écoutez 15-20 minutes par jour pour de meilleurs résultats',
            icon: Timer
          },
          {
            title: 'État d\'esprit',
            content: 'Choisissez la musique selon votre humeur du moment',
            icon: Heart
          }
        ],
        cta: {
          label: 'Guide de musicothérapie',
          onClick: () => navigate('/help-center#music-therapy-guide')
        }
      }}
    >
      <div className="space-y-8">
        {/* Lecteur Audio Caché */}
        <audio 
          ref={audioRef} 
          src={currentTrack.url}
          preload="metadata"
        />

        {/* Lecteur Principal */}
        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Music2 className="h-6 w-6 text-primary" />
              En cours de lecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Piste */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{currentTrack.title}</h2>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">{currentTrack.category}</span>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">{currentTrack.mood}</span>
              </div>
            </div>

            {/* Barre de Progression */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrevious}
                className="h-12 w-12"
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon"
                onClick={handlePlayPause}
                className="h-16 w-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNext}
                className="h-12 w-12"
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {/* Contrôle Volume */}
            <div className="flex items-center gap-3 max-w-xs mx-auto">
              <Volume2 className="h-5 w-5" />
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="flex-1 cursor-pointer"
              />
              <span className="text-sm w-12">{Math.round(volume * 100)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Playlist */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Playlist Recommandée</h2>
          <div className="grid gap-4">
            {tracks.map((track, index) => (
              <Card
                key={track.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  index === currentTrackIndex 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleTrackSelect(index)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === currentTrackIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Music2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {formatTime(track.duration)}
                    </div>
                    <div className="flex gap-1 mt-1">
                      <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">{track.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MusicPage;
