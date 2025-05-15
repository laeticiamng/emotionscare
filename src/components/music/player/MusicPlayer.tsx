
import React, { useState, useEffect } from 'react';
import { Disc, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from '@/types';
import PlayerControls from './PlayerControls';
import TrackInfo from '../TrackInfo';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

interface MusicPlayerProps {
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  showPlaylist?: boolean;
  hideControls?: boolean;
  darkTheme?: boolean;
  minimal?: boolean;
  compact?: boolean;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack = null,
  isPlaying = false,
  onPlay = () => {},
  onPause = () => {},
  onNext = () => {},
  onPrevious = () => {},
  onSeek = () => {},
  currentTime = 0,
  duration = 0,
  volume = 1,
  onVolumeChange = () => {},
  showPlaylist = false,
  hideControls = false,
  darkTheme = false,
  minimal = false,
  compact = false,
  className = ''
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [audioError, setAudioError] = useState<Error | null>(null);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset states when track changes
  useEffect(() => {
    if (currentTrack) {
      setLoadingTrack(true);
      setAudioError(null);
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setLoadingTrack(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentTrack?.id]);

  if (minimal) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {currentTrack ? (
          <>
            <TrackInfo 
              track={currentTrack} 
              loadingTrack={loadingTrack}
              compact={compact} 
              className="flex-1"
            />
            {!hideControls && (
              <PlayerControls 
                isPlaying={isPlaying}
                loadingTrack={loadingTrack}
                onPlay={onPlay}
                onPause={onPause}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Aucune piste en lecture</div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${darkTheme ? 'bg-muted/20' : 'bg-card'} ${className}`}>
      <div className="flex items-start mb-4 gap-4">
        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {currentTrack && (currentTrack.coverUrl || currentTrack.cover_url || currentTrack.cover) ? (
            <img 
              src={currentTrack.coverUrl || currentTrack.cover_url || currentTrack.cover}
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/music/default-cover.jpg';
              }}
            />
          ) : (
            <Disc className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-lg truncate">
            {loadingTrack ? 'Chargement...' : currentTrack?.title || 'Aucune piste sélectionnée'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {loadingTrack ? '...' : currentTrack?.artist || 'Artiste inconnu'}
          </p>
          
          <div className="mt-2">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              formatTime={formatTime}
              handleProgressClick={(e) => {
                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                onSeek(percentage * duration);
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <PlayerControls
          isPlaying={isPlaying}
          loadingTrack={loadingTrack}
          onPlay={onPlay}
          onPause={onPause}
          onPrevious={onPrevious}
          onNext={onNext}
        />
        
        <div className="flex items-center gap-2">
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button className="p-2 hover:bg-muted/50 rounded-full">
              {volume > 0 ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-full mb-2 p-2 bg-background border rounded shadow-md">
                <VolumeControl
                  volume={volume}
                  onVolumeChange={onVolumeChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
