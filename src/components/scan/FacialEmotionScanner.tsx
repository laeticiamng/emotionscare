
import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCw } from 'lucide-react';
import { Emotion, EmotionResult } from '@/types/emotion';
import { useHumeAI } from '@/hooks/useHumeAI';

interface FacialEmotionScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ onEmotionDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { isProcessing, processFacialExpression } = useHumeAI();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erreur d'accès à la caméra",
        description: "Impossible d'accéder à votre webcam.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Convert to base64 data URL
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Process with Hume AI
        processFacialExpression(imageData).then(result => {
          if (result) {
            // Create appropriate result structure for emotions
            const dominantEmotion: Emotion = {
              name: result.dominantEmotion?.name || "neutral",
              intensity: result.dominantEmotion?.intensity || 0.5
            };
            
            // Create result with the emotion
            const emotionResult: EmotionResult = {
              emotions: result.emotions || [],
              dominantEmotion,
              intensity: dominantEmotion.intensity,
              source: 'facial',
              faceDetected: true,
              timestamp: new Date().toISOString()
            };
            
            if (onEmotionDetected) {
              onEmotionDetected(emotionResult);
            }
          }
        });
      }
    }
  }, [onEmotionDetected, processFacialExpression]);

  return (
    <Card className="p-4 overflow-hidden">
      <div className="space-y-4">
        <div className="relative">
          <video 
            ref={videoRef} 
            className={`w-full rounded-md ${isScanning ? 'block' : 'hidden'}`}
            autoPlay 
            playsInline
            muted
          />
          
          <canvas 
            ref={canvasRef} 
            className="hidden" // Hidden canvas for image processing
          />
          
          {!isScanning && (
            <div className="bg-muted h-48 flex items-center justify-center rounded-md">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          {!isScanning ? (
            <Button onClick={startCamera} className="w-full">
              Activer la caméra
            </Button>
          ) : (
            <div className="flex w-full gap-2">
              <Button onClick={captureImage} disabled={isProcessing} className="flex-1">
                {isProcessing ? 'Analyse en cours...' : 'Analyser l\'expression'}
              </Button>
              <Button onClick={stopCamera} variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FacialEmotionScanner;
