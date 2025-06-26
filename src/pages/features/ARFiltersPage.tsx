
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Download, Share2, Sparkles, Heart, Smile, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

const ARFiltersPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('calm-aura');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const arFilters = [
    {
      id: 'calm-aura',
      name: 'Aura Apaisante',
      description: 'Halo lumineux relaxant autour de vous',
      color: 'from-blue-400 to-purple-400',
      icon: <Sparkles className="h-5 w-5" />,
      mood: 'Calme'
    },
    {
      id: 'confidence-boost',
      name: 'Boost de Confiance',
      description: 'Éclat doré pour renforcer l\'estime de soi',
      color: 'from-yellow-400 to-orange-400',
      icon: <Star className="h-5 w-5" />,
      mood: 'Confiant'
    },
    {
      id: 'energy-spark',
      name: 'Étincelle d\'Énergie',
      description: 'Particules énergétiques dynamiques',
      color: 'from-green-400 to-cyan-400',
      icon: <Zap className="h-5 w-5" />,
      mood: 'Énergique'
    },
    {
      id: 'joy-bubbles',
      name: 'Bulles de Joie',
      description: 'Bulles colorées qui flottent autour',
      color: 'from-pink-400 to-rose-400',
      icon: <Smile className="h-5 w-5" />,
      mood: 'Joyeux'
    },
    {
      id: 'love-heart',
      name: 'Cœurs Bienveillants',
      description: 'Cœurs flottants pour l\'amour-propre',
      color: 'from-red-400 to-pink-400',
      icon: <Heart className="h-5 w-5" />,
      mood: 'Aimant'
    },
    {
      id: 'zen-lotus',
      name: 'Lotus Zen',
      description: 'Fleur de lotus pour la méditation',
      color: 'from-indigo-400 to-purple-400',
      icon: <Sparkles className="h-5 w-5" />,
      mood: 'Zen'
    }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      toast.success('Caméra activée !');
    } catch (error) {
      toast.error('Impossible d\'accéder à la caméra');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/png');
        setCapturedPhoto(photoData);
        toast.success('Photo capturée avec le filtre !');
      }
    }
  };

  const downloadPhoto = () => {
    if (capturedPhoto) {
      const link = document.createElement('a');
      link.download = `ar-filter-${selectedFilter}-${Date.now()}.png`;
      link.href = capturedPhoto;
      link.click();
      toast.success('Photo téléchargée !');
    }
  };

  const sharePhoto = async () => {
    if (capturedPhoto && navigator.share) {
      try {
        const response = await fetch(capturedPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'ar-filter-photo.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Mon moment bien-être avec EmotionsCare',
          text: 'J\'utilise les filtres AR pour booster mon moral !',
          files: [file]
        });
        toast.success('Photo partagée !');
      } catch (error) {
        toast.error('Partage non disponible sur cet appareil');
      }
    }
  };

  const selectedFilterData = arFilters.find(f => f.id === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Camera className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Filtres AR Bien-être
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Utilisez la réalité augmentée pour booster votre moral et capturer vos moments positifs
            </p>
          </div>

          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="camera">Caméra AR</TabsTrigger>
              <TabsTrigger value="filters">Filtres</TabsTrigger>
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Zone caméra */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Caméra AR</span>
                        <Badge className={`bg-gradient-to-r ${selectedFilterData?.color} text-white`}>
                          {selectedFilterData?.name}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          playsInline
                          muted
                        />
                        {/* Overlay pour simuler le filtre AR */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${selectedFilterData?.color} opacity-20 pointer-events-none`} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`w-32 h-32 rounded-full bg-gradient-to-br ${selectedFilterData?.color} opacity-30`}
                          />
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      
                      <div className="flex justify-center gap-3">
                        <Button onClick={startCamera} variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Activer Caméra
                        </Button>
                        <Button onClick={capturePhoto} size="lg">
                          <Camera className="h-4 w-4 mr-2" />
                          Capturer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contrôles */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Filtre Actuel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className={`p-4 rounded-lg bg-gradient-to-br ${selectedFilterData?.color} text-white text-center`}>
                        <div className="flex items-center justify-center mb-2">
                          {selectedFilterData?.icon}
                        </div>
                        <h3 className="font-semibold">{selectedFilterData?.name}</h3>
                        <p className="text-sm opacity-90">{selectedFilterData?.description}</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className="px-4 py-2">
                          Humeur: {selectedFilterData?.mood}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {capturedPhoto && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Photo Capturée</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={capturedPhoto} 
                            alt="Photo capturée" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={downloadPhoto} variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button onClick={sharePhoto} variant="outline" size="sm" className="flex-1">
                            <Share2 className="h-4 w-4 mr-2" />
                            Partager
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {arFilters.map((filter) => (
                  <motion.div
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${selectedFilter === filter.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
                      onClick={() => {
                        setSelectedFilter(filter.id);
                        toast.success(`Filtre ${filter.name} sélectionné`);
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {filter.icon}
                            {filter.name}
                          </CardTitle>
                          <Badge variant="outline">{filter.mood}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className={`h-32 rounded-lg bg-gradient-to-br ${filter.color} mb-3 flex items-center justify-center`}>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, 0]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="text-white text-2xl"
                          >
                            {filter.icon}
                          </motion.div>
                        </div>
                        <p className="text-sm text-muted-foreground">{filter.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <div className="text-center py-16">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Galerie vide</h3>
                <p className="text-muted-foreground mb-6">
                  Vos photos capturées avec les filtres AR apparaîtront ici
                </p>
                <Button onClick={() => document.querySelector('[value="camera"]')?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  Prendre une photo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ARFiltersPage;
