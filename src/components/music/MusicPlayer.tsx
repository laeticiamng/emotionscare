
import React from 'react';
import { useMusic } from '@/contexts/music';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume, VolumeX, Music } from 'lucide-react';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';
import { MusicContextType } from '@/types/music';

interface MusicProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  formatTime?: (seconds: number) => string;
}

const MusicProgressBar: React.FC<MusicProgressBarProps> = ({
  currentTime = 0,
  duration = 0,
  formatTime = (sec) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  },
  onSeek
}) => {
  return (
    <div className="w-full">
      <div className="relative h-1 bg-gray-300 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary"
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

const MusicPlayer: React.FC = () => {
  const music = useMusic() as MusicContextType;
  const { 
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    pauseTrack,
    resumeTrack,
    error
  } = music;
  
  // Valeurs par défaut si non disponibles dans le contexte
  const volume = music.volume !== undefined ? music.volume : 0.5;
  const currentTime = music.currentTime || 0;
  const duration = music.duration || 0;
  const previousTrack = music.previousTrack || (() => console.log('Previous track not implemented'));
  const seekTo = music.seekTo || ((time: number) => console.log('Seek not implemented', time));
  const setVolume = music.setVolume || ((vol: number) => console.log('Set volume not implemented', vol));
  const toggleMute = music.toggleMute || (() => console.log('Toggle mute not implemented'));
  const muted = music.muted !== undefined ? music.muted : false;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
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

  const coverUrl = getTrackCover(currentTrack);
  const title = getTrackTitle(currentTrack);
  const artist = getTrackArtist(currentTrack);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/20 p-4 rounded-lg shadow-inner">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Album cover and info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="min-w-12 h-12 bg-blue-200 dark:bg-blue-800/30 rounded shadow-md overflow-hidden">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-200 dark:bg-blue-800/30">
                <Music className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="font-medium text-blue-800 dark:text-blue-200 truncate">{title}</p>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70 truncate">{artist}</p>
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

          <MusicProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
            formatTime={formatTime}
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
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume className="h-4 w-4" />}
          </Button>
          <input
            type="range"
            min="0"
            max="100"
            value={(muted ? 0 : volume) * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
