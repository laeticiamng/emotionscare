
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Webcam, Camera, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useHumeAI } from '@/hooks/useHumeAI';
import { EmotionAnalysisResult } from '@/lib/humeai/humeAIService';
import { motion, AnimatePresence } from "framer-motion";
import { Emotion } from '@/types';

interface FacialEmotionScannerProps {
  onEmotionDetected?: (emotion: EmotionAnalysisResult, result: Emotion) => void;
  className?: string;
  autoStart?: boolean;
}

const FacialEmotionScanner: React.FC<FacialEmotionScannerProps> = ({
  onEmotionDetected,
  className,
  autoStart = false
}) => {
  const [consent, setConsent] = useState(false);
  const [emotionName, setEmotionName] = useState<string | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState<number>(0);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  
  const { 
    videoRef, 
    isActive, 
    isLoading, 
    lastEmotion, 
    startFaceTracking, 
    stopFaceTracking 
  } = useHumeAI({
    autoStart: false,
    onEmotion: handleEmotionResult
  });
  
  // Function to handle emotion results from HumeAI
  function handleEmotionResult(result: EmotionAnalysisResult) {
    setEmotionName(result.dominantEmotion);
    setEmotionIntensity(result.confidence * 100);
    
    // If we're actively scanning, update the progress
    if (isScanning) {
      setScanProgress(prev => Math.min(100, prev + 20));
    }
    
    // For callback to parent component
    if (onEmotionDetected) {
      const emotionResult: Emotion = {
        id: `em-${Date.now()}`,
        user_id: 'current-user',
        date: new Date().toISOString(),
        emotion: result.dominantEmotion,
        score: Math.round(result.confidence * 10),
        intensity: result.confidence,
        confidence: result.confidence,
        category: result.confidence > 0.7 ? 'positive' : 'neutral',
        name: result.dominantEmotion,
        source: 'facial'
      };
      
      onEmotionDetected(result, emotionResult);
    }
  }
  
  // Handle scan completion
  useEffect(() => {
    if (scanProgress >= 100 && isScanning) {
      setIsScanning(false);
      
      // Stop tracking after a complete scan if not in continuous mode
      if (!autoStart) {
        setTimeout(() => {
          stopFaceTracking();
        }, 1000);
      }
    }
  }, [scanProgress, isScanning, autoStart, stopFaceTracking]);
  
  // Auto-start if consent is given
  useEffect(() => {
    if (consent && autoStart && !isActive && !isLoading) {
      startFaceTracking();
    }
  }, [consent, autoStart, isActive, isLoading, startFaceTracking]);
  
  const handleStartScan = async () => {
    if (!consent) {
      setConsent(true);
    }
    
    if (!isActive) {
      const success = await startFaceTracking();
      if (!success) return;
    }
    
    // Reset scan progress and start scanning
    setScanProgress(0);
    setIsScanning(true);
  };
  
  const handleStopScan = () => {
    setIsScanning(false);
    if (!autoStart) {
      stopFaceTracking();
    }
  };
  
  // Map emotion names to friendly French names
  const getEmotionLabel = (emotion: string | null): string => {
    if (!emotion) return 'Analyse en cours...';
    
    const emotionMap: Record<string, string> = {
      'happy': 'Joie',
      'sad': 'Tristesse',
      'angry': 'Colère',
      'fearful': 'Peur',
      'surprised': 'Surprise',
      'disgusted': 'Dégoût',
      'neutral': 'Neutre',
      'calm': 'Calme',
      'excited': 'Excitation',
      'anxious': 'Anxiété',
      'stressed': 'Stress',
      'bored': 'Ennui',
      'tired': 'Fatigue',
      'focused': 'Concentration'
    };
    
    return emotionMap[emotion.toLowerCase()] || emotion;
  };
  
  // Get emotion color based on emotion name
  const getEmotionColor = (emotion: string | null): string => {
    if (!emotion) return 'bg-gray-200';
    
    const emotionColorMap: Record<string, string> = {
      'happy': 'bg-yellow-500',
      'sad': 'bg-blue-500',
      'angry': 'bg-red-500',
      'fearful': 'bg-purple-500',
      'surprised': 'bg-pink-500',
      'disgusted': 'bg-green-500',
      'neutral': 'bg-gray-500',
      'calm': 'bg-sky-500',
      'excited': 'bg-orange-500',
      'anxious': 'bg-indigo-500',
      'stressed': 'bg-amber-500',
      'bored': 'bg-slate-500',
      'tired': 'bg-zinc-500',
      'focused': 'bg-emerald-500'
    };
    
    return emotionColorMap[emotion.toLowerCase()] || 'bg-gray-500';
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Webcam className="h-5 w-5" />
          Scanner émotionnel facial
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {!consent ? (
          <div className="space-y-4 p-4 text-center">
            <h3 className="font-medium">Autorisation d'accès à la caméra</h3>
            <p className="text-sm text-muted-foreground">
              Pour analyser vos émotions faciales, nous avons besoin d'accéder à votre webcam. 
              Aucune image n'est enregistrée ou stockée.
            </p>
            <Button onClick={() => setConsent(true)}>
              Autoriser l'accès
            </Button>
          </div>
        ) : (
          <>
            {/* Video element (hidden in UI but used for processing) */}
            <div className={`relative ${isActive ? 'block' : 'hidden'}`}>
              <video 
                ref={videoRef}
                className="w-full h-48 object-cover rounded-md bg-black"
                playsInline
                muted
              />
              
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-48 h-48 rounded-full border-2 border-primary"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 0.2, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </div>
              )}
            </div>
            
            {!isActive && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="p-4 bg-muted/30 rounded-full">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground">
                  Cliquez sur le bouton ci-dessous pour commencer l'analyse faciale
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">
                  Initialisation de la caméra...
                </p>
              </div>
            )}
            
            {/* Emotion Display */}
            {isActive && lastEmotion && (
              <div className="space-y-4 mt-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Émotion détectée</h3>
                  <Badge variant="outline" className={`${getEmotionColor(emotionName)} text-white`}>
                    {getEmotionLabel(emotionName)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Intensité</span>
                    <span>{Math.round(emotionIntensity)}%</span>
                  </div>
                  <Progress value={emotionIntensity} className="h-2" />
                </div>
                
                {isScanning && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progression du scan</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
            
            {/* Controls */}
            <div className="flex justify-center mt-4">
              <AnimatePresence mode="wait">
                {!isScanning ? (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button 
                      onClick={handleStartScan}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      {isActive ? "Lancer un nouveau scan" : "Démarrer le scan facial"}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stop"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button 
                      onClick={handleStopScan}
                      variant="secondary"
                    >
                      Arrêter le scan
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FacialEmotionScanner;
