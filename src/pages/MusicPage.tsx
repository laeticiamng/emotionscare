
import React from 'react';
import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-green-100 dark:bg-green-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thérapie Musicale
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Musiques adaptées à votre état émotionnel
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 h-32 w-32 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Music className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mélodie Apaisante</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Recommandée pour votre état actuel
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button variant="outline" size="icon">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="icon" className="bg-green-600 hover:bg-green-700">
              <Play className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Relaxation Profonde</span>
                <span className="text-sm text-gray-500">5:32</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Méditation Guidée</span>
                <span className="text-sm text-gray-500">8:15</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Sons de la Nature</span>
                <span className="text-sm text-gray-500">12:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
