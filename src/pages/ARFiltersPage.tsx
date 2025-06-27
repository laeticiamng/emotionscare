
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, Heart, Sun, Moon, Star, Smile, Zap } from 'lucide-react';
import { toast } from 'sonner';

const ARFiltersPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const emotionFilters = [
    {
      id: 'joy',
      name: 'Joie Dorée',
      icon: Sun,
      color: 'from-yellow-400 to-orange-400',
      description: 'Rayonnez de bonheur avec des particules dorées',
      effect: 'golden-sparkles'
    },
    {
      id: 'serenity',
      name: 'Sérénité Bleue',
      icon: Moon,
      color: 'from-blue-400 to-purple-400',
      description: 'Apaisement avec des vagues lumineuses douces',
      effect: 'calm-waves'
    },
    {
      id: 'love',
      name: 'Amour Rose',
      icon: Heart,
      color: 'from-pink-400 to-red-400',
      description: 'Cœurs flottants et aura chaleureuse',
      effect: 'floating-hearts'
    },
    {
      id: 'energy',
      name: 'Énergie Électrique',
      icon: Zap,
      color: 'from-green-400 to-cyan-400',
      description: 'Éclairs d\'énergie et vitalité',
      effect: 'electric-energy'
    },
    {
      id: 'wonder',
      name: 'Émerveillement',
      icon: Star,
      color: 'from-purple-400 to-pink-400',
      description: 'Étoiles magiques et éclat mystique',
      effect: 'magic-stars'
    },
    {
      id: 'confidence',
      name: 'Confiance Solaire',
      icon: Smile,
      color: 'from-orange-400 to-yellow-400',
      description: 'Aura de confiance rayonnante',
      effect: 'confident-glow'
    }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        toast.success('Caméra activée ! Sélectionnez un filtre émotionnel');
      }
    } catch (error) {
      toast.error('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setSelectedFilter(null);
  };

  const applyFilter = (filter: any) => {
    setSelectedFilter(filter);
    toast.success(`Filtre "${filter.name}" appliqué !`);
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.success('Enregistrement démarré !');
    
    // Simulation d'enregistrement
    setTimeout(() => {
      setIsRecording(false);
      toast.success('Vidéo sauvegardée avec votre filtre émotionnel !');
    }, 5000);
  };

  const takePhoto = () => {
    toast.success('Photo capturée avec votre aura émotionnelle !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AR Filters
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transformez vos émotions en filtres de réalité augmentée magiques
          </p>
          <Badge variant="secondary" className="mt-4 bg-indigo-100 text-indigo-700">
            Réalité Augmentée Émotionnelle
          </Badge>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Zone caméra */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-600" />
                  Caméra AR
                  {selectedFilter && (
                    <Badge className={`ml-2 bg-gradient-to-r ${selectedFilter.color} text-white`}>
                      {selectedFilter.name}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {selectedFilter && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${selectedFilter.color} opacity-20 animate-pulse`} />
                      )}
                      {selectedFilter && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-4 left-4 text-white font-semibold bg-black/50 px-3 py-1 rounded-full"
                        >
                          {selectedFilter.name} actif
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-4">Activez votre caméra pour commencer</p>
                        <Button onClick={startCamera} className="bg-indigo-600 hover:bg-indigo-700">
                          <Camera className="w-4 h-4 mr-2" />
                          Démarrer la caméra
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {cameraActive && (
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={takePhoto}
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button
                      onClick={startRecording}
                      disabled={isRecording}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      {isRecording ? (
                        <>
                          <div className="w-4 h-4 mr-2 bg-red-500 rounded-full animate-pulse" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 mr-2 bg-red-500 rounded-full" />
                          Vidéo
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="border-gray-500 text-gray-600 hover:bg-gray-50"
                    >
                      Arrêter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Filtres disponibles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Filtres Émotionnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emotionFilters.map((filter) => {
                    const IconComponent = filter.icon;
                    return (
                      <motion.div
                        key={filter.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => applyFilter(filter)}
                          variant={selectedFilter?.id === filter.id ? 'default' : 'outline'}
                          className={`w-full p-4 h-auto justify-start ${
                            selectedFilter?.id === filter.id
                              ? `bg-gradient-to-r ${filter.color} text-white hover:opacity-90`
                              : 'hover:bg-gray-50'
                          }`}
                          disabled={!cameraActive}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              selectedFilter?.id === filter.id 
                                ? 'bg-white/20' 
                                : `bg-gradient-to-r ${filter.color}`
                            }`}>
                              <IconComponent className={`w-4 h-4 ${
                                selectedFilter?.id === filter.id ? 'text-white' : 'text-white'
                              }`} />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{filter.name}</div>
                              <div className={`text-xs ${
                                selectedFilter?.id === filter.id ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {filter.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                {!cameraActive && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Activez votre caméra pour utiliser les filtres AR
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Camera className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Réalité Augmentée</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Filtres Magiques</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800 text-sm">Émotions Visuelles</h4>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
            <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-semibf ext-gray-800 text-sm">Expérience Unique</h4>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ARFiltersPage;
