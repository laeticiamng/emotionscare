
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useHumeAI } from '@/hooks/useHumeAI';
import { EmotionResult } from '@/types/emotion';

interface FacialEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  autoStart?: boolean;
  continuous?: boolean;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onEmotionDetected,
  autoStart = false,
  continuous = false
}) => {
  const { 
    startCamera, 
    stopCamera,
    processFaceEmotion,
    isProcessing,
    error,
    cameraActive 
  } = useHumeAI();
  const [scanResult, setScanResult] = useState<EmotionResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (autoStart) {
      handleStartCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [autoStart]);

  const handleStartCamera = async () => {
    try {
      await startCamera(videoRef);
      if (continuous) {
        startContinuousScan();
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const startContinuousScan = () => {
    const interval = setInterval(async () => {
      if (cameraActive && !isProcessing) {
        await handleScan();
      }
    }, 5000); // Scan every 5 seconds
    
    return () => clearInterval(interval);
  };

  const handleScan = async () => {
    if (!cameraActive || isProcessing) return;
    
    try {
      if (videoRef.current && canvasRef.current) {
        const result = await processFaceEmotion(videoRef.current, canvasRef.current);
        setScanResult(result);
        if (onEmotionDetected) {
          onEmotionDetected(result);
        }
      }
    } catch (err) {
      console.error("Scan error:", err);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="aspect-video bg-muted relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full opacity-0"
          />
          
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
              <Camera size={48} className="mb-4" />
              <p className="text-center text-sm mb-4">
                L'analyse faciale nécessite l'accès à votre caméra
              </p>
              <Button onClick={handleStartCamera} variant="secondary">
                Activer la caméra
              </Button>
            </div>
          )}
          
          {error && (
            <div className="absolute bottom-0 left-0 right-0 bg-destructive text-white p-2 text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <div>
            {scanResult && (
              <div className="text-sm">
                <span className="font-medium">Détecté: </span>
                <span className="text-primary">{scanResult.emotion}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({Math.round(scanResult.confidence * 100)}%)
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {cameraActive ? (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => stopCamera()}
                >
                  <CameraOff className="h-4 w-4 mr-2" />
                  Arrêter
                </Button>
                <Button 
                  size="sm"
                  onClick={handleScan}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  Analyser
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleStartCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Activer la caméra
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacialEmotionScanner;
