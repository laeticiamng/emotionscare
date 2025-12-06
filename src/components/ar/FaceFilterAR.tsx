// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, CameraOff, RotateCcw, Settings } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useARStore } from '@/store/ar.store';

interface FaceFilterARProps {
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

const FaceFilterAR: React.FC<FaceFilterARProps> = ({ onStart, onStop, className = '' }) => {
  const store = useARStore();
  const { videoRef, stream, startCamera, stopCamera, switchCamera, hasMultipleCameras, isLoading } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarted, setIsStarted] = useState(false);

  // Start AR session
  const handleStart = async () => {
    try {
      const mediaStream = await startCamera();
      if (mediaStream) {
        store.setActive(true);
        setIsStarted(true);
        onStart();
      }
    } catch (error) {
      // AR session start failed
    }
  };

  // Stop AR session
  const handleStop = () => {
    stopCamera();
    store.setActive(false);
    setIsStarted(false);
    onStop();
  };

  // Draw overlay effects on canvas
  const drawOverlay = React.useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !stream) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw subtle overlay effects based on emotion
    if (store.currentEmotion && !store.reducedMotion) {
      const { emotion, confidence } = store.currentEmotion;
      const alpha = Math.min(confidence * 0.3, 0.3); // Max 30% opacity

      ctx.save();
      
      switch (emotion) {
        case 'joy':
          // Soft golden glow
          ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
          
        case 'calm':
          // Gentle blue tint
          ctx.fillStyle = `rgba(135, 206, 235, ${alpha})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
          
        case 'surprise':
          // Light sparkle effect
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
          
        default:
          // Neutral warm overlay
          ctx.fillStyle = `rgba(255, 248, 220, ${alpha * 0.5})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.restore();
    }
  }, [stream, store.currentEmotion, store.reducedMotion]);

  // Animation loop for overlay
  useEffect(() => {
    if (!isStarted || !stream) return;

    let animationId: number;
    
    const animate = () => {
      drawOverlay();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isStarted, stream, drawOverlay]);

  return (
    <div className={`face-filter-ar ${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-muted aspect-video">
            {!isStarted ? (
              // Start screen
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Filtres Visage AR</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Active ta caméra pour détecter ton émotion
                    </p>
                    <Button 
                      onClick={handleStart} 
                      disabled={isLoading}
                      aria-label="Activer la caméra pour les filtres AR"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Activation...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Activer la caméra
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Active camera view
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
                
                {/* Overlay canvas */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {/* Controls overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    {hasMultipleCameras && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={switchCamera}
                        aria-label="Changer de caméra"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleStop}
                      aria-label="Arrêter la caméra"
                    >
                      <CameraOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Connection status */}
                <div className="absolute top-4 right-4">
                  <div className={`
                    w-3 h-3 rounded-full 
                    ${store.isConnected ? 'bg-green-500' : 'bg-red-500'}
                  `} />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Error display */}
      {store.error && (
        <Card className="mt-4 border-destructive/50">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{store.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaceFilterAR;