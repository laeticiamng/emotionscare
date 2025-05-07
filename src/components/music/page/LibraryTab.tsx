
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import MusicLibrary from './MusicLibrary';

const LibraryTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bibliothèque musicale</CardTitle>
        <CardDescription>Explorez notre collection de playlists thérapeutiques</CardDescription>
      </CardHeader>
      <CardContent>
        <MusicLibrary />
      </CardContent>
    </Card>
  );
};

export default LibraryTab;
