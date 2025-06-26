
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, Heart, Star } from 'lucide-react';

const ARFiltersPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('calme');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const filters = [
    {
      id: 'calme',
      name: 'Sérénité',
      description: 'Aura apaisante bleu clair',
      color: 'bg-blue-500',
      emotion: 'Calme'
    },
    {
      id: 'joie',
      name: 'Joie',
      description: 'Particules dorées scintillantes',
      color: 'bg-yellow-500',
      emotion: 'Bonheur'
    },
    {
      id: 'energie',
      name: 'Énergie',
      description: 'Flammes orange dynamiques',
      color: 'bg-orange-500',
      emotion: 'Vitalité'
    },
    {
      id: 'amour',
      name: 'Amour',
      description: 'Cœurs roses flottants',
      color: 'bg-pink-500',
      emotion: 'Tendresse'
    },
    {
      id: 'concentration',
      name: 'Focus',
      description: 'Géométrie violette précise',
      color: 'bg-purple-500',
      emotion: 'Concentration'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Feuilles vertes dansantes',
      color: 'bg-green-500',
      emotion: 'Harmonie'
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Camera className="h-12 w-12 text-cyan-600 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              AR Filters
            </h1>
            <Sparkles className="h-12 w-12 text-cyan-600 ml-4" />
          </div>
          <p className="text-xl text-cyan-700 max-w-3xl mx-auto">
            Exprimez et renforcez vos émotions avec des filtres de réalité augmentée thérapeutiques
          </p>
        </motion.div>

        {/* Caméra virtuelle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <Card className="bg-black/80 border-cyan-200 shadow-xl backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                {isCameraActive ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg">Caméra active - Filtre: {filters.find(f => f.id === selectedFilter)?.name}</p>
                      <div className="mt-4 flex justify-center space-x-4">
                        <Heart className="h-8 w-8 text-pink-400 animate-bounce" />
                        <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
                        <Sparkles className="h-8 w-8 text-cyan-400 animate-spin" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Appuyez sur Démarrer pour activer la caméra</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={isCameraActive 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-cyan-600 hover:bg-cyan-700 text-white"
                  }
                >
                  {isCameraActive ? 'Arrêter' : 'Démarrer'}
                </Button>
                <Button
                  variant="outline"
                  className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                >
                  📸 Capturer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sélection de filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 border-cyan-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-700 text-center">Filtres Émotionnels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filters.map((filter) => (
                  <motion.div
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                      selectedFilter === filter.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 bg-white hover:border-cyan-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${filter.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-center text-gray-800">{filter.name}</h3>
                    <p className="text-sm text-gray-600 text-center mt-1">{filter.description}</p>
                    <Badge className="mt-2 mx-auto block w-fit bg-cyan-100 text-cyan-700">
                      {filter.emotion}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Options et contrôles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/80 border-cyan-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-700">Personnalisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-cyan-600">Intensité</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    defaultValue="70"
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-cyan-600">Vitesse</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue="5"
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-cyan-600">Opacité</label>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    defaultValue="80"
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-cyan-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-700">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  Enregistrer Vidéo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                >
                  Partager
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                >
                  Sauvegarder Filtre
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ARFiltersPage;
