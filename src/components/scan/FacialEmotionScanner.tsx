
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';

export interface FacialEmotionScannerProps {
  onEmotionDetected: (result: EmotionResult) => void;
  compact?: boolean;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({ 
  onEmotionDetected,
  compact = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  const captureAndAnalyze = () => {
    setIsAnalyzing(true);
    
    // Mock analysis - in a real app this would use an ML model or API
    setTimeout(() => {
      const mockResults: EmotionResult = {
        emotion: ['joy', 'neutral', 'surprise', 'calm'][Math.floor(Math.random() * 4)],
        score: Math.random() * 0.5 + 0.5,
        confidence: 0.82
      };
      
      onEmotionDetected(mockResults);
      setIsAnalyzing(false);
      stopCamera();
    }, 2000);
  };
  
  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);
  
  if (compact) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={startCamera}
        >
          <Camera className="mr-2 h-4 w-4" /> Activer la caméra
        </Button>
        {isAnalyzing && <p className="text-sm text-center">Analyse en cours...</p>}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black/10 h-64">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-white text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Analyse des émotions...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={captureAndAnalyze}
          disabled={isAnalyzing || !streamRef.current}
        >
          Analyser mon expression
        </Button>
      </div>
    </div>
  );
};

export default FacialEmotionScanner;
