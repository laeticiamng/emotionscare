import React from 'react';
import { Card } from '@/components/ui/card';
import { MusicTrack } from '@/types/music';

interface MusicPlayerProps {
  tracks: MusicTrack[];
}

const MusicPlayerCard: React.FC<MusicPlayerProps> = ({ 
  tracks = [] // Provide default empty array
}) => {
  return (
    <Card>
      {/* You can add content here to display the music player */}
      {/* For example, a list of tracks or a simple message */}
      <p>Music Player Card</p>
    </Card>
  );
};

export default MusicPlayerCard;
