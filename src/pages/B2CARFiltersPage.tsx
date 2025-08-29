import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Zap, 
  Heart, 
  Smile, 
  Sparkles, 
  Palette,
  Download,
  Share2,
  RotateCcw,
  Settings,
  Eye,
  Star,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useToast } from '@/hooks/use-toast';

interface ARFilter {
  id: string;
  name: string;
  emotion: 'joy' | 'calm' | 'energy' | 'confidence' | 'mystery' | 'love';
  intensity: number;
  color: string;
  icon: string;
  premium: boolean;
}

const B2CARFiltersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  usePageMetadata('AR Filters', 'Filtres de réalité augmentée émotionnels adaptatifs', '/app/face-ar', 'energized');

  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ARFilter | null>(null);
  const [filterIntensity, setFilterIntensity] = useState([70]);
  const [emotionDetected, setEmotionDetected] = useState<string>('neutre');
  const [confidenceLevel, setConfidenceLevel] = useState(85);
  const [isRecording, setIsRecording] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);

  const arFilters: ARFilter[] = [
    {
      id: 'joy-burst',
      name: 'Joy Burst',
      emotion: 'joy',
      intensity: 80,
      color: 'from-yellow-400 to-orange-500',
      icon: '😄',
      premium: false
    },
    {
      id: 'zen-aura',
      name: 'Zen Aura',
      emotion: 'calm',
      intensity: 65,
      color: 'from-blue-400 to-cyan-500',
      icon: '🧘‍♀️',
      premium: false
    },
    {
      id: 'energy-lightning',
      name: 'Energy Lightning',
      emotion: 'energy',
      intensity: 90,
      color: 'from-purple-500 to-pink-500',
      icon: '⚡',
      premium: true
    },
    {
      id: 'confidence-crown',
      name: 'Confidence Crown',
      emotion: 'confidence',
      intensity: 85,
      color: 'from-amber-400 to-yellow-500',
      icon: '👑',
      premium: true
    },
    {
      id: 'mystic-eyes',
      name: 'Mystic Eyes',
      emotion: 'mystery',
      intensity: 75,
      color: 'from-indigo-500 to-purple-600',
      icon: '🔮',
      premium: true
    },
    {
      id: 'love-hearts',
      name: 'Love Hearts',
      emotion: 'love',
      intensity: 70,
      color: 'from-pink-400 to-rose-500',
      icon: '💖',
      premium: false
    }
  ];

  useEffect(() => {
    // Simulation de détection d'émotion
    if (cameraActive) {
      const emotions = ['joie', 'calme', 'énergie', 'confiance', 'mystère', 'amour', 'neutre'];
      const interval = setInterval(() => {
        setEmotionDetected(emotions[Math.floor(Math.random() * emotions.length)]);
        setConfidenceLevel(Math.floor(Math.random() * 30) + 70);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [cameraActive]);

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
      
      setCameraActive(true);
      toast({
        title: "Caméra activée",
        description: "Positionnez votre visage dans le cadre",
      });
    } catch (error) {
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
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

  const applyFilter = (filter: ARFilter) => {
    if (filter.premium) {
      toast({
        title: "Filtre Premium",
        description: "Upgrader votre compte pour accéder à ce filtre",
        variant: "default"
      });
      return;
    }
    
    setSelectedFilter(filter);
    toast({
      title: "Filtre appliqué",
      description: `${filter.name} activé avec ${filter.emotion}`,
    });
  };

  const takePhoto = () => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoUrl = canvas.toDataURL('image/jpeg');
        setSavedPhotos(prev => [photoUrl, ...prev.slice(0, 5)]);
        
        toast({
          title: "Photo capturée !",
          description: "Votre selfie avec filtre AR a été sauvegardé",
        });
      }
    }
  };

  const getEmotionColor = () => {
    switch (emotionDetected) {
      case 'joie': return 'text-yellow-600';
      case 'calme': return 'text-blue-600';
      case 'énergie': return 'text-purple-600';
      case 'confiance': return 'text-amber-600';
      case 'mystère': return 'text-indigo-600';
      case 'amour': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/app/home')}
            className="hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Face AR Filters</h1>
            <p className="text-gray-600">Filtres de réalité augmentée adaptatifs à vos émotions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Caméra et prévisualisation */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-6 h-6 text-purple-500" />
                    Vue Caméra
                  </div>
                  <Badge variant={cameraActive ? "default" : "secondary"}>
                    {cameraActive ? 'Active' : 'Inactive'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover transform -scale-x-100"
                        autoPlay
                        playsInline
                        muted
                      />
                      
                      {/* Overlay de filtre */}
                      {selectedFilter && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: filterIntensity[0] / 100 }}
                          className={`absolute inset-0 bg-gradient-to-br ${selectedFilter.color} mix-blend-soft-light pointer-events-none`}
                        />
                      )}
                      
                      {/* Interface de détection d'émotion */}
                      <div className="absolute top-4 left-4">
                        <Card className="bg-black/60 border-white/20 text-white">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Eye className="w-4 h-4" />
                              <span>Émotion détectée:</span>
                            </div>
                            <div className={`text-lg font-bold ${getEmotionColor()}`}>
                              {emotionDetected.charAt(0).toUpperCase() + emotionDetected.slice(1)}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span>Confiance:</span>
                              <Progress value={confidenceLevel} className="w-16 h-1" />
                              <span>{confidenceLevel}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Nom du filtre actuel */}
                      {selectedFilter && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-black/60 text-white">
                            {selectedFilter.icon} {selectedFilter.name}
                          </Badge>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-4">Caméra désactivée</p>
                        <Button onClick={startCamera} size="lg">
                          <Camera className="w-5 h-5 mr-2" />
                          Activer la Caméra
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contrôles de la caméra */}
                {cameraActive && (
                  <div className="flex gap-4 justify-center mt-6">
                    <Button 
                      onClick={takePhoto}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capturer
                    </Button>
                    
                    <Button 
                      onClick={() => setIsRecording(!isRecording)}
                      size="lg"
                      variant="outline"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isRecording ? 'Arrêter' : 'Enregistrer'}
                    </Button>
                    
                    <Button 
                      onClick={stopCamera}
                      size="lg"
                      variant="destructive"
                    >
                      Arrêter
                    </Button>
                  </div>
                )}

                {/* Contrôle d'intensité du filtre */}
                {selectedFilter && cameraActive && (
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Intensité du filtre</label>
                      <Badge variant="outline">{filterIntensity[0]}%</Badge>
                    </div>
                    <Slider
                      value={filterIntensity}
                      onValueChange={setFilterIntensity}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Galerie de filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 w-6 text-yellow-500" />
                  Collection de Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {arFilters.map((filter) => (
                    <motion.div
                      key={filter.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all relative ${
                          selectedFilter?.id === filter.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => cameraActive && applyFilter(filter)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{filter.icon}</div>
                          <h4 className="font-semibold text-sm mb-1">{filter.name}</h4>
                          <div className="text-xs text-gray-600 mb-2 capitalize">{filter.emotion}</div>
                          
                          <div className={`w-full h-2 rounded-full bg-gradient-to-r ${filter.color} mb-2`} />
                          
                          {filter.premium && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          
                          {!cameraActive && (
                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs">Caméra requise</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Statut et paramètres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Statut AR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Caméra</span>
                    <Badge variant={cameraActive ? "default" : "secondary"}>
                      {cameraActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Détection faciale</span>
                    <Badge variant={cameraActive ? "default" : "secondary"}>
                      {cameraActive ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Filtre actuel</span>
                    <Badge variant="outline">
                      {selectedFilter ? selectedFilter.name : 'Aucun'}
                    </Badge>
                  </div>
                </div>

                {cameraActive && (
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">Performance</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>FPS:</span>
                        <span className="text-green-600">30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latence:</span>
                        <span className="text-green-600">12ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={!selectedFilter}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager Filtre
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={savedPhotos.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter Photos
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedFilter(null)}
                  disabled={!selectedFilter}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Supprimer Filtre
                </Button>
              </CardContent>
            </Card>

            {/* Galerie de captures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-500" />
                  Captures Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedPhotos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune capture</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {savedPhotos.slice(0, 4).map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={photo} 
                          alt={`Capture ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CARFiltersPage;