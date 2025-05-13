
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Webcam, Loader2 } from 'lucide-react';
import useHumeAI from '@/hooks/useHumeAI';
import { EmotionAnalysisResult } from '@/lib/humeai/humeAIService';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FacialEmotionScannerProps {
  onEmotionDetected?: (result: EmotionAnalysisResult, emotion: Partial<Emotion>) => void;
  autoStart?: boolean;
  className?: string;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onEmotionDetected,
  autoStart = false,
  className = ''
}) => {
  const [isScanning, setIsScanning] = useState(autoStart);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  
  const { 
    videoRef, 
    isActive, 
    isLoading, 
    error, 
    lastEmotion,
    startFaceTracking, 
    stopFaceTracking, 
    toggleFaceTracking 
  } = useHumeAI({
    autoStart,
    onEmotion: (result) => {
      setDetectedEmotion(result.dominantEmotion);
      setConfidence(Math.round(result.confidence * 100));
      
      if (onEmotionDetected) {
        // Convert to our app's emotion format
        const emotion: Partial<Emotion> = {
          emotion: result.dominantEmotion,
          score: result.confidence * 10, // Scale 0-1 to 0-10
          confidence: result.confidence,
          source: 'facial',
          category: 'primary'
        };
        onEmotionDetected(result, emotion);
      }
    }
  });
  
  useEffect(() => {
    if (autoStart) {
      handleStartScan();
    }
    
    return () => {
      if (isActive) {
        stopFaceTracking();
      }
    };
  }, [autoStart]);
  
  const handleStartScan = async () => {
    setIsScanning(true);
    await startFaceTracking();
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
    stopFaceTracking();
  };
  
  const toggleScan = async () => {
    if (isScanning) {
      handleStopScan();
    } else {
      await handleStartScan();
    }
  };
  
  // Get color based on emotion
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      'happy': 'bg-yellow-500',
      'calm': 'bg-blue-300',
      'sad': 'bg-blue-500',
      'surprised': 'bg-pink-500',
      'angry': 'bg-red-500',
      'disgusted': 'bg-green-600',
      'fearful': 'bg-purple-500',
      'neutral': 'bg-gray-400',
      'confused': 'bg-amber-500'
    };
    
    return colors[emotion?.toLowerCase()] || 'bg-gray-500';
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Video display area */}
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {!isActive && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-4">
              <Webcam className="h-10 w-10" />
              <p className="text-center max-w-xs text-sm">
                Autorisez l'accès à votre caméra pour l'analyse des émotions faciales
              </p>
              <Button 
                variant="outline" 
                onClick={handleStartScan}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                Démarrer l'analyse
              </Button>
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          
          {/* Overlay info when emotion is detected */}
          {detectedEmotion && isActive && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-2">
                <Badge className={`${getEmotionColor(detectedEmotion)}`}>
                  {detectedEmotion}
                </Badge>
                <div className="flex-1">
                  <Progress value={confidence} className="h-1.5" />
                </div>
                <span className="text-xs text-white">{confidence}%</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {isActive ? 'Analyse faciale en cours...' : 'Analyse faciale inactive'}
          </p>
          
          <Button 
            size="sm" 
            variant={isActive ? "destructive" : "outline"}
            onClick={toggleScan}
          >
            {isActive ? 'Arrêter' : 'Démarrer'}
          </Button>
        </div>
        
        {error && (
          <p className="text-sm text-red-500">
            Erreur: {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FacialEmotionScanner;
