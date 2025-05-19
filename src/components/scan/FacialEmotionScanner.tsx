
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Camera, X, Loader2 } from 'lucide-react';

interface FacialEmotionScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Démarrer la caméra
  const startCamera = async () => {
    setErrorMessage(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      setErrorMessage('Impossible d\'accéder à votre caméra. Veuillez vérifier les permissions.');
    }
  };
  
  // Arrêter la caméra
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  // Analyser l'image pour détecter l'émotion (simulation)
  const scanEmotion = () => {
    setIsScanning(true);
    
    // Capturer une image depuis la vidéo
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Définir les dimensions du canvas égales à celles de la vidéo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dessiner l'image de la vidéo sur le canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simuler une analyse d'émotion (dans une application réelle, nous enverrions cette image à une API)
        setTimeout(() => {
          // Résultat simulé
          const result: EmotionResult = {
            emotion: 'neutral', // Émotion par défaut
            confidence: 0.75,
            timestamp: new Date().toISOString(),
            source: 'facial',
            duration: 2.5,
            secondaryEmotions: ['surprised', 'happy'],
            // Utilisation correcte du champ emotion au lieu de emotions
            emotion: 'neutral'
          };
          
          setIsScanning(false);
          stopCamera();
          
          if (onScanComplete) {
            onScanComplete(result);
          }
        }, 2000);
      }
    }
  };
  
  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  // Démarrer automatiquement la caméra au montage
  useEffect(() => {
    startCamera();
  }, []);
  
  const handleCancel = () => {
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2" />
          Analyse faciale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md bg-muted aspect-video relative">
          {errorMessage ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-destructive">{errorMessage}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Analyse en cours...</p>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        
        <div>
          {errorMessage && (
            <Button onClick={startCamera} className="mr-2">
              Réessayer
            </Button>
          )}
          
          {!errorMessage && stream && (
            <Button 
              onClick={scanEmotion} 
              disabled={isScanning || !stream}
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FacialEmotionScanner;
