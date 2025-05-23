
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Camera, Image, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useHumeAI from '@/hooks/api/useHumeAI';

interface FacialEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel?: () => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { analyzeFacialEmotion, isAnalyzing } = useHumeAI();
  
  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Impossible d\'accéder à la caméra');
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            setCapturedImage(blob);
            setImage(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedImage(file);
      setImage(URL.createObjectURL(file));
    }
  };
  
  // Reset captured image and restart camera
  const resetImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setCapturedImage(null);
    startCamera();
  };
  
  // Analyze emotion
  const handleAnalyze = async () => {
    if (!capturedImage) {
      toast.error('Veuillez capturer ou télécharger une image');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await analyzeFacialEmotion(capturedImage);
      if (result) {
        onScanComplete(result);
      } else {
        toast.error('Erreur lors de l\'analyse de l\'image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Erreur lors de l\'analyse de l\'image');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p>
          Prenez une photo de votre visage ou téléchargez une image pour analyser votre expression faciale.
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        {!image ? (
          <>
            {!isCameraActive ? (
              <div className="w-full max-w-sm aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-4">
                <Button 
                  variant="outline"
                  className="mb-4"
                  onClick={startCamera}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Activer la caméra
                </Button>
                
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">ou</p>
                </div>
                
                <Button 
                  variant="outline"
                  className="mt-4"
                  asChild
                >
                  <label>
                    <Image className="mr-2 h-4 w-4" />
                    Télécharger une image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
              </div>
            ) : (
              <div className="relative w-full max-w-sm">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <Button onClick={captureImage}>
                    Prendre une photo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={stopCamera}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative w-full max-w-sm">
            <img 
              src={image} 
              alt="Captured" 
              className="w-full rounded-lg"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button 
                variant="outline"
                onClick={resetImage}
                disabled={isProcessing || isAnalyzing}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recommencer
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing || isAnalyzing}
          >
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleAnalyze}
          disabled={isProcessing || isAnalyzing || !image}
          className="ml-auto"
        >
          {isProcessing || isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse...
            </>
          ) : (
            'Analyser'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FacialEmotionScanner;
