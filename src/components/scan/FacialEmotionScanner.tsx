import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion-unified';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useHumeAI from '@/hooks/api/useHumeAI';

interface FacialEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onScanComplete,
  onCancel
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { analyzeFacialEmotion, isAnalyzing } = useHumeAI();
  
  // Démarrer la caméra
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setIsCapturing(true);
      toast.success('Caméra activée. Positionnez votre visage dans le cadre.');
    } catch (error) {
      // Camera access error
      toast.error('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  };
  
  // Arrêter la caméra
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);
  
  // Capturer une photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dessiner l'image du video sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir en data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Arrêter la caméra
    stopCamera();
    
    toast.success('Photo capturée avec succès');
  }, [stopCamera]);
  
  // Gérer l'upload de fichier
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
      toast.success('Image chargée avec succès');
    };
    reader.readAsDataURL(file);
  };
  
  // Analyser l'image
  const handleAnalyze = async () => {
    if (!capturedImage) {
      toast.error('Aucune image à analyser');
      return;
    }
    
    try {
      const result = await analyzeFacialEmotion(capturedImage);
      if (result) {
        onScanComplete(result);
        toast.success('Analyse faciale terminée');
      }
    } catch (error) {
      // Facial analysis error
      toast.error('Erreur lors de l\'analyse faciale');
    }
  };
  
  // Reprendre une photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse faciale</CardTitle>
        <CardDescription>
          Capturez votre visage pour analyser vos expressions émotionnelles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {!capturedImage ? (
            <>
              {isCapturing ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full max-w-md rounded-lg border"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg pointer-events-none" />
                </div>
              ) : (
                <div className="w-full max-w-md h-64 bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Aucune image capturée</p>
                  </div>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex gap-2">
                {!isCapturing ? (
                  <>
                    <Button onClick={startCamera}>
                      <Camera className="mr-2 h-4 w-4" />
                      Activer la caméra
                    </Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Charger une photo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={capturePhoto}>
                      <Camera className="mr-2 h-4 w-4" />
                      Capturer
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      Annuler
                    </Button>
                  </>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          ) : (
            <>
              <img
                src={capturedImage}
                alt="Photo capturée"
                className="w-full max-w-md rounded-lg border"
              />
              
              <div className="flex gap-2">
                <Button onClick={retakePhoto} variant="outline">
                  Reprendre
                </Button>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    'Analyser'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          <p>Assurez-vous d'être dans un environnement bien éclairé pour une meilleure analyse.</p>
          <p>Votre image est traitée localement et n'est pas stockée.</p>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacialEmotionScanner;
