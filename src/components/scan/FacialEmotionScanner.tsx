
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import { FacialEmotionScannerProps } from '@/types/emotion';
import { useHumeAI } from '@/hooks/useHumeAI';

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ 
  onEmotionDetected, 
  className,
  isScanning,
  onToggleScanning 
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { processFacialExpression, isProcessing } = useHumeAI();
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      if (onToggleScanning) {
        onToggleScanning();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      
      if (onToggleScanning) {
        onToggleScanning();
      }
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const capturedImage = canvas.toDataURL('image/jpeg');
        setImage(capturedImage);
        analyzeImage(capturedImage);
      }
    }
  };
  
  const analyzeImage = async (imageData: string) => {
    setProcessing(true);
    setError(null);
    
    try {
      const result = await processFacialExpression(imageData);
      
      // Ensure we have a proper dominantEmotion object
      if (result && result.dominantEmotion) {
        onEmotionDetected(result.dominantEmotion);
      } else if (result && result.emotion) {
        // Create dominantEmotion object if it doesn't exist
        const dominantEmotion = {
          name: result.emotion,
          score: result.score || 0
        };
        onEmotionDetected(dominantEmotion);
      }
    } catch (err) {
      console.error('Error analyzing facial expression:', err);
      setError('Une erreur est survenue lors de l\'analyse de l\'expression faciale.');
    } finally {
      setProcessing(false);
      stopCamera();
    }
  };
  
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Analyse d'expression faciale</h3>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          {!isScanning && !image ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Activez la caméra ou téléchargez une image</p>
            </div>
          ) : (
            <>
              {image ? (
                <img src={image} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              )}
            </>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex flex-wrap gap-2">
          {!isScanning && !image ? (
            <>
              <Button onClick={startCamera}>
                Activer la caméra
              </Button>
              <div className="relative">
                <Button variant="outline" className="relative">
                  Télécharger une image
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleUpload}
                  />
                </Button>
              </div>
            </>
          ) : (
            <>
              {isScanning && !image && (
                <Button onClick={captureImage} disabled={processing || isProcessing}>
                  Capturer
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => {
                  stopCamera();
                  setImage(null);
                }}
                disabled={processing || isProcessing}
              >
                Annuler
              </Button>
            </>
          )}
        </div>
        
        {(processing || isProcessing) && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FacialEmotionScanner;
