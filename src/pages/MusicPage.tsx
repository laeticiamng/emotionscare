
import React from 'react';
import AdaptiveMusicPlayer from '@/components/music/AdaptiveMusicPlayer';

const MusicPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Musicothérapie Adaptative</h1>
      <AdaptiveMusicPlayer />
    </div>
  );
};

export default MusicPage;
