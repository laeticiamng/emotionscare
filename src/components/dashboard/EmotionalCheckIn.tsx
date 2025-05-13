
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHumeAI } from '@/hooks/useHumeAI';
import { EmotionAnalysisResult } from '@/lib/humeai/humeAIService';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Emotion } from '@/types';
import { saveEmotion } from '@/lib/scanService';
import { useAuth } from '@/contexts/AuthContext';

const EmotionalCheckIn: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [emotionLabel, setEmotionLabel] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { loadPlaylistForEmotion } = useMusic();
  
  const { 
    videoRef, 
    isActive, 
    isLoading, 
    lastEmotion, 
    startFaceTracking, 
    stopFaceTracking 
  } = useHumeAI({
    onEmotion: handleEmotionDetected
  });
  
  // Show check-in after login
  useEffect(() => {
    // Check if we've already done a check-in today
    const lastCheckIn = localStorage.getItem('lastEmotionalCheckIn');
    const today = new Date().toDateString();
    
    if (user && (!lastCheckIn || lastCheckIn !== today)) {
      setTimeout(() => {
        setOpen(true);
      }, 1500);
    }
  }, [user]);
  
  // Start facial analysis when dialog opens
  useEffect(() => {
    if (open && !isActive && !isLoading) {
      startFaceTracking();
    }
    
    return () => {
      if (isActive) {
        stopFaceTracking();
      }
    };
  }, [open, isActive, isLoading, startFaceTracking, stopFaceTracking]);
  
  // Update progress during scan
  useEffect(() => {
    if (open && isActive && !checkInComplete) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [open, isActive, checkInComplete]);
  
  // Handle scan completion
  useEffect(() => {
    if (scanProgress >= 100 && !checkInComplete) {
      setCheckInComplete(true);
      
      // Save today's date as last check-in
      localStorage.setItem('lastEmotionalCheckIn', new Date().toDateString());
      
      // Apply emotion-based music if available
      if (lastEmotion) {
        applyEmotionBasedMusic(lastEmotion);
      }
    }
  }, [scanProgress, checkInComplete, lastEmotion]);
  
  function handleEmotionDetected(result: EmotionAnalysisResult) {
    if (!result.dominantEmotion) return;
    
    // Map emotion names to friendly French names
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
    
    setEmotionLabel(emotionMap[result.dominantEmotion] || result.dominantEmotion);
    setEmotionIntensity(result.confidence * 100);
    
    // Save emotion to database when check-in is complete
    if (checkInComplete && user) {
      const emotionData: Emotion = {
        id: `em-checkin-${Date.now()}`,
        user_id: user.id,
        date: new Date().toISOString(),
        emotion: result.dominantEmotion,
        score: Math.round(result.confidence * 10),
        intensity: result.confidence,
        confidence: result.confidence,
        name: result.dominantEmotion,
        source: 'checkin',
        category: 'emotion'
      };
      
      saveEmotion({
        user_id: user.id,
        date: new Date().toISOString(),
        emotion: result.dominantEmotion,
        score: Math.round(result.confidence * 10),
        text: `Check-in automatique: ${emotionMap[result.dominantEmotion] || result.dominantEmotion}`,
        ai_feedback: `Analyse faciale a détecté: ${emotionMap[result.dominantEmotion] || result.dominantEmotion} avec une intensité de ${Math.round(result.confidence * 100)}%`
      });
    }
  }
  
  function applyEmotionBasedMusic(emotion: EmotionAnalysisResult) {
    if (!emotion.dominantEmotion) return;
    
    // Map emotions to music types
    const emotionToMusicMap: Record<string, string> = {
      'happy': 'energetic',
      'sad': 'calm',
      'angry': 'calm',
      'fearful': 'calm',
      'surprised': 'neutral',
      'disgusted': 'neutral',
      'neutral': 'neutral',
      'calm': 'calm',
      'excited': 'energetic',
      'anxious': 'calm',
      'stressed': 'calm',
      'bored': 'energetic',
      'tired': 'calm',
      'focused': 'concentration'
    };
    
    const musicType = emotionToMusicMap[emotion.dominantEmotion] || 'neutral';
    
    try {
      loadPlaylistForEmotion(musicType);
      
      toast({
        title: "Musique adaptée à votre humeur",
        description: `Nous avons chargé une ambiance musicale adaptée à votre état émotionnel : ${emotionLabel}`,
      });
    } catch (error) {
      console.error("Error loading emotion-based music:", error);
    }
  }
  
  const handleClose = () => {
    setOpen(false);
    stopFaceTracking();
  };
  
  // Get emotion color based on name
  const getEmotionColor = (emotion: string): string => {
    const emotionToColor: Record<string, string> = {
      'Joie': 'bg-yellow-500',
      'Tristesse': 'bg-blue-500',
      'Colère': 'bg-red-500',
      'Peur': 'bg-purple-500',
      'Surprise': 'bg-pink-500',
      'Dégoût': 'bg-green-500',
      'Neutre': 'bg-gray-500',
      'Calme': 'bg-sky-500',
      'Excitation': 'bg-orange-500',
      'Anxiété': 'bg-indigo-500',
      'Stress': 'bg-amber-500',
      'Ennui': 'bg-slate-500',
      'Fatigue': 'bg-zinc-500',
      'Concentration': 'bg-emerald-500'
    };
    
    return emotionToColor[emotion] || 'bg-gray-500';
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Check-in émotionnel
          </DialogTitle>
          <DialogDescription>
            {checkInComplete 
              ? "Analyse complétée ! Nous adaptons l'interface à votre état émotionnel."
              : "Nous analysons vos expressions faciales pour personnaliser votre expérience."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          {/* Video element (hidden in UI but used for processing) */}
          <div className="relative h-48 bg-black rounded-md overflow-hidden">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          </div>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyse en cours</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
          
          {/* Emotion display */}
          {lastEmotion && emotionLabel && (
            <div className="flex flex-col items-center gap-2 p-3 bg-muted/20 rounded-md">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Votre état émotionnel détecté</p>
                <Badge className={`mt-1 ${getEmotionColor(emotionLabel)} text-white`}>
                  {emotionLabel}
                </Badge>
              </div>
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Intensité</span>
                  <span>{Math.round(emotionIntensity)}%</span>
                </div>
                <Progress value={emotionIntensity} className="h-1.5" />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {checkInComplete ? (
            <Button onClick={handleClose} className="w-full">
              Continuer
            </Button>
          ) : (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmotionalCheckIn;
