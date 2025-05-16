
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuid } from 'uuid';

interface FacialEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
  autoStart?: boolean;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onResult,
  autoStart = false
}) => {
  const [isScanning, setIsScanning] = useState(autoStart);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Start the camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (isScanning && !streamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { ideal: 640 },
              height: { ideal: 480 } 
            } 
          });
          
          streamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // Wait for video to be ready
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            };
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Erreur caméra",
          description: "Impossible d'accéder à votre caméra. Veuillez vérifier les autorisations.",
          variant: "destructive"
        });
        setIsScanning(false);
      }
    };
    
    startCamera();
    
    // Cleanup camera stream on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScanning, toast]);

  // Handle scan button click
  const handleScan = () => {
    if (isScanning) {
      // Stop scanning
      setIsScanning(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } else {
      // Start scanning
      setIsScanning(true);
    }
  };

  // Capture and analyze frame
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsProcessing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame on canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Simulate API call to emotion detection service
    simulateEmotionDetection(imageData);
  };

  // Simulate emotion detection with a delay
  const simulateEmotionDetection = (imageData: string) => {
    setTimeout(() => {
      // Mock emotion result
      const emotionResult: EmotionResult = {
        id: uuid(),
        user_id: 'current-user',
        date: new Date().toISOString(),
        emotion: getRandomEmotion(),
        score: Math.floor(Math.random() * 40) + 60, // Random between 60-99
        confidence: (Math.floor(Math.random() * 20) + 70) / 100, // Random between 0.7-0.9
        intensity: (Math.floor(Math.random() * 50) + 50) / 100, // Random between 0.5-0.99
      };
      
      // Call onResult callback
      if (onResult) {
        onResult(emotionResult);
      }
      
      // Show toast notification
      toast({
        title: "Analyse terminée",
        description: `Émotion détectée: ${emotionResult.emotion}`,
      });
      
      // Reset processing state
      setIsProcessing(false);
      
      // Auto-stop scanning
      setIsScanning(false);
      
      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }, 2000); // Simulate 2 second processing time
  };

  // Generate random emotion for demo
  const getRandomEmotion = () => {
    const emotions = ['happy', 'neutral', 'sad', 'surprised', 'calm'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse faciale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            className={`w-full rounded-md ${isScanning ? 'opacity-100' : 'opacity-0 absolute'}`}
            muted
            playsInline
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
          
          {!isScanning && (
            <div className="bg-muted flex items-center justify-center rounded-md" style={{ height: '250px' }}>
              <p className="text-muted-foreground">Caméra désactivée</p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <Button 
            onClick={handleScan}
            variant={isScanning ? "destructive" : "default"}
            disabled={isProcessing}
            className="w-full"
          >
            {isScanning ? "Arrêter la caméra" : "Activer la caméra"}
          </Button>
          
          {isScanning && (
            <Button 
              onClick={captureFrame}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Analyse en cours..." : "Analyser mon expression"}
            </Button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Vos images sont traitées localement et ne sont pas stockées
        </p>
      </CardContent>
    </Card>
  );
};

export default FacialEmotionScanner;
