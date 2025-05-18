
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MusicTrack } from '@/types/music';
import MusicPlayer from './MusicPlayer';

interface MusicPlayerCardProps {
  tracks: MusicTrack[];
}

const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ 
  tracks = [] // Provide default empty array
}) => {
  // State for the current track
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(
    tracks.length > 0 ? tracks[0] : null
  );
  
  // Basic player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Handle play/pause
  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  // Handle track change
  const handleNextTrack = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  };
  
  const handlePreviousTrack = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        {currentTrack && (
          <MusicPlayer 
            track={currentTrack}
            autoPlay={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNextTrack}
            onPrevious={handlePreviousTrack}
            onEnded={handleNextTrack}
            volume={volume}
            onVolumeChange={setVolume}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MusicPlayerCard;
