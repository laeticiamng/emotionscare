
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

/**
 * Page de musicothérapie
 */
const MusicPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Music className="h-8 w-8 text-purple-600" />
          Musicothérapie
        </h1>
        <p className="text-gray-600">
          Découvrez des musiques adaptées à vos émotions du moment
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lecteur Musical Adaptatif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Module de musicothérapie en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicPage;
