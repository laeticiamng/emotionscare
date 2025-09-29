import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, RotateCcw, Loader2, Zap } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { motion } from 'framer-motion';

interface LiveScannerProps {
  onAnalyze: (video: HTMLVideoElement) => void;
  loading?: boolean;
}

export const LiveScanner: React.FC<LiveScannerProps> = ({
  onAnalyze,
  loading = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const {
    videoRef,
    isActive,
    hasPermission,
    error,
    startCamera,
    stopCamera,
    swapCamera,
    captureFrame
  } = useCamera({
    onPermissionDenied: () => {
      // Fallback to photo mode could be implemented here
    }
  });

  const handleAnalyze = () => {
    if (!videoRef.current || !isActive) return;
    
    setIsAnalyzing(true);
    onAnalyze(videoRef.current);
    
    // Reset analyzing state after a delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (error || hasPermission === false) {
    return (
      <div className="text-center space-y-4 py-8">
        <CameraOff className="w-16 h-16 mx-auto text-muted-foreground" />
        <div>
          <p className="text-lg font-medium text-foreground">
            Accès à la caméra refusé
          </p>
          <p className="text-sm text-muted-foreground">
            Veuillez autoriser l'accès à la caméra ou utiliser le mode Photo
          </p>
        </div>
        <Button
          variant="outline"
          onClick={startCamera}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            
            {/* Overlay for analysis */}
            {(loading || isAnalyzing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
                  <p className="text-sm">Analyse en cours...</p>
                </div>
              </motion.div>
            )}

            {/* Frame overlay */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary"></div>
            </div>

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                En direct
              </Badge>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 mx-auto opacity-50" />
              <div>
                <p className="text-lg font-medium">Caméra inactive</p>
                <p className="text-sm opacity-75">
                  Cliquez pour activer votre caméra
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={startCamera}
            className="flex-1"
            aria-label="Activer la caméra"
          >
            <Camera className="w-4 h-4 mr-2" />
            Activer la caméra
          </Button>
        ) : (
          <>
            <Button
              onClick={handleAnalyze}
              disabled={loading || isAnalyzing}
              className="flex-1"
              aria-label="Analyser l'image actuelle"
            >
              {loading || isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Analyser
            </Button>
            
            <Button
              variant="outline"
              onClick={swapCamera}
              disabled={loading || isAnalyzing}
              aria-label="Changer de caméra"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={stopCamera}
              disabled={loading || isAnalyzing}
              aria-label="Arrêter la caméra"
            >
              <CameraOff className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Positionnez votre visage dans le cadre et cliquez sur Analyser
      </div>
    </div>
  );
};