
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Musicothérapie</h1>
        <Card>
          <CardHeader>
            <CardTitle>Thérapie par la musique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Découvrez des playlists personnalisées pour votre bien-être.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicPage;
