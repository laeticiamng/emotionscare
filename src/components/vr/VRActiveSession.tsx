
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VRSessionTemplate, VRSession } from '@/types/vr';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface VRActiveSessionProps {
  template: VRSessionTemplate;
  onComplete?: (session: VRSession) => void;
  onClose?: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({ 
  template, 
  onComplete,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const { toast } = useToast();
  const { pauseTrack, playTrack, currentTrack } = useMusic();
  
  // Check if this is an audio-only session
  const isAudioOnly = template.is_audio_only ?? !template.videoUrl;
  
  // Start session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && !sessionCompleted) {
      timer = setInterval(() => {
        setTimeElapsed(prev => {
          const newValue = prev + 1;
          // Check if session is complete
          if (newValue >= template.duration) {
            clearInterval(timer);
            setIsPlaying(false);
            setSessionCompleted(true);
            
            // Create session data
            const sessionData: VRSession = {
              id: crypto.randomUUID(),
              templateId: template.id,
              userId: 'current-user', // This should come from authentication context
              startTime: new Date(Date.now() - template.duration * 1000).toISOString(),
              endTime: new Date().toISOString(),
              duration: template.duration,
              completed: true
            };
            
            if (onComplete) {
              onComplete(sessionData);
            }
            
            toast({
              title: "Session terminée",
              description: "Votre session VR est terminée. Comment vous sentez-vous ?",
            });
            
            return template.duration;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, sessionCompleted, template.duration, onComplete, toast]);
  
  // Load appropriate music if specified
  useEffect(() => {
    if (isPlaying && template.audio_url) {
      // In a full implementation, we would load and play the audio
      console.log('Playing VR session audio:', template.audio_url);
    }
  }, [isPlaying, template.audio_url]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      const targetEmotion = template.emotion_target || template.emotion || 'calm';
      toast({
        title: "Session démarrée",
        description: `Session de ${Math.floor(template.duration / 60)} minutes. Installez-vous confortablement.`,
      });
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = (timeElapsed / template.duration) * 100;
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-primary/5">
        <CardTitle>{template.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="py-6 space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
          {isAudioOnly ? (
            <div className="text-center p-8">
              <div className="text-6xl mb-4 opacity-70">🧘‍♀️</div>
              <p className="text-lg font-medium">Session audio guidée</p>
              <p className="text-sm text-muted-foreground mt-2">
                Fermez les yeux et laissez-vous guider
              </p>
            </div>
          ) : (
            template.videoUrl ? (
              <video 
                src={template.videoUrl} 
                controls={isPlaying}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Aucune vidéo disponible</p>
              </div>
            )
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatTime(timeElapsed)}</span>
            <span>{formatTime(template.duration)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Quitter
        </Button>
        
        <Button 
          onClick={togglePlay}
          disabled={sessionCompleted}
        >
          {!isPlaying ? 'Démarrer' : 'Pause'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VRActiveSession;
