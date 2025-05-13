
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHumeAI } from '@/hooks/useHumeAI';
import { EmotionResult, FacialEmotionScannerProps } from '@/types/emotion';

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onEmotionDetected,
  isScanning: externalIsScanning,
  onToggleScanning
}) => {
  const [localIsScanning, setLocalIsScanning] = useState(externalIsScanning || false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { analyzeFace, loading } = useHumeAI();
  
  const isScanning = externalIsScanning !== undefined ? externalIsScanning : localIsScanning;
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setLocalIsScanning(true);
      if (onToggleScanning) onToggleScanning();
      
      // Run facial scan automatically after camera starts
      setTimeout(scanFace, 1000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erreur d'accès à la caméra",
        description: "Veuillez autoriser l'accès à votre caméra pour utiliser cette fonctionnalité.",
        variant: "destructive"
      });
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setLocalIsScanning(false);
    if (onToggleScanning) onToggleScanning();
  };
  
  const toggleCamera = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };
  
  const scanFace = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    try {
      // In a real implementation, this would capture a frame from the video
      // and send it to a facial emotion recognition API
      
      // For now, we'll simulate a result
      const mockResult: EmotionResult = {
        emotions: [
          { name: 'happiness', intensity: 0.7, score: 0.7 },
          { name: 'neutral', intensity: 0.2, score: 0.2 },
          { name: 'surprise', intensity: 0.1, score: 0.1 }
        ],
        dominantEmotion: { name: 'happiness', intensity: 0.7, score: 0.7 },
        source: 'facial',
        timestamp: new Date().toISOString(),
        faceDetected: true,
        confidence: 0.85
      };
      
      if (onEmotionDetected) {
        onEmotionDetected(mockResult);
      }
      
      // Stop scanning after result
      stopCamera();
    } catch (error) {
      console.error('Error scanning face:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre visage. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Scan émotionnel facial</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-full max-w-md aspect-video bg-muted rounded-md overflow-hidden">
          {isScanning ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">Caméra désactivée</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={scanFace}
          disabled={!isScanning || loading}
        >
          Analyser maintenant
        </Button>
        <Button
          variant={isScanning ? "destructive" : "default"}
          onClick={toggleCamera}
        >
          {isScanning ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Arrêter la caméra
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Activer la caméra
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacialEmotionScanner;
