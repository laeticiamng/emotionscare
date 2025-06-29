
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import Container from '@/components/layout/Container';

const MusicPage: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(1); // Index 1 car "Focus Profond" est sélectionné

  const tracks = [
    {
      id: 1,
      title: 'Méditation Matinale',
      artist: 'Sons de la Nature',
      duration: 180, // 3:00
      url: '/sounds/nature-calm.mp3'
    },
    {
      id: 2,
      title: 'Focus Profond',
      artist: 'Ambiance Zen',
      duration: 240, // 4:00
      url: '/sounds/focus-ambient.mp3'
    },
    {
      id: 3,
      title: 'Relaxation Océan',
      artist: 'Vagues Apaisantes',
      duration: 300, // 5:00
      url: '/sounds/ambient-calm.mp3'
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
      console.log('⏸️ Lecture en pause');
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        console.log('▶️ Lecture démarrée');
      }).catch(err => {
        console.error('Erreur lors de la lecture:', err);
      });
    }
  };

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
    console.log('⏮️ Piste précédente:', tracks[newIndex].title);
  };

  const handleNext = () => {
    const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
    console.log('⏭️ Piste suivante:', tracks[newIndex].title);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    console.log('🎯 Saut à:', Math.floor(newTime / 60) + ':' + String(Math.floor(newTime % 60)).padStart(2, '0'));
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    console.log('🔊 Volume:', Math.round(newVolume * 100) + '%');
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(false);
    console.log('🎵 Piste sélectionnée:', tracks[index].title);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          🎵 Lecteur de Musique EmotionsCare
        </h1>

        {/* Lecteur Audio Caché */}
        <audio 
          ref={audioRef} 
          src={currentTrack.url}
          preload="metadata"
        />

        {/* Lecteur Principal */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-center">🎵 En cours de lecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Piste */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{currentTrack.title}</h2>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
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
                className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700"
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
        <Card>
          <CardHeader>
            <CardTitle>Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrackIndex 
                      ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(track.duration)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default MusicPage;
