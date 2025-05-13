
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

export interface FacialEmotionScannerProps {
  onEmotionDetected: (result: EmotionResult) => void;
  compact?: boolean;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ 
  onEmotionDetected,
  compact = false
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      setVideoStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      onEmotionDetected({
        error: 'Impossible d\'accéder à la caméra. Veuillez vérifier vos permissions.',
        emotion: 'neutral',
        score: 0.5
      });
    }
  };
  
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };
  
  const analyzeEmotion = async () => {
    setIsScanning(true);
    
    try {
      // In a real implementation, you would:
      // 1. Capture a frame from the video
      // 2. Send it to your emotion detection API
      // 3. Process the result
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const mockResult: EmotionResult = {
        emotion: 'joy',
        score: 0.8,
        confidence: 0.85,
        primaryEmotion: {
          name: 'joy',
          intensity: 0.8
        }
      };
      
      onEmotionDetected(mockResult);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      onEmotionDetected({
        error: 'Erreur lors de l\'analyse de l\'émotion',
        emotion: 'neutral',
        score: 0.5
      });
    } finally {
      setIsScanning(false);
      stopCamera();
    }
  };
  
  return (
    <div className="space-y-4">
      {videoStream ? (
        <div className="relative">
          <video 
            ref={videoRef} 
            autoPlay 
            muted
            className={`w-full ${compact ? 'h-48' : 'h-64'} object-cover rounded-lg bg-black`}
          />
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button
              onClick={analyzeEmotion}
              disabled={isScanning}
              variant="secondary"
              className="shadow-lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Capturer et analyser'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center ${compact ? 'h-48' : 'h-64'} bg-muted rounded-lg`}>
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Activer la caméra
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Votre confidentialité est respectée. Aucune image n'est stockée.
          </p>
        </div>
      )}
    </div>
  );
};

export default FacialEmotionScanner;
