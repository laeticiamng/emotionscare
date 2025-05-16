
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/music';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import ProgressBar from '@/components/music/player/ProgressBar';

const MusicPlayer = () => {
  const { 
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    muted
  } = useMusic();

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-32 bg-card text-card-foreground p-4 rounded-md">
        <Music className="h-10 w-10 text-primary/50 mb-2" />
        <p className="text-muted-foreground">Aucune musique sélectionnée</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/20 p-4 rounded-lg shadow-inner">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Album cover and info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="min-w-12 h-12 bg-blue-200 dark:bg-blue-800/30 rounded shadow-md overflow-hidden">
            {currentTrack.coverUrl || currentTrack.coverImage ? (
              <img 
                src={currentTrack.coverUrl || currentTrack.coverImage} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-200 dark:bg-blue-800/30">
                <Music className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="font-medium text-blue-800 dark:text-blue-200 truncate">{currentTrack.title}</p>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls and progress */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousTrack}
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-full h-10 w-10 flex items-center justify-center"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              className="text-blue-700 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <ProgressBar
            currentTime={progress || 0}
            duration={duration || 0}
            formatTime={formatTime}
            onSeek={seekTo}
          />
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[muted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
