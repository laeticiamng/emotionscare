
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from 'lucide-react';
import { useHumeAI } from '@/hooks/useHumeAI'; // Fix import
import { EmotionResult } from '@/types/emotion';

export interface FacialEmotionScannerProps {
  onEmotionDetected: (emotion: EmotionResult) => void;
  className?: string;
  isScanning?: boolean;
  onToggleScanning?: () => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ 
  onEmotionDetected, 
  className,
  isScanning = false,
  onToggleScanning
}) => {
  const [scanning, setScanning] = useState(isScanning);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { isProcessing, processFacialExpression } = useHumeAI();
  
  useEffect(() => {
    setScanning(isScanning);
  }, [isScanning]);

  const startScan = async () => {
    try {
      const toggleScanning = () => {
        setScanning(prev => !prev);
        if (onToggleScanning) onToggleScanning();
      };

      toggleScanning();
      
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      videoRef.current.srcObject = stream;
      setError(null);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier vos permissions.');
      setScanning(false);
      if (onToggleScanning) onToggleScanning();
    }
  };
  
  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
    if (onToggleScanning) onToggleScanning();
  };
  
  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imgData = canvasRef.current.toDataURL('image/png');
        
        // Process the image
        try {
          const result = await processFacialExpression(imgData);
          if (result && result.dominantEmotion) {
            // Pass the complete emotion result
            onEmotionDetected(result);
          }
        } catch (err) {
          console.error('Error processing facial expression:', err);
          setError('Erreur lors de l\'analyse de l\'expression faciale.');
        }
        
        stopScan();
      }
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {scanning ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Camera className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex justify-center space-x-3">
          {scanning ? (
            <>
              <Button 
                onClick={captureImage}
                disabled={isProcessing}
                variant="default"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  'Capturer et analyser'
                )}
              </Button>
              <Button 
                onClick={stopScan}
                variant="secondary"
              >
                Annuler
              </Button>
            </>
          ) : (
            <Button onClick={startScan}>
              Scanner mon visage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FacialEmotionScanner;
