
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmotionResult } from '@/types/emotion';

interface FacialEmotionScannerProps {
  onResult?: (result: EmotionResult) => void;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ onResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
      // Clean up stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setVideoActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Erreur d'accès à la caméra",
        description: "Veuillez autoriser l'accès à votre caméra pour utiliser cette fonctionnalité.",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setVideoActive(false);
    }
  };
  
  const handleStartScan = () => {
    if (!videoActive) {
      startCamera();
    }
    setIsScanning(true);
    
    // Mock facial scan
    setTimeout(() => {
      analyzeFacialExpression();
    }, 2000);
  };
  
  const analyzeFacialExpression = () => {
    // Mock result data
    const mockResult: EmotionResult = {
      id: `scan-${Date.now()}`,
      user_id: "user123",
      emotion: "happy",
      score: 0.85,
      confidence: 0.88,
      intensity: 0.75,
      emojis: ["😊"],
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      source: "facial"
    };
    
    setIsScanning(false);
    
    if (onResult) {
      onResult(mockResult);
    }
    
    toast({
      title: "Analyse terminée",
      description: `Émotion détectée : ${mockResult.emotion}`,
    });
    
    // Optionally stop the camera after scanning
    stopCamera();
  };
  
  return (
    <div className="space-y-4">
      {videoActive && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
          />
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="bg-background p-4 rounded-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      )}
      
      {!videoActive && !isScanning && (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-8 bg-muted/30">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-4">
            Activez votre caméra pour analyser votre expression faciale et déterminer votre état émotionnel
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleStartScan} 
        disabled={isScanning} 
        className="w-full" 
        size="lg"
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : videoActive ? (
          "Lancer l'analyse"
        ) : (
          "Activer la caméra"
        )}
      </Button>
      
      {videoActive && !isScanning && (
        <Button 
          variant="outline" 
          onClick={stopCamera} 
          className="w-full mt-2"
        >
          Désactiver la caméra
        </Button>
      )}
    </div>
  );
};

export default FacialEmotionScanner;
