
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Musicothérapie</h1>
        <Card>
          <CardHeader>
            <CardTitle>Musique adaptée à vos émotions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Découvrez des playlists personnalisées selon votre état émotionnel.</p>
            <Button>Explorer la musique</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicPage;
