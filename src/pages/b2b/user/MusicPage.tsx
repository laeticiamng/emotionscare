
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserMusicPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Thérapie Musicale</h1>
      <Card>
        <CardHeader>
          <CardTitle>Musique adaptative</CardTitle>
          <CardDescription>Playlists basées sur vos émotions</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de thérapie musicale à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserMusicPage;
