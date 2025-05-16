
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MusicTrack } from '@/types/music';
import MusicPlayer from './MusicPlayer';

interface MusicPlayerCardProps {
  tracks: MusicTrack[];
}

const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ 
  tracks = [] // Provide default empty array
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <MusicPlayer tracks={tracks} />
      </CardContent>
    </Card>
  );
};

export default MusicPlayerCard;
