
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Simplified version without HumAI integration for now
const EmotionalCheckIn: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [emotionLabel, setEmotionLabel] = useState('Calme');
  const [emotionIntensity, setEmotionIntensity] = useState(65);
  const { user } = useAuth();
  const { toast } = useToast();
  
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
  
  // Simulate scanning progress
  useEffect(() => {
    if (open && !checkInComplete) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setCheckInComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [open, checkInComplete]);
  
  // Handle scan completion
  useEffect(() => {
    if (scanProgress >= 100 && checkInComplete) {
      // Save today's date as last check-in
      localStorage.setItem('lastEmotionalCheckIn', new Date().toDateString());
      
      toast({
        title: "Check-in émotionnel complété",
        description: `Votre état émotionnel détecté : ${emotionLabel}`,
      });
    }
  }, [scanProgress, checkInComplete, emotionLabel, toast]);
  
  const handleClose = () => {
    setOpen(false);
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
          {/* Video would be here in the full implementation */}
          <div className="relative h-48 bg-black rounded-md overflow-hidden flex items-center justify-center">
            <div className="text-white">Caméra simulée</div>
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
          {emotionLabel && (
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
                  <span>{emotionIntensity}%</span>
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
