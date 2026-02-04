import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, CameraOff, Sparkles, Sun, Moon, Heart, 
  Smile, Cloud, Star, Palette, RefreshCw, Download,
  Share2, FlipHorizontal, Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ARFilter {
  id: string;
  name: string;
  category: 'emotion' | 'nature' | 'artistic' | 'wellness';
  icon: React.ReactNode;
  description: string;
  isPremium: boolean;
  cssFilter?: string;
  overlay?: string;
}

const AR_FILTERS: ARFilter[] = [
  {
    id: 'calm_glow',
    name: 'Aura Calme',
    category: 'emotion',
    icon: <Heart className="h-5 w-5" />,
    description: 'Halo apaisant autour du visage',
    isPremium: false,
    cssFilter: 'brightness(1.1) saturate(1.2) hue-rotate(10deg)'
  },
  {
    id: 'sunshine',
    name: 'Rayon de Soleil',
    category: 'nature',
    icon: <Sun className="h-5 w-5" />,
    description: 'Lumière dorée chaleureuse',
    isPremium: false,
    cssFilter: 'brightness(1.15) contrast(1.05) sepia(0.2)'
  },
  {
    id: 'moonlight',
    name: 'Clair de Lune',
    category: 'nature',
    icon: <Moon className="h-5 w-5" />,
    description: 'Ambiance nocturne relaxante',
    isPremium: false,
    cssFilter: 'brightness(0.9) saturate(0.8) contrast(1.1) hue-rotate(-10deg)'
  },
  {
    id: 'joy_burst',
    name: 'Éclat de Joie',
    category: 'emotion',
    icon: <Smile className="h-5 w-5" />,
    description: 'Confettis et étincelles',
    isPremium: false,
    cssFilter: 'brightness(1.2) saturate(1.3)'
  },
  {
    id: 'cloud_soft',
    name: 'Douceur Nuageuse',
    category: 'wellness',
    icon: <Cloud className="h-5 w-5" />,
    description: 'Effet brumeux relaxant',
    isPremium: true,
    cssFilter: 'brightness(1.05) contrast(0.95) blur(0.5px)'
  },
  {
    id: 'starlight',
    name: 'Lumière Stellaire',
    category: 'artistic',
    icon: <Star className="h-5 w-5" />,
    description: 'Scintillements magiques',
    isPremium: true,
    cssFilter: 'brightness(1.1) saturate(1.1) contrast(1.1)'
  },
  {
    id: 'dream_haze',
    name: 'Brume Onirique',
    category: 'artistic',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Effet rêveur éthéré',
    isPremium: true,
    cssFilter: 'brightness(1.1) saturate(0.9) blur(1px)'
  },
  {
    id: 'energy_boost',
    name: 'Boost d\'Énergie',
    category: 'wellness',
    icon: <Palette className="h-5 w-5" />,
    description: 'Couleurs vives dynamisantes',
    isPremium: false,
    cssFilter: 'brightness(1.15) saturate(1.4) contrast(1.1)'
  }
];

const ARFiltersUI: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ARFilter | null>(null);
  const [filterIntensity, setFilterIntensity] = useState([75]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoCapture, setAutoCapture] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsCameraOn(true);
      toast.success('Caméra activée');
    } catch {
      toast.error('Impossible d\'accéder à la caméra');
    }
  }, [isFrontCamera]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
  }, [stream]);

  const flipCamera = useCallback(async () => {
    stopCamera();
    setIsFrontCamera(!isFrontCamera);
    // La caméra sera redémarrée avec la nouvelle direction
  }, [stopCamera, isFrontCamera]);

  useEffect(() => {
    if (isCameraOn && !stream) {
      startCamera();
    }
  }, [isCameraOn, stream, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Appliquer le filtre CSS
    if (selectedFilter?.cssFilter) {
      ctx.filter = selectedFilter.cssFilter;
    }
    
    ctx.drawImage(video, 0, 0);
    
    // Télécharger l'image
    const link = document.createElement('a');
    link.download = `emotionscare-ar-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success('Photo enregistrée !');
  }, [selectedFilter]);

  const sharePhoto = useCallback(async () => {
    if (!navigator.share) {
      toast.error('Le partage n\'est pas supporté sur cet appareil');
      return;
    }

    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob | null>(resolve => 
        canvasRef.current?.toBlob(resolve, 'image/png')
      );
      
      if (blob) {
        const file = new File([blob], 'emotionscare-ar.png', { type: 'image/png' });
        await navigator.share({
          title: 'Ma photo EmotionsCare AR',
          files: [file]
        });
      }
    } catch {
      toast.error('Erreur lors du partage');
    }
  }, []);

  const getCategoryColor = (category: ARFilter['category']) => {
    switch (category) {
      case 'emotion': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'nature': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'artistic': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'wellness': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getAppliedFilter = () => {
    if (!selectedFilter?.cssFilter) return 'none';
    const intensity = filterIntensity[0] / 100;
    // Simplifier l'intensité pour le demo
    return selectedFilter.cssFilter;
  };

  return (
    <div className="space-y-6">
      {/* Zone caméra */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ filter: isCameraOn ? getAppliedFilter() : 'none' }}
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Overlay quand caméra éteinte */}
          {!isCameraOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <CameraOff className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Caméra inactive</p>
              <Button onClick={startCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Activer la caméra
              </Button>
            </div>
          )}

          {/* Contrôles caméra */}
          {isCameraOn && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={flipCamera}
              >
                <FlipHorizontal className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full h-16 w-16"
                onClick={capturePhoto}
              >
                <Camera className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={stopCamera}
              >
                <CameraOff className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Badge filtre actif */}
          {selectedFilter && isCameraOn && (
            <Badge 
              className="absolute top-4 left-4"
              variant="secondary"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {selectedFilter.name}
            </Badge>
          )}

          {/* Bouton settings */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* Paramètres */}
      {showSettings && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Capture automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Capturer lors de la détection de sourire
                </p>
              </div>
              <Switch
                checked={autoCapture}
                onCheckedChange={setAutoCapture}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Intensité du filtre</Label>
                <span className="text-sm font-medium">{filterIntensity[0]}%</span>
              </div>
              <Slider
                value={filterIntensity}
                onValueChange={setFilterIntensity}
                min={0}
                max={100}
                step={5}
                aria-label="Intensité du filtre"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sélection de filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Filtres AR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="emotion">Émotions</TabsTrigger>
              <TabsTrigger value="nature">Nature</TabsTrigger>
              <TabsTrigger value="wellness">Bien-être</TabsTrigger>
            </TabsList>

            {['all', 'emotion', 'nature', 'wellness', 'artistic'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AR_FILTERS
                    .filter(f => tab === 'all' || f.category === tab)
                    .map((filter) => (
                      <Button
                        key={filter.id}
                        variant={selectedFilter?.id === filter.id ? 'default' : 'outline'}
                        className={`h-auto p-4 flex-col gap-2 ${getCategoryColor(filter.category)}`}
                        onClick={() => setSelectedFilter(
                          selectedFilter?.id === filter.id ? null : filter
                        )}
                      >
                        <div className="relative">
                          {filter.icon}
                          {filter.isPremium && (
                            <Star className="h-3 w-3 absolute -top-1 -right-1 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <span className="text-xs font-medium">{filter.name}</span>
                      </Button>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Actions */}
          {selectedFilter && (
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedFilter(null)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={capturePhoto}
                disabled={!isCameraOn}
              >
                <Download className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={sharePhoto}
                disabled={!isCameraOn}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info filtre sélectionné */}
      {selectedFilter && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${getCategoryColor(selectedFilter.category)}`}>
                {selectedFilter.icon}
              </div>
              <div>
                <p className="font-medium">{selectedFilter.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedFilter.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ARFiltersUI;
