
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MusicPlayer from './MusicPlayer';

const MusicPlayerCard: React.FC = () => {
  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <MusicPlayer />
      </CardContent>
    </Card>
  );
};

export default MusicPlayerCard;
