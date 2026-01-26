import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  artwork?: string;
}

interface AudioPlayerProps {
  tracks: AudioTrack[];
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  autoPlay?: boolean;
  showPlaylist?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  currentTrackIndex = 0,
  onTrackChange,
  autoPlay = false,
  showPlaylist = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(currentTrackIndex);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (autoPlay) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentIndex, currentTrack, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentIndex(newIndex);
    onTrackChange?.(newIndex);
  };

  const handleNext = () => {
    let newIndex;
    if (isShuffle) {
      newIndex = Math.floor(Math.random() * tracks.length);
    } else {
      newIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    }
    setCurrentIndex(newIndex);
    onTrackChange?.(newIndex);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && currentTrack) {
      const newTime = (value[0] / 100) * currentTrack.duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current?.play();
    } else {
      handleNext();
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setCurrentTime(0);
          }
        }}
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {currentTrack.artwork && (
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
            </div>
            <Badge variant="secondary">
              {formatTime(currentTime)} / {formatTime(currentTrack.duration)}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffle(!isShuffle)}
              className={isShuffle ? 'text-primary' : ''}
              aria-label={isShuffle ? "Désactiver le mode aléatoire" : "Activer le mode aléatoire"}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handlePrevious} aria-label="Piste précédente">
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button size="icon" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Lecture"}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Piste suivante">
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRepeat(!isRepeat)}
              className={isRepeat ? 'text-primary' : ''}
              aria-label={isRepeat ? "Désactiver la répétition" : "Activer la répétition"}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? "Activer le son" : "Couper le son"}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Playlist */}
      {showPlaylist && tracks.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Playlist ({tracks.length} titres)</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    index === currentIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    onTrackChange?.(index);
                  }}
                >
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(track.duration)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudioPlayer;
