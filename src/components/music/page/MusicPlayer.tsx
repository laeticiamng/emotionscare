
import React, { useState, useEffect } from 'react';
import { MusicTrack } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  track: MusicTrack | null;
  onNext: () => void;
  onPrevious: () => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (value: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  onNext,
  onPrevious,
  onPlay,
  onPause,
  isPlaying,
  volume,
  onVolumeChange
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [track, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const seekTime = value[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {track && (
          <>
            <div className="flex flex-col items-center mb-4">
              <h3 className="text-lg font-medium">{track.title}</h3>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>

            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={onNext}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 0.1}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />

              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  disabled={!track}
                >
                  <SkipBack size={20} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleTogglePlay}
                  disabled={!track}
                  className="h-12 w-12 rounded-full"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  disabled={!track}
                >
                  <SkipForward size={20} />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleMute}
                  className="h-8 w-8"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => onVolumeChange(value[0])}
                  className="w-24"
                />
              </div>
            </div>
          </>
        )}

        {!track && (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Select a track to play</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
