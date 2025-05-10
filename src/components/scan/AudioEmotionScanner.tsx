
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AudioEmotionScannerProps {
  audioUrl: string | null;
  onAudioChange: (url: string | null) => void;
  className?: string;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  audioUrl,
  onAudioChange,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<number | null>(null);
  
  const startRecording = () => {
    // Simulation d'enregistrement pour la démo
    setIsRecording(true);
    
    // Commencer à compter
    const interval = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setRecordingInterval(interval);
    
    // Dans une implémentation réelle, on utiliserait navigator.mediaDevices.getUserMedia
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    // Arrêter le compteur
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
    
    // Simuler un URL d'enregistrement
    onAudioChange(`recording-${Date.now()}.mp3`);
    
    // Réinitialiser le temps d'enregistrement
    setRecordingTime(0);
  };
  
  const deleteRecording = () => {
    onAudioChange(null);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        {!audioUrl ? (
          isRecording ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 animate-pulse">
                <Mic className="h-10 w-10 text-red-500" />
              </div>
              
              <div className="text-center">
                <div className="text-xl font-mono">{formatTime(recordingTime)}</div>
                <div className="text-sm text-muted-foreground">Enregistrement en cours...</div>
              </div>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={stopRecording}
                className="mt-4 px-6"
              >
                <Square className="h-4 w-4 mr-2" />
                Arrêter
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Button
                variant="outline"
                size="lg"
                onClick={startRecording}
                className="h-20 w-20 rounded-full"
              >
                <Mic className="h-8 w-8 text-primary" />
              </Button>
              <div className="text-center">
                <div className="text-lg font-medium">Enregistrer mon émotion</div>
                <div className="text-sm text-muted-foreground">Cliquez pour commencer</div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Enregistrement</div>
                    <div className="text-xs text-muted-foreground">Audio prêt pour analyse</div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={deleteRecording}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <Button
              variant="outline"
              onClick={() => {
                onAudioChange(null);
                startRecording();
              }}
            >
              Nouvel enregistrement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
