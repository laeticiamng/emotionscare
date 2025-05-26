
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download } from 'lucide-react';

const SilkPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(null);

  const wallpapers = [
    {
      id: 'sunset',
      name: 'Coucher de soleil',
      description: 'Magnifique coucher de soleil apaisant',
      preview: 'bg-gradient-to-br from-orange-400 to-pink-600'
    },
    {
      id: 'ocean',
      name: 'Océan',
      description: 'Vagues bleues relaxantes',
      preview: 'bg-gradient-to-br from-blue-400 to-cyan-600'
    },
    {
      id: 'forest',
      name: 'Forêt',
      description: 'Verdure apaisante',
      preview: 'bg-gradient-to-br from-green-400 to-emerald-600'
    },
    {
      id: 'mountain',
      name: 'Montagne',
      description: 'Sommets majestueux',
      preview: 'bg-gradient-to-br from-gray-400 to-slate-600'
    },
    {
      id: 'lavender',
      name: 'Lavande',
      description: 'Champs de lavande violet',
      preview: 'bg-gradient-to-br from-purple-400 to-violet-600'
    },
    {
      id: 'aurora',
      name: 'Aurore boréale',
      description: 'Lumières magiques',
      preview: 'bg-gradient-to-br from-teal-400 to-blue-600'
    }
  ];

  const handleSelectWallpaper = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId);
  };

  const handleApplyWallpaper = () => {
    if (selectedWallpaper) {
      // En production, cela sauvegarderait la préférence de l'utilisateur
      localStorage.setItem('selectedWallpaper', selectedWallpaper);
      console.log(`Fond d'écran "${selectedWallpaper}" appliqué`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'accueil
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Fonds d'écran Silk
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Choisissez un fond d'écran qui vous inspire et vous apaise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {wallpapers.map((wallpaper) => (
          <Card 
            key={wallpaper.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedWallpaper === wallpaper.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSelectWallpaper(wallpaper.id)}
          >
            <CardContent className="p-0">
              <div className={`h-32 ${wallpaper.preview} rounded-t-lg relative`}>
                {selectedWallpaper === wallpaper.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {wallpaper.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {wallpaper.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedWallpaper && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Button onClick={handleApplyWallpaper}>
                  <Download className="mr-2 h-4 w-4" />
                  Appliquer le fond d'écran
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedWallpaper(null)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SilkPage;
