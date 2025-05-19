
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Camera, Loader, X } from 'lucide-react';

interface FacialEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let timer: number;

    if (isScanning && countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isScanning && countdown === 0) {
      captureImage();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isScanning, countdown]);

  useEffect(() => {
    return () => {
      // Clean up the media stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsScanning(true);
      setCountdown(3);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setProcessing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Stop the video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Here you would normally send the image to your facial emotion API
    // Instead, we'll simulate a response
    
    // Simulate API processing time
    setTimeout(() => {
      // Mock result
      const result: EmotionResult = {
        emotion: 'happy',
        confidence: 0.85,
        secondaryEmotions: ['neutral', 'surprised'],
        timestamp: new Date().toISOString(),
        source: 'facial',
        recommendations: [
          {
            type: 'music',
            title: 'Playlist joyeuse',
            description: 'Des morceaux pour maintenir votre bonne humeur',
            icon: 'music'
          } as unknown as string,
          {
            type: 'activity',
            title: 'Activité créative',
            description: 'Profitez de cette énergie positive pour créer quelque chose',
            icon: 'activity'
          } as unknown as string
        ]
      };
      
      setProcessing(false);
      
      if (onScanComplete) {
        onScanComplete(result);
      }
    }, 2000);
  };

  const handleCancelScan = () => {
    // Stop any active stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Reset state
    setIsScanning(false);
    setCountdown(3);
    setProcessing(false);
    
    // Call cancel callback
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2" />
          <span>Analyse faciale d'émotion</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          {isScanning ? (
            <>
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-6xl font-bold">
                  {countdown}
                </div>
              )}
              {processing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                  <Loader className="animate-spin h-10 w-10 mb-2" />
                  <p>Analyse en cours...</p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Button onClick={startCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Activer la caméra
              </Button>
            </div>
          )}
          
          {/* Hidden canvas for capturing image */}
          <canvas 
            ref={canvasRef} 
            className="hidden"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleCancelScan}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacialEmotionScanner;
