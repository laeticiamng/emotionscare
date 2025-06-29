
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plateforme de bien-être émotionnel avec musique thérapeutique adaptative
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link to="/music-generator">
            <Button className="w-full h-20 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group">
              <Music className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Générateur de Musique
            </Button>
          </Link>

          <Link to="/music">
            <Button variant="outline" className="w-full h-20 text-lg border-2 border-purple-300 hover:bg-purple-50 group">
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Lecteur Musical
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          Cliquez sur "Générateur de Musique" pour accéder à la nouvelle page fonctionnelle
        </div>
      </div>
    </div>
  );
};

export default Index;
