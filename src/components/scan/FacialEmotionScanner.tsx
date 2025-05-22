
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Camera, X, Smile } from 'lucide-react';
import { emotions } from '@/types/emotion';

interface FacialEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onScanComplete,
  onCancel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  useEffect(() => {
    // Check if we already have permission
    navigator.permissions?.query({ name: 'camera' as PermissionName })
      .then(result => {
        setPermission(result.state as 'granted' | 'denied' | 'prompt');
        
        if (result.state === 'granted') {
          startCamera();
        }
      })
      .catch(err => {
        console.log('Permissions API not supported, assuming prompt', err);
      });
      
    return () => {
      // Clean up on unmount
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      setStream(mediaStream);
      setIsCapturing(true);
      setPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setPermission('denied');
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };
  
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Begin processing
    setIsProcessing(true);
    
    try {
      // Simulate emotion analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, we would send the image to an API for analysis
      // For demo, we'll just pick a random emotion
      const randomIndex = Math.floor(Math.random() * emotions.length);
      const secondaryIndex = (randomIndex + 3) % emotions.length;
      
      const emotionResult: EmotionResult = {
        primaryEmotion: emotions[randomIndex].name,
        secondaryEmotion: emotions[secondaryIndex].name,
        intensity: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
        source: 'facial',
        timestamp: new Date().toISOString()
      };
      
      stopCamera();
      onScanComplete(emotionResult);
    } catch (error) {
      console.error('Error analyzing facial expression:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRequestPermission = () => {
    startCamera();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          Analysez votre expression faciale pour détecter votre état émotionnel
        </p>
      </div>
      
      <div className="relative aspect-video bg-black/10 rounded-lg overflow-hidden">
        {permission === 'granted' && isCapturing ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay capture button */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button 
                onClick={handleCapture}
                disabled={isProcessing}
                variant="secondary"
                className="shadow-lg"
                size="lg"
              >
                {isProcessing ? 'Analyse...' : 'Capturer mon expression'}
              </Button>
            </div>
            
            {/* Close camera button */}
            <Button
              className="absolute top-2 right-2 rounded-full p-2 h-8 w-8"
              size="icon"
              variant="secondary"
              onClick={stopCamera}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <Smile className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-center mb-4 text-muted-foreground">
              {permission === 'denied'
                ? "L'accès à la caméra a été refusé. Veuillez modifier les paramètres de votre navigateur pour autoriser l'accès."
                : "Activez votre caméra pour analyser votre expression faciale"}
            </p>
            
            <Button
              onClick={handleRequestPermission}
              disabled={permission === 'denied'}
            >
              <Camera className="mr-2 h-4 w-4" />
              Activer la caméra
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Annuler
        </Button>
        
        {(isCapturing && !isProcessing) && (
          <Button 
            onClick={handleCapture}
            className="flex-1"
          >
            Analyser
          </Button>
        )}
      </div>
    </div>
  );
};

export default FacialEmotionScanner;
