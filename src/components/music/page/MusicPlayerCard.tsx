
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
  
  // Handle play/pause
  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
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
  
  return (
    <Card>
      <CardContent className="p-4">
        <MusicPlayer 
          track={currentTrack}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onNext={handleNextTrack}
          onPrevious={handlePreviousTrack}
          volume={volume}
          onVolumeChange={setVolume}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayerCard;
