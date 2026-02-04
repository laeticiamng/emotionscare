/**
 * ARCameraPreview - Prévisualisation de la caméra avec filtres AR
 */

import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  FlipHorizontal, 
  X, 
  Download,
  Sparkles,
  Timer,
  CircleDot
} from 'lucide-react';
import { ARFilter, MoodImpact } from '../index';
import { cn } from '@/lib/utils';

interface ARCameraPreviewProps {
  filter: ARFilter | null;
  isActive: boolean;
  onCapture: () => void;
  onClose: () => void;
  onComplete: (moodImpact: MoodImpact) => void;
  photoCount: number;
  className?: string;
}

export const ARCameraPreview = memo<ARCameraPreviewProps>(({
  filter,
  isActive,
  onCapture,
  onClose,
  onComplete,
  photoCount,
  className,
}) => {
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [showMoodRating, setShowMoodRating] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Démarrer la caméra
  useEffect(() => {
    if (!isActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: isFrontCamera ? 'user' : 'environment' },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error('[AR Camera] Failed to access camera:', err);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isFrontCamera]);

  // Timer de session
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleCamera = useCallback(() => {
    setIsFrontCamera(prev => !prev);
  }, []);

  const handleEndSession = useCallback(() => {
    setShowMoodRating(true);
  }, []);

  const handleMoodSelect = useCallback((impact: MoodImpact) => {
    onComplete(impact);
    setShowMoodRating(false);
    setSessionDuration(0);
  }, [onComplete]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive || !filter) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 z-50 bg-black", className)}>
      {/* Prévisualisation vidéo */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          isFrontCamera && "scale-x-[-1]"
        )}
      />

      {/* Overlay du filtre */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: filter.type === 'mood-aura' 
            ? `radial-gradient(circle at 50% 30%, transparent 20%, rgba(100, 100, 255, ${filter.intensity / 200}) 80%)`
            : filter.type === 'zen-particles'
            ? `linear-gradient(to bottom, transparent 50%, rgba(255, 255, 255, ${filter.intensity / 400}) 100%)`
            : 'transparent',
          mixBlendMode: 'screen',
        }}
      />

      {/* En-tête */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-none">
            <Timer className="h-3 w-3 mr-1" />
            {formatDuration(sessionDuration)}
          </Badge>
          <Badge variant="secondary" className="bg-black/50 text-white border-none">
            <Camera className="h-3 w-3 mr-1" />
            {photoCount}
          </Badge>
        </div>
        <Badge className="bg-primary/80">{filter.name}</Badge>
      </div>

      {/* Modal de notation humeur */}
      {showMoodRating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 p-4"
        >
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Comment vous sentez-vous ?</h3>
              <p className="text-sm text-muted-foreground">
                Après cette session avec le filtre {filter.name}
              </p>
              
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => handleMoodSelect('negative')}
                  className="flex-1"
                >
                  😔 Moins bien
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleMoodSelect('neutral')}
                  className="flex-1"
                >
                  😐 Pareil
                </Button>
                <Button
                  onClick={() => handleMoodSelect('positive')}
                  className="flex-1"
                >
                  😊 Mieux
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Contrôles */}
      {!showMoodRating && (
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-6 z-10">
          {/* Fermer */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={handleEndSession}
            aria-label="Terminer la session"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Capture */}
          <Button
            size="icon"
            className="h-16 w-16 rounded-full bg-white text-black hover:bg-white/90"
            onClick={onCapture}
            aria-label="Prendre une photo"
          >
            <CircleDot className="h-8 w-8" />
          </Button>

          {/* Switch camera */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={toggleCamera}
            aria-label="Changer de caméra"
          >
            <FlipHorizontal className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
});

ARCameraPreview.displayName = 'ARCameraPreview';

export default ARCameraPreview;
